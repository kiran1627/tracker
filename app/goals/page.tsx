import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { GoalsClient } from '@/components/goals/GoalsClient';

export const dynamic = 'force-dynamic';

export default async function GoalsPage() {
  const userId = await getCurrentUserId();

  const goals = await prisma.goal.findMany({
    where: { userId },
    include: {
      habits: {
        where: { active: true },
        include: {
          logs: {
            where: {
              date: { gte: new Date(Date.now() - 30 * 86400000) },
              completed: true,
            },
          },
        },
      },
      tasks: {
        where: { date: { gte: new Date(Date.now() - 30 * 86400000) } },
        select: { completed: true },
      },
      _count: { select: { habits: true, tasks: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Goals</h1>
        <p className="text-sm text-slate-500 mt-0.5">Define what you want to achieve</p>
      </div>
      <GoalsClient goals={goals} />
    </div>
  );
}
