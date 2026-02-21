"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardNav from "@/app/components/DashboardNav";
import { supabase } from "@/lib/supabase";

const BUSINESS_ID = "3f6505b0-ac65-487e-8dee-f3b2cd9d73fa";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: "$49",
    desc: "Solo founders & small sites",
    features: [
      "1 AI sales agent",
      "500 conversations/mo",
      "Lead capture",
      "Embed on 1 site",
      "Email support",
    ],
    color: "border-zinc-700",
    popular: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$99",
    desc: "Growing businesses",
    features: [
      "3 AI sales agents",
      "Unlimited conversations",
      "Lead capture + CRM export",
      "Embed on 5 sites",
      "Analytics dashboard",
      "Priority support",
    ],
    color: "border-blue-500/50",
    popular: true,
  },
  {
    key: "scale",
    name: "Scale",
    price: "$199",
    desc: "Agencies & high-traffic sites",
    features: [
      "Unlimited agents",
      "Unlimited conversations",
      "White-label widget",
      "Unlimited sites",
      "Custom AI persona",
      "Dedicated support",
    ],
    color: "border-zinc-700",
    popular: false,
  },
];

export default function BillingPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [currentPlan, setCurrentPlan] = useState("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("businesses")
      .select("plan, subscription_status")
      .eq("id", BUSINESS_ID)
      .single()
      .then(({ data }) => {
        if (data) {
          setCurrentPlan(data.plan || "free");
          setSubscriptionStatus(data.subscription_status || "inactive");
        }
        setPageLoading(false);
      });

    // Load Lemon Squeezy embed script
    if (!document.getElementById("lemon-js")) {
      const script = document.createElement("script");
      script.id = "lemon-js";
      script.src = "https://app.lemonsqueezy.com/js/lemon.js";
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Open Lemon Squeezy overlay when checkoutUrl is set
  useEffect(() => {
    if (!checkoutUrl) return;
    const interval = setInterval(() => {
      const LemonSqueezy = (window as any).LemonSqueezy;
      if (LemonSqueezy) {
        clearInterval(interval);
        LemonSqueezy.Url.Open(checkoutUrl);
        setCheckoutUrl(null);
        setLoadingPlan(null);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [checkoutUrl]);

  const handleUpgrade = async (planKey: string) => {
    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, businessId: BUSINESS_ID }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
      } else {
        alert("Failed to open checkout. Please try again.");
        setLoadingPlan(null);
      }
    } catch {
      alert("Something went wrong.");
      setLoadingPlan(null);
    }
  };

  const isActive =
    subscriptionStatus === "active" || subscriptionStatus === "on_trial";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-10">
            <p className="text-zinc-500 text-xs mb-1 tracking-widest uppercase">
              Billing
            </p>
            <h1 className="text-4xl font-bold tracking-tight">Your Plan</h1>
          </div>

          {/* Success banner */}
          {success && (
            <div className="mb-8 flex items-center gap-3 bg-green-500/10 border border-green-500/25 rounded-2xl px-5 py-4">
              <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                ✓
              </div>
              <div>
                <p className="text-green-300 font-semibold text-sm">
                  Payment successful!
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Your plan has been activated. It may take a few seconds to
                  update.
                </p>
              </div>
            </div>
          )}

          {/* Current plan status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-xs mb-1">Current plan</p>
                {pageLoading ? (
                  <div className="w-24 h-7 bg-zinc-800 rounded animate-pulse" />
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold capitalize">
                      {currentPlan}
                    </p>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${
                        isActive
                          ? "bg-green-500/15 text-green-400 border-green-500/20"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700"
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      )}
                      {isActive
                        ? subscriptionStatus === "on_trial"
                          ? "Free trial"
                          : "Active"
                        : "Inactive"}
                    </span>
                  </div>
                )}
              </div>
              {isActive && (
                <button className="text-sm text-zinc-500 hover:text-red-400 transition-colors border border-zinc-800 hover:border-red-500/30 px-4 py-2 rounded-xl">
                  Cancel subscription
                </button>
              )}
            </div>
          </div>

          {/* Pricing cards */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-6">
              {isActive ? "Change your plan" : "Choose a plan"}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {PLANS.map((plan) => {
                const isCurrent = currentPlan === plan.key && isActive;
                const isLoading = loadingPlan === plan.key;

                return (
                  <div key={plan.key} className="relative">
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-blue-500/30">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div
                      className={`relative bg-zinc-900 border ${plan.color} ${plan.popular ? "bg-gradient-to-b from-blue-950/50 to-zinc-900" : ""} rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${isCurrent ? "ring-2 ring-green-500/30" : ""}`}
                    >
                      {isCurrent && (
                        <div className="absolute top-4 right-4">
                          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        </div>
                      )}

                      <div className="mb-5">
                        <p className="text-zinc-400 text-xs font-semibold tracking-widest uppercase mb-3">
                          {plan.name}
                        </p>
                        <div className="flex items-end gap-1 mb-1">
                          <span className="text-4xl font-bold">
                            {plan.price}
                          </span>
                          <span className="text-zinc-500 text-sm mb-1">
                            /mo
                          </span>
                        </div>
                        <p className="text-zinc-500 text-xs">{plan.desc}</p>
                      </div>

                      <ul className="space-y-2.5 flex-1 mb-6">
                        {plan.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2 text-xs text-zinc-300"
                          >
                            <span className="text-green-400 mt-0.5 flex-shrink-0">
                              ✓
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => !isCurrent && handleUpgrade(plan.key)}
                        disabled={isCurrent || isLoading}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed ${
                          isCurrent
                            ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
                            : plan.popular
                              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                            Opening...
                          </span>
                        ) : isCurrent ? (
                          "Current plan"
                        ) : (
                          "Upgrade →"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-center text-zinc-600 text-xs">
            14-day free trial on all plans · Cancel anytime · Secure payments
            via Lemon Squeezy
          </p>
        </div>
      </div>
    </div>
  );
}
