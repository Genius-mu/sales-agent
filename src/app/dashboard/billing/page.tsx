"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardNav from "@/app/components/DashboardNav";
import Reveal from "@/app/components/Reveal";
import { getSupabase } from "@/lib/supabase";
import { PLANS, PlanConfig, formatPlanPrice } from "@/lib/plans";
import { useBillingCurrency } from "@/lib/currency";
import CurrencyToggle from "@/app/components/CurrencyToggle";

const PAIN_POINTS = [
  {
    title: "Leads visit at 2am",
    desc: "Free plan caps at 20 conversations. After that, your agent goes silent — and visitors leave without a word.",
  },
  {
    title: "You're capped at 20 chats",
    desc: "That's just a few traffic days. If your site gets real visitors, you'll hit the limit before the month ends.",
  },
  {
    title: "No analytics on free",
    desc: "You can't see what visitors are asking, which questions convert, or where leads drop off.",
  },
];

const COMPARISON = [
  {
    feature: "Conversations/month",
    free: "20",
    starter: "300",
    pro: "1,200",
    scale: "3,000",
  },
  { feature: "Lead capture", free: true, starter: true, pro: true, scale: true },
  { feature: "CRM export", free: false, starter: false, pro: true, scale: true },
  { feature: "Analytics dashboard", free: false, starter: false, pro: true, scale: true },
  { feature: "Site embeds", free: "1", starter: "1", pro: "5", scale: "Unlimited" },
  { feature: "Custom agent name", free: false, starter: false, pro: true, scale: true },
  { feature: "Priority support", free: false, starter: false, pro: true, scale: true },
];

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
    className="text-slate-300 mx-auto"
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
  const router = useRouter();
  const referenceParam = searchParams.get("reference") || searchParams.get("trxref");

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [currentPlanKey, setCurrentPlanKey] = useState("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [monthlyUsage, setMonthlyUsage] = useState<number>(0);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Verification state
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Cancellation state
  const [cancelling, setCancelling] = useState(false);

  const { currency, setCurrency, canChoose: canChooseCurrency } =
    useBillingCurrency();

  const fetchBusinessData = async () => {
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
      setCurrentPlanKey(d.plan || "free");
      setSubscriptionStatus(d.subscription_status || "inactive");

      // Count monthly conversations usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await sb
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("business_id", d.id)
        .gte("created_at", startOfMonth.toISOString());

      setMonthlyUsage(count ?? 0);
    }
    setPageLoading(false);
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

  // Handle server-side transaction verification when returning from Paystack redirect
  useEffect(() => {
    if (!referenceParam) return;

    async function verifyTransaction() {
      setVerifying(true);
      setVerificationError(null);
      setVerificationSuccess(null);

      try {
        const res = await fetch("/api/billing/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: referenceParam }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setVerificationSuccess("Payment verified successfully! Your plan is now active.");
          await fetchBusinessData();
        } else {
          setVerificationError(
            data.error || "Payment verification pending or unsuccessful. If charged, your plan will activate shortly.",
          );
        }
      } catch (err) {
        setVerificationError("Network error while verifying payment reference.");
      } finally {
        setVerifying(false);
        // Clean up URL reference param without full page refresh
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("reference");
        newUrl.searchParams.delete("trxref");
        router.replace(newUrl.pathname);
      }
    }

    verifyTransaction();
  }, [referenceParam]);

  const handleUpgrade = async (planKey: string) => {
    if (!businessId) return;
    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, businessId, currency }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Couldn't start checkout. Please try again.");
        setLoadingPlan(null);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!businessId) return;
    if (!confirm("Are you sure you want to cancel your subscription? Your plan will return to Free.")) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("Subscription cancelled successfully.");
        await fetchBusinessData();
      } else {
        alert(data.error || "Failed to cancel subscription.");
      }
    } catch {
      alert("An error occurred while cancelling your subscription.");
    } finally {
      setCancelling(false);
    }
  };

  const currentPlan = PLANS[currentPlanKey] || PLANS.free;
  const isActive = subscriptionStatus === "active";
  const isPastDue = subscriptionStatus === "past_due";
  const isCancelled = subscriptionStatus === "cancelled";
  const isFree = currentPlanKey === "free" || !isActive;

  const planList: PlanConfig[] = [PLANS.starter, PLANS.pro, PLANS.scale];

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <Reveal distance={20} className="mb-8">
        <h1 className="text-[22px] sm:text-2xl font-semibold tracking-tight text-slate-900 mb-1">
          {isFree ? "Your agent is running on limits" : "Billing"}
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
          {isFree
            ? `You're on the Free tier — ${PLANS.free.monthlyLimit} conversations a month. Enough to see it work. Upgrade to let it run without limits.`
            : "Manage your subscription and unlock more capacity as your business grows."}
        </p>
      </Reveal>

      {/* Verification Loading Banner */}
      {verifying && (
        <Reveal distance={16} className="mb-6">
          <div className="flex items-center gap-3 bg-blue-500/[0.07] border border-blue-500/20 rounded-xl px-4 py-3.5 text-blue-700">
            <svg
              className="animate-spin h-5 w-5 text-blue-600 shrink-0"
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
            <div>
              <p className="font-medium text-sm">Verifying payment with Paystack...</p>
              <p className="text-slate-500 text-[13px] mt-0.5">Please wait a moment while we confirm your transaction.</p>
            </div>
          </div>
        </Reveal>
      )}

      {/* Verification Success banner */}
      {verificationSuccess && (
        <Reveal distance={16} className="mb-6">
          <div className="flex items-center gap-3 bg-emerald-500/[0.07] border border-emerald-500/20 rounded-xl px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0">
              <Check />
            </div>
            <div>
              <p className="text-emerald-700 font-medium text-sm">
                You're all set — welcome aboard
              </p>
              <p className="text-slate-500 text-[13px] mt-0.5">
                {verificationSuccess}
              </p>
            </div>
          </div>
        </Reveal>
      )}

      {/* Verification Error banner */}
      {verificationError && (
        <Reveal distance={16} className="mb-6">
          <div className="flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-600 shrink-0">
              !
            </div>
            <div>
              <p className="text-red-700 font-medium text-sm">
                Payment Verification Notice
              </p>
              <p className="text-slate-500 text-[13px] mt-0.5">
                {verificationError}
              </p>
            </div>
          </div>
        </Reveal>
      )}

      {/* Current plan */}
      <Reveal delay={60} className="mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-500 text-[11px] mb-2 tracking-[0.12em] uppercase font-medium">
                Current plan
              </p>
              {pageLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-24 h-7 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="w-14 h-5 bg-slate-100 rounded-full animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="text-xl font-semibold capitalize tracking-tight">
                    {currentPlan.name}
                  </p>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border flex items-center gap-1.5 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : isPastDue
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : isCancelled
                            ? "bg-slate-100 text-slate-500 border-slate-300"
                            : "bg-slate-100 text-slate-500 border-slate-300"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    )}
                    {isActive
                      ? "Active"
                      : isPastDue
                        ? "Payment past due"
                        : isCancelled
                          ? "Cancelled"
                          : "Free tier"}
                  </span>
                </div>
              )}
              {!pageLoading && (
                <p className="text-slate-500 text-[13px] mt-2">
                  Usage: <span className="text-slate-900 font-medium">{monthlyUsage}</span> /{" "}
                  {currentPlan.monthlyLimit} conversations this month
                </p>
              )}
            </div>
            {isActive && !isFree && (
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="text-[13px] text-slate-500 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-500/20 px-3.5 py-1.5 rounded-lg shrink-0 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel Subscription"}
              </button>
            )}
          </div>
        </div>
      </Reveal>

      {/* Pain points — free users only */}
      {isFree && !pageLoading && (
        <div className="mb-8">
          <Reveal className="mb-4">
            <h2 className="text-[15px] font-semibold text-slate-900 mb-1">
              What you're leaving on the table
            </h2>
            <p className="text-slate-500 text-[13px]">
              Every day on Free, here's what slips by.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAIN_POINTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} direction="up">
                <div className="bg-white border border-slate-200 rounded-xl p-4 h-full">
                  <h3 className="text-slate-900 text-[13px] font-medium mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-slate-500 text-[12px] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* ROI callout */}
      {isFree && !pageLoading && (
        <Reveal delay={60} distance={24} className="mb-8">
          <div className="relative overflow-hidden bg-white border border-blue-500/20 rounded-xl px-5 sm:px-6 py-5">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            <div className="absolute -top-16 left-1/4 w-48 h-32 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-slate-900 font-semibold text-[15px] mb-1">
                  One extra lead pays for months of service
                </p>
                <p className="text-slate-500 text-[13px] leading-relaxed max-w-lg">
                  If your average deal is worth{" "}
                  {currency === "USD" ? "$50" : "₦68,000"}+, Pro pays for itself
                  the moment it captures a single lead you&apos;d have missed.
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
        </Reveal>
      )}

      {/* Plans */}
      <Reveal>
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-[15px] font-semibold text-slate-700 shrink-0">
            {isActive ? "Change plan" : "Choose a plan"}
          </h2>
          <div className="h-px flex-1 bg-slate-100" />
          {canChooseCurrency && (
            <CurrencyToggle value={currency} onChange={setCurrency} theme="light" />
          )}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {planList.map((plan, i) => {
          const isCurrent = currentPlanKey === plan.key && isActive;
          const isLoading = loadingPlan === plan.key;
          return (
            <Reveal key={plan.key} delay={i * 90} direction="up">
              <div className="relative h-full">
                {plan.badge && (
                  <div className="absolute -top-3 left-6 z-20">
                    <span className="bg-blue-600 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-[0_0_16px_rgba(37,99,235,0.6)] tracking-wide">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div
                  className={`relative h-full bg-white backdrop-blur-xl border rounded-[28px] p-6 sm:p-7 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_8px_24px_-14px_rgba(15,23,42,0.18)] ${
                    plan.popular
                      ? "border-blue-500/40 shadow-[0_0_50px_rgba(37,99,235,0.18)]"
                      : "border-slate-200"
                  } ${isCurrent ? "ring-2 ring-emerald-500/40" : ""}`}
                >
                  {plan.popular && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-blue-600/[0.15] rounded-full blur-3xl pointer-events-none" />
                    </>
                  )}

                  {isCurrent && (
                    <div className="absolute top-6 right-6">
                      <span className="text-[11px] bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Current
                      </span>
                    </div>
                  )}

                  <div className="relative mb-5">
                    <p className="text-slate-500 text-[11px] font-semibold tracking-[0.14em] uppercase mb-3">
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-[38px] leading-none font-semibold tracking-tight text-slate-900">
                        {formatPlanPrice(plan, currency)}
                      </span>
                      <span className="text-slate-500 text-sm mb-1 font-normal">
                        /mo
                      </span>
                    </div>
                    <p className="text-slate-500 text-[13px] leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="h-px bg-slate-100 mb-5" />

                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-[13px] text-slate-700"
                      >
                        <span className="text-emerald-600 mt-0.5 shrink-0">
                          <Check className="w-4 h-4" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !isCurrent && handleUpgrade(plan.key)}
                    disabled={isCurrent || !!loadingPlan || !businessId}
                    className={`relative w-full py-3.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed shadow-md border ${
                      isCurrent
                        ? "bg-slate-100 text-slate-500 border-slate-200"
                        : plan.popular
                          ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500/40 shadow-[0_0_24px_rgba(37,99,235,0.4)]"
                          : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200"
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
            </Reveal>
          );
        })}
      </div>

      {/* Comparison table */}
      <Reveal className="mb-10">
        <h2 className="text-[15px] font-semibold text-slate-700 mb-4">
          Compare plans
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-6 text-[11px] font-medium text-slate-500 uppercase tracking-wider px-4 py-3 border-b border-slate-200">
            <div className="col-span-2">Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center text-slate-500">Starter</div>
            <div className="text-center text-blue-600">Pro</div>
            <div className="text-center text-purple-600">Scale</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-6 text-[13px] px-4 py-3 items-center ${
                i < COMPARISON.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div className="col-span-2 text-slate-500">{row.feature}</div>
              <div className="text-center text-slate-500">
                {typeof row.free === "boolean" ? (
                  row.free ? (
                    <Check className="w-3.5 h-3.5 text-slate-500 mx-auto" />
                  ) : (
                    <Dash />
                  )
                ) : (
                  row.free
                )}
              </div>
              <div className="text-center text-slate-700">
                {typeof row.starter === "boolean" ? (
                  row.starter ? (
                    <Check className="w-3.5 h-3.5 text-slate-700 mx-auto" />
                  ) : (
                    <Dash />
                  )
                ) : (
                  row.starter
                )}
              </div>
              <div className="text-center text-blue-600 font-medium">
                {typeof row.pro === "boolean" ? (
                  row.pro ? (
                    <Check className="w-3.5 h-3.5 text-blue-600 mx-auto" />
                  ) : (
                    <Dash />
                  )
                ) : (
                  row.pro
                )}
              </div>
              <div className="text-center text-purple-600 font-medium">
                {typeof row.scale === "boolean" ? (
                  row.scale ? (
                    <Check className="w-3.5 h-3.5 text-purple-600 mx-auto" />
                  ) : (
                    <Dash />
                  )
                ) : (
                  row.scale
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Trust footer */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-4">
          {[
            "Secure payments via Paystack",
            "Cancel anytime",
            "Instant activation",
            "Automatic renewal",
          ].map((text) => (
            <div key={text} className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400 text-[12px]">{text}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10">
        <DashboardNav />
        <Suspense
          fallback={
            <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
              <div className="w-44 h-8 bg-slate-100 rounded-lg animate-pulse mb-3" />
              <div className="w-full h-24 bg-white rounded-xl animate-pulse" />
            </div>
          }
        >
          <BillingContent />
        </Suspense>
      </div>
    </div>
  );
}
