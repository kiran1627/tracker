'use client';

import { ProgressRing } from '@/components/ui/ProgressRing';
import { Flame, CheckCircle2, Repeat2 } from 'lucide-react';

interface TodayHeroProps {
  percent: number;
  completed: number;
  total: number;
  streak: number;
  completedTasks: number;
  completedHabits: number;
}

export function TodayHero({
  percent,
  completed,
  total,
  streak,
  completedTasks,
  completedHabits,
}: TodayHeroProps) {
  const remaining = total - completed;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Today&apos;s Progress
          </p>
          {total === 0 ? (
            <div>
              <p className="text-3xl font-bold text-slate-700">No activity</p>
              <p className="text-sm text-slate-400 mt-1">Add some tasks or habits to get started</p>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {completed}
                <span className="text-xl text-slate-400 font-medium"> / {total}</span>
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                {remaining > 0
                  ? `${remaining} remaining`
                  : '🎉 All done for today!'}
              </p>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-4">
            {streak > 0 && (
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-600">
                  {streak} day streak
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>{completedTasks} tasks</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Repeat2 className="w-3.5 h-3.5 text-violet-500" />
              <span>{completedHabits} habits</span>
            </div>
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div className="mt-4 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full gradient-brand transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          )}
        </div>

        {/* Ring */}
        {total > 0 && (
          <div className="ml-6 flex-shrink-0">
            <ProgressRing percent={percent} size={110} stroke={10} />
          </div>
        )}
      </div>
    </div>
  );
}
