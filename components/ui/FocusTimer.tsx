'use client';

import { useState, useEffect, useTransition } from 'react';
import { Play, Pause, RotateCcw, Timer, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logFocusSession } from '@/lib/actions';

const DURATIONS = [15, 25, 45, 60];

export function FocusTimer() {
  const [durationMin, setDurationMin] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');
  const [showSettings, setShowSettings] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      
      // If it was a focus session, log it to the database
      if (mode === 'FOCUS') {
        startTransition(async () => {
          try {
            await logFocusSession(durationMin);
            // Play a sound or notification here
            alert(`Great job! Logged ${durationMin} minutes of focus time.`);
          } catch (error) {
            console.error('Failed to log session:', error);
          }
        });
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, durationMin]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'FOCUS' ? durationMin * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'FOCUS' | 'BREAK') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'FOCUS' ? durationMin * 60 : 5 * 60);
    setShowSettings(false);
  };

  const changeDuration = (mins: number) => {
    setDurationMin(mins);
    if (mode === 'FOCUS') {
      setTimeLeft(mins * 60);
      setIsRunning(false);
    }
    setShowSettings(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="px-5 py-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Focus Timer</span>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-slate-400 hover:text-indigo-500 transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 relative">
        {showSettings ? (
          <div className="absolute inset-0 bg-white/95 rounded-xl z-10 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Duration</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => changeDuration(d)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-md font-medium transition-colors border",
                    durationMin === d ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                  )}
                >
                  {d} min
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowSettings(false)}
              className="mt-3 text-[10px] text-slate-400 hover:text-slate-600 underline"
            >
              Cancel
            </button>
          </div>
        ) : null}

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
            disabled={isPending}
          >
            {isPending ? (
              <span className="opacity-80">Saving...</span>
            ) : (
              <>
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isRunning ? 'Pause' : 'Start'}
              </>
            )}
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
