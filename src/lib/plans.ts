export interface PlanConfig {
  key: "free" | "starter" | "pro" | "scale";
  name: string;
  priceNGN: number;
  priceKobo: number;
  monthlyLimit: number;
  paystackPlanCode: string | null;
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
    monthlyLimit: 20,
    paystackPlanCode: null,
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
    monthlyLimit: 300,
    paystackPlanCode: "PLN_l45c6u49b4rtphi",
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
    monthlyLimit: 1200,
    paystackPlanCode: "PLN_mdtlpytqpous1zr",
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
    monthlyLimit: 3000,
    paystackPlanCode: "PLN_jw99ak49aljjjd4",
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
  return Object.values(PLANS).find((plan) => plan.paystackPlanCode === code);
}
