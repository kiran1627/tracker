'use client';

import { useState, useTransition, useEffect } from 'react';
import { Plus, Check, Trash2, Clock, Calendar } from 'lucide-react';
import { completeTask, createTask, deleteTask } from '@/lib/actions';
import { cn, getPriorityColor } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { format, isToday, isPast, isFuture } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  completed: boolean;
  completedAt: Date | null;
  estimatedMin: number | null;
  time: string | null;
  goal: { id: string; title: string } | null;
}

interface Goal {
  id: string;
  title: string;
}

interface Habit {
  id: string;
  title: string;
}

export function TasksClient({ tasks: initialTasks, goals, habits = [] }: { tasks: Task[]; goals: Goal[]; habits?: Habit[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'PAST'>('TODAY');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    goalId: '',
    habitId: '',
    estimatedMin: '',
    time: '',
  });

  const filtered = tasks.filter((t) => {
    const d = new Date(t.date);
    if (filter === 'TODAY') return isToday(d);
    if (filter === 'UPCOMING') return isFuture(d) && !isToday(d);
    if (filter === 'PAST') return isPast(d) && !isToday(d);
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createTask({
        title: form.title,
        description: form.description || undefined,
        date: form.date,
        priority: form.priority,
        goalId: form.goalId || undefined,
        habitId: form.habitId || undefined,
        estimatedMin: form.estimatedMin ? parseInt(form.estimatedMin) : undefined,
        time: form.time || undefined,
      });
      setForm({ title: '', description: '', date: format(new Date(), 'yyyy-MM-dd'), priority: 'MEDIUM', goalId: '', habitId: '', estimatedMin: '', time: '' });
      setOpen(false);
    });
  };

  const priorityDot: Record<string, string> = {
    HIGH: 'bg-red-500',
    MEDIUM: 'bg-amber-400',
    LOW: 'bg-slate-300',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {(['TODAY', 'UPCOMING', 'PAST', 'ALL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg font-medium transition-all',
                filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500',
              )}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <button id="create-task-btn" onClick={() => setOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Tasks list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="✅"
          title={`No ${filter.toLowerCase()} tasks`}
          description="Add specific actions to move toward your goals."
          action={
            <button onClick={() => setOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => (
            <div
              key={task.id}
              className={cn(
                'group flex items-start gap-3 p-4 rounded-xl border card transition-all duration-200',
                task.completed ? 'opacity-60' : 'hover:border-indigo-200 hover:shadow-sm',
              )}
            >
              {/* Checkbox */}
              <button
                id={`task-check-${task.id}`}
                onClick={() => {
                  setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : null } : t));
                  startTransition(async () => { await completeTask(task.id); })
                }}
                className={cn('task-check mt-0.5', task.completed ? 'checked' : 'unchecked')}
                aria-label={task.completed ? 'Undo' : 'Complete'}
              >
                {task.completed && <Check className="w-3 h-3 text-white" />}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium text-slate-800', task.completed && 'line-through text-slate-400')}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className={cn('flex items-center gap-1 text-[11px] font-medium')}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', priorityDot[task.priority])} />
                    <span className="text-slate-400">{task.priority.toLowerCase()}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(task.date), 'MMM d')}
                  </span>
                  {task.time && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      {task.time}
                    </span>
                  )}
                  {task.estimatedMin && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {task.estimatedMin}m
                    </span>
                  )}
                  {task.goal && (
                    <span className="text-[11px] text-indigo-400">↳ {task.goal.title}</span>
                  )}
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => {
                  if (confirm('Delete task?')) {
                    setTasks(prev => prev.filter(t => t.id !== task.id));
                    startTransition(async () => { await deleteTask(task.id); });
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-slate-300 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task name *</label>
            <input
              id="new-task-title"
              type="text"
              className="input"
              placeholder="e.g. Solve Two Sum"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                className="input"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                className="select"
                value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as any }))}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time (optional)</label>
              <input
                type="time"
                className="input"
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Est. time (min)</label>
              <input
                type="number"
                className="input"
                placeholder="45"
                min={1}
                value={form.estimatedMin}
                onChange={(e) => setForm((p) => ({ ...p, estimatedMin: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {habits.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link Habit</label>
                <select
                  className="select"
                  value={form.habitId}
                  onChange={(e) => setForm((p) => ({ ...p, habitId: e.target.value }))}
                >
                  <option value="">No habit</option>
                  {habits.map((h) => (
                    <option key={h.id} value={h.id}>{h.title}</option>
                  ))}
                </select>
              </div>
            )}
            {goals.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link Goal</label>
                <select
                  className="select"
                  value={form.goalId}
                  onChange={(e) => setForm((p) => ({ ...p, goalId: e.target.value }))}
                >
                  <option value="">No goal</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={isPending}>
              {isPending ? 'Adding…' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
