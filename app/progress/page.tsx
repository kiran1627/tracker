import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { safePercent } from '@/lib/utils';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { TrendingUp, Flame, CheckSquare, Repeat2, Target } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
  const userId = await getCurrentUserId();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // All-time stats
  const [totalTasks, completedTasksAll, habitLogCount, goalsCompleted, goalsActive] =
    await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, completed: true } }),
      prisma.habitLog.count({ where: { habit: { userId }, completed: true } }),
      prisma.goal.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.goal.count({ where: { userId, status: 'ACTIVE' } }),
    ]);

  // 30-day habit logs
  const last30HabitLogs = await prisma.habitLog.findMany({
    where: {
      habit: { userId },
      date: { gte: thirtyDaysAgo },
      completed: true,
    },
    select: { date: true },
  });

  // Calculate streak
  const logDateSet = new Set(last30HabitLogs.map((l) => format(new Date(l.date), 'yyyy-MM-dd')));
  let streak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  const cursor = new Date(today);
  for (let i = 0; i < 30; i++) {
    const key = format(cursor, 'yyyy-MM-dd');
    if (logDateSet.has(key)) {
      tempStreak++;
      if (i === 0) streak = tempStreak;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      if (i === 0) streak = 0;
      else if (streak === 0) {} // ok
      tempStreak = 0;
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  // Weekly data per day
  const weekTaskData = await prisma.task.findMany({
    where: { userId, date: { gte: weekStart, lte: weekEnd } },
    select: { date: true, completed: true },
  });
  const weekHabitData = await prisma.habitLog.findMany({
    where: {
      habit: { userId },
      date: { gte: weekStart, lte: weekEnd },
    },
    select: { date: true, completed: true },
  });

  const weekStats = weekDays.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTasks = weekTaskData.filter((t) => format(new Date(t.date), 'yyyy-MM-dd') === dayStr);
    const dayHabits = weekHabitData.filter((h) => format(new Date(h.date), 'yyyy-MM-dd') === dayStr);
    const total = dayTasks.length + dayHabits.length;
    const completed = dayTasks.filter((t) => t.completed).length + dayHabits.filter((h) => h.completed).length;
    return {
      day: format(day, 'EEE'),
      dayStr,
      total,
      completed,
      percent: safePercent(completed, total),
    };
  });

  const weekAvg = safePercent(
    weekStats.reduce((s, d) => s + d.completed, 0),
    weekStats.reduce((s, d) => s + d.total, 0),
  );

  const bestDay = weekStats.reduce((best, d) => (d.percent > best.percent ? d : best), weekStats[0]);
  const worstDay = weekStats.filter(d => d.total > 0).reduce((worst, d) => (d.percent < worst.percent ? d : worst), weekStats.find(d => d.total > 0) || weekStats[0]);

  // Top habits by 30-day consistency
  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
    include: {
      logs: {
        where: { date: { gte: thirtyDaysAgo }, completed: true },
      },
    },
  });

  const habitStats = habits
    .map((h) => ({
      id: h.id,
      title: h.title,
      icon: h.icon,
      color: h.color,
      logs: h.logs.length,
      consistency: safePercent(h.logs.length, 30),
    }))
    .sort((a, b) => b.consistency - a.consistency);

  const overallRate = safePercent(completedTasksAll, totalTasks);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Progress</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your performance analytics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: <Flame className="w-5 h-5 text-orange-500" />, value: streak, label: 'Current Streak', sub: 'days', bg: 'bg-orange-50' },
          { icon: <Flame className="w-5 h-5 text-amber-500" />, value: bestStreak, label: 'Best Streak', sub: 'days', bg: 'bg-amber-50' },
          { icon: <TrendingUp className="w-5 h-5 text-indigo-500" />, value: `${overallRate}%`, label: 'Completion Rate', sub: 'all time', bg: 'bg-indigo-50' },
          { icon: <CheckSquare className="w-5 h-5 text-green-500" />, value: completedTasksAll, label: 'Tasks Done', sub: `of ${totalTasks}`, bg: 'bg-green-50' },
          { icon: <Repeat2 className="w-5 h-5 text-violet-500" />, value: habitLogCount, label: 'Habit Logs', sub: 'total', bg: 'bg-violet-50' },
          { icon: <Target className="w-5 h-5 text-blue-500" />, value: goalsCompleted, label: 'Goals Done', sub: `${goalsActive} active`, bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="card p-4 text-center">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-[11px] font-medium text-slate-600 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Weekly breakdown */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">This Week</h2>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {weekStats.filter(d => d.total > 0).length > 0 && <>
              <span className="text-green-600 font-medium">Best: {bestDay.day}</span>
              {worstDay && <span className="text-amber-600 font-medium">Weakest: {worstDay.day}</span>}
            </>}
            <span className="font-semibold text-slate-700">Avg: {weekAvg}%</span>
          </div>
        </div>
        <div className="space-y-3">
          {weekStats.map((day) => (
            <div key={day.dayStr} className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 w-8">{day.day}</span>
              <div className="flex-1">
                <ProgressBar
                  percent={day.percent}
                  height="h-6"
                  color="gradient-brand"
                />
              </div>
              <span className="text-xs font-semibold text-slate-600 w-10 text-right">
                {day.total > 0 ? `${day.percent}%` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Habit consistency */}
      {habitStats.length > 0 && (
        <div className="card p-5">
          <h2 className="section-title mb-4">Habit Consistency (30 days)</h2>
          <div className="space-y-3">
            {habitStats.slice(0, 8).map((h) => (
              <div key={h.id} className="flex items-center gap-3">
                <span className="text-lg w-7">{h.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 truncate">{h.title}</span>
                    <span className="text-xs font-semibold text-slate-600 ml-2">{h.consistency}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${h.consistency}%`, backgroundColor: h.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
