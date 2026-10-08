import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { today } from '@/lib/dates';
import { TasksClient } from '@/components/tasks/TasksClient';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const userId = await getCurrentUserId();
  const todayDate = today();

  const tasks = await prisma.task.findMany({
    where: { userId },
    include: { goal: { select: { id: true, title: true } } },
    orderBy: [{ date: 'desc' }, { priority: 'desc' }],
    take: 100,
  });

  const goals = await prisma.goal.findMany({
    where: { userId, status: 'ACTIVE' },
    select: { id: true, title: true },
  });

  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
    select: { id: true, title: true },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
        <p className="text-sm text-slate-500 mt-0.5">All your specific actions</p>
      </div>
      <TasksClient tasks={tasks} goals={goals} habits={habits} />
    </div>
  );
}
