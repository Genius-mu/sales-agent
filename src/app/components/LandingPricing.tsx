"use client";

import Reveal from "@/app/components/Reveal";
import CurrencyToggle from "@/app/components/CurrencyToggle";
import Tilt3D from "@/app/components/Tilt3D";
import TagButton from "@/app/components/TagButton";
import { useCurrency } from "@/lib/currency";
import { NGN_RATE_NOTE, PLANS, formatPlanPrice, type Currency } from "@/lib/plans";

const LANDING_PLANS = [
  {
    key: "starter",
    emoji: "🌱",
    desc: "For getting started",
    popular: false,
    features: ["300 chats / month", "Lead capture", "1 website"],
  },
  {
    key: "pro",
    emoji: "🚀",
    desc: "For growing businesses",
    popular: true,
    features: ["1,200 chats / month", "CRM export + analytics", "5 websites", "Custom persona"],
  },
  {
    key: "scale",
    emoji: "🏢",
    desc: "For agencies",
    popular: false,
    features: ["3,000 chats / month", "Unlimited websites", "White-label widget"],
  },
] as const;

const Check = () => (
  <span className="w-5 h-5 shrink-0 rounded-full bg-green-300 border-2 border-slate-900 flex items-center justify-center">
    <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
      <path stroke="#0f172a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
    </svg>
  </span>
);

export default function LandingPricing({ initialCurrency }: { initialCurrency: Currency }) {
  const [currency, setCurrency] = useCurrency(initialCurrency);

  return (
    <>
      <div className="flex flex-col items-center gap-2 mb-10">
        <CurrencyToggle value={currency} onChange={setCurrency} theme="light" />
        <p className={`text-slate-500 text-[12px] h-4 transition-opacity ${currency === "NGN" ? "opacity-100" : "opacity-0"}`} aria-hidden={currency !== "NGN"}>
          {NGN_RATE_NOTE}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch">
        {LANDING_PLANS.map((plan, i) => {
          const config = PLANS[plan.key];
          return (
            <Reveal key={plan.key} delay={i * 90} direction="up" className="relative h-full">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="block bg-yellow-300 text-slate-900 text-[12px] font-bold px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0_#0f172a] whitespace-nowrap">
                    ⭐ Most popular
                  </span>
                </div>
              )}
              <Tilt3D max={6}>
                <div
                  className={`relative h-full rounded-3xl p-6 flex flex-col border-2 border-slate-900 ${
                    plan.popular ? "bg-blue-50 shadow-[6px_7px_0_#2563eb]" : "bg-white shadow-[4px_5px_0_#0f172a]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{plan.emoji}</span>
                    <span className="font-bold text-[18px]">{config.name}</span>
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-[44px] leading-none font-bold tracking-tight tabular-nums">{formatPlanPrice(config, currency)}</span>
                    <span className="text-slate-500 text-[15px] mb-1.5">/mo</span>
                  </div>
                  <p className="text-slate-500 text-[14px] mb-5">{plan.desc}</p>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-[14px] font-medium">
                        <Check />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <TagButton href="/login?mode=signup" variant={plan.popular ? "primary" : "secondary"} slant="right" fullWidth height={48}>
                    Choose {config.name}
                  </TagButton>
                </div>
              </Tilt3D>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
