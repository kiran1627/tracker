import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { format } from 'date-fns';
import { today } from '@/lib/dates';
import { HabitsClient } from '@/components/habits/HabitsClient';

export const dynamic = 'force-dynamic';

export default async function HabitsPage() {
  const userId = await getCurrentUserId();
  const todayDate = today();
  const todayStr = format(todayDate, 'yyyy-MM-dd');

  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      goal: { select: { id: true, title: true } },
      logs: {
        where: { date: { gte: new Date(Date.now() - 14 * 86400000) } },
        orderBy: { date: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  const goals = await prisma.goal.findMany({
    where: { userId, status: 'ACTIVE' },
    select: { id: true, title: true },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Habits</h1>
        <p className="text-sm text-slate-500 mt-0.5">Build consistent daily behaviors</p>
      </div>
      <HabitsClient habits={habits} goals={goals} todayStr={todayStr} />
    </div>
  );
}
