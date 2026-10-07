'use client';

import { useState, useTransition } from 'react';
import { Plus, Flame, Check, Trash2, Pencil } from 'lucide-react';
import { completeHabit, createHabit, deleteHabit } from '@/lib/actions';
import { cn, safePercent } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { format, subDays } from 'date-fns';

interface HabitLog {
  date: Date;
  completed: boolean;
}

interface Habit {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  target: number;
  unit: string;
  frequency: string;
  active: boolean;
  goal: { id: string; title: string } | null;
  logs: HabitLog[];
}

interface Goal {
  id: string;
  title: string;
}

const ICONS = ['⭐', '🧠', '🐍', '🏗️', '🏃', '📚', '🧘', '💪', '🎯', '💻', '✍️', '🎨'];
const COLORS = ['#6366F1', '#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

export function HabitsClient({
  habits,
  goals,
  todayStr,
}: {
  habits: Habit[];
  goals: Goal[];
  todayStr: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: '',
    description: '',
    goalId: '',
    frequency: 'DAILY' as 'DAILY' | 'WEEKDAYS' | 'CUSTOM',
    target: '1',
    unit: 'times',
    color: '#6366F1',
    icon: '⭐',
  });

  const activeHabits = habits.filter((h) => h.active);
  const archivedHabits = habits.filter((h) => !h.active);

  const handleComplete = (habitId: string) => {
    startTransition(() => completeHabit(habitId, todayStr));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createHabit({
        title: form.title,
        description: form.description,
        goalId: form.goalId || undefined,
        frequency: form.frequency,
        target: parseInt(form.target) || 1,
        unit: form.unit,
        color: form.color,
        icon: form.icon,
      });
      setForm({ title: '', description: '', goalId: '', frequency: 'DAILY', target: '1', unit: 'times', color: '#6366F1', icon: '⭐' });
      setOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this habit and all its logs?')) {
      startTransition(() => deleteHabit(id));
    }
  };

  // Last 7 days for mini calendar
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex justify-end">
        <button id="create-habit-btn" onClick={() => setOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Habit
        </button>
      </div>

      {/* Habits grid */}
      {activeHabits.length === 0 ? (
        <EmptyState
          icon="🔄"
          title="No habits yet"
          description="Start with one small habit. Consistency beats perfection."
          action={
            <button onClick={() => setOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Create Habit
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeHabits.map((habit) => {
            const todayLog = habit.logs.find(
              (l) => format(new Date(l.date), 'yyyy-MM-dd') === todayStr,
            );
            const isCompleted = todayLog?.completed;

            // Calculate 7-day consistency
            const logMap = new Map(
              habit.logs.map((l) => [format(new Date(l.date), 'yyyy-MM-dd'), l.completed]),
            );
            const last7Completed = last7.filter(
              (d) => logMap.get(format(d, 'yyyy-MM-dd')),
            ).length;
            const consistency = safePercent(last7Completed, 7);

            return (
              <div key={habit.id} className="card p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: habit.color + '20' }}
                    >
                      {habit.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{habit.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {habit.target} {habit.unit} · {habit.frequency.toLowerCase()}
                      </p>
                      {habit.goal && (
                        <p className="text-[11px] text-indigo-500 mt-0.5 truncate">↳ {habit.goal.title}</p>
                      )}
                    </div>
                  </div>

                  {/* Complete button */}
                  <button
                    id={`habit-complete-${habit.id}`}
                    onClick={() => handleComplete(habit.id)}
                    disabled={isPending}
                    className={cn(
                      'habit-check flex-shrink-0 mt-0.5',
                      isCompleted ? 'checked' : 'unchecked',
                    )}
                    aria-label={isCompleted ? 'Undo habit' : 'Mark complete'}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>

                {/* 7-day mini calendar */}
                <div className="mt-3">
                  <div className="flex items-center gap-1">
                    {last7.map((day, i) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const isToday = dateStr === todayStr;
                      const completed = logMap.get(dateStr);
                      return (
                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[9px] text-slate-400">{format(day, 'EEE')[0]}</span>
                          <div
                            className={cn(
                              'w-full aspect-square rounded max-w-[28px]',
                              completed
                                ? 'bg-indigo-500'
                                : isToday
                                ? 'bg-slate-200 ring-1 ring-indigo-300'
                                : 'bg-slate-100',
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-slate-400">{consistency}% this week</span>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                      aria-label="Delete habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Habit Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Create New Habit">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Habit name *</label>
            <input
              id="habit-title-input"
              type="text"
              className="input"
              placeholder="e.g. Solve DSA problems"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              className="input"
              placeholder="Optional details"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          {/* Icon + Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
              <div className="flex flex-wrap gap-1.5">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, icon }))}
                    className={cn(
                      'text-xl p-1.5 rounded-lg transition-all',
                      form.icon === icon ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'hover:bg-slate-100',
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, color }))}
                    className={cn(
                      'w-7 h-7 rounded-full transition-all',
                      form.color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : '',
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
              <select
                className="select"
                value={form.frequency}
                onChange={(e) => setForm((p) => ({ ...p, frequency: e.target.value as any }))}
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKDAYS">Weekdays</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target</label>
              <input
                type="number"
                className="input"
                min={1}
                value={form.target}
                onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
              <input
                type="text"
                className="input"
                placeholder="minutes"
                value={form.unit}
                onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
              />
            </div>
          </div>

          {goals.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link to goal</label>
              <select
                className="select"
                value={form.goalId}
                onChange={(e) => setForm((p) => ({ ...p, goalId: e.target.value }))}
              >
                <option value="">No goal</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={isPending}>
              {isPending ? 'Creating…' : 'Create Habit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
