import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Target, Calendar, CheckSquare, Flame } from 'lucide-react';
import { safePercent, cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function GoalDetailPage({ params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();

  const goal = await prisma.goal.findFirst({
    where: { id: params.id, userId },
    include: {
      habits: {
        include: {
          logs: { where: { completed: true }, orderBy: { date: 'desc' } }
        }
      },
      tasks: {
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!goal) return notFound();

  // Progress Calculation
  const totalTasks = goal.tasks.length;
  const completedTasks = goal.tasks.filter((t: any) => t.completed).length;
  const totalHabitLogs = goal.habits.length * 30; // approx
  const actualLogs = goal.habits.reduce((sum: number, h: any) => sum + h.logs.length, 0);
  
  const total = totalTasks + totalHabitLogs;
  const completed = completedTasks + actualLogs;
  const progress = safePercent(completed, total);

  // Timeline (merge tasks and habit logs)
  const timeline: Array<{ id: string; date: Date; title: string; type: 'TASK' | 'HABIT'; completed: boolean }> = [];
  
  goal.tasks.forEach((t: any) => {
    timeline.push({ id: `task-${t.id}`, date: t.date, title: t.title, type: 'TASK', completed: t.completed });
  });
  
  goal.habits.forEach((h: any) => {
    h.logs.forEach((l: any) => {
      timeline.push({ id: `log-${l.id}`, date: l.date, title: `Completed ${h.title}`, type: 'HABIT', completed: true });
    });
  });

  timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
  const recentActivity = timeline.slice(0, 15);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <Link href="/goals" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Goals
      </Link>

      {/* Header */}
      <div className="card p-6 border-t-4 border-t-indigo-500">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{goal.title}</h1>
            {goal.description && <p className="text-slate-500 mt-2">{goal.description}</p>}
          </div>
          <span className={cn('badge text-xs', goal.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-700' : 'bg-green-50 text-green-700')}>
            {goal.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-400" />
            <span>Category: {goal.category}</span>
          </div>
          {goal.targetDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Target: {format(new Date(goal.targetDate), 'MMMM d, yyyy')}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
            <span className="text-xl font-bold text-indigo-600">{progress}%</span>
          </div>
          <ProgressBar percent={progress} height="h-3" color="gradient-brand" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supporting Habits */}
        <div className="card p-5">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" /> Habits
          </h2>
          {goal.habits.length === 0 ? (
            <p className="text-sm text-slate-400">No habits assigned.</p>
          ) : (
            <div className="space-y-3">
              {goal.habits.map((h: any) => (
                <div key={h.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{h.icon}</span>
                    <span className="text-sm font-medium text-slate-800">{h.title}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{h.logs.length} completions</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Supporting Tasks */}
        <div className="card p-5">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-green-500" /> Tasks
          </h2>
          {goal.tasks.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks assigned.</p>
          ) : (
            <div className="space-y-3">
              {goal.tasks.slice(0, 5).map((t: any) => (
                <div key={t.id} className={cn('p-3 rounded-xl border', t.completed ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-white border-slate-200')}>
                  <p className={cn('text-sm font-medium', t.completed ? 'text-slate-500 line-through' : 'text-slate-800')}>
                    {t.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{format(new Date(t.date), 'MMM d, yyyy')}</p>
                </div>
              ))}
              {goal.tasks.length > 5 && (
                <p className="text-xs text-center text-slate-400 pt-2">+{goal.tasks.length - 5} more</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h2 className="section-title mb-5">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-slate-400">No recent activity for this goal.</p>
        ) : (
          <div className="space-y-6">
            {recentActivity.map((item, i) => (
              <div key={item.id} className="relative flex gap-4">
                {/* Timeline line */}
                {i !== recentActivity.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200" />
                )}
                
                {/* Icon */}
                <div className={cn(
                  'relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  item.type === 'HABIT' ? 'bg-orange-100 text-orange-600' : 
                  item.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                )}>
                  {item.type === 'HABIT' ? <Flame className="w-3 h-3" /> : <CheckSquare className="w-3 h-3" />}
                </div>

                {/* Content */}
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {format(new Date(item.date), 'EEEE, MMMM d')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
