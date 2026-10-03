'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Crown, ListChecks, MessagesSquare, Mic, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LimitKind = 'messages' | 'quizzes' | 'voice';

const KIND_META: Record<
  LimitKind,
  { icon: typeof MessagesSquare; label: string; unit: string }
> = {
  messages: { icon: MessagesSquare, label: 'AI messages', unit: '' },
  quizzes: { icon: ListChecks, label: 'quizzes', unit: '' },
  voice: { icon: Mic, label: 'voice-transcription minutes', unit: '' },
};

interface LimitReachedModalProps {
  open: boolean;
  kind: LimitKind;
  planName?: string;
  resetLabel?: string;
  onClose: () => void;
}

/**
 * Hard stop shown when a monthly usage cap is hit.
 * Rendered at the call-site so the API request is never fired —
 * callers must early-return when `remaining <= 0` and open this instead.
 */
export function LimitReachedModal({
  open,
  kind,
  planName = 'Spark',
  resetLabel,
  onClose,
}: LimitReachedModalProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const meta = KIND_META[kind];
  const Icon = meta.icon;

  // Esc to dismiss + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const goPlan = () => {
    onClose();
    router.push('/plan');
  };

  // NOTE: intentionally no AnimatePresence exit — plain conditional with
  // enter-only animations, so a hung exit can never leave an invisible
  // fullscreen overlay swallowing every click (see SettingsPanel).
  if (!open) return null;

  return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={onClose}
        >
          <motion.div
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, transform: 'translateY(12px) scale(0.97)' }
            }
            animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="limit-reached-title"
            aria-describedby="limit-reached-desc"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-md overflow-hidden rounded-3xl border border-border',
              'bg-card text-left shadow-2xl shadow-black/40',
            )}
          >
            {/* Accent glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(155,135,245,0.22),transparent)]"
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close limit notice"
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative px-6 pb-6 pt-8 text-center sm:px-8">
              <span
                aria-hidden="true"
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted"
              >
                <Icon className="h-5 w-5 text-[#9b87f5]" />
              </span>

              <h2
                id="limit-reached-title"
                className="mt-4 text-2xl font-bold tracking-tight text-foreground"
              >
                Sorry!
              </h2>
              <p className="mt-1 text-sm font-semibold text-foreground/90">
                You have hit your limits.
              </p>
              <p
                id="limit-reached-desc"
                className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground"
              >
                You&apos;ve used up your {meta.label} for this month on Smartli{' '}
                {planName}. Upgrade your plan for more limits
                {resetLabel
                  ? `, or wait until ${resetLabel} when your usage resets.`
                  : ', or wait until your usage resets next month.'}
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={goPlan}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/60"
                >
                  <Crown className="h-4 w-4" />
                  View plans
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-border bg-muted/60 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/60"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
  );
}
