import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percent: number;
  className?: string;
  height?: string;
  color?: string;
}

export function ProgressBar({ percent, className, height = 'h-2', color }: ProgressBarProps) {
  return (
    <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', height, className)}>
      <div
        className={cn(
          'h-full rounded-full transition-all duration-700 ease-out',
          color || 'gradient-brand',
        )}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
