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
}: {
  value: Currency;
  onChange: (currency: Currency) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Currency"
      className={`inline-flex items-center gap-1 p-1 rounded-full bg-zinc-900/70 border border-white/[0.08] ${className}`}
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
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
              active
                ? "bg-white text-black"
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
