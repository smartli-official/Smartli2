'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, Minus, Plus } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface FocusDurations {
  focusMin: number;
  shortMin: number;
  longMin: number;
  sessionsUntilLong: number;
}

const DEFAULT_DURATIONS: FocusDurations = {
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  sessionsUntilLong: 4,
};

const STORAGE_KEY = 'smartli-focus-settings-v1';

function readDurations(): FocusDurations {
  if (typeof window === 'undefined') return DEFAULT_DURATIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_DURATIONS, ...(JSON.parse(raw) as Partial<FocusDurations>) };
  } catch {
    /* ignore */
  }
  return DEFAULT_DURATIONS;
}

/** Tiny completion chime — WebAudio so no asset file is needed. */
function playChime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.4);
    });
    window.setTimeout(() => void ctx.close(), 1200);
  } catch {
    /* audio blocked — ignore */
  }
}

function Stepper({
  value,
  min,
  max,
  onChange,
  size = 'md',
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  size?: 'lg' | 'md';
  ariaLabel: string;
}) {
  const btn = cn(
    'flex items-center justify-center rounded-xl bg-white/[0.08] text-white transition hover:bg-white/[0.14] active:scale-95',
    size === 'lg' ? 'h-11 w-11 text-lg' : 'h-9 w-9'
  );
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.04]',
        size === 'lg' ? 'px-2.5 py-2.5' : 'px-2 py-2'
      )}
    >
      <button
        type="button"
        aria-label={`Decrease ${ariaLabel}`}
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={size === 'lg' ? 18 : 15} />
      </button>
      <span className="min-w-[3rem] text-center font-bold tabular-nums text-white" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${ariaLabel}`}
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={size === 'lg' ? 18 : 15} />
      </button>
    </div>
  );
}

export const SmartTimer = () => {
  const [durations, setDurations] = useState<FocusDurations>(DEFAULT_DURATIONS);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS.focusMin * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [completedInCycle, setCompletedInCycle] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Which field the big stepper in the modal edits — mirrors the blue ring in the reference.
  const [selectedTarget, setSelectedTarget] = useState<'focus' | 'short' | 'long'>('focus');
  // Draft values while the modal is open (Cancel discards them).
  const [draft, setDraft] = useState<FocusDurations>(DEFAULT_DURATIONS);

  const durationsRef = useRef(durations);
  durationsRef.current = durations;
  const modeRef = useRef<TimerMode>('work');
  modeRef.current = mode;
  const cycleRef = useRef(0);

  // Load persisted durations once.
  useEffect(() => {
    const saved = readDurations();
    setDurations(saved);
    setDraft(saved);
    setTimeLeft((prev) => (modeRef.current === 'work' ? saved.focusMin * 60 : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const durationFor = useCallback(
    (m: TimerMode, d: FocusDurations = durationsRef.current) =>
      m === 'work' ? d.focusMin * 60 : m === 'shortBreak' ? d.shortMin * 60 : d.longMin * 60,
    []
  );

  const persist = useCallback((next: FocusDurations) => {
    setDurations(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  }, []);

  const advanceFromWork = useCallback(() => {
    const d = durationsRef.current;
    setSessionsToday((n) => n + 1);
    const nextCount = cycleRef.current + 1;
    const isLong = nextCount % Math.max(1, d.sessionsUntilLong) === 0;
    const nextMode: TimerMode = isLong ? 'longBreak' : 'shortBreak';
    cycleRef.current = isLong ? 0 : nextCount;
    setCompletedInCycle(cycleRef.current);
    setMode(nextMode);
    setTimeLeft(durationFor(nextMode, d));
    setIsActive(true); // auto-start the break so the cycle keeps flowing
  }, [durationFor]);

  const advanceFromBreak = useCallback(() => {
    const d = durationsRef.current;
    setMode('work');
    setTimeLeft(durationFor('work', d));
    setIsActive(true); // auto-start the next focus block
  }, [durationFor]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeft === 0) {
      // Phase finished — chime and auto-advance the pomodoro cycle.
      if (modeRef.current === 'work') {
        playChime();
        advanceFromWork();
      } else {
        playChime();
        advanceFromBreak();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, advanceFromWork, advanceFromBreak]);

  // Esc closes the settings panel.
  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settingsOpen]);

  const openSettings = () => {
    setDraft(durations);
    setSelectedTarget(mode === 'longBreak' ? 'long' : mode === 'shortBreak' ? 'short' : 'focus');
    setSettingsOpen(true);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) return;
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durationFor(mode));
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(durationFor(newMode));
  };

  const applyDraftAndStart = () => {
    persist(draft);
    setMode('work');
    setTimeLeft(draft.focusMin * 60);
    setIsActive(true);
    setSettingsOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ---- Donut (fixed geometry) ----
  // viewBox-based ring so the circumference math actually matches the pixels.
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const totalTime = durationFor(mode);
  const progress = totalTime > 0 ? Math.min(1, Math.max(0, timeLeft / totalTime)) : 0;
  const strokeDashoffset = CIRC * (1 - progress);

  const MODE_META: Record<TimerMode, { label: string; icon: typeof Brain }> = {
    work: { label: 'Work', icon: Brain },
    shortBreak: { label: 'Short Break', icon: Coffee },
    longBreak: { label: 'Long Break', icon: Coffee },
  };

  const bigValue = selectedTarget === 'focus' ? draft.focusMin : selectedTarget === 'short' ? draft.shortMin : draft.longMin;
  const setBigValue = (v: number) =>
    setDraft((d) =>
      selectedTarget === 'focus'
        ? { ...d, focusMin: v }
        : selectedTarget === 'short'
          ? { ...d, shortMin: v }
          : { ...d, longMin: v }
    );

  return (
    <div className="flex flex-col items-center gap-10 p-12 bg-card rounded-[3rem] border shadow-2xl relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Mode Selector - Refined */}
      <div className="flex gap-1 p-1 bg-muted rounded-full relative z-10">
        {(Object.keys(MODE_META) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300',
              mode === m
                ? 'bg-background text-foreground shadow-sm scale-105'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {MODE_META[m].label}
          </button>
        ))}
      </div>

      {/* Timer Visual — fixed donut: viewBox 120, r=52, real circumference */}
      <div className="relative w-72 h-72 flex items-center justify-center z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Background Track */}
          <circle cx="60" cy="60" r={R} stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/25" />
          {/* Progress — full ring at start, drains as time elapses */}
          <circle
            cx="60"
            cy="60"
            r={R}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={CIRC}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold tabular-nums text-foreground tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-2">
            {mode === 'work' ? 'Deep Work' : MODE_META[mode].label}
          </span>
          <span className="mt-1 text-[11px] font-semibold tabular-nums text-muted-foreground/70">
            {completedInCycle}/{Math.max(1, durations.sessionsUntilLong)} until long break
          </span>
        </div>
      </div>

      {/* Controls - Tactile & Minimal */}
      <div className="flex items-center gap-6 z-10">
        <Button variant="secondary" size="default" onClick={resetTimer} className="w-12 h-12 p-0 rounded-full" aria-label="Reset timer">
          <RotateCcw size={20} />
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={toggleTimer}
          className="w-24 h-24 p-0 rounded-full shadow-xl"
          aria-label={isActive ? 'Pause' : 'Start'}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </Button>

        <Button
          variant="secondary"
          size="default"
          className="w-12 h-12 p-0 rounded-full"
          onClick={openSettings}
          aria-label="Customize pomodoro"
        >
          <Settings size={20} />
        </Button>
      </div>

      {/* Local session count */}
      <div className="z-10 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <span>
          {sessionsToday === 0
            ? 'No sessions yet — start your first focus'
            : `${sessionsToday} session${sessionsToday === 1 ? '' : 's'} completed`}
        </span>
      </div>

      {/* Customize Pomodoro panel (focus-scoped, not the global settings page) */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSettingsOpen(false)}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label="Customize Pomodoro"
              className="w-full max-w-[400px] rounded-[24px] border border-white/10 bg-[#1c1c1f]/95 p-6 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-center text-[15px] font-bold text-white">Customize Pomodoro</h2>

              {/* Big stepper — edits the currently selected target */}
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-2.5 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    aria-label="Decrease selected length"
                    onClick={() => setBigValue(Math.max(1, bigValue - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.08] text-white transition hover:bg-white/[0.14] active:scale-95"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="text-center leading-none">
                    <div className="text-xl font-extrabold tabular-nums text-white">{bigValue}</div>
                    <div className="mt-1 text-[11px] font-bold tracking-[0.18em] text-gray-400">MIN</div>
                  </div>
                  <button
                    type="button"
                    aria-label="Increase selected length"
                    onClick={() => setBigValue(Math.min(120, bigValue + 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.08] text-white transition hover:bg-white/[0.14] active:scale-95"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Focus / Break pickers */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-center text-[13px] font-bold tracking-[0.12em] text-gray-400">FOCUS</p>
                  <button
                    type="button"
                    onClick={() => setSelectedTarget('focus')}
                    className={cn('w-full rounded-2xl transition', selectedTarget === 'focus' && 'ring-2 ring-[#6ea8fe]')}
                    aria-pressed={selectedTarget === 'focus'}
                  >
                    <Stepper
                      value={draft.focusMin}
                      min={1}
                      max={120}
                      ariaLabel="Focus length"
                      onChange={(v) => {
                        setDraft((d) => ({ ...d, focusMin: v }));
                        setSelectedTarget('focus');
                      }}
                    />
                  </button>
                </div>
                <div>
                  <p className="mb-2 text-center text-[13px] font-bold tracking-[0.12em] text-gray-400">BREAK</p>
                  <button
                    type="button"
                    onClick={() => setSelectedTarget('short')}
                    className={cn('w-full rounded-2xl transition', selectedTarget === 'short' && 'ring-2 ring-[#6ea8fe]')}
                    aria-pressed={selectedTarget === 'short'}
                  >
                    <Stepper
                      value={draft.shortMin}
                      min={1}
                      max={60}
                      ariaLabel="Short break length"
                      onChange={(v) => {
                        setDraft((d) => ({ ...d, shortMin: v }));
                        setSelectedTarget('short');
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Long break + cycle length */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-center text-[11px] font-bold tracking-[0.12em] text-gray-500">LONG BREAK</p>
                  <button
                    type="button"
                    onClick={() => setSelectedTarget('long')}
                    className={cn('w-full rounded-2xl transition', selectedTarget === 'long' && 'ring-2 ring-[#6ea8fe]')}
                    aria-pressed={selectedTarget === 'long'}
                  >
                    <Stepper
                      value={draft.longMin}
                      min={1}
                      max={60}
                      ariaLabel="Long break length"
                      onChange={(v) => {
                        setDraft((d) => ({ ...d, longMin: v }));
                        setSelectedTarget('long');
                      }}
                    />
                  </button>
                </div>
                <div>
                  <p className="mb-2 text-center text-[11px] font-bold tracking-[0.12em] text-gray-500">PER CYCLE</p>
                  <Stepper
                    value={draft.sessionsUntilLong}
                    min={2}
                    max={8}
                    ariaLabel="Focus sessions per cycle"
                    onChange={(v) => setDraft((d) => ({ ...d, sessionsUntilLong: v }))}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="h-12 rounded-xl bg-white/[0.08] text-sm font-bold text-gray-200 transition hover:bg-white/[0.12] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyDraftAndStart}
                  className="h-12 rounded-xl bg-[#6ea8fe] text-sm font-bold text-white shadow-lg transition hover:bg-[#5b9bfc] active:scale-[0.98]"
                >
                  Start Focus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
