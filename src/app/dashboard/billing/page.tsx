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
    per: "/mo",
    desc: "For founders ready to stop losing leads",
    accent: "#71717a",
    popular: false,
    badge: null,
    features: [
      "500 conversations/month",
      "Lead capture & email collection",
      "Full conversation dashboard",
      "1 site embed",
      "Email support",
    ],
    cta: "Upgrade to Starter",
  },
  {
    key: "pro",
    name: "Pro",
    price: "$99",
    per: "/mo",
    desc: "For businesses that can't afford to miss a sale",
    accent: "#3b82f6",
    popular: true,
    badge: "Most popular",
    features: [
      "Unlimited conversations",
      "Lead capture + CRM export",
      "Advanced analytics dashboard",
      "Up to 5 site embeds",
      "Custom agent persona",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
  },
  {
    key: "scale",
    name: "Scale",
    price: "$199",
    per: "/mo",
    desc: "For agencies running multiple client sites",
    accent: "#71717a",
    popular: false,
    badge: null,
    features: [
      "Unlimited conversations",
      "Unlimited site embeds",
      "White-label widget",
      "Custom AI persona per client",
      "Dedicated account support",
      "Priority API access",
    ],
    cta: "Upgrade to Scale",
  },
];

const PAIN_POINTS = [
  {
    title: "Leads visit at 2am",
    desc: "Free plan caps at 50 conversations. After that, your agent goes silent — and visitors leave without a word.",
  },
  {
    title: "You're capped at 50 chats",
    desc: "That's one decent traffic day. If your site gets real visitors, you'll hit the limit before the month ends.",
  },
  {
    title: "No analytics on free",
    desc: "You can't see what visitors are asking, which questions convert, or where leads drop off.",
  },
];

const COMPARISON = [
  {
    feature: "Conversations/month",
    free: "50",
    starter: "500",
    pro: "Unlimited",
  },
  { feature: "Lead capture", free: true, starter: true, pro: true },
  { feature: "CRM export", free: false, starter: false, pro: true },
  { feature: "Analytics dashboard", free: false, starter: false, pro: true },
  { feature: "Site embeds", free: "1", starter: "1", pro: "5" },
  { feature: "Custom agent name", free: false, starter: false, pro: true },
  { feature: "Priority support", free: false, starter: false, pro: true },
];

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition:
          "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}

const Check = ({ className = "" }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 6 9 17l-5-5"
    />
  </svg>
);

const Dash = () => (
  <svg
    width="12"
    height="12"
    fill="none"
    viewBox="0 0 24 24"
    className="text-zinc-700 mx-auto"
  >
    <path
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      d="M5 12h14"
    />
  </svg>
);

function BillingContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

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
        .maybeSingle();
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
  }, []);

  useEffect(() => {
    if (!checkoutUrl) return;
    window.location.href = checkoutUrl;
    setCheckoutUrl(null);
    setLoadingPlan(null);
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
      if (data.url) setCheckoutUrl(data.url);
      else {
        alert(data.error || "Couldn't start checkout. Please try again.");
        setLoadingPlan(null);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  const isActive =
    subscriptionStatus === "active" || subscriptionStatus === "on_trial";
  const isFree = currentPlan === "free" || !isActive;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <FadeIn className="mb-8">
        <h1 className="text-[22px] sm:text-2xl font-semibold tracking-tight text-white mb-1">
          {isFree ? "Your agent is running on limits" : "Billing"}
        </h1>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
          {isFree
            ? "You're on the free tier — 50 conversations a month. Enough to see it work. Upgrade to let it run without limits."
            : "Manage your subscription and unlock more as your business grows."}
        </p>
      </FadeIn>

      {/* Success banner */}
      {success && (
        <FadeIn className="mb-6">
          <div className="flex items-center gap-3 bg-emerald-500/[0.07] border border-emerald-500/20 rounded-xl px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
              <Check />
            </div>
            <div>
              <p className="text-emerald-300 font-medium text-sm">
                You're all set — welcome aboard
              </p>
              <p className="text-zinc-500 text-[13px] mt-0.5">
                Your plan is active and the limits are lifted.
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Current plan */}
      <FadeIn delay={60} className="mb-8">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-zinc-500 text-[11px] mb-2 tracking-[0.12em] uppercase font-medium">
                Current plan
              </p>
              {pageLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-24 h-7 bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="w-14 h-5 bg-zinc-800 rounded-full animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="text-xl font-semibold capitalize tracking-tight">
                    {currentPlan}
                  </p>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium border flex items-center gap-1.5 ${isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800/80 text-zinc-500 border-zinc-700"}`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    )}
                    {isActive
                      ? subscriptionStatus === "on_trial"
                        ? "Free trial"
                        : "Active"
                      : "Free tier"}
                  </span>
                </div>
              )}
              {isFree && !pageLoading && (
                <p className="text-zinc-600 text-[13px] mt-2">
                  50 conversations/month · Upgrade anytime
                </p>
              )}
            </div>
            {isActive && (
              <button className="text-[13px] text-zinc-500 hover:text-red-400 transition-colors border border-zinc-800 hover:border-red-500/20 px-3 py-1.5 rounded-lg shrink-0">
                Cancel
              </button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Pain points — free users only */}
      {isFree && !pageLoading && (
        <FadeIn delay={120} className="mb-8">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-white mb-1">
              What you're leaving on the table
            </h2>
            <p className="text-zinc-500 text-[13px]">
              Every day on free, here's what slips by.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.title}
                className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4"
              >
                <h3 className="text-white text-[13px] font-medium mb-1.5">
                  {p.title}
                </h3>
                <p className="text-zinc-500 text-[12px] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* ROI callout */}
      {isFree && !pageLoading && (
        <FadeIn delay={180} className="mb-8">
          <div className="relative overflow-hidden bg-zinc-900/40 border border-blue-500/20 rounded-xl px-5 sm:px-6 py-5">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            <div className="absolute -top-16 left-1/4 w-48 h-32 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold text-[15px] mb-1">
                  One extra lead pays for three months
                </p>
                <p className="text-zinc-400 text-[13px] leading-relaxed max-w-lg">
                  If your average deal is worth $150+, Pro pays for itself the
                  moment it captures a single lead you'd have missed.
                </p>
              </div>
              <button
                onClick={() => handleUpgrade("pro")}
                disabled={!!loadingPlan}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-[13px] px-5 py-2.5 rounded-lg transition-colors active:scale-[0.98] shrink-0 w-full sm:w-auto disabled:opacity-60"
              >
                {loadingPlan === "pro" ? "Opening…" : "Upgrade to Pro"}
              </button>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Plans */}
      <FadeIn delay={220}>
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-[15px] font-semibold text-zinc-300 shrink-0">
            {isActive ? "Change plan" : "Choose a plan"}
          </h2>
          <div className="h-px flex-1 bg-zinc-800/60" />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {PLANS.map((plan, i) => {
          const isCurrent = currentPlan === plan.key && isActive;
          const isLoading = loadingPlan === plan.key;
          return (
            <FadeIn key={plan.key} delay={260 + i * 60}>
              <div className="relative h-full">
                {plan.badge && (
                  <div className="absolute -top-2.5 left-5 z-20">
                    <span className="bg-blue-600 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div
                  className={`relative h-full bg-zinc-900/40 border rounded-xl p-5 flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${plan.popular ? "border-blue-500/30 hover:border-blue-500/50" : "border-zinc-800 hover:border-zinc-700"} ${isCurrent ? "ring-1 ring-emerald-500/30" : ""}`}
                >
                  {plan.popular && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-28 bg-blue-600/[0.12] rounded-full blur-3xl pointer-events-none" />
                    </>
                  )}

                  {isCurrent && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                        Current
                      </span>
                    </div>
                  )}

                  <div className="relative mb-4">
                    <p className="text-zinc-400 text-[11px] font-medium tracking-[0.12em] uppercase mb-3">
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1 mb-1.5">
                      <span className="text-[34px] leading-none font-semibold tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-zinc-500 text-[13px] mb-1">
                        {plan.per}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[12px] leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="h-px bg-zinc-800/80 mb-4" />

                  <ul className="space-y-2.5 flex-1 mb-5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-[13px] text-zinc-300"
                      >
                        <span className="text-emerald-400 mt-0.5 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !isCurrent && handleUpgrade(plan.key)}
                    disabled={isCurrent || !!loadingPlan || !businessId}
                    className={`relative w-full py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed ${isCurrent ? "bg-zinc-800/60 text-zinc-500 border border-zinc-700" : plan.popular ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"}`}
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
                        Opening…
                      </span>
                    ) : isCurrent ? (
                      "Current plan"
                    ) : (
                      plan.cta
                    )}
                  </button>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Comparison table */}
      <FadeIn delay={440} className="mb-10">
        <h2 className="text-[15px] font-semibold text-zinc-300 mb-4">
          Compare plans
        </h2>
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 text-[11px] font-medium text-zinc-500 uppercase tracking-wider px-4 py-3 border-b border-zinc-800/60">
            <div className="col-span-2">Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center text-zinc-400">Starter</div>
            <div className="text-center text-blue-400">Pro</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-5 text-[13px] px-4 py-3 items-center ${i < COMPARISON.length - 1 ? "border-b border-zinc-800/40" : ""}`}
            >
              <div className="col-span-2 text-zinc-400">{row.feature}</div>
              <div className="text-center text-zinc-500">
                {typeof row.free === "boolean" ? (
                  row.free ? (
                    <Check className="w-3.5 h-3.5 text-zinc-400 mx-auto" />
                  ) : (
                    <Dash />
                  )
                ) : (
                  row.free
                )}
              </div>
              <div className="text-center text-zinc-300">
                {typeof row.starter === "boolean" ? (
                  row.starter ? (
                    <Check className="w-3.5 h-3.5 text-zinc-300 mx-auto" />
                  ) : (
                    <Dash />
                  )
                ) : (
                  row.starter
                )}
              </div>
              <div className="text-center text-blue-400 font-medium">
                {typeof row.pro === "boolean" ? (
                  row.pro ? (
                    <Check className="w-3.5 h-3.5 text-blue-400 mx-auto" />
                  ) : (
                    <Dash />
                  )
                ) : (
                  row.pro
                )}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Trust footer */}
      <FadeIn delay={520}>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-4">
          {[
            "Secure payments via Paystack",
            "Cancel anytime",
            "14-day free trial",
            "Instant activation",
          ].map((text) => (
            <div key={text} className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-zinc-600" />
              <span className="text-zinc-600 text-[12px]">{text}</span>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#08090b] text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10">
        <DashboardNav />
        <Suspense
          fallback={
            <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
              <div className="w-44 h-8 bg-zinc-800 rounded-lg animate-pulse mb-3" />
              <div className="w-full h-24 bg-zinc-900 rounded-xl animate-pulse" />
            </div>
          }
        >
          <BillingContent />
        </Suspense>
      </div>
    </div>
  );
}
