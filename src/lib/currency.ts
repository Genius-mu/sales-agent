"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CURRENCY_COOKIE,
  USD_BILLING_ENABLED,
  isCurrency,
  type Currency,
} from "@/lib/plans";

const CURRENCY_EVENT = "saim-currency-change";

function readCookie(): Currency | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([^;]*)`),
  );
  const value = match ? decodeURIComponent(match[1]) : null;
  return isCurrency(value) ? value : null;
}

function writeCookie(currency: Currency) {
  document.cookie = `${CURRENCY_COOKIE}=${currency}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * The visitor's display currency. Order: their saved choice (cookie), then
 * their location (via /api/geo), then dollars.
 */
export function useCurrency(initial?: Currency) {
  const [currency, setCurrencyState] = useState<Currency>(initial ?? "USD");

  useEffect(() => {
    const saved = readCookie();
    if (saved) {
      setCurrencyState(saved);
      return;
    }
    if (initial) return;

    let cancelled = false;
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && isCurrency(data?.currency)) {
          setCurrencyState(data.currency);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [initial]);

  // Keep every price on the page in sync when one toggle changes.
  useEffect(() => {
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Currency>).detail;
      if (isCurrency(next)) setCurrencyState(next);
    };
    window.addEventListener(CURRENCY_EVENT, onChange);
    return () => window.removeEventListener(CURRENCY_EVENT, onChange);
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    writeCookie(next);
    setCurrencyState(next);
    window.dispatchEvent(new CustomEvent(CURRENCY_EVENT, { detail: next }));
  }, []);

  return [currency, setCurrency] as const;
}

/**
 * Currency for pages where people actually pay. Until USD Paystack plans are
 * configured, checkout can only charge naira, so these pages stay in NGN and
 * hide the toggle — the price shown always matches the price charged.
 */
export function useBillingCurrency() {
  const [currency, setCurrency] = useCurrency();
  if (!USD_BILLING_ENABLED) {
    return { currency: "NGN" as Currency, setCurrency, canChoose: false };
  }
  return { currency, setCurrency, canChoose: true };
}
