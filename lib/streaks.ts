import { supabaseAdmin } from '@/lib/supabase';

export interface StreakRow {
  user_id: string;
  streak_days: number;
  last_seen_date: string | null;
  last_credited_date: string | null;
  active_seconds_today: number;
  credited_today: boolean;
  updated_at: string | null;
}

function todayKey(d = new Date()) {
  // Store as YYYY-MM-DD in UTC to match Supabase `date` columns.
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  const ms = new Date(b + 'T00:00:00Z').getTime() - new Date(a + 'T00:00:00Z').getTime();
  return Math.round(ms / 86_400_000);
}

/** Fetch or create the user's streak row. Applies day-rollover + expiry reset. */
export async function getStreak(userId: string): Promise<StreakRow> {
  const today = todayKey();

  const { data, error } = await supabaseAdmin
    .from('user_streaks')
    .select('user_id, streak_days, last_seen_date, last_credited_date, active_seconds_today, credited_today, updated_at')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    const fresh = {
      user_id: userId,
      streak_days: 0,
      last_seen_date: today,
      last_credited_date: null,
      active_seconds_today: 0,
      credited_today: false,
    };
    const { data: created } = await supabaseAdmin
      .from('user_streaks')
      .upsert(fresh, { onConflict: 'user_id' })
      .select('user_id, streak_days, last_seen_date, last_credited_date, active_seconds_today, credited_today, updated_at')
      .single();
    if (created) return created as StreakRow;
    return { ...fresh, updated_at: null };
  }

  let row = data as StreakRow;

  // New calendar day since last seen → reset daily counters.
  if (row.last_seen_date !== today) {
    const { data: rolled } = await supabaseAdmin
      .from('user_streaks')
      .update({ last_seen_date: today, active_seconds_today: 0, credited_today: false })
      .eq('user_id', userId)
      .select('user_id, streak_days, last_seen_date, last_credited_date, active_seconds_today, credited_today, updated_at')
      .single();
    if (rolled) row = rolled as StreakRow;
    else row = { ...row, last_seen_date: today, active_seconds_today: 0, credited_today: false };
  }

  // Streak expired: last credited day is 2+ days ago → show 0 until next activity.
  if (row.last_credited_date) {
    const gap = daysBetween(row.last_credited_date, today);
    if (gap >= 2 && row.streak_days !== 0) {
      const { data: reset } = await supabaseAdmin
        .from('user_streaks')
        .update({ streak_days: 0 })
        .eq('user_id', userId)
        .select('user_id, streak_days, last_seen_date, last_credited_date, active_seconds_today, credited_today, updated_at')
        .single();
      if (reset) row = reset as StreakRow;
      else row = { ...row, streak_days: 0 };
      // Keep dashboard mirror in sync.
      await supabaseAdmin.from('dashboard').update({ streak_days: 0 }).eq('id', userId);
    }
  }

  return row;
}

/**
 * Record genuine activity for today.
 * - `seconds` accumulates into active_seconds_today (focus time, session heartbeats).
 * - `credit`: when true (AI message, quiz, completed focus block), counts today
 *   toward the streak. First credit of the day bumps streak_days (+1 if yesterday
 *   was credited, else reset to 1).
 */
export async function touchStreak(
  userId: string,
  opts: { seconds?: number; credit?: boolean } = {},
): Promise<StreakRow> {
  const { seconds = 0, credit = true } = opts;
  const today = todayKey();

  let row = await getStreak(userId);

  const patch: Partial<StreakRow> & Record<string, unknown> = {
    last_seen_date: today,
    active_seconds_today: Math.max(0, Number(row.active_seconds_today ?? 0) + Math.max(0, Math.floor(seconds))),
  };

  if (credit && !row.credited_today) {
    const last = row.last_credited_date;
    const nextStreak = !last ? 1 : daysBetween(last, today) <= 1 ? Number(row.streak_days ?? 0) + 1 : 1;
    patch.streak_days = nextStreak;
    patch.last_credited_date = today;
    patch.credited_today = true;
  }

  const { data: updated } = await supabaseAdmin
    .from('user_streaks')
    .update(patch)
    .eq('user_id', userId)
    .select('user_id, streak_days, last_seen_date, last_credited_date, active_seconds_today, credited_today, updated_at')
    .single();

  const finalRow = (updated as StreakRow | null) ?? ({ ...row, ...patch } as StreakRow);

  // Mirror into dashboard.streak_days so legacy reads stay consistent.
  try {
    await supabaseAdmin.from('dashboard').update({ streak_days: finalRow.streak_days }).eq('id', userId);
  } catch {
    /* dashboard row may not exist yet — non-fatal */
  }

  return finalRow;
}
