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

export const PLANS: Record<string, PlanConfig> = {
  free: {
    key: "free",
    name: "Free",
    priceNGN: 0,
    priceKobo: 0,
    priceUSD: 0,
    priceUSDCents: 0,
    monthlyLimit: 20,
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
    priceNGN: 7500,
    priceKobo: 750000,
    priceUSD: 13,
    priceUSDCents: 1300,
    monthlyLimit: 300,
    paystackPlanCode: "PLN_l45c6u49b4rtphi",
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
    priceNGN: 18000,
    priceKobo: 1800000,
    priceUSD: 29,
    priceUSDCents: 2900,
    monthlyLimit: 1200,
    paystackPlanCode: "PLN_mdtlpytqpous1zr",
    paystackPlanCodeUSD: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO_USD || null,
    isFree: false,
    desc: "For businesses that can't afford to miss a sale",
    accent: "#3b82f6",
    popular: true,
    badge: "Most popular",
    features: [
      "1,200 conversations/month",
      "Lead capture + CRM export",
      "Advanced analytics dashboard",
      "Up to 5 site embeds",
      "Custom agent persona",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
  },
  scale: {
    key: "scale",
    name: "Scale",
    priceNGN: 40000,
    priceKobo: 4000000,
    priceUSD: 59,
    priceUSDCents: 5900,
    monthlyLimit: 3000,
    paystackPlanCode: "PLN_jw99ak49aljjjd4",
    paystackPlanCodeUSD: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_SCALE_USD || null,
    isFree: false,
    desc: "For agencies running multiple client sites",
    accent: "#71717a",
    popular: false,
    badge: null,
    features: [
      "3,000 conversations/month",
      "Unlimited site embeds",
      "White-label widget",
      "Custom AI persona per client",
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
