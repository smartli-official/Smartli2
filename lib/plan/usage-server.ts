import { supabaseAdmin } from '@/lib/supabase';
import { monthKey, normalizePlanId, buildUsageView, type UsageState } from './limits';

export interface UsageRow {
  user_id: string;
  plan_id: string;
  messages_used: number;
  quizzes_used: number;
  voice_minutes_used: number;
  period_month: string;
}

function toUsageState(row: UsageRow): UsageState {
  return {
    messagesUsed: Number(row.messages_used ?? 0) || 0,
    quizzesUsed: Number(row.quizzes_used ?? 0) || 0,
    voiceMinutesUsed: Number(row.voice_minutes_used ?? 0) || 0,
  };
}

/** Fetch or create the user's usage row. Rolls over to a fresh cycle on new month. */
export async function getOrCreateUsage(userId: string) {
  const currentMonth = monthKey();

  const { data, error } = await supabaseAdmin
    .from('user_usage')
    .select('user_id, plan_id, messages_used, quizzes_used, voice_minutes_used, period_month')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    // No row yet (PGRST116 = no rows) or real error — try to create a fresh one.
    const fresh = {
      user_id: userId,
      plan_id: 'spark',
      messages_used: 0,
      quizzes_used: 0,
      voice_minutes_used: 0,
      period_month: currentMonth,
    };
    const { data: created, error: createError } = await supabaseAdmin
      .from('user_usage')
      .upsert(fresh, { onConflict: 'user_id' })
      .select('user_id, plan_id, messages_used, quizzes_used, voice_minutes_used, period_month')
      .single();
    if (createError || !created) {
      // If upsert raced, re-read.
      const { data: retry } = await supabaseAdmin
        .from('user_usage')
        .select('user_id, plan_id, messages_used, quizzes_used, voice_minutes_used, period_month')
        .eq('user_id', userId)
        .single();
      if (!retry) throw createError ?? new Error('Failed to load usage.');
      return finalizeRow(retry as UsageRow, currentMonth);
    }
    return finalizeRow(created as UsageRow, currentMonth);
  }

  return finalizeRow(data as UsageRow, currentMonth);
}

async function finalizeRow(row: UsageRow, currentMonth: string) {
  let effectiveRow = row;
  // New calendar month → fresh cycle, keep plan.
  if (row.period_month !== currentMonth) {
    const { data: reset, error } = await supabaseAdmin
      .from('user_usage')
      .update({
        messages_used: 0,
        quizzes_used: 0,
        voice_minutes_used: 0,
        period_month: currentMonth,
      })
      .eq('user_id', row.user_id)
      .select('user_id, plan_id, messages_used, quizzes_used, voice_minutes_used, period_month')
      .single();
    if (!error && reset) effectiveRow = reset as UsageRow;
    else {
      effectiveRow = { ...row, messages_used: 0, quizzes_used: 0, voice_minutes_used: 0, period_month: currentMonth };
    }
  }
  const planId = normalizePlanId(effectiveRow.plan_id);
  const used = toUsageState(effectiveRow);
  const view = buildUsageView(planId, used);
  return { row: effectiveRow, planId, used, view };
}

export type UsageKind = 'messages' | 'quizzes' | 'voice';

/**
 * Atomically check quota and consume it.
 * Returns { allowed:false, view } with 402 semantics when exhausted.
 */
export async function checkAndConsume(
  userId: string,
  kind: UsageKind,
  amount = 1,
): Promise<{ allowed: boolean; view: ReturnType<typeof buildUsageView>; row: UsageRow }> {
  const { row, planId, used, view } = await getOrCreateUsage(userId);

  const remaining =
    kind === 'messages'
      ? view.remaining.messages
      : kind === 'quizzes'
        ? view.remaining.quizzes
        : view.remaining.voiceMinutes;

  if (remaining !== null && remaining < amount) {
    return { allowed: false, view, row };
  }

  // Unlimited buckets still track usage for analytics.
  const nextUsed: UsageState = {
    messagesUsed: used.messagesUsed + (kind === 'messages' ? amount : 0),
    quizzesUsed: used.quizzesUsed + (kind === 'quizzes' ? amount : 0),
    voiceMinutesUsed:
      Math.round((used.voiceMinutesUsed + (kind === 'voice' ? amount : 0)) * 10) / 10,
  };

  const { data: updated, error } = await supabaseAdmin
    .from('user_usage')
    .update({
      messages_used: nextUsed.messagesUsed,
      quizzes_used: nextUsed.quizzesUsed,
      voice_minutes_used: nextUsed.voiceMinutesUsed,
    })
    .eq('user_id', userId)
    .select('user_id, plan_id, messages_used, quizzes_used, voice_minutes_used, period_month')
    .single();

  if (error || !updated) {
    // Read-modify-write race lost — re-read and report truth.
    const fresh = await getOrCreateUsage(userId);
    return { allowed: true, view: fresh.view, row: fresh.row };
  }

  const nextView = buildUsageView(planId, toUsageState(updated as UsageRow));
  return { allowed: true, view: nextView, row: updated as UsageRow };
}

/** Update the user's plan (e.g. free downgrade to Spark). Usage counters are kept. */
export async function setUserPlan(userId: string, planId: string) {
  const safe = normalizePlanId(planId);
  const currentMonth = monthKey();
  const { data, error } = await supabaseAdmin
    .from('user_usage')
    .upsert(
      {
        user_id: userId,
        plan_id: safe,
        period_month: currentMonth,
      },
      { onConflict: 'user_id', ignoreDuplicates: false },
    )
    .select('user_id, plan_id, messages_used, quizzes_used, voice_minutes_used, period_month')
    .single();
  if (error) {
    // Row exists but upsert with partial fields may conflict — fall back to update.
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('user_usage')
      .update({ plan_id: safe })
      .eq('user_id', userId)
      .select('user_id, plan_id, messages_used, quizzes_used, voice_minutes_used, period_month')
      .single();
    if (updateError || !updated) throw updateError ?? error;
    const used = toUsageState(updated as UsageRow);
    return { row: updated as UsageRow, view: buildUsageView(safe, used) };
  }
  // Upsert without counters defaults them to 0 on insert; on conflict it may
  // have overwritten? Re-read to be safe and preserve counters.
  const fresh = await getOrCreateUsage(userId);
  if (fresh.row.plan_id !== safe) {
    await supabaseAdmin.from('user_usage').update({ plan_id: safe }).eq('user_id', userId);
    const reread = await getOrCreateUsage(userId);
    return { row: reread.row, view: reread.view };
  }
  void data;
  return { row: fresh.row, view: fresh.view };
}

/**
 * Activate a PAID plan after a verified Razorpay capture.
 * Unlike setUserPlan, this RESETS all AI usage counters to 0 for the new
 * cycle — a fresh quota comes with the fresh payment.
 */
export async function activatePaidPlan(userId: string, planId: string) {
  const safe = normalizePlanId(planId);
  if (safe !== 'scholar' && safe !== 'luminary') {
    throw new Error(`activatePaidPlan only supports paid plans, got "${planId}".`);
  }
  const currentMonth = monthKey();
  const { data, error } = await supabaseAdmin
    .from('user_usage')
    .upsert(
      {
        user_id: userId,
        plan_id: safe,
        messages_used: 0,
        quizzes_used: 0,
        voice_minutes_used: 0,
        period_month: currentMonth,
      },
      { onConflict: 'user_id' },
    )
    .select('user_id, plan_id, messages_used, quizzes_used, voice_minutes_used, period_month')
    .single();
  if (error || !data) {
    // Upsert raced or partially applied — force the reset via update.
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('user_usage')
      .update({
        plan_id: safe,
        messages_used: 0,
        quizzes_used: 0,
        voice_minutes_used: 0,
        period_month: currentMonth,
      })
      .eq('user_id', userId)
      .select('user_id, plan_id, messages_used, quizzes_used, voice_minutes_used, period_month')
      .single();
    if (updateError || !updated) throw updateError ?? error ?? new Error('Failed to activate plan.');
    const used = toUsageState(updated as UsageRow);
    return { row: updated as UsageRow, view: buildUsageView(safe, used) };
  }
  const used = toUsageState(data as UsageRow);
  return { row: data as UsageRow, view: buildUsageView(safe, used) };
}
