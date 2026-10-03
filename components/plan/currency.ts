export type CurrencyCode = 'USD' | 'INR' | 'MMK';

const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  USD: 'en-US',
  INR: 'en-IN',
  MMK: 'en-MM',
};

export function currencyLocale(currency: CurrencyCode): string {
  return CURRENCY_LOCALE[currency];
}

export const CURRENCY_LABEL: Record<CurrencyCode, string> = {
  USD: 'USD ($)',
  INR: 'INR (₹)',
  MMK: 'MMK (Ks)',
};

/** Per-plan prices in each supported currency (whole units, no decimals). */
const PLAN_PRICES: Record<string, Record<CurrencyCode, { monthly: number; yearly: number }>> = {
  spark: {
    USD: { monthly: 0, yearly: 0 },
    INR: { monthly: 0, yearly: 0 },
    MMK: { monthly: 0, yearly: 0 },
  },
  scholar: {
    USD: { monthly: 5, yearly: 24 },
    INR: { monthly: 110, yearly: 1188 },
    MMK: { monthly: 2500, yearly: 25000 },
  },
  luminary: {
    USD: { monthly: 16, yearly: 160 },
    INR: { monthly: 1399, yearly: 13999 },
    MMK: { monthly: 33600, yearly: 336000 },
  },
};

export function formatPrice(value: number, currency: CurrencyCode): string {
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value}`;
  }
}

/** Monthly-equivalent display price (yearly billing shows per-month cost). */
export function displayPrice(
  planId: string,
  currency: CurrencyCode,
  billing: 'monthly' | 'yearly',
): string {
  return formatPrice(priceAmount(planId, currency, billing), currency);
}

/** Raw numeric amount behind displayPrice (for the rolling ticker). */
export function priceAmount(
  planId: string,
  currency: CurrencyCode,
  billing: 'monthly' | 'yearly',
): number {
  const prices = PLAN_PRICES[planId] ?? PLAN_PRICES.spark!;
  const tier = prices[currency];
  if (tier.monthly === 0) return 0;
  return billing === 'monthly' ? tier.monthly : Math.round(tier.yearly / 12);
}

/** Whole-percent saving of yearly billing vs monthly, on a per-month basis. */
export function yearlyDiscountPct(planId: string, currency: CurrencyCode): number {
  const prices = PLAN_PRICES[planId] ?? PLAN_PRICES.spark!;
  const tier = prices[currency];
  if (!tier || tier.monthly === 0) return 0;
  return Math.round((1 - tier.yearly / 12 / tier.monthly) * 100);
}

/** Locale-aware parts (currency symbol, groups, digits) for the ticker. */
export function priceParts(
  amount: number,
  currency: CurrencyCode,
): Intl.NumberFormatPart[] {
  return new Intl.NumberFormat(currencyLocale(currency), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).formatToParts(amount);
}

/** Instant synchronous guess from timezone + locale (no network). */
export function guessCurrency(): CurrencyCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (/kolkata|calcutta/i.test(tz)) return 'INR';
    if (/yangon|rangoon/i.test(tz)) return 'MMK';
    const lang = (typeof navigator !== 'undefined' ? navigator.language : '') ?? '';
    const region = lang.split('-')[1]?.toUpperCase();
    if (region === 'IN') return 'INR';
    if (region === 'MM') return 'MMK';
    const primary = lang.split('-')[0]?.toLowerCase();
    if (
      primary &&
      ['hi', 'mr', 'gu', 'kn', 'ml', 'pa', 'ta', 'te', 'or', 'as'].includes(primary)
    ) {
      return 'INR';
    }
    if (primary === 'my') return 'MMK';
  } catch {
    /* fall through to USD */
  }
  return 'USD';
}

/**
 * Authoritative check via IP geolocation. Returns the ISO country code,
 * or null when the lookup fails (offline, blocked, timeout).
 */
export async function fetchCountryCode(signal: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch('https://ipapi.co/country_code/', { signal });
    if (!res.ok) return null;
    const code = (await res.text()).trim().toUpperCase();
    return /^[A-Z]{2}$/.test(code) ? code : null;
  } catch {
    return null;
  }
}

export function currencyForCountry(code: string | null): CurrencyCode | null {
  if (code === 'IN') return 'INR';
  if (code === 'MM') return 'MMK';
  if (code === null) return null;
  return 'USD';
}
