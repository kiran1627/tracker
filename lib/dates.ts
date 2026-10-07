import { format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

/**
 * Returns today as a Date with time set to 00:00:00
 */
export function today(): Date {
  const d = new Date();
  // Shift time backwards by 8 hours so the day rolls over at 8 AM
  d.setHours(d.getHours() - 8);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, fmt = 'MMMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt);
}

/**
 * Format date as yyyy-MM-dd for DB queries
 */
export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get start and end of today
 */
export function todayRange() {
  const d = today();
  return { start: startOfDay(d), end: endOfDay(d) };
}

/**
 * Get start and end of current week (Mon-Sun)
 */
export function thisWeekRange() {
  const d = new Date();
  return {
    start: startOfWeek(d, { weekStartsOn: 1 }),
    end: endOfWeek(d, { weekStartsOn: 1 }),
  };
}

/**
 * Get start and end of current month
 */
export function thisMonthRange() {
  const d = new Date();
  return { start: startOfMonth(d), end: endOfMonth(d) };
}

/**
 * Get greeting based on hour
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Get day name abbreviation
 */
export function getDayAbbr(date: Date): string {
  return format(date, 'EEE');
}

/**
 * Returns an array of the last N days
 */
export function getLastNDays(n: number): Date[] {
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

/**
 * Get all days in a month
 */
export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
