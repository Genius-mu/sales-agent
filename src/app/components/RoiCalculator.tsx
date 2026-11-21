"use client";

import { useMemo, useState } from "react";
import TagButton from "@/app/components/TagButton";
import { useCurrency } from "@/lib/currency";
import { NGN_PER_USD, type Currency } from "@/lib/plans";

function money(value: number, currency: Currency) {
  const amount = currency === "USD" ? value : value * NGN_PER_USD;
  const symbol = currency === "USD" ? "$" : "₦";
  return `${symbol}${Math.round(amount).toLocaleString("en-US")}`;
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-slate-600 text-[14px] font-medium">{label}</span>
        <span className="text-slate-900 text-[15px] font-bold tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-range w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </label>
  );
}

/**
 * Interactive "what are you leaving on the table" estimate. Every
 * assumption is a slider the visitor controls, so nothing is a hidden claim.
 */
export default function RoiCalculator({ initialCurrency }: { initialCurrency: Currency }) {
  const [currency] = useCurrency(initialCurrency);
  const [visitors, setVisitors] = useState(2000);
  const [dealUSD, setDealUSD] = useState(200);
  const [leadRate, setLeadRate] = useState(2);
  const [closeRate, setCloseRate] = useState(10);

  const { leads, deals, revenue } = useMemo(() => {
    const leads = Math.round(visitors * (leadRate / 100));
    const deals = leads * (closeRate / 100);
    return { leads, deals, revenue: deals * dealUSD };
  }, [visitors, dealUSD, leadRate, closeRate]);

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] rounded-[28px] overflow-hidden border-2 border-slate-900 bg-white shadow-[5px_6px_0_#0f172a]">
      <div className="bg-white p-6 sm:p-8 space-y-6 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-900">
        <Slider label="👀 Visitors / month" value={visitors} display={visitors.toLocaleString("en-US")} min={200} max={50000} step={100} onChange={setVisitors} />
        <Slider label="💰 Value of a customer" value={dealUSD} display={money(dealUSD, currency)} min={10} max={5000} step={10} onChange={setDealUSD} />
        <Slider label="💬 Visitors who become leads" value={leadRate} display={`${leadRate}%`} min={0.5} max={10} step={0.5} onChange={setLeadRate} />
        <Slider label="🤝 Leads you close" value={closeRate} display={`${closeRate}%`} min={1} max={50} step={1} onChange={setCloseRate} />
        <p className="text-slate-400 text-[12px]">Your numbers. An estimate, not a promise.</p>
      </div>
      <div className="relative bg-blue-600 p-6 sm:p-8 flex flex-col justify-center overflow-hidden text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} />
        <p className="relative text-blue-100 text-[13px] font-semibold mb-2">Every month you could get</p>
        <div className="relative flex items-baseline gap-2 mb-1">
          <span className="text-6xl font-bold tracking-tight tabular-nums">{leads.toLocaleString("en-US")}</span>
          <span className="text-blue-100 text-[16px] font-medium">leads</span>
        </div>
        <p className="relative text-blue-100 text-[14px] mb-6">≈ {deals.toFixed(deals < 10 ? 1 : 0)} new customers</p>
        <p className="relative text-blue-100 text-[13px] font-semibold mb-1">Worth about</p>
        <p className="relative text-4xl sm:text-5xl font-bold tracking-tight tabular-nums text-yellow-300 mb-8">
          {money(revenue, currency)}
          <span className="text-blue-100 text-lg font-medium">/mo</span>
        </p>
        <TagButton href="/login?mode=signup" variant="light" slant="down" fullWidth height={48} className="relative">
          Get these leads free →
        </TagButton>
      </div>
    </div>
  );
}
