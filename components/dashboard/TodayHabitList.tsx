'use client';

import { useTransition, useState, useEffect } from 'react';
import { Repeat2, Check, Flame } from 'lucide-react';
import { completeHabit } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

interface Habit {
  id: string;
  title: string;
  icon: string;
  color: string;
  target: number;
  unit: string;
  frequency: string;
  goal: { id: string; title: string } | null;
  logs: Array<{ completed: boolean; completedAt: Date | null }>;
}

interface TodayHabitListProps {
  habits: Habit[];
  todayStr: string;
}

export function TodayHabitList({ habits: initialHabits, todayStr }: TodayHabitListProps) {
  const [habits, setHabits] = useState(initialHabits);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  const handleComplete = (habitId: string) => {
    // Optimistic update
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isCompleted = h.logs[0]?.completed;
        return {
          ...h,
          logs: [{ completed: !isCompleted, completedAt: !isCompleted ? new Date() : null }]
        };
      }
      return h;
    }));

    startTransition(async () => {
      await completeHabit(habitId, todayStr);
    });
  };

  const pending = habits.filter((h) => !h.logs[0]?.completed);
  const done = habits.filter((h) => h.logs[0]?.completed);

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Repeat2 className="w-4 h-4 text-violet-500" />
          <h2 className="section-title">Today&apos;s Habits</h2>
          {habits.length > 0 && (
            <span className="badge bg-violet-50 text-violet-600 text-[11px]">
              {pending.length} left
            </span>
          )}
        </div>
      </div>

      {habits.length === 0 ? (
        <EmptyState
          icon="🔄"
          title="No habits scheduled"
          description="Create a habit and it'll show up here."
        />
      ) : (
        <div className="space-y-6">
          {/* Group pending habits by Goal/Track */}
          {Object.entries(
            pending.reduce((acc, habit) => {
              const track = habit.goal?.title || 'Daily Routine';
              if (!acc[track]) acc[track] = [];
              acc[track].push(habit);
              return acc;
            }, {} as Record<string, Habit[]>)
          ).map(([track, trackHabits]) => (
            <div key={track} className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                {track}
              </p>
              {trackHabits.map((habit) => (
                <HabitItem key={habit.id} habit={habit} onComplete={handleComplete} isPending={isPending} />
              ))}
            </div>
          ))}

          {done.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-green-500 pb-1">
                Completed Today
              </p>
              {done.map((habit) => (
                <HabitItem key={habit.id} habit={habit} onComplete={handleComplete} isPending={isPending} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HabitItem({
  habit,
  onComplete,
  isPending,
}: {
  habit: Habit;
  onComplete: (id: string) => void;
  isPending: boolean;
}) {
  const isCompleted = habit.logs[0]?.completed;

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
        isCompleted
          ? 'bg-slate-50 border-slate-100'
          : 'bg-white border-slate-200 hover:border-violet-200 hover:shadow-sm',
      )}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: isCompleted ? '#F1F5F9' : habit.color + '20' }}
      >
        {habit.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium leading-tight',
            isCompleted ? 'line-through text-slate-400' : 'text-slate-800',
          )}
        >
          {habit.title}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {habit.target} {habit.unit}
          {habit.goal && (
            <span className="text-indigo-400 ml-1.5 truncate">↳ {habit.goal.title}</span>
          )}
        </p>
      </div>

      {/* Complete button */}
      <button
        id={`complete-habit-${habit.id}`}
        onClick={() => onComplete(habit.id)}
        disabled={isPending}
        className={cn(
          'habit-check flex-shrink-0',
          isCompleted ? 'checked' : 'unchecked',
        )}
        aria-label={isCompleted ? 'Undo habit' : 'Complete habit'}
      >
        {isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
      </button>
    </div>
  );
}
