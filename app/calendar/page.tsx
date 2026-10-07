import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';
import { CalendarClient } from '@/components/calendar/CalendarClient';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const userId = await getCurrentUserId();

  // Get last 90 days of data for the heatmap
  const since = new Date(Date.now() - 90 * 86400000);

  const habitLogs = await prisma.habitLog.findMany({
    where: { habit: { userId }, date: { gte: since }, completed: true },
    select: { date: true },
  });

  const tasks = await prisma.task.findMany({
    where: { userId, date: { gte: since } },
    select: { date: true, completed: true },
  });

  // Build date → completion data
  const dateMap: Record<string, { habits: number; tasks: number; totalTasks: number }> = {};

  for (const log of habitLogs) {
    const key = log.date.toISOString().slice(0, 10);
    if (!dateMap[key]) dateMap[key] = { habits: 0, tasks: 0, totalTasks: 0 };
    dateMap[key].habits++;
  }

  for (const task of tasks) {
    const key = task.date.toISOString().slice(0, 10);
    if (!dateMap[key]) dateMap[key] = { habits: 0, tasks: 0, totalTasks: 0 };
    dateMap[key].totalTasks++;
    if (task.completed) dateMap[key].tasks++;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Calendar</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your activity history at a glance</p>
      </div>
      <CalendarClient dateMap={dateMap} />
    </div>
  );
}
