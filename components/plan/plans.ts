export type BillingPeriod = 'monthly' | 'yearly';

export interface PlanTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  cta: string;
  popular?: boolean;
  accent: string;
  glow: string;
  benefits: string[];
  limitations: string[];
  usage: {
    messages: string;
    quizzes: string;
    voice: string;
  };
}

export const PLANS: PlanTier[] = [
  {
    id: 'spark',
    name: 'Spark',
    tagline: 'For trying Smartli out and light daily study.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: 'Stay on Spark',
    accent: '#a1a1aa',
    glow: 'rgba(161, 161, 170, 0.16)',
    benefits: [
      '25 AI messages per month',
      '5 quizzes per month',
      'Explainer mode with standard models',
      '5 voice-transcription minutes / mo',
      'Community support',
    ],
    limitations: [
      'No image uploads or Canvas mode',
      'No Focus Hub history or Analytics',
      'No priority / high-reasoning models',
      'No offline or early-access features',
    ],
    usage: {
      messages: '25 / mo',
      quizzes: '5 / mo',
      voice: '5 min / mo',
    },
  },
  {
    id: 'scholar',
    name: 'Scholar',
    tagline: 'For daily learners who want it all, faster.',
    monthlyPrice: 5,
    yearlyPrice: 24,
    cta: 'Upgrade to Scholar',
    popular: true,
    accent: '#9b87f5',
    glow: 'rgba(155, 135, 245, 0.28)',
    benefits: [
      '1,500 AI messages per month',
      'Unlimited quizzes with timer + grading',
      'Image uploads, Canvas + Think modes',
      '120 voice-transcription minutes / mo',
      'Focus Hub history + full Analytics',
      'Priority speed on standard models',
    ],
    limitations: [
      'High-reasoning 120B model capped monthly',
      'No team workspaces or shared libraries',
    ],
    usage: {
      messages: '1,500 / mo',
      quizzes: 'Unlimited',
      voice: '120 min / mo',
    },
  },
  {
    id: 'luminary',
    name: 'Luminary',
    tagline: 'For power learners and exam-season sprints.',
    monthlyPrice: 16,
    yearlyPrice: 160,
    cta: 'Upgrade to Luminary',
    accent: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.22)',
    benefits: [
      'Unlimited AI messages + quizzes',
      'Highest-reasoning models, top priority',
      '600 voice-transcription minutes / mo',
      'Early access to new study modes',
      'Advanced Analytics exports',
      'Priority support (under 24h)',
    ],
    limitations: ['Fair-use cap on bulk generation bursts'],
    usage: {
      messages: 'Unlimited',
      quizzes: 'Unlimited',
      voice: '600 min / mo',
    },
  },
];

export interface ComparisonRow {
  feature: string;
  values: [string, string, string];
  included: [boolean, boolean, boolean];
}

export const COMPARISON: ComparisonRow[] = [
  {
    feature: 'AI messages',
    values: ['25 / month', '1,500 / month', 'Unlimited'],
    included: [true, true, true],
  },
  {
    feature: 'Quizzes + grading',
    values: ['5 / month', 'Unlimited', 'Unlimited'],
    included: [true, true, true],
  },
  {
    feature: 'Voice transcription (Whisper)',
    values: ['5 min / mo', '120 min / mo', '600 min / mo'],
    included: [true, true, true],
  },
  {
    feature: 'Image uploads + Canvas',
    values: ['Not included', 'Included', 'Included'],
    included: [false, true, true],
  },
  {
    feature: 'Focus Hub history + Analytics',
    values: ['Not included', 'Full history', 'Full history + exports'],
    included: [false, true, true],
  },
  {
    feature: 'High-reasoning models',
    values: ['Not included', 'Monthly cap', 'Top priority'],
    included: [false, true, true],
  },
  {
    feature: 'Early access + priority support',
    values: ['—', '—', 'Included'],
    included: [false, false, true],
  },
];

/** @deprecated Plan now lives in Supabase (`user_usage` via /api/usage). Kept for back-compat only. */
export const STORAGE_KEY = 'smartli-plan-id';

export function priceFor(plan: PlanTier, billing: BillingPeriod): string {
  if (plan.monthlyPrice === 0) return '$0';
  if (billing === 'monthly') return `$${plan.monthlyPrice}`;
  return `$${Math.round(plan.yearlyPrice / 12)}`;
}
