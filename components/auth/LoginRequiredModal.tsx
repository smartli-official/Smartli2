'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Hard block shown when a logged-out visitor tries to use AI features.
 * Rendered at the call-site so the API request is never fired —
 * callers must early-return and open this instead.
 * Intentionally non-dismissable: signing in is the only way forward.
 */
export function LoginRequiredModal({ open, onClose }: LoginRequiredModalProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  // Lock background scroll while open. No Esc/overlay/X dismissal —
  // the visitor must sign in to proceed.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const goSignIn = () => {
    onClose();
    router.push('/sign-in');
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
            aria-labelledby="login-required-title"
            aria-describedby="login-required-desc"
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

            <div className="relative px-6 pb-6 pt-8 text-center sm:px-8">
              <span
                aria-hidden="true"
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted"
              >
                <LogIn className="h-5 w-5 text-[#9b87f5]" />
              </span>

              <h2
                id="login-required-title"
                className="mt-4 text-2xl font-bold tracking-tight text-foreground"
              >
                You&apos;re not logged in.
              </h2>
              <p
                id="login-required-desc"
                className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground"
              >
                You have to be logged in to use AI features. Sign in to keep
                chatting, generating quizzes, and transcribing voice.
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={goSignIn}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/60"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
  );
}
