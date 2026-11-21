export type Currency = "USD" | "NGN";

export const CURRENCY_COOKIE = "saim_currency";

export function isCurrency(value: unknown): value is Currency {
  return value === "USD" || value === "NGN";
}

/** Nigeria sees naira; everyone else sees dollars. */
export function currencyForCountry(country: string | null | undefined): Currency {
  return country?.toUpperCase() === "NG" ? "NGN" : "USD";
}

export interface PlanConfig {
  key: "free" | "starter" | "pro" | "scale";
  name: string;
  /** Naira price (charged to Nigerian customers). */
  priceNGN: number;
  priceKobo: number;
  /** Dollar price (default for everyone outside Nigeria). */
  priceUSD: number;
  priceUSDCents: number;
  monthlyLimit: number;
  /** Websites the widget may run on; null = unlimited. */
  maxSites: number | null;
  /** Paystack plan code for NGN billing. */
  paystackPlanCode: string | null;
  /**
   * Paystack plan code for USD billing. Create USD plans in the Paystack
   * dashboard (your account must have USD enabled), then set the
   * NEXT_PUBLIC_PAYSTACK_PLAN_*_USD env vars. Until then, checkout charges NGN.
   */
  paystackPlanCodeUSD: string | null;
  isFree: boolean;
  desc: string;
  accent: string;
  popular: boolean;
  badge: string | null;
  features: string[];
  cta: string;
}

/**
 * Naira prices are the dollar prices converted at the CBN official (NFEM)
 * rate, rounded to the nearest ₦500. Update both when the rate moves a lot.
 */
export const NGN_PER_USD = 1360;
export const NGN_RATE_NOTE = "Naira prices use the CBN official rate (about ₦1,360 per $1, November 2026).";

export const PLANS: Record<string, PlanConfig> = {
  free: {
    key: "free",
    name: "Free",
    priceNGN: 0,
    priceKobo: 0,
    priceUSD: 0,
    priceUSDCents: 0,
    monthlyLimit: 20,
    maxSites: 1,
    paystackPlanCode: null,
    paystackPlanCodeUSD: null,
    isFree: true,
    desc: "For trying out Saim on your website",
    accent: "#71717a",
    popular: false,
    badge: null,
    features: [
      "20 conversations/month",
      "Lead capture & email collection",
      "Full conversation dashboard",
      "1 site embed",
    ],
    cta: "Current plan",
  },
  starter: {
    key: "starter",
    name: "Starter",
    priceNGN: 15000,
    priceKobo: 1500000,
    priceUSD: 11,
    priceUSDCents: 1100,
    monthlyLimit: 300,
    maxSites: 1,
    paystackPlanCode:
      process.env.NEXT_PUBLIC_PAYSTACK_PLAN_STARTER_NGN || "PLN_l45c6u49b4rtphi",
    paystackPlanCodeUSD: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_STARTER_USD || null,
    isFree: false,
    desc: "For founders ready to stop losing leads",
    accent: "#71717a",
    popular: false,
    badge: null,
    features: [
      "300 conversations/month",
      "Lead capture & email collection",
      "Full conversation dashboard",
      "1 site embed",
      "Email support",
    ],
    cta: "Upgrade to Starter",
  },
  pro: {
    key: "pro",
    name: "Pro",
    priceNGN: 34000,
    priceKobo: 3400000,
    priceUSD: 25,
    priceUSDCents: 2500,
    monthlyLimit: 1200,
    maxSites: 5,
    paystackPlanCode:
      process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_NGN || "PLN_mdtlpytqpous1zr",
    paystackPlanCodeUSD: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_USD || null,
    isFree: false,
    desc: "For businesses that can't afford to miss a sale",
    accent: "#3b82f6",
    popular: true,
    badge: "Most popular",
    features: [
      "1,200 conversations/month",
      "Lead capture + CSV export for your CRM",
      "Analytics dashboard",
      "Up to 5 site embeds",
      "Write your own agent personality",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
  },
  scale: {
    key: "scale",
    name: "Scale",
    priceNGN: 66500,
    priceKobo: 6650000,
    priceUSD: 49,
    priceUSDCents: 4900,
    monthlyLimit: 3000,
    maxSites: null,
    paystackPlanCode:
      process.env.NEXT_PUBLIC_PAYSTACK_PLAN_SCALE_NGN || "PLN_jw99ak49aljjjd4",
    paystackPlanCodeUSD: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_SCALE_USD || null,
    isFree: false,
    desc: "For agencies running multiple client sites",
    accent: "#71717a",
    popular: false,
    badge: null,
    features: [
      "3,000 conversations/month",
      "Unlimited site embeds",
      "White-label widget (no Saim branding)",
      "Everything in Pro",
      "Dedicated account support",
      "Priority API access",
    ],
    cta: "Upgrade to Scale",
  },
};

export function getPlanByKey(key: string): PlanConfig {
  return PLANS[key] || PLANS.free;
}

export function getPlanByPaystackCode(code: string): PlanConfig | undefined {
  return Object.values(PLANS).find(
    (plan) =>
      plan.paystackPlanCode === code || plan.paystackPlanCodeUSD === code,
  );
}

/** True once every paid plan has a USD Paystack plan code configured. */
export const USD_BILLING_ENABLED = [PLANS.starter, PLANS.pro, PLANS.scale].every(
  (plan) => !!plan.paystackPlanCodeUSD,
);

/** Amount in the smallest unit (kobo / cents) and plan code for a currency. */
export function getPlanCharge(plan: PlanConfig, currency: Currency) {
  if (currency === "USD") {
    return {
      currency,
      amount: plan.priceUSDCents,
      paystackPlanCode: plan.paystackPlanCodeUSD,
    };
  }
  return {
    currency,
    amount: plan.priceKobo,
    paystackPlanCode: plan.paystackPlanCode,
  };
}

/** "$12" or "₦7,500" */
export function formatPlanPrice(plan: PlanConfig, currency: Currency): string {
  return currency === "USD"
    ? `$${plan.priceUSD.toLocaleString("en-US")}`
    : `₦${plan.priceNGN.toLocaleString("en-US")}`;
}

/* ─────────────────────────── Plan features ───────────────────────────
   One source of truth for what each plan unlocks. Used by the dashboard
   (to show or lock features) and by the API (to enforce them). */

export type Feature = "analytics" | "export" | "customPersona" | "whiteLabel";

const FEATURES: Record<PlanConfig["key"], Feature[]> = {
  free: [],
  starter: [],
  pro: ["analytics", "export", "customPersona"],
  scale: ["analytics", "export", "customPersona", "whiteLabel"],
};

export function hasFeature(plan: string | null | undefined, feature: Feature): boolean {
  const key = (plan && plan in FEATURES ? plan : "free") as PlanConfig["key"];
  return FEATURES[key].includes(feature);
}

/** Cheapest plan that unlocks a feature (for "Upgrade to …" prompts). */
export function planFor(feature: Feature): PlanConfig {
  const order: PlanConfig["key"][] = ["starter", "pro", "scale"];
  const key = order.find((k) => FEATURES[k].includes(feature)) ?? "scale";
  return PLANS[key];
}
