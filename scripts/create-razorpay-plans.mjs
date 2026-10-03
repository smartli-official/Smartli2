/**
 * One-time setup: create the 4 Smartli billing Plans on Razorpay (TEST mode).
 *
 * Razorpay Subscriptions always bill through a Plan object (fixed amount +
 * interval), so one Plan is needed per (paid tier x billing period):
 *   scholar x monthly/yearly, luminary x monthly/yearly.
 *
 * Amounts MUST match the canonical table in lib/plan/pricing.ts
 * (PLAN_PRICES_INR_PAISA) — that file is the source of truth, the numbers
 * below are just echoed for plan creation.
 *
 * Usage:
 *   node scripts/create-razorpay-plans.mjs
 *
 * Reads RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET from the environment (or
 * .env.local). Because those are TEST keys, the plans are created in test
 * mode. Live mode needs its own 4 plans later — re-run with live keys and
 * store the resulting IDs separately.
 *
 * Idempotent: existing plans tagged with our notes are reused, never
 * duplicated. Prints the .env block to append at the end.
 */

import fs from 'node:fs';
import path from 'node:path';

// Minimal .env.local loader (fills only vars not already in the environment).
function loadEnvLocal() {
  const file = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const keyId = process.env.RAZORPAY_KEY_ID;
const secret = process.env.RAZORPAY_KEY_SECRET;
if (!keyId || !secret) {
  console.error('Missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET (env or .env.local).');
  process.exit(1);
}
if (!keyId.startsWith('rzp_test_')) {
  console.error(`Refusing: ${keyId} is not a TEST key. This script only creates test-mode plans.`);
  process.exit(1);
}

// Canonical INR prices in paise — must match lib/plan/pricing.ts.
const WANT = [
  { env: 'RAZORPAY_PLAN_SCHOLAR_MONTHLY', planId: 'scholar', billing: 'monthly', period: 'monthly', amount: 11000, name: 'Smartli Scholar — Monthly' },
  { env: 'RAZORPAY_PLAN_SCHOLAR_YEARLY', planId: 'scholar', billing: 'yearly', period: 'yearly', amount: 118800, name: 'Smartli Scholar — Yearly' },
  { env: 'RAZORPAY_PLAN_LUMINARY_MONTHLY', planId: 'luminary', billing: 'monthly', period: 'monthly', amount: 139900, name: 'Smartli Luminary — Monthly' },
  { env: 'RAZORPAY_PLAN_LUMINARY_YEARLY', planId: 'luminary', billing: 'yearly', period: 'yearly', amount: 1399900, name: 'Smartli Luminary — Yearly' },
];

const auth = Buffer.from(`${keyId}:${secret}`).toString('base64');

async function rz(method, endpoint, body) {
  const res = await fetch(`https://api.razorpay.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${endpoint} → ${res.status}: ${json?.error?.description ?? JSON.stringify(json)}`);
  }
  return json;
}

const existing = await rz('GET', '/v1/plans?count=100');
const items = Array.isArray(existing.items) ? existing.items : [];

function findPlan(w) {
  return items.find(
    (p) =>
      (p?.notes?.smartli_plan === w.planId && p?.notes?.billing === w.billing) ||
      p?.item?.name === w.name,
  );
}

const envLines = [];
for (const w of WANT) {
  const hit = findPlan(w);
  if (hit) {
    console.log(`reuse  ${w.env}=${hit.id}  (${w.name}, ${hit.item?.amount ?? '?'} paise)`);
    envLines.push(`${w.env}=${hit.id}`);
    continue;
  }
  const created = await rz('POST', '/v1/plans', {
    period: w.period,
    interval: 1,
    item: {
      name: w.name,
      amount: w.amount,
      currency: 'INR',
      description: `${w.name} — Smartli recurring subscription (test mode)`,
    },
    notes: { smartli_plan: w.planId, billing: w.billing, managed_by: 'smartli-setup' },
  });
  console.log(`create ${w.env}=${created.id}  (${w.name})`);
  envLines.push(`${w.env}=${created.id}`);
}

console.log('\n--- append to .env.local ---');
console.log(envLines.join('\n'));
