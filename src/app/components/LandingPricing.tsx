"use client";

import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import CurrencyToggle from "@/app/components/CurrencyToggle";
import { useCurrency } from "@/lib/currency";
import { PLANS, formatPlanPrice, type Currency } from "@/lib/plans";

const LANDING_PLANS = [
  {
    key: "starter",
    name: "Starter",
    per: "/mo",
    desc: "For founders ready to stop losing leads",
    popular: false,
    features: [
      "300 conversations/month",
      "Lead capture & email collection",
      "Full conversation dashboard",
      "1 site embed",
      "Email support",
    ],
    cta: "Start capturing leads",
  },
  {
    key: "pro",
    name: "Pro",
    per: "/mo",
    desc: "For businesses that can't afford to miss a sale",
    popular: true,
    features: [
      "1,200 conversations/month",
      "Lead capture + CRM export",
      "Advanced analytics dashboard",
      "Up to 5 site embeds",
      "Custom agent persona",
      "Priority support",
    ],
    cta: "Start free trial",
  },
  {
    key: "scale",
    name: "Scale",
    per: "/mo",
    desc: "For agencies running multiple client sites",
    popular: false,
    features: [
      "3,000 conversations/month",
      "Unlimited site embeds",
      "White-label widget",
      "Custom AI persona per client",
      "Dedicated account support",
      "Priority API access",
    ],
    cta: "Talk to us",
  },
] as const;

const Check = ({ className = "" }: { className?: string }) => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className={className}>
    <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
  </svg>
);

export default function LandingPricing({ initialCurrency }: { initialCurrency: Currency }) {
  const [currency, setCurrency] = useCurrency(initialCurrency);

  return (
    <>
      <div className="flex justify-center mb-10">
        <CurrencyToggle value={currency} onChange={setCurrency} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {LANDING_PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 90} direction="up" className="relative">
            {plan.popular && (
              <div className="absolute -top-3 left-6 z-20">
                <span className="bg-blue-600 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-[0_0_16px_rgba(37,99,235,0.6)] tracking-wide">Most popular</span>
              </div>
            )}
            <div className={`relative h-full bg-[#0d0f17]/80 backdrop-blur-xl border rounded-[28px] p-6 sm:p-7 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 text-left shadow-[-12px_-12px_36px_rgba(255,255,255,0.02),16px_16px_45px_rgba(0,0,0,0.85)] ${plan.popular ? "border-blue-500/40 shadow-[0_0_50px_rgba(37,99,235,0.18)]" : "border-white/[0.08]"}`}>
              {plan.popular && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-blue-600/[0.15] rounded-full blur-3xl pointer-events-none" />
                </>
              )}
              <div className="relative mb-5">
                <p className="text-zinc-400 text-[11px] font-semibold tracking-[0.14em] uppercase mb-3">{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-[38px] leading-none font-semibold tracking-tight text-white">{formatPlanPrice(PLANS[plan.key], currency)}</span>
                  <span className="text-zinc-400 text-sm mb-1 font-normal">{plan.per}</span>
                </div>
                <p className="text-zinc-400 text-[13px] leading-relaxed">{plan.desc}</p>
              </div>
              <div className="h-px bg-zinc-800/80 mb-5" />
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-zinc-200">
                    <span className="text-emerald-400 mt-0.5 shrink-0"><Check className="w-4 h-4" /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className={`block w-full py-3.5 rounded-full text-sm font-medium text-center transition-all duration-200 active:scale-[0.98] shadow-md border ${plan.popular ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500/40 shadow-[0_0_24px_rgba(37,99,235,0.4)]" : "bg-[#161824] hover:bg-[#1c1f2e] text-white border-white/[0.08]"}`}>
                {plan.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
