'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Play a sound or notification here if desired
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'FOCUS' | 'BREAK') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="px-5 py-4 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Focus Timer</span>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <div className="flex items-center justify-center gap-2 mb-3">
          <button
            onClick={() => switchMode('FOCUS')}
            className={cn(
              'text-[10px] px-2 py-1 rounded-md font-medium transition-colors',
              mode === 'FOCUS' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-200'
            )}
          >
            Focus
          </button>
          <button
            onClick={() => switchMode('BREAK')}
            className={cn(
              'text-[10px] px-2 py-1 rounded-md font-medium transition-colors',
              mode === 'BREAK' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-200'
            )}
          >
            Break
          </button>
        </div>

        <div className="text-3xl font-bold text-center text-slate-800 mb-3 tracking-tight font-mono">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={toggleTimer}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-white transition-all',
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
            )}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="p-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
