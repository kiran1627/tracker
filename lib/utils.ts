import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Safely round a number to given decimal places
 */
export function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculate percentage safely (avoids NaN / division by zero)
 */
export function safePercent(completed: number, total: number): number {
  if (total === 0) return 0;
  return round((completed / total) * 100);
}

/**
 * Get intensity class for calendar heatmap
 */
export function getHeatmapIntensity(percent: number): string {
  if (percent === 0) return 'bg-slate-100';
  if (percent < 25) return 'bg-indigo-100';
  if (percent < 50) return 'bg-indigo-200';
  if (percent < 75) return 'bg-indigo-400';
  return 'bg-indigo-600';
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'HIGH':
      return 'text-red-500 bg-red-50';
    case 'MEDIUM':
      return 'text-amber-500 bg-amber-50';
    case 'LOW':
      return 'text-slate-500 bg-slate-100';
    default:
      return 'text-slate-500 bg-slate-100';
  }
}

/**
 * Get mood emoji
 */
export function getMoodEmoji(mood: string | null | undefined): string {
  switch (mood) {
    case 'TERRIBLE': return '😞';
    case 'BAD': return '😐';
    case 'OKAY': return '🙂';
    case 'GOOD': return '😊';
    case 'GREAT': return '🤩';
    default: return '—';
  }
}

/**
 * Truncate string to given length
 */
export function truncate(str: string, length = 50): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

/**
 * Format a number with commas
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}
