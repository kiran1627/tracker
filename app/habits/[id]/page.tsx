import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Flame, Target, Repeat2, Calendar as CalIcon } from 'lucide-react';
import { completeHabit } from '@/lib/actions';
import { safePercent, cn } from '@/lib/utils';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function HabitDetailPage({ params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();

  const habit = await prisma.habit.findFirst({
    where: { id: params.id, userId },
    include: {
      goal: true,
      logs: {
        orderBy: { date: 'asc' }
      }
    }
  });

  if (!habit) return notFound();

  // Streak Calculation
  const logMap = new Map(habit.logs.map((l: any) => [format(new Date(l.date), 'yyyy-MM-dd'), l.completed]));
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  
  for (let i = 0; i < 90; i++) {
    const d = subDays(today, i);
    const key = format(d, 'yyyy-MM-dd');
    if (logMap.get(key)) {
      tempStreak++;
      if (i === 0 || currentStreak === tempStreak - 1) currentStreak = tempStreak;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      if (i > 0) tempStreak = 0;
    }
  }

  // Monthly Heatmap
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const completedThisMonth = monthDays.filter(d => logMap.get(format(d, 'yyyy-MM-dd'))).length;
  const monthConsistency = safePercent(completedThisMonth, monthDays.length);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <Link href="/habits" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Habits
      </Link>

      {/* Header */}
      <div className="card p-6 border-t-4" style={{ borderColor: habit.color }}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: habit.color + '20' }}>
            {habit.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{habit.title}</h1>
            {habit.description && <p className="text-slate-500 mt-1">{habit.description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Repeat2 className="w-3.5 h-3.5" /> Frequency
            </div>
            <p className="font-semibold text-slate-700 capitalize">{habit.frequency.toLowerCase()}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Target className="w-3.5 h-3.5" /> Target
            </div>
            <p className="font-semibold text-slate-700">{habit.target} {habit.unit}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" /> Streak
            </div>
            <p className="font-semibold text-slate-700">{currentStreak} days</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              <CalIcon className="w-3.5 h-3.5" /> Total
            </div>
            <p className="font-semibold text-slate-700">{habit.logs.filter((l: any) => l.completed).length}</p>
          </div>
        </div>

        {habit.goal && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium mb-1">Supporting Goal</p>
            <Link href={`/goals/${habit.goal.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              <Target className="w-4 h-4" /> {habit.goal.title}
            </Link>
          </div>
        )}
      </div>

      {/* Monthly Heatmap */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">This Month</h2>
          <span className="text-sm font-semibold text-indigo-600">{monthConsistency}% Consistency</span>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[10px] font-semibold text-slate-400 mb-1">{day}</div>
          ))}
          
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {monthDays.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isCompleted = logMap.get(dateStr);
            const isFuture = day > today;
            const toggleAction = completeHabit.bind(null, habit.id, dateStr);
            
            return (
              <form key={day.toISOString()} action={toggleAction} className="block w-full h-full">
                <button 
                  type="submit"
                  disabled={isFuture}
                  className={cn(
                    'w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all hover:scale-105 active:scale-95',
                    isCompleted ? 'text-white shadow-sm' : isFuture ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer'
                  )}
                  style={isCompleted ? { backgroundColor: habit.color } : undefined}
                  title={format(day, 'MMMM d, yyyy')}
                >
                  {format(day, 'd')}
                </button>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
