'use client';

import { useState, useTransition } from 'react';
import { CheckSquare, Plus, Clock, Trash2, Check } from 'lucide-react';
import { completeTask, deleteTask, createTask } from '@/lib/actions';
import { getPriorityColor, cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  completed: boolean;
  completedAt: Date | null;
  estimatedMin: number | null;
  time: string | null;
  goal: { id: string; title: string } | null;
}

export function TodayTaskList({ tasks }: { tasks: Task[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    estimatedMin: '',
    time: '',
  });

  const handleComplete = (id: string) => {
    startTransition(async () => {
      await completeTask(id);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) {
      startTransition(async () => {
        await deleteTask(id);
      });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    startTransition(async () => {
      await createTask({
        title: form.title,
        priority: form.priority,
        date: format(new Date(), 'yyyy-MM-dd'),
        estimatedMin: form.estimatedMin ? parseInt(form.estimatedMin) : undefined,
        time: form.time || undefined,
      });
      setForm({ title: '', priority: 'MEDIUM', estimatedMin: '', time: '' });
      setOpen(false);
    });
  };

  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-indigo-500" />
          <h2 className="section-title">Today&apos;s Tasks</h2>
          {tasks.length > 0 && (
            <span className="badge bg-indigo-50 text-indigo-600 text-[11px]">
              {pending.length} left
            </span>
          )}
        </div>
        <button
          id="add-task-btn"
          onClick={() => setOpen(true)}
          className="btn-ghost text-indigo-600 hover:bg-indigo-50"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Add</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No tasks today"
          description="Start with one small task to make progress."
          action={
            <button onClick={() => setOpen(true)} className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {/* Pending tasks */}
          {pending.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          ))}

          {/* Completed tasks */}
          {done.length > 0 && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pt-2 pb-1">
                Completed
              </p>
              {done.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Quick Add Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task name *</label>
            <input
              id="task-title-input"
              type="text"
              className="input"
              placeholder="e.g. Solve Two Sum problem"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                className="select"
                value={form.priority}
                onChange={(e) =>
                  setForm((p) => ({ ...p, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' }))
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Time (optional)
              </label>
              <input
                type="time"
                className="input"
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={isPending}>
              {isPending ? 'Adding…' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function TaskItem({
  task,
  onComplete,
  onDelete,
}: {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const priorityColors: Record<string, string> = {
    HIGH: 'bg-red-500',
    MEDIUM: 'bg-amber-400',
    LOW: 'bg-slate-300',
  };

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-3 rounded-xl border transition-all duration-200',
        task.completed
          ? 'bg-slate-50 border-slate-100'
          : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm',
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onComplete(task.id)}
        id={`complete-task-${task.id}`}
        className={cn(
          'task-check mt-0.5',
          task.completed ? 'checked' : 'unchecked',
        )}
        aria-label={task.completed ? 'Undo task' : 'Complete task'}
      >
        {task.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium leading-tight',
            task.completed ? 'line-through text-slate-400' : 'text-slate-800',
          )}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {/* Priority dot */}
          <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', priorityColors[task.priority])} />
          <span className="text-[11px] text-slate-400 capitalize">{task.priority.toLowerCase()}</span>

          {task.time && (
            <span className="flex items-center gap-0.5 text-[11px] font-medium text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
              <Clock className="w-3 h-3" />
              {task.time}
            </span>
          )}
          {task.estimatedMin && (
            <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {task.estimatedMin}m
            </span>
          )}
          {task.goal && (
            <span className="text-[11px] text-indigo-400 truncate max-w-[120px]">
              ↳ {task.goal.title}
            </span>
          )}
          {task.completed && task.completedAt && (
            <span className="text-[11px] text-green-500">
              ✓ {format(new Date(task.completedAt), 'h:mm a')}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-300 hover:text-red-500 transition-all"
        aria-label="Delete task"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
