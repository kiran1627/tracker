'use client';

import { useState, useTransition } from 'react';
import { Plus, Target, Trash2, CheckCircle2, Calendar } from 'lucide-react';
import { createGoal, updateGoal, deleteGoal } from '@/lib/actions';
import { safePercent, cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { format } from 'date-fns';

const CATEGORIES = [
  { value: 'CAREER', label: 'Career', icon: '💼' },
  { value: 'LEARNING', label: 'Learning', icon: '📚' },
  { value: 'HEALTH', label: 'Health', icon: '❤️' },
  { value: 'FITNESS', label: 'Fitness', icon: '💪' },
  { value: 'FINANCE', label: 'Finance', icon: '💰' },
  { value: 'PERSONAL', label: 'Personal', icon: '🌱' },
  { value: 'PROJECTS', label: 'Projects', icon: '🛠️' },
  { value: 'OTHER', label: 'Other', icon: '⭐' },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-indigo-50 text-indigo-700',
  COMPLETED: 'bg-green-50 text-green-700',
  PAUSED: 'bg-amber-50 text-amber-700',
};

function getGoalProgress(goal: any): number {
  const totalTasks = goal.tasks.length;
  const completedTasks = goal.tasks.filter((t: any) => t.completed).length;
  const totalHabitLogs = goal.habits.length * 30;
  const actualLogs = goal.habits.reduce((sum: number, h: any) => sum + h.logs.length, 0);
  const total = totalTasks + totalHabitLogs;
  const completed = completedTasks + actualLogs;
  return safePercent(completed, total);
}

export function GoalsClient({ goals }: { goals: any[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'PAUSED'>('ALL');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'CAREER',
    targetDate: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const filtered = goals.filter((g) => filter === 'ALL' || g.status === filter);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createGoal({
        title: form.title,
        description: form.description,
        category: form.category,
        startDate: form.startDate,
        targetDate: form.targetDate || undefined,
      });
      setForm({ title: '', description: '', category: 'CAREER', targetDate: '', startDate: format(new Date(), 'yyyy-MM-dd') });
      setOpen(false);
    });
  };

  const handleComplete = (goalId: string) => {
    startTransition(async () => { await updateGoal(goalId, { status: 'COMPLETED' }); });
  };

  const handleDelete = (goalId: string) => {
    if (confirm('Delete this goal? Associated habits and tasks will remain.')) {
      startTransition(async () => { await deleteGoal(goalId); });
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {(['ALL', 'ACTIVE', 'COMPLETED', 'PAUSED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg font-medium transition-all',
                filter === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500',
              )}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <button id="create-goal-btn" onClick={() => setOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No goals yet"
          description="Create a goal and turn your daily actions into measurable progress."
          action={
            <button onClick={() => setOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Create Goal
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((goal) => {
            const progress = getGoalProgress(goal);
            const cat = CATEGORIES.find((c) => c.value === goal.category);

            return (
              <div key={goal.id} className="card p-5 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl flex-shrink-0">{cat?.icon}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 leading-tight">{goal.title}</p>
                      {goal.description && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <span className={cn('badge text-[10px]', STATUS_COLORS[goal.status])}>
                      {goal.status.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">Progress</span>
                    <span className="text-sm font-semibold text-slate-700">{progress}%</span>
                  </div>
                  <ProgressBar percent={progress} />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span>{goal._count.habits} habits</span>
                  <span>{goal._count.tasks} tasks</span>
                  {goal.targetDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {goal.status === 'ACTIVE' && (
                    <button
                      id={`complete-goal-${goal.id}`}
                      onClick={() => handleComplete(goal.id)}
                      className="btn-ghost text-green-600 hover:bg-green-50 text-xs py-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="btn-ghost text-red-500 hover:bg-red-50 text-xs py-1.5 ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Create New Goal">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Goal name *</label>
            <input
              id="goal-title-input"
              type="text"
              className="input"
              placeholder="e.g. Become Job Ready"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="What does success look like?"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, category: cat.value }))}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                    form.category === cat.value
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300',
                  )}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start date</label>
              <input
                type="date"
                className="input"
                value={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target date</label>
              <input
                type="date"
                className="input"
                value={form.targetDate}
                onChange={(e) => setForm((p) => ({ ...p, targetDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={isPending}>
              {isPending ? 'Creating…' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
