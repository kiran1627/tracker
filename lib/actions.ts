'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUserId } from '@/lib/auth';
import { today } from '@/lib/dates';

// ── Tasks ────────────────────────────────────────────────

export async function createTask(data: {
  title: string;
  description?: string;
  date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  goalId?: string;
  estimatedMin?: number;
  time?: string;
  habitId?: string;
}) {
  const userId = await getCurrentUserId();
  const task = await prisma.task.create({
    data: {
      userId,
      title: data.title.trim(),
      description: data.description?.trim(),
      date: new Date(data.date),
      priority: data.priority,
      goalId: data.goalId || null,
      estimatedMin: data.estimatedMin,
      time: data.time || null,
      habitId: data.habitId || null,
    },
  });
  revalidatePath('/');
  revalidatePath('/tasks');
  return task;
}

export async function completeTask(taskId: string) {
  const userId = await getCurrentUserId();
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new Error('Task not found');

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !task.completed,
      completedAt: task.completed ? null : new Date(),
    },
  });

  if (updated.completed && updated.habitId) {
    const dateStr = updated.date.toISOString().split('T')[0];
    await completeHabit(updated.habitId, dateStr);
  }
  revalidatePath('/');
  revalidatePath('/tasks');
  revalidatePath('/progress');
  return updated;
}

export async function deleteTask(taskId: string) {
  const userId = await getCurrentUserId();
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new Error('Task not found');
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath('/');
  revalidatePath('/tasks');
}

export async function updateTask(taskId: string, data: {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  goalId?: string | null;
  estimatedMin?: number;
  time?: string | null;
}) {
  const userId = await getCurrentUserId();
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new Error('Task not found');

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description?.trim() }),
      ...(data.priority && { priority: data.priority }),
      ...(data.goalId !== undefined && { goalId: data.goalId }),
      ...(data.estimatedMin !== undefined && { estimatedMin: data.estimatedMin }),
      ...(data.time !== undefined && { time: data.time }),
    },
  });
  revalidatePath('/');
  revalidatePath('/tasks');
  return updated;
}

// ── Habits ───────────────────────────────────────────────

export async function createHabit(data: {
  title: string;
  description?: string;
  goalId?: string;
  frequency: 'DAILY' | 'WEEKDAYS' | 'CUSTOM';
  target: number;
  unit: string;
  reminderTime?: string;
  color: string;
  icon: string;
  customDays?: number[];
}) {
  const userId = await getCurrentUserId();
  const habit = await prisma.habit.create({
    data: {
      userId,
      title: data.title.trim(),
      description: data.description?.trim(),
      goalId: data.goalId || null,
      frequency: data.frequency,
      target: data.target,
      unit: data.unit.trim(),
      reminderTime: data.reminderTime,
      color: data.color,
      icon: data.icon,
      customDays: data.customDays || [],
    },
  });
  revalidatePath('/');
  revalidatePath('/habits');
  return habit;
}

export async function completeHabit(habitId: string, date: string) {
  const userId = await getCurrentUserId();
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw new Error('Habit not found');

  const logDate = new Date(date);
  logDate.setHours(0, 0, 0, 0);

  // Check existing log
  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date: logDate } },
  });

  const log = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date: logDate } },
    create: {
      habitId,
      date: logDate,
      completed: true,
      completedAt: new Date(),
    },
    update: {
      completed: !existing?.completed,
      completedAt: existing?.completed ? null : new Date(),
    },
  });

  revalidatePath('/');
  revalidatePath('/habits');
  revalidatePath('/progress');
  return log;
}

export async function deleteHabit(habitId: string) {
  const userId = await getCurrentUserId();
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw new Error('Habit not found');
  await prisma.habit.delete({ where: { id: habitId } });
  revalidatePath('/');
  revalidatePath('/habits');
}

export async function updateHabit(habitId: string, data: {
  title?: string;
  description?: string;
  goalId?: string | null;
  frequency?: 'DAILY' | 'WEEKDAYS' | 'CUSTOM';
  target?: number;
  unit?: string;
  color?: string;
  active?: boolean;
}) {
  const userId = await getCurrentUserId();
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw new Error('Habit not found');
  const updated = await prisma.habit.update({ where: { id: habitId }, data });
  revalidatePath('/');
  revalidatePath('/habits');
  return updated;
}

// ── Goals ────────────────────────────────────────────────

export async function createGoal(data: {
  title: string;
  description?: string;
  category: string;
  startDate: string;
  targetDate?: string;
}) {
  const userId = await getCurrentUserId();
  const goal = await prisma.goal.create({
    data: {
      userId,
      title: data.title.trim(),
      description: data.description?.trim(),
      category: data.category as any,
      startDate: new Date(data.startDate),
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
    },
  });
  revalidatePath('/');
  revalidatePath('/goals');
  return goal;
}

export async function updateGoal(goalId: string, data: {
  title?: string;
  description?: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  targetDate?: string | null;
}) {
  const userId = await getCurrentUserId();
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) throw new Error('Goal not found');
  const updated = await prisma.goal.update({
    where: { id: goalId },
    data: {
      ...(data.title && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description?.trim() }),
      ...(data.status && { status: data.status }),
      ...(data.targetDate !== undefined && {
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
      }),
    },
  });
  revalidatePath('/');
  revalidatePath('/goals');
  return updated;
}

export async function deleteGoal(goalId: string) {
  const userId = await getCurrentUserId();
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) throw new Error('Goal not found');
  await prisma.goal.delete({ where: { id: goalId } });
  revalidatePath('/');
  revalidatePath('/goals');
}

// ── Daily Notes ──────────────────────────────────────────

export async function saveDailyNote(data: {
  date: string;
  accomplishment?: string;
  learning?: string;
  difficulty?: string;
  tomorrow?: string;
  mood?: string;
}) {
  const userId = await getCurrentUserId();
  const date = new Date(data.date);
  date.setHours(0, 0, 0, 0);

  const note = await prisma.dailyNote.upsert({
    where: { userId_date: { userId, date } },
    create: {
      userId,
      date,
      accomplishment: data.accomplishment?.trim(),
      learning: data.learning?.trim(),
      difficulty: data.difficulty?.trim(),
      tomorrow: data.tomorrow?.trim(),
      mood: data.mood as any,
    },
    update: {
      accomplishment: data.accomplishment?.trim(),
      learning: data.learning?.trim(),
      difficulty: data.difficulty?.trim(),
      tomorrow: data.tomorrow?.trim(),
      mood: data.mood as any,
    },
  });

  revalidatePath('/');
  revalidatePath('/notes');
  return note;
}

// ── Focus Timer ──────────────────────────────────────────

export async function logFocusSession(durationMin: number) {
  const userId = await getCurrentUserId();
  const date = today();

  const session = await prisma.focusSession.create({
    data: {
      userId,
      durationMin,
      date,
    }
  });

  revalidatePath('/');
  return session;
}
