'use client';

import { useId, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BadgeCheck,
  Bell,
  Crown,
  Download,
  ListChecks,
  MessagesSquare,
  Mic,
  Moon,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Timer,
  Volume2,
  Wand2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppleSwitch } from '@/components/ui/apple-switch';
import { usePlanUsage } from '@/hooks/usePlanUsage';
import {
  type QuizDifficulty,
  type Theme,
  type Verbosity,
  type VoiceLanguage,
  useAppSettings,
} from '@/hooks/useAppSettings';

/* ---------------------------------- bits ---------------------------------- */

function Donut({
  pct,
  color,
  label,
}: {
  pct: number;
  color: string;
  label: string;
}) {
  const R = 26;
  const C = 2 * Math.PI * R;
  const clamped = Math.min(1, Math.max(0, pct));
  const ring = Math.max(0.02, clamped);
  return (
    <div
      role="img"
      aria-label={label}
      className="relative h-[72px] w-[72px] shrink-0"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-border"
        />
        <motion.circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - ring) }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold tabular-nums text-foreground">
        {Math.round(clamped * 100)}%
      </span>
    </div>
  );
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      role="presentation"
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
    >
      <motion.div
        initial={{ transform: 'scaleX(0)' }}
        animate={{ transform: `scaleX(${Math.min(1, Math.max(0, pct))})` }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformOrigin: 'left center', background: color }}
        className="h-full w-full rounded-full"
      />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return <AppleSwitch checked={checked} onChange={onChange} label={label} />;
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: { value: T; label: string; icon?: LucideIcon }[];
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  const pillId = useId();
  const reduceMotion = useReducedMotion();
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1 rounded-xl border border-border bg-muted/60 p-1"
    >
      {options.map((o) => {
        const active = o.value === value;
        const OptionIcon = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cn(
              'relative isolate rounded-lg px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/60',
              'transition-[color] duration-150 ease-out active:scale-[0.96]',
              active
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId={`segmented-pill-${pillId}`}
                aria-hidden="true"
                initial={false}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        type: 'spring',
                        stiffness: 500,
                        damping: 38,
                        mass: 0.7,
                      }
                }
                className="absolute inset-0 z-0 rounded-lg bg-primary shadow-[0_1px_8px_rgba(0,0,0,0.25)]"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {OptionIcon && <OptionIcon className="h-3.5 w-3.5" />}
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-muted text-[#7c6cf0] dark:text-[#c4b5fd]">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </header>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

function Row({
  icon: Icon,
  title,
  desc,
  control,
}: {
  icon: LucideIcon;
  title: string;
  desc?: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="flex min-w-0 items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground/90">{title}</p>
          {desc && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function leftPill(remaining: number | null, warnAt: number): ReactNode {
  if (remaining === null) {
    return (
      <span className="rounded-full bg-[#9b87f5]/15 px-2 py-0.5 text-[11px] font-semibold text-[#6d5ef0] dark:text-[#c4b5fd]">
        Unlimited
      </span>
    );
  }
  const tone =
    remaining <= 0
      ? 'bg-red-500/15 text-red-600 dark:text-red-300'
      : remaining <= warnAt
        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', tone)}>
      {remaining <= 0 ? 'Limit reached' : `${remaining} left`}
    </span>
  );
}

/* --------------------------------- content --------------------------------- */

export function SettingsContent({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const { plan, limits, used, remaining, pct, nextResetLabel } = usePlanUsage();
  const { settings, update, resetAll } = useAppSettings();
  const [flash, setFlash] = useState<string | null>(null);

  const goPlan = () => {
    onNavigate?.();
    router.push('/plan');
  };

  const exportJson = () => {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        plan: plan.id,
        usage: used,
        settings,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smartli-settings.json';
      a.click();
      URL.revokeObjectURL(url);
      setFlash('Settings exported');
    } catch {
      setFlash('Export failed — try again');
    }
    window.setTimeout(() => setFlash(null), 2400);
  };

  const usageCards = [
    {
      icon: MessagesSquare,
      name: 'AI messages',
      color: '#9b87f5',
      usedLabel: `${used.messagesUsed.toLocaleString()} used`,
      limitLabel: limits.messages === null ? 'Unlimited / mo' : `of ${limits.messages.toLocaleString()} / mo`,
      pct: pct.messages,
      pill: leftPill(remaining.messages, 10),
      hint:
        remaining.messages !== null && remaining.messages <= 0
          ? 'You’ve hit this month’s message cap — upgrade for more headroom.'
          : 'Every Explainer reply and quiz generation counts as one.',
    },
    {
      icon: ListChecks,
      name: 'Quizzes',
      color: '#22d3ee',
      usedLabel: `${used.quizzesUsed.toLocaleString()} used`,
      limitLabel: limits.quizzes === null ? 'Unlimited / mo' : `of ${limits.quizzes} / mo`,
      pct: pct.quizzes,
      pill: leftPill(remaining.quizzes, 1),
      hint:
        remaining.quizzes !== null && remaining.quizzes <= 0
          ? 'Quiz cap reached — Scholar and Luminary unlock unlimited quizzes.'
          : 'Timed runs, grading and retries all draw from this pool.',
    },
    {
      icon: Mic,
      name: 'Voice transcription',
      color: '#34d399',
      usedLabel: `${used.voiceMinutesUsed.toLocaleString()} min used`,
      limitLabel:
        limits.voiceMinutes === null ? 'Unlimited / mo' : `of ${limits.voiceMinutes.toLocaleString()} min / mo`,
      pct: pct.voice,
      pill: leftPill(remaining.voiceMinutes, 3),
      hint: 'Lecture uploads and voice notes transcribed with Whisper.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Current plan */}
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/70 to-card p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border"
            style={{ background: `linear-gradient(135deg, ${plan.glow}, transparent 70%)` }}
          >
            {plan.id === 'spark' ? (
              <Sparkles className="h-5 w-5" style={{ color: plan.accent }} />
            ) : (
              <Crown className="h-5 w-5" style={{ color: plan.accent }} />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Current plan
            </p>
            <p className="truncate text-base font-bold tracking-tight text-foreground">
              Smartli {plan.name}
            </p>
          </div>
          <span className="hidden items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 sm:inline-flex">
            <BadgeCheck className="h-3.5 w-3.5" /> Active
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{plan.tagline}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={goPlan}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/60"
          >
            <Crown className="h-4 w-4" /> Manage plan
          </button>
          <span className="inline-flex h-10 items-center rounded-xl border border-border bg-muted/60 px-3 text-xs text-muted-foreground">
            Resets {nextResetLabel}
          </span>
        </div>
      </div>

      {/* Usage */}
      <div>
        <div className="mb-2 flex items-baseline justify-between px-1">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Usage this cycle
          </h3>
          <span className="text-[11px] text-muted-foreground/70">Monthly limits · per plan</span>
        </div>
        <div className="space-y-3">
          {usageCards.map((u) => (
            <div
              key={u.name}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-4">
                <Donut pct={u.pct} color={u.color} label={`${u.name}: ${u.usedLabel}, ${u.limitLabel}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <u.icon className="h-4 w-4 shrink-0" style={{ color: u.color }} />
                    <p className="truncate text-sm font-semibold text-foreground">{u.name}</p>
                  </div>
                  <p className="mt-1 text-[13px] tabular-nums text-muted-foreground">
                    <span className="font-semibold text-foreground/90">{u.usedLabel}</span>{' '}
                    {u.limitLabel}
                  </p>
                  <div className="mt-2">{u.pill}</div>
                </div>
              </div>
              <div className="mt-3">
                <Bar pct={u.pct} color={u.color} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">{u.hint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <Section
        icon={SlidersHorizontal}
        title="Preferences"
        subtitle="How Smartli behaves for you"
      >
        <Row
          icon={Sun}
          title="Appearance"
          desc="Light or dark — applied instantly."
          control={
            <Segmented<Theme>
              ariaLabel="Appearance"
              value={settings.theme}
              onChange={(v) => update('theme', v)}
              options={[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
              ]}
            />
          }
        />
        <Row
          icon={Wand2}
          title="Default AI mode"
          desc="What a fresh chat starts in."
          control={
            <Segmented
              ariaLabel="Default AI mode"
              value={settings.defaultMode}
              onChange={(v) => update('defaultMode', v)}
              options={[
                { value: 'explainer', label: 'Explainer' },
                { value: 'quiz', label: 'Quiz' },
              ]}
            />
          }
        />
        <Row
          icon={MessagesSquare}
          title="Response style"
          desc="Length and detail of AI answers."
          control={
            <Segmented<Verbosity>
              ariaLabel="Response style"
              value={settings.verbosity}
              onChange={(v) => update('verbosity', v)}
              options={[
                { value: 'concise', label: 'Concise' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'detailed', label: 'Detailed' },
              ]}
            />
          }
        />
        <Row
          icon={Sparkles}
          title="Auto-save chats"
          desc="Keep new conversations in history."
          control={
            <Toggle
              label="Auto-save chats"
              checked={settings.autoSaveChats}
              onChange={(v) => update('autoSaveChats', v)}
            />
          }
        />
        <Row
          icon={SlidersHorizontal}
          title="Compact mode"
          desc="Denser spacing in chat and lists."
          control={
            <Toggle
              label="Compact mode"
              checked={settings.compactMode}
              onChange={(v) => update('compactMode', v)}
            />
          }
        />
        <Row
          icon={SlidersHorizontal}
          title="Reduce motion"
          desc="Minimise animations and transitions."
          control={
            <Toggle
              label="Reduce motion"
              checked={settings.reduceMotion}
              onChange={(v) => update('reduceMotion', v)}
            />
          }
        />
      </Section>

      {/* Quizzes & voice */}
      <Section
        icon={Timer}
        title="Quizzes & voice"
        subtitle="Defaults for practice sessions"
      >
        <Row
          icon={Timer}
          title="Quiz timer"
          desc="Pre-selected length for new quizzes."
          control={
            <Segmented
              ariaLabel="Quiz timer length"
              value={String(settings.quizTimerMin)}
              onChange={(v) => update('quizTimerMin', Number(v))}
              options={[
                { value: '5', label: '5m' },
                { value: '10', label: '10m' },
                { value: '20', label: '20m' },
                { value: '30', label: '30m' },
              ]}
            />
          }
        />
        <Row
          icon={ListChecks}
          title="Quiz difficulty"
          desc="Mix of recall vs. stretch questions."
          control={
            <Segmented<QuizDifficulty>
              ariaLabel="Quiz difficulty"
              value={settings.quizDifficulty}
              onChange={(v) => update('quizDifficulty', v)}
              options={[
                { value: 'easy', label: 'Easy' },
                { value: 'mixed', label: 'Mixed' },
                { value: 'hard', label: 'Hard' },
              ]}
            />
          }
        />
        <Row
          icon={BadgeCheck}
          title="Auto-grade quizzes"
          desc="Score answers as soon as you finish."
          control={
            <Toggle
              label="Auto-grade quizzes"
              checked={settings.autoGrade}
              onChange={(v) => update('autoGrade', v)}
            />
          }
        />
        <Row
          icon={Volume2}
          title="Voice language"
          desc="Transcription language for uploads."
          control={
            <Segmented<VoiceLanguage>
              ariaLabel="Voice language"
              value={settings.voiceLanguage}
              onChange={(v) => update('voiceLanguage', v)}
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'en', label: 'EN' },
                { value: 'hi', label: 'HI' },
                { value: 'es', label: 'ES' },
                { value: 'fr', label: 'FR' },
              ]}
            />
          }
        />
        <Row
          icon={Mic}
          title="Auto-transcribe"
          desc="Transcribe voice notes on arrival."
          control={
            <Toggle
              label="Auto-transcribe voice"
              checked={settings.autoTranscribe}
              onChange={(v) => update('autoTranscribe', v)}
            />
          }
        />
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications" subtitle="Only the useful pings">
        <Row
          icon={Bell}
          title="Study reminders"
          desc="Gentle nudges to keep streaks alive."
          control={
            <Toggle
              label="Study reminders"
              checked={settings.studyReminders}
              onChange={(v) => update('studyReminders', v)}
            />
          }
        />
        <Row
          icon={Sparkles}
          title="Product updates"
          desc="New modes and major improvements."
          control={
            <Toggle
              label="Product updates"
              checked={settings.productUpdates}
              onChange={(v) => update('productUpdates', v)}
            />
          }
        />
      </Section>

      {/* Data */}
      <Section
        icon={Download}
        title="Data & privacy"
        subtitle="Your stuff stays yours"
      >
        <Row
          icon={Download}
          title="Export settings"
          desc="Download plan, usage and preferences as JSON."
          control={
            <button
              type="button"
              onClick={exportJson}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 text-xs font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/60"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          }
        />
        <Row
          icon={RotateCcw}
          title="Reset all preferences"
          desc="Back to Smartli defaults."
          control={
            <button
              type="button"
              onClick={() => {
                resetAll();
                setFlash('Preferences reset to defaults');
                window.setTimeout(() => setFlash(null), 2400);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-500/15 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 dark:text-red-300"
            >
              Reset all
            </button>
          }
        />
      </Section>

      {flash && (
        <p
          role="status"
          className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-center text-xs font-medium text-emerald-700 dark:text-emerald-300"
        >
          {flash}
        </p>
      )}

      <p className="px-1 pb-1 text-center text-[11px] leading-relaxed text-muted-foreground/70">
        Usage resets monthly and follows your plan. Need more?{' '}
        <button type="button" onClick={goPlan} className="font-semibold text-foreground/80 underline underline-offset-2 hover:text-foreground">
          Compare plans
        </button>
      </p>
    </div>
  );
}
