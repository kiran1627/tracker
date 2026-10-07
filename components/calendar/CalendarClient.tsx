'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isToday,
  subMonths,
  addMonths,
} from 'date-fns';
import { cn, safePercent } from '@/lib/utils';

interface DayData {
  habits: number;
  tasks: number;
  totalTasks: number;
}

interface CalendarClientProps {
  dateMap: Record<string, DayData>;
}

function getIntensityClass(percent: number) {
  if (percent === 0) return 'bg-slate-100 hover:bg-slate-200';
  if (percent < 25) return 'bg-indigo-100 hover:bg-indigo-200';
  if (percent < 50) return 'bg-indigo-200 hover:bg-indigo-300';
  if (percent < 75) return 'bg-indigo-400 hover:bg-indigo-500';
  return 'bg-indigo-600 hover:bg-indigo-700';
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarClient({ dateMap }: CalendarClientProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const startDayOfWeek = getDay(start);

  const selectedData = selectedDate ? dateMap[selectedDate] : null;

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            id="prev-month-btn"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="btn-ghost"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold text-slate-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            id="next-month-btn"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="btn-ghost"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map((day) => (
            <div key={day} className="text-center text-[11px] font-semibold text-slate-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const data = dateMap[dateStr];
            const total = (data?.habits || 0) + (data?.totalTasks || 0);
            const completed = (data?.habits || 0) + (data?.tasks || 0);
            const percent = safePercent(completed, total);
            const isSelected = selectedDate === dateStr;
            const today = isToday(day);

            return (
              <button
                key={dateStr}
                id={`cal-day-${dateStr}`}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={cn(
                  'relative aspect-square rounded-lg transition-all duration-150 flex flex-col items-center justify-center gap-0.5',
                  total > 0 ? getIntensityClass(percent) : 'bg-slate-50 hover:bg-slate-100',
                  isSelected && 'ring-2 ring-indigo-500 ring-offset-1',
                  today && 'ring-2 ring-indigo-300',
                )}
                title={`${format(day, 'MMMM d')}: ${completed}/${total} completed`}
              >
                <span
                  className={cn(
                    'text-[11px] font-medium',
                    percent >= 75 ? 'text-white' : today ? 'text-indigo-600 font-bold' : 'text-slate-600',
                  )}
                >
                  {format(day, 'd')}
                </span>
                {total > 0 && (
                  <span
                    className={cn(
                      'text-[9px] font-semibold',
                      percent >= 75 ? 'text-indigo-100' : 'text-indigo-500',
                    )}
                  >
                    {percent}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>Less</span>
        {[0, 25, 50, 75, 100].map((p) => (
          <div
            key={p}
            className={cn('w-4 h-4 rounded', getIntensityClass(p))}
            title={`${p}%`}
          />
        ))}
        <span>More</span>
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div className="card p-5 animate-fade-in">
          <h3 className="text-base font-semibold text-slate-800 mb-3">
            {format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
          </h3>
          {selectedData ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-xl">
                <p className="text-2xl font-bold text-indigo-600">{selectedData.habits}</p>
                <p className="text-xs text-slate-500 mt-1">Habits completed</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-700">
                  {selectedData.tasks}/{selectedData.totalTasks}
                </p>
                <p className="text-xs text-slate-500 mt-1">Tasks done</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">
                  {safePercent(
                    selectedData.habits + selectedData.tasks,
                    selectedData.habits + selectedData.totalTasks,
                  )}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Completion</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No activity recorded for this day.</p>
          )}
        </div>
      )}
    </div>
  );
}
