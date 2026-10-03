'use client';

import { useEffect, useState } from 'react';

export type AiDefaultMode = 'explainer' | 'quiz';
export type Verbosity = 'concise' | 'balanced' | 'detailed';
export type QuizDifficulty = 'easy' | 'mixed' | 'hard';
export type VoiceLanguage = 'auto' | 'en' | 'hi' | 'es' | 'fr';
export type Theme = 'dark' | 'light';

export interface AppSettings {
  theme: Theme;
  reduceMotion: boolean;
  compactMode: boolean;
  defaultMode: AiDefaultMode;
  verbosity: Verbosity;
  autoSaveChats: boolean;
  quizTimerMin: number;
  quizDifficulty: QuizDifficulty;
  autoGrade: boolean;
  voiceLanguage: VoiceLanguage;
  autoTranscribe: boolean;
  studyReminders: boolean;
  productUpdates: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  reduceMotion: false,
  compactMode: false,
  defaultMode: 'explainer',
  verbosity: 'balanced',
  autoSaveChats: true,
  quizTimerMin: 10,
  quizDifficulty: 'mixed',
  autoGrade: true,
  voiceLanguage: 'auto',
  autoTranscribe: true,
  studyReminders: true,
  productUpdates: false,
};

const KEY = 'smartli-settings-v1';
export const SETTINGS_KEY = KEY;

export function applyTheme(theme: Theme) {
  try {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme === 'light' ? 'light' : 'dark');
    root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#fafafa' : '#09090b');
  } catch {
    /* ssr / private mode */
  }
}

function read(): AppSettings {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(read());
    setReady(true);
  }, []);

  // Apply theme globally once stored settings have loaded (avoids
  // flashing the default over the pre-paint inline script value).
  useEffect(() => {
    if (ready) applyTheme(settings.theme);
  }, [settings.theme, ready]);

  // Cross-tab sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSettings(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* private mode */
      }
      return next;
    });
  };

  const resetAll = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  return { settings, update, resetAll, ready };
}

export type AppSettingsStore = ReturnType<typeof useAppSettings>;
