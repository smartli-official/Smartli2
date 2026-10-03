import { supabaseAdmin } from '@/lib/supabase';

export interface DashboardRow {
  id: string;
  study_time: number; // total focused seconds (lifetime)
  streak_days: number;
  this_week_hours: number;
  current_weekly_hours: number;
  weekly_target_hours: number;
  weekly_target_percentage: number;
  updated_at: string | null;
}

function startOfWeekMonday(d = new Date()) {
  const copy = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = copy.getUTCDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7; // days since Monday
  copy.setUTCDate(copy.getUTCDate() - diff);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

/** Fetch or create the dashboard row; resets weekly counters on a new week. */
export async function getDashboard(userId: string): Promise<DashboardRow> {
  const { data, error } = await supabaseAdmin
    .from('dashboard')
    .select(
      'id, study_time, streak_days, this_week_hours, current_weekly_hours, weekly_target_hours, weekly_target_percentage, updated_at',
    )
    .eq('id', userId)
    .single();

  let row: DashboardRow;
  if (error || !data) {
    const fresh = { id: userId };
    const { data: created } = await supabaseAdmin
      .from('dashboard')
      .upsert(fresh, { onConflict: 'id' })
      .select(
        'id, study_time, streak_days, this_week_hours, current_weekly_hours, weekly_target_hours, weekly_target_percentage, updated_at',
      )
      .single();
    row = (created as DashboardRow | null) ?? {
      id: userId,
      study_time: 0,
      streak_days: 0,
      this_week_hours: 0,
      current_weekly_hours: 0,
      weekly_target_hours: 10,
      weekly_target_percentage: 0,
      updated_at: null,
    };
  } else {
    row = data as DashboardRow;
  }

  // Weekly rollover: if last update was before this Monday, zero the week.
  const weekStart = startOfWeekMonday();
  const updatedAt = row.updated_at ? new Date(row.updated_at) : null;
  if (!updatedAt || updatedAt < weekStart) {
    const { data: rolled } = await supabaseAdmin
      .from('dashboard')
      .update({ this_week_hours: 0, current_weekly_hours: 0, weekly_target_percentage: 0 })
      .eq('id', userId)
      .select(
        'id, study_time, streak_days, this_week_hours, current_weekly_hours, weekly_target_hours, weekly_target_percentage, updated_at',
      )
      .single();
    if (rolled) row = rolled as DashboardRow;
    else row = { ...row, this_week_hours: 0, current_weekly_hours: 0, weekly_target_percentage: 0 };
  }

  return row;
}

export function toHoursView(row: DashboardRow) {
  const totalSeconds = Math.max(0, Number(row.study_time ?? 0) || 0);
  const totalHours = totalSeconds / 3600;
  const weekHours = Number(row.this_week_hours ?? row.current_weekly_hours ?? 0) || 0;
  const target = Number(row.weekly_target_hours ?? 10) || 10;
  const pct = Math.min(1, target > 0 ? weekHours / target : 0);
  return {
    totalSeconds,
    totalHours,
    totalLabel: totalHours >= 10 ? totalHours.toFixed(1) : totalHours.toFixed(2).replace(/0$/, ''),
    weekHours,
    weeklyTargetHours: target,
    weeklyPct: pct,
  };
}

/**
 * Log completed focus seconds to Supabase.
 * Updates lifetime `study_time` (seconds) + weekly hour buckets.
 * Returns the refreshed row + derived view.
 */
export async function logFocusSeconds(userId: string, seconds: number) {
  const safe = Math.max(1, Math.min(24 * 3600, Math.floor(seconds || 0)));
  const row = await getDashboard(userId);

  const nextTotal = Number(row.study_time ?? 0) + safe;
  const addedHours = safe / 3600;
  const nextWeek = Number(row.this_week_hours ?? 0) + addedHours;
  const target = Number(row.weekly_target_hours ?? 10) || 10;
  const pct = Math.min(100, target > 0 ? (nextWeek / target) * 100 : 0);

  const { data: updated } = await supabaseAdmin
    .from('dashboard')
    .update({
      study_time: nextTotal,
      this_week_hours: nextWeek,
      current_weekly_hours: nextWeek,
      weekly_target_percentage: pct,
    })
    .eq('id', userId)
    .select(
      'id, study_time, streak_days, this_week_hours, current_weekly_hours, weekly_target_hours, weekly_target_percentage, updated_at',
    )
    .single();

  const finalRow = (updated as DashboardRow | null) ?? {
    ...row,
    study_time: nextTotal,
    this_week_hours: nextWeek,
    current_weekly_hours: nextWeek,
    weekly_target_percentage: pct,
  };
  return { row: finalRow, view: toHoursView(finalRow) };
}
