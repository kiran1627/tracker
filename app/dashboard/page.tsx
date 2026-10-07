import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { format } from 'date-fns';
import { getGreeting, today } from '@/lib/dates';
import { safePercent } from '@/lib/utils';
import { TodayHero } from '@/components/dashboard/TodayHero';
import { TodayTaskList } from '@/components/dashboard/TodayTaskList';
import { TodayHabitList } from '@/components/dashboard/TodayHabitList';
import { GoalProgressList } from '@/components/dashboard/GoalProgressList';
import { TodayNoteSection } from '@/components/dashboard/TodayNoteSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTodayData(userId: string) {
  const todayDate = today();
  const todayStr = format(todayDate, 'yyyy-MM-dd');

  // Get today's tasks
  const tasks = await prisma.task.findMany({
    where: { userId, date: todayDate },
    include: { goal: { select: { id: true, title: true } } },
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
  });

  // Get active habits
  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
    include: {
      goal: { select: { id: true, title: true } },
      logs: {
        where: { date: todayDate },
        take: 1,
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Filter habits scheduled for today
  const todayDay = todayDate.getDay();
  const scheduledHabits = habits.filter((h: any) => {
    if (h.frequency === 'DAILY') return true;
    if (h.frequency === 'WEEKDAYS') return todayDay >= 1 && todayDay <= 5;
    if (h.frequency === 'CUSTOM') return h.customDays.includes(todayDay);
    return true;
  });

  // Calculate progress
  const completedTasks = tasks.filter((t: any) => t.completed).length;
  const completedHabits = scheduledHabits.filter((h: any) => h.logs[0]?.completed).length;
  const total = tasks.length + scheduledHabits.length;
  const completed = completedTasks + completedHabits;
  const percent = safePercent(completed, total);

  // Get active goals with progress
  const goals = await prisma.goal.findMany({
    where: { userId, status: 'ACTIVE' },
    include: {
      habits: {
        where: { active: true },
        include: {
          logs: {
            where: {
              date: { gte: new Date(Date.now() - 30 * 86400000) },
              completed: true,
            },
          },
        },
      },
      tasks: {
        where: { date: { gte: new Date(Date.now() - 30 * 86400000) } },
        select: { completed: true },
      },
    },
    take: 3,
    orderBy: { createdAt: 'asc' },
  });

  // Get today's note
  const note = await prisma.dailyNote.findUnique({
    where: { userId_date: { userId, date: todayDate } },
  });

  // Calculate overall streak (last 30 days)
  const last30 = await prisma.habitLog.findMany({
    where: {
      habit: { userId },
      date: { gte: new Date(Date.now() - 30 * 86400000) },
      completed: true,
    },
    select: { date: true },
    distinct: ['date'],
    orderBy: { date: 'desc' },
  });

  let streak = 0;
  const cursor = new Date(todayDate);
  for (const log of last30) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    if (logDate.getTime() === cursor.getTime()) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    tasks,
    scheduledHabits,
    goals,
    note,
    completedTasks,
    completedHabits,
    total,
    completed,
    percent,
    streak,
    todayStr,
    todayDate,
  };
}

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  
  const data = await getTodayData(userId);
  const greeting = getGreeting();
  const user = await prisma.user.findFirst({ where: { id: userId } });
  const userName = user?.name ?? 'there';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {greeting}, {userName} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {format(data.todayDate, 'EEEE, MMMM d')}
        </p>
      </div>

      {/* Progress Hero */}
      <TodayHero
        percent={data.percent}
        completed={data.completed}
        total={data.total}
        streak={data.streak}
        completedTasks={data.completedTasks}
        completedHabits={data.completedHabits}
      />

      {/* Grid layout for tasks + habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTaskList tasks={data.tasks} />
        <TodayHabitList habits={data.scheduledHabits} todayStr={data.todayStr} />
      </div>

      {/* Goals */}
      {data.goals.length > 0 && (
        <GoalProgressList goals={data.goals} />
      )}

      {/* Daily Note */}
      <TodayNoteSection note={data.note} todayStr={data.todayStr} />
    </div>
  );
}
