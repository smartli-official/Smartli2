'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Timer, Zap, ChevronRight, Sparkles, ListTodo, TrendingUp, MessagesSquare } from 'lucide-react';
import Link from 'next/link';
import { useDashboardStats } from '@/hooks/useDashboardStats';

function formatWeekHours(h: number) {
  if (h >= 10) return h.toFixed(1);
  if (h >= 1) return h.toFixed(1).replace(/\.0$/, '');
  return h.toFixed(2).replace(/0$/, '');
}

export default function DashboardPage() {
  const { data, authed, loading } = useDashboardStats();

  const hours = data?.hours;
  const streak = data?.streak;
  const usage = data?.usage;

  const hoursValue = !authed ? '—' : loading || !hours ? '…' : `${hours.totalLabel}h`;
  const hoursSub = !authed
    ? 'Sign in to track focus'
    : loading || !hours
      ? 'Syncing…'
      : `${formatWeekHours(hours.weekHours)}h this week`;

  const streakValue = !authed ? '—' : loading || !streak ? '…' : `${streak.streakDays}d`;
  const streakSub = !authed
    ? 'Sign in to build streaks'
    : loading || !streak
      ? 'Syncing…'
      : streak.creditedToday
        ? 'Credited today — keep it alive'
        : streak.streakDays > 0
          ? 'Do a focus / AI session today'
          : 'Start today: 1 focus or AI chat';

  const usageValue = !authed
    ? '—'
    : loading || !usage
      ? '…'
      : usage.limits.messages === null
        ? `${usage.used.messagesUsed}`
        : `${usage.used.messagesUsed}/${usage.limits.messages}`;
  const usageSub = !authed
    ? 'Sign in to see AI quota'
    : loading || !usage
      ? 'Syncing…'
      : usage.limits.messages === null
        ? `${usage.used.messagesUsed} messages · unlimited · resets ${usage.nextResetLabel}`
        : `${usage.remaining.messages ?? 0} left · resets ${usage.nextResetLabel}`;

  const cards = [
    {
      label: 'Hours',
      value: hoursValue,
      sub: hoursSub,
      icon: Timer,
      color: 'text-blue-500',
      bar: null as number | null,
      barColor: '',
    },
    {
      label: 'Streak',
      value: streakValue,
      sub: streakSub,
      icon: Zap,
      color: 'text-orange-500',
      bar: null as number | null,
      barColor: '',
    },
    {
      label: 'AI Usage',
      value: usageValue,
      sub: usageSub,
      icon: MessagesSquare,
      color: 'text-indigo-500',
      bar: usage ? usage.pct.messages : 0,
      barColor: 'bg-indigo-500',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <header className="flex items-center justify-between py-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Studio <span className="text-primary">Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Welcome back. Your learning system is ready.
          </p>
        </div>
        <Button variant="outline" className="hidden md:flex items-center gap-2 rounded-full px-5">
          <TrendingUp size={16} /> Analytics
        </Button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Key Stats - Compact Bento, all live from Supabase */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {cards.map((stat, i) => (
            <Card key={i} className="group hover:border-primary/50 transition-all cursor-default">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon size={18} className={stat.color} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground group-hover:translate-x-1 transition-transform">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-muted-foreground leading-snug">
                  {stat.sub}
                </div>
                {stat.bar !== null && (
                  <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stat.barColor} transition-all duration-500`}
                      style={{ width: `${Math.round(Math.min(1, stat.bar ?? 0) * 100)}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {/* Hidden icon import guard (keeps Brain tree-shaken only if unused) */}
          <span className="hidden">
            <Brain size={1} />
          </span>
        </div>

        {/* Learning Suite - Large Bento */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/ai" className="group">
            <Card className="relative h-full p-8 overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain size={120} className="text-primary" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">AI Explainer</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  Deep-dive into complex topics with pedagogical precision.
                </p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    Enter Suite <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/ai?mode=quiz" className="group">
            <Card className="relative h-full p-8 overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-emerald-500/50">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <ListTodo size={120} className="text-emerald-500" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                  <ListTodo size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Quiz Generator</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  Transform your notes into active recall assessments.
                </p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-500 group-hover:gap-2 transition-all">
                    Generate Quiz <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Focus Hub - Wide Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/focus" className="md:col-span-3 group">
          <Card className="relative p-8 bg-card dark:bg-zinc-950 text-card-foreground overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
              <Timer size={120} className="text-zinc-500 dark:text-zinc-400" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 flex items-center justify-center mb-4">
                  <Timer size={24} />
                </div>
                <h3 className="text-2xl font-bold">Focus Hub</h3>
                <p className="text-muted-foreground max-w-md">
                  Enter a state of deep work with the Pomodoro timer and ambient soundscapes.
                  {hours && authed && (
                    <span className="block mt-1 text-sm font-semibold text-foreground">
                      {formatWeekHours(hours.weekHours)}h focused this week — every session syncs here.
                    </span>
                  )}
                </p>
              </div>
              <Button variant="secondary" className="rounded-full px-8 py-4 text-base font-bold">
                Start Focusing
              </Button>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
