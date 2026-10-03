'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { TimerCorner } from '@/types';
import { cn } from '@/lib/utils';

interface QuizTimerProps {
  minutes: number;
  corner: TimerCorner;
  /** When true the donut stays full and never ticks (e.g. quiz builder preview). */
  paused?: boolean;
  /** Manual pause toggled from the center button (only effective while running). */
  userPaused?: boolean;
  onTogglePause?: () => void;
}

const POSITION_CLASSES: Record<TimerCorner, string> = {
  'top-left': 'left-4 top-4 md:left-[304px]',
  'top-right': 'right-4 top-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

export function QuizTimer({ minutes, corner, paused = false, userPaused = false, onTogglePause }: QuizTimerProps) {
  const total = Math.max(1, Math.round(minutes * 60));
  const [secondsLeft, setSecondsLeft] = useState(total);
  const isPaused = paused || userPaused;

  useEffect(() => setSecondsLeft(Math.max(1, Math.round(minutes * 60))), [minutes]);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return;
    const interval = window.setInterval(() => setSecondsLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [secondsLeft, isPaused]);

  const display = `${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;
  const fraction = total > 0 ? Math.min(1, Math.max(0, secondsLeft / total)) : 0;
  const low = secondsLeft < 60;
  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <div
      role="timer"
      aria-label={paused ? `Timer preview: ${display}` : `Time remaining: ${display}`}
      className={cn(
        'pointer-events-none fixed z-[80] flex items-center gap-3 rounded-3xl border bg-background/90 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-md',
        low ? 'border-red-400/50' : 'border-border/70',
        POSITION_CLASSES[corner],
      )}
    >
      <span className="relative h-[56px] w-[56px] shrink-0">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <circle cx="32" cy="32" r={R} fill="none" stroke="currentColor" strokeWidth="7" className="text-muted" />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke={low ? '#f87171' : '#34d399'}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - fraction)}
          />
        </svg>
        <button
          type="button"
          onClick={onTogglePause}
          disabled={paused || !onTogglePause}
          aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
          title={isPaused ? 'Resume timer' : 'Pause timer'}
          className="absolute inset-0 flex items-center justify-center rounded-full text-foreground transition pointer-events-auto enabled:hover:scale-110 enabled:active:scale-95 disabled:cursor-default disabled:opacity-50"
        >
          {isPaused ? <Play className="h-5 w-5 fill-current" /> : <Pause className="h-5 w-5 fill-current" />}
        </button>
      </span>
      <span className="flex flex-col">
        <span className={cn('font-mono text-lg font-semibold tabular-nums leading-none', low ? 'text-red-500 dark:text-red-300' : 'text-foreground')}>
          {display}
        </span>
        <span className="mt-1 text-[11px] font-medium text-muted-foreground">{paused ? 'paused' : 'remaining'}</span>
      </span>
    </div>
  );
}
