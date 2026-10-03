'use client';

import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsContent } from './settings-content';

export function SettingsPageClient() {
  return (
    <div className="min-h-screen w-full bg-background pb-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(155,135,245,0.14),transparent)]" />
      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-12 sm:px-6 md:pt-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card">
            <SettingsIcon className="h-5 w-5 text-foreground" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Plan usage, preferences and privacy
            </p>
          </div>
        </div>
        <SettingsContent />
      </div>
    </div>
  );
}
