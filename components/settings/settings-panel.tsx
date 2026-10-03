'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Settings, X } from 'lucide-react';
import { SettingsContent } from './settings-content';

export function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();

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

  // NOTE: intentionally no AnimatePresence exit here — just a plain
  // conditional with enter-only animations. AnimatePresence defers unmount
  // until every nested exit reports complete, and if that bookkeeping ever
  // hangs the invisible fixed overlay stays mounted and swallows every
  // click, leaving the page dead. Instant unmount on close can't get stuck.
  if (!open) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[90] flex justify-end"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.aside
        initial={
          reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48, scale: 0.99 }
        }
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={
          reduceMotion
            ? { duration: 0.15 }
            : { type: 'spring', stiffness: 380, damping: 36 }
        }
        className="relative flex h-full w-full max-w-[480px] flex-col overflow-hidden border-l border-border bg-popover shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-popover/95 px-5 py-4 backdrop-blur">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
            <Settings className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Settings
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              Plan usage, preferences and privacy
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            autoFocus
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-accent-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <SettingsContent onNavigate={onClose} />
        </div>
      </motion.aside>
    </motion.div>
  );
}
