import { HabitLog, HabitFrequency } from '@prisma/client';
import { isBefore, isAfter, isSameDay, subDays, format } from 'date-fns';

export interface StreakResult {
  current: number;
  best: number;
}

/**
 * Checks if a given date is a scheduled day for the habit
 */
function isScheduledDay(date: Date, frequency: HabitFrequency, customDays: number[]): boolean {
  if (frequency === 'DAILY') return true;
  if (frequency === 'WEEKDAYS') {
    const day = date.getDay(); // 0=Sun, 6=Sat
    return day >= 1 && day <= 5;
  }
  if (frequency === 'CUSTOM') {
    return customDays.includes(date.getDay());
  }
  return true;
}

/**
 * Gets dates that were scheduled but not completed between startDate and today
 * Returns the current streak (consecutive completed scheduled days ending today or yesterday)
 * And the best streak ever
 */
export function calculateStreaks(
  logs: HabitLog[],
  frequency: HabitFrequency,
  customDays: number[],
  startDate: Date,
): StreakResult {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build a map of completed dates
  const completedDates = new Set(
    logs
      .filter((l) => l.completed)
      .map((l) => format(new Date(l.date), 'yyyy-MM-dd')),
  );

  // Generate all scheduled days from startDate to today
  const scheduledDays: Date[] = [];
  let cursor = new Date(startDate);
  cursor.setHours(0, 0, 0, 0);

  while (!isAfter(cursor, today)) {
    if (isScheduledDay(cursor, frequency, customDays)) {
      scheduledDays.push(new Date(cursor));
    }
    cursor = new Date(cursor.getTime() + 86400000);
  }

  if (scheduledDays.length === 0) return { current: 0, best: 0 };

  // Calculate streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  for (let i = scheduledDays.length - 1; i >= 0; i--) {
    const dateKey = format(scheduledDays[i], 'yyyy-MM-dd');
    const isCompleted = completedDates.has(dateKey);
    const isToday = isSameDay(scheduledDays[i], today);

    if (isCompleted) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;

      // For current streak: we count backwards from most recent scheduled day
      if (i === scheduledDays.length - 1 || isToday) {
        currentStreak = tempStreak;
      }
    } else {
      // If today is not yet completed, don't break the streak yet
      if (isToday) continue;
      // Missed a scheduled day - break streak
      if (currentStreak === 0 && i === scheduledDays.length - 1) {
        // Most recent day wasn't completed
        currentStreak = 0;
      } else if (currentStreak > 0) {
        break;
      }
      tempStreak = 0;
    }
  }

  // If current streak hasn't been set yet (all completed in sequence)
  if (currentStreak === 0 && tempStreak > 0 && completedDates.has(format(scheduledDays[scheduledDays.length - 1], 'yyyy-MM-dd'))) {
    currentStreak = tempStreak;
  }

  return { current: currentStreak, best: Math.max(bestStreak, currentStreak) };
}

/**
 * Calculate current streak from the last N days of habit logs
 * Simplified version for display
 */
export function getSimpleStreak(
  logs: HabitLog[],
  frequency: HabitFrequency,
  customDays: number[],
  startDate: Date,
): number {
  return calculateStreaks(logs, frequency, customDays, startDate).current;
}
