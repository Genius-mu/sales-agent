"use client";

import type { Currency } from "@/lib/plans";

const OPTIONS: { value: Currency; label: string }[] = [
  { value: "USD", label: "USD $" },
  { value: "NGN", label: "NGN ₦" },
];

export default function CurrencyToggle({
  value,
  onChange,
  className = "",
  theme = "dark",
}: {
  value: Currency;
  onChange: (currency: Currency) => void;
  className?: string;
  theme?: "dark" | "light";
}) {
  const light = theme === "light";
  return (
    <div
      role="radiogroup"
      aria-label="Currency"
      className={`inline-flex items-center gap-1 p-1 rounded-full ${
        light
          ? "bg-white border-2 border-slate-900 shadow-[2px_3px_0_#0f172a]"
          : "bg-zinc-900/70 border border-white/[0.08]"
      } ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
              active
                ? light
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black"
                : light
                  ? "text-slate-500 hover:text-slate-900"
                  : "text-zinc-400 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
