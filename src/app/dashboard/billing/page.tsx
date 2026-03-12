"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardNav from "@/app/components/DashboardNav";
import { getSupabase } from "@/lib/supabase";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: "$49",
    desc: "For solo founders testing the waters",
    border: "border-zinc-800",
    gradient: "from-zinc-900 to-zinc-950",
    accent: "#52525b",
    features: [
      "1 AI sales agent",
      "500 conversations/mo",
      "Lead capture",
      "Embed on 1 site",
      "Email support",
    ],
    popular: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$99",
    desc: "For businesses serious about growth",
    border: "border-blue-500/40",
    gradient: "from-blue-950/60 to-zinc-950",
    accent: "#3b82f6",
    features: [
      "3 AI sales agents",
      "Unlimited conversations",
      "Lead capture + CRM export",
      "Embed on 5 sites",
      "Analytics dashboard",
      "Priority support",
    ],
    popular: true,
  },
  {
    key: "scale",
    name: "Scale",
    price: "$199",
    desc: "For agencies running at full speed",
    border: "border-zinc-800",
    gradient: "from-zinc-900 to-zinc-950",
    accent: "#52525b",
    features: [
      "Unlimited agents",
      "Unlimited conversations",
      "White-label widget",
      "Unlimited sites",
      "Custom AI persona",
      "Dedicated support",
    ],
    popular: false,
  },
];

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.98)",
        transition:
          "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function loadPlan() {
      const sb = getSupabase();
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (!session?.user) {
        setPageLoading(false);
        return;
      }

      const { data } = await sb
        .from("businesses")
        .select("id, plan, subscription_status")
        .eq("user_id", session.user.id)
        .single();

      if (data) {
        const d = data as {
          id: string;
          plan: string;
          subscription_status: string;
        };
        setBusinessId(d.id);
        setCurrentPlan(d.plan || "free");
        setSubscriptionStatus(d.subscription_status || "inactive");
      }
      setPageLoading(false);
    }
    loadPlan();

    if (!document.getElementById("lemon-js")) {
      const script = document.createElement("script");
      script.id = "lemon-js";
      script.src = "https://app.lemonsqueezy.com/js/lemon.js";
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!checkoutUrl) return;
    const interval = setInterval(() => {
      const LS = (
        window as { LemonSqueezy?: { Url: { Open: (u: string) => void } } }
      ).LemonSqueezy;
      if (LS) {
        clearInterval(interval);
        LS.Url.Open(checkoutUrl);
        setCheckoutUrl(null);
        setLoadingPlan(null);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [checkoutUrl]);

  const handleUpgrade = async (planKey: string) => {
    if (!businessId) return;
    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, businessId }),
      });
      const data = await res.json();
      if (data.checkoutUrl) setCheckoutUrl(data.checkoutUrl);
      else {
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div
        className="mb-8 sm:mb-12"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
          transition:
            "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-medium">
            Billing
          </p>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none">
          Your Plan
        </h1>
      </div>

      {/* Success banner */}
      {success && (
        <AnimatedSection delay={0}>
          <div className="relative mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl px-4 sm:px-6 py-4 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-base shrink-0">
              ✓
            </div>
            <div>
              <p className="text-emerald-300 font-semibold text-sm">
                Payment successful!
              </p>
              <p className="text-zinc-500 text-xs mt-0.5">
                Your plan has been activated. It may take a few seconds to
                update.
              </p>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Current plan card */}
      <AnimatedSection delay={150}>
        <div className="relative bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-zinc-600 text-xs mb-2 tracking-widest uppercase font-medium">
                Current plan
              </p>
              {pageLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-28 h-8 bg-zinc-800 rounded-xl animate-pulse" />
                  <div className="w-16 h-6 bg-zinc-800 rounded-full animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <p className="text-2xl sm:text-3xl font-bold capitalize tracking-tight">
                    {currentPlan}
                  </p>
                  <span
                    className={`text-xs px-2.5 sm:px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"}`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
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
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {isActive && (
                <button className="text-xs text-zinc-500 hover:text-red-400 transition-colors border border-zinc-800 hover:border-red-500/20 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl whitespace-nowrap">
                  Cancel
                </button>
              )}
              {!pageLoading && (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-xl sm:text-2xl">
                  {currentPlan === "pro"
                    ? "⚡"
                    : currentPlan === "scale"
                      ? "🚀"
                      : "🌱"}
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section label */}
      <AnimatedSection delay={250}>
        <div className="flex items-center gap-4 mb-5 sm:mb-6">
          <h2 className="text-base font-semibold text-zinc-300 shrink-0">
            {isActive ? "Change your plan" : "Choose a plan"}
          </h2>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>
      </AnimatedSection>

      {/* Pricing grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {PLANS.map((plan, i) => {
          const isCurrent = currentPlan === plan.key && isActive;
          const isLoading = loadingPlan === plan.key;
          return (
            <AnimatedSection key={plan.key} delay={300 + i * 100}>
              <div className="relative h-full">
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl shadow-blue-500/30 tracking-wide">
                      Most Popular
                    </span>
                  </div>
                )}
                <div
                  className={`relative h-full bg-gradient-to-b ${plan.gradient} border ${plan.border} ${isCurrent ? "ring-2 ring-emerald-500/25" : ""} rounded-2xl p-5 sm:p-6 flex flex-col overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${plan.popular ? "hover:border-blue-400/50" : "hover:border-zinc-700"}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                  )}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(280px circle at 50% 0%, ${plan.accent}10, transparent 70%)`,
                    }}
                  />

                  {isCurrent && (
                    <div className="absolute top-4 right-4">
                      <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                        Current
                      </span>
                    </div>
                  )}

                  <div className="relative mb-4 sm:mb-5">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase">
                        {plan.name}
                      </p>
                      {plan.popular && (
                        <span className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                          Best value
                        </span>
                      )}
                    </div>
                    <div className="flex items-end gap-1.5 mb-1">
                      <span className="text-4xl sm:text-5xl font-bold tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-zinc-500 text-sm mb-1.5">/mo</span>
                    </div>
                    <p className="text-zinc-600 text-xs">{plan.desc}</p>
                  </div>

                  <div className="relative h-px bg-zinc-800/80 mb-4 sm:mb-5" />

                  <ul className="relative grid grid-cols-1 gap-2 flex-1 mb-5 sm:mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-xs text-zinc-300"
                      >
                        <span className="text-emerald-400 mt-0.5 shrink-0 font-bold">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !isCurrent && handleUpgrade(plan.key)}
                    disabled={isCurrent || isLoading || !businessId}
                    className={`relative w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed overflow-hidden ${
                      isCurrent
                        ? "bg-zinc-800/80 text-zinc-500 border border-zinc-700"
                        : plan.popular
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-3.5 w-3.5"
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
            </AnimatedSection>
          );
        })}
      </div>

      {/* Footer */}
      <AnimatedSection delay={700}>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pb-4">
          {[
            "14-day free trial",
            "Cancel anytime",
            "Secure via Lemon Squeezy",
          ].map((text, i) => (
            <div key={text} className="flex items-center gap-3 sm:gap-6">
              {i > 0 && (
                <div className="w-1 h-1 bg-zinc-700 rounded-full hidden sm:block" />
              )}
              <span className="text-zinc-600 text-xs">{text}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#080809] text-white">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, #080809 100%)",
          }}
        />
      </div>
      <div className="relative z-10">
        <DashboardNav />
        <Suspense
          fallback={
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
              <div className="w-48 h-12 bg-zinc-800 rounded-xl animate-pulse mb-4" />
              <div className="w-full h-32 bg-zinc-900 rounded-2xl animate-pulse" />
            </div>
          }
        >
          <BillingContent />
        </Suspense>
      </div>
    </div>
  );
}
