"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
        <span className="text-zinc-400 text-[13px]">{label}</span>
        <span className="text-white text-[14px] font-medium tabular-nums">{display}</span>
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
    <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-px bg-zinc-800/60 rounded-[28px] overflow-hidden border border-zinc-800">
      <div className="bg-[#0b0c11] p-6 sm:p-8 space-y-6">
        <Slider label="Website visitors per month" value={visitors} display={visitors.toLocaleString("en-US")} min={200} max={50000} step={100} onChange={setVisitors} />
        <Slider label="Average value of a customer" value={dealUSD} display={money(dealUSD, currency)} min={10} max={5000} step={10} onChange={setDealUSD} />
        <Slider label="Visitors who'd chat and leave contact details" value={leadRate} display={`${leadRate}%`} min={0.5} max={10} step={0.5} onChange={setLeadRate} />
        <Slider label="Leads you'd turn into customers" value={closeRate} display={`${closeRate}%`} min={1} max={50} step={1} onChange={setCloseRate} />
        <p className="text-zinc-600 text-[12px] leading-relaxed">
          Your numbers, your assumptions. Move the sliders to match your business. This is an estimate, not a promise.
        </p>
      </div>
      <div className="relative bg-[#0d0f17] p-6 sm:p-8 flex flex-col justify-center overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <p className="relative text-zinc-500 text-[11px] tracking-[0.15em] uppercase font-medium mb-3">Every month you could capture</p>
        <div className="relative flex items-baseline gap-2 mb-1">
          <span className="text-5xl font-semibold tracking-tight tabular-nums text-white">{leads.toLocaleString("en-US")}</span>
          <span className="text-zinc-400 text-[15px]">qualified leads</span>
        </div>
        <p className="relative text-zinc-500 text-[13px] mb-7">≈ {deals.toFixed(deals < 10 ? 1 : 0)} new customers</p>
        <p className="relative text-zinc-500 text-[11px] tracking-[0.15em] uppercase font-medium mb-2">Worth about</p>
        <p className="relative text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent mb-8">
          {money(revenue, currency)}
          <span className="text-zinc-500 text-lg font-normal">/mo</span>
        </p>
        <Link href="/login" className="relative inline-flex justify-center bg-white text-black font-medium text-[14px] px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors active:scale-[0.98]">
          Start capturing them, free
        </Link>
      </div>
    </div>
  );
}
