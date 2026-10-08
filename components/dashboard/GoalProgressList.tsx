'use client';

import Link from 'next/link';
import { Target, ChevronRight, Check, Trash2 } from 'lucide-react';
import { safePercent, cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { format } from 'date-fns';
import { useState, useTransition } from 'react';
import { completeTask, deleteTask } from '@/lib/actions';

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

interface Task {
  id: string;
  title: string;
  completed: boolean;
  goalId?: string | null;
}

export function GoalProgressList({ goals, tasks = [] }: { goals: Goal[], tasks?: Task[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteTask = (taskId: string) => {
    startTransition(async () => {
      await deleteTask(taskId);
    });
  };

  const handleCompleteTask = (taskId: string) => {
    startTransition(async () => {
      await completeTask(taskId);
    });
  };
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
        {goals.map((goal) => (
          <GoalItem 
            key={goal.id} 
            goal={goal} 
            tasks={tasks.filter(t => t.goalId === goal.id)}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            isPending={isPending}
          />
        ))}
      </div>
    </div>
  );
}

function GoalItem({
  goal,
  tasks,
  onCompleteTask,
  onDeleteTask,
  isPending
}: {
  goal: Goal;
  tasks: Task[];
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  isPending: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const progress = calculateGoalProgress(goal);

  return (
    <div className="flex flex-col gap-2">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="block group cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 transition-colors">
                  {goal.title}
                </p>
                <Link 
                  href={`/goals/${goal.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded hover:bg-indigo-100"
                >
                  View Goal
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {goal.targetDate && (
                  <p className="text-[11px] text-slate-400">
                    Due {format(new Date(goal.targetDate), 'MMM d')}
                  </p>
                )}
                {tasks.length > 0 && (
                  <span className="text-[11px] text-indigo-500 font-medium">
                    ({tasks.filter(t => t.completed).length}/{tasks.length} tasks today)
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className="text-sm font-semibold text-slate-600">{progress}%</span>
        </div>
        <ProgressBar percent={progress} />
      </div>
      
      {/* Expanded tasks */}
      {expanded && (
        <div className="ml-2 pl-4 border-l-2 border-slate-100 space-y-2 py-1 mb-2">
          {tasks.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">No tasks linked today.</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="group/task flex items-center justify-between gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onCompleteTask(task.id); }}
                  disabled={isPending}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-sm flex items-center justify-center border transition-colors",
                    task.completed ? "bg-indigo-500 border-indigo-500" : "border-slate-300 hover:border-indigo-400"
                  )}>
                    {task.completed && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    task.completed ? "text-slate-400 line-through" : "text-slate-700 hover:text-indigo-600 transition-colors"
                  )}>
                    {task.title}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this task?')) {
                      onDeleteTask(task.id);
                    }
                  }}
                  disabled={isPending}
                  className="opacity-0 group-hover/task:opacity-100 p-1 rounded text-slate-300 hover:text-red-500 transition-all"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
