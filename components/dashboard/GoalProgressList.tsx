import Link from 'next/link';
import { Target, ChevronRight } from 'lucide-react';
import { safePercent } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { format } from 'date-fns';

interface Goal {
  id: string;
  title: string;
  category: string;
  targetDate: Date | null;
  status: string;
  habits: Array<{ logs: Array<{ date: Date }> }>;
  tasks: Array<{ completed: boolean }>;
}

function calculateGoalProgress(goal: Goal): number {
  const totalTasks = goal.tasks.length;
  const completedTasks = goal.tasks.filter((t) => t.completed).length;
  const totalHabitLogs = goal.habits.length * 30; // expected logs in 30 days
  const actualLogs = goal.habits.reduce((sum, h) => sum + h.logs.length, 0);

  const total = totalTasks + totalHabitLogs;
  const completed = completedTasks + actualLogs;
  return safePercent(completed, total);
}

export function GoalProgressList({ goals }: { goals: Goal[] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-500" />
          <h2 className="section-title">Goal Progress</h2>
        </div>
        <Link href="/goals" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal);
          return (
            <Link key={goal.id} href={`/goals/${goal.id}`} className="block group">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 transition-colors">
                    {goal.title}
                  </p>
                  {goal.targetDate && (
                    <p className="text-[11px] text-slate-400">
                      Due {format(new Date(goal.targetDate), 'MMM d')}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-600">{progress}%</span>
              </div>
              <ProgressBar percent={progress} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
