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
    border: "border-zinc-800",
    gradient: "from-zinc-900 to-zinc-950",
    accent: "#52525b",
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
    icon: "🌱",
  },
  {
    key: "pro",
    name: "Pro",
    price: "$99",
    per: "/mo",
    desc: "For businesses that can't afford to miss a sale",
    border: "border-blue-500/40",
    gradient: "from-blue-950/60 to-zinc-950",
    accent: "#3b82f6",
    popular: true,
    badge: "Most Popular",
    features: [
      "Unlimited conversations",
      "Lead capture + CRM export",
      "Advanced analytics dashboard",
      "Up to 5 site embeds",
      "Custom agent persona",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    icon: "⚡",
  },
  {
    key: "scale",
    name: "Scale",
    price: "$199",
    per: "/mo",
    desc: "For agencies running multiple client sites",
    border: "border-zinc-800",
    gradient: "from-zinc-900 to-zinc-950",
    accent: "#52525b",
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
    icon: "🚀",
  },
];

const PAIN_POINTS = [
  {
    icon: "😴",
    title: "Leads visit at 2am",
    desc: "Free plan caps at 50 conversations. After that, your agent goes silent — and visitors leave without a word.",
  },
  {
    icon: "📉",
    title: "You're capped at 50 chats",
    desc: "That's one decent traffic day. If your site gets real visitors, you'll hit the limit before the month ends.",
  },
  {
    icon: "🔇",
    title: "No analytics on free",
    desc: "You can't see what visitors are asking, which questions convert, or where leads are dropping off.",
  },
];

const COMPARISON = [
  { feature: "Conversations/month", free: "50", starter: "500", pro: "Unlimited", scale: "Unlimited" },
  { feature: "Lead capture", free: "✓", starter: "✓", pro: "✓", scale: "✓" },
  { feature: "CRM export", free: "✗", starter: "✗", pro: "✓", scale: "✓" },
  { feature: "Analytics dashboard", free: "✗", starter: "✗", pro: "✓", scale: "✓" },
  { feature: "Site embeds", free: "1", starter: "1", pro: "5", scale: "Unlimited" },
  { feature: "Custom agent name", free: "✗", starter: "✗", pro: "✓", scale: "✓" },
  { feature: "White-label widget", free: "✗", starter: "✗", pro: "✗", scale: "✓" },
  { feature: "Priority support", free: "✗", starter: "✗", pro: "✓", scale: "✓" },
];

function AnimatedSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)", transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)` }}>
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

  useEffect(() => { const t = setTimeout(() => setHeaderVisible(true), 50); return () => clearTimeout(t); }, []);

  useEffect(() => {
    async function loadPlan() {
      const sb = getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session?.user) { setPageLoading(false); return; }

      const { data } = await sb
        .from("businesses")
        .select("id, plan, subscription_status")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data) {
        const d = data as { id: string; plan: string; subscription_status: string };
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
      const LS = (window as { LemonSqueezy?: { Url: { Open: (u: string) => void } } }).LemonSqueezy;
      if (LS) { clearInterval(interval); LS.Url.Open(checkoutUrl); setCheckoutUrl(null); setLoadingPlan(null); }
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
      if (data.url) setCheckoutUrl(data.url);
      else { alert("Failed to open checkout. Please try again."); setLoadingPlan(null); }
    } catch { alert("Something went wrong."); setLoadingPlan(null); }
  };

  const isActive = subscriptionStatus === "active" || subscriptionStatus === "on_trial";
  const isFree = currentPlan === "free" || !isActive;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* Header */}
      <div className="mb-8 sm:mb-12" style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? "translateY(0)" : "translateY(-12px)", transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-semibold">Billing</p>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-3">
          {isFree ? "Your agent is limited." : "Your Plan"}
        </h1>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
          {isFree
            ? "You're on the free tier — 50 conversations a month. That's enough to see it work. Upgrade to let it run without limits."
            : "Manage your subscription and unlock more features as your business grows."}
        </p>
      </div>

      {/* Success banner */}
      {success && (
        <AnimatedSection delay={0} className="mb-6 sm:mb-8">
          <div className="relative flex items-center gap-4 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl px-5 py-4 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg shrink-0">✓</div>
            <div>
              <p className="text-emerald-300 font-black text-sm">Payment successful — welcome to the upgrade!</p>
              <p className="text-zinc-500 text-xs mt-0.5">Your plan is now active. Limits have been lifted.</p>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Current plan */}
      <AnimatedSection delay={100} className="mb-8 sm:mb-10">
        <div className="relative bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-zinc-600 text-xs mb-2 tracking-widest uppercase font-semibold">Current plan</p>
              {pageLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-28 h-8 bg-zinc-800 rounded-xl animate-pulse" />
                  <div className="w-16 h-6 bg-zinc-800 rounded-full animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <p className="text-2xl sm:text-3xl font-black capitalize tracking-tight">{currentPlan}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border flex items-center gap-1.5 ${isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"}`}>
                    {isActive && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                    {isActive ? subscriptionStatus === "on_trial" ? "Free trial" : "Active" : "Free tier"}
                  </span>
                </div>
              )}
              {isFree && !pageLoading && (
                <p className="text-zinc-600 text-xs mt-2">50 conversations/month · Upgrade anytime</p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {isActive && (
                <button className="text-xs text-zinc-500 hover:text-red-400 transition-colors border border-zinc-800 hover:border-red-500/20 px-3 py-2 rounded-xl">Cancel</button>
              )}
              {!pageLoading && (
                <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-2xl">
                  {currentPlan === "pro" ? "⚡" : currentPlan === "scale" ? "🚀" : "🌱"}
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Pain points — only show for free users */}
      {isFree && !pageLoading && (
        <AnimatedSection delay={200} className="mb-8 sm:mb-10">
          <div className="mb-5">
            <h2 className="text-lg font-black text-white mb-1">What the free plan can't do</h2>
            <p className="text-zinc-500 text-sm">Here's what you're missing every day you stay on free.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-5 hover:border-red-500/15 transition-colors group">
                <div className="text-2xl mb-3">{p.icon}</div>
                <h3 className="text-white text-sm font-black mb-1.5">{p.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* ROI callout */}
      {isFree && !pageLoading && (
        <AnimatedSection delay={300} className="mb-8 sm:mb-10">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/50 to-zinc-950 border border-blue-500/15 rounded-2xl px-5 sm:px-8 py-6 sm:py-7">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-blue-300 font-black text-base mb-1">One extra lead pays for 3 months.</p>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                  If your average deal is worth $150+, Saim Pro pays for itself the moment it captures a single lead you would have otherwise missed. That's not a cost — it's a multiplier.
                </p>
              </div>
              <button
                onClick={() => handleUpgrade("pro")}
                disabled={!!loadingPlan}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/30 shrink-0 w-full sm:w-auto text-center"
              >
                {loadingPlan === "pro" ? "Opening..." : "Upgrade to Pro →"}
              </button>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Plans */}
      <AnimatedSection delay={350}>
        <div className="flex items-center gap-4 mb-5 sm:mb-6">
          <h2 className="text-base font-black text-zinc-300 shrink-0">{isActive ? "Change your plan" : "Choose your plan"}</h2>
          <div className="h-px flex-1 bg-zinc-800/60" />
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 sm:mb-10">
        {PLANS.map((plan, i) => {
          const isCurrent = currentPlan === plan.key && isActive;
          const isLoading = loadingPlan === plan.key;
          return (
            <AnimatedSection key={plan.key} delay={400 + i * 80}>
              <div className="relative h-full">
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-xl shadow-blue-600/40 tracking-wide uppercase">{plan.badge}</span>
                  </div>
                )}
                <div className={`relative h-full bg-gradient-to-b ${plan.gradient} border ${plan.border} ${isCurrent ? "ring-2 ring-emerald-500/25" : ""} rounded-2xl p-5 sm:p-6 flex flex-col overflow-hidden group transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${plan.popular ? "hover:border-blue-400/50 hover:shadow-blue-500/10" : "hover:border-zinc-700 hover:shadow-black/60"}`}>
                  {plan.popular && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(280px circle at 50% 0%, ${plan.accent}12, transparent 70%)` }} />

                  {isCurrent && (
                    <div className="absolute top-4 right-4">
                      <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />Current
                      </span>
                    </div>
                  )}

                  <div className="relative mb-4 sm:mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-zinc-500 text-xs font-black tracking-[0.2em] uppercase">{plan.name}</p>
                      {plan.popular && <span className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">Best value</span>}
                    </div>
                    <div className="flex items-end gap-1.5 mb-1">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight">{plan.price}</span>
                      <span className="text-zinc-500 text-sm mb-1.5">{plan.per}</span>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="h-px bg-zinc-800/80 mb-4 sm:mb-5" />

                  <ul className="space-y-2.5 flex-1 mb-5 sm:mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <span className="text-emerald-400 mt-0.5 shrink-0 font-black">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !isCurrent && handleUpgrade(plan.key)}
                    disabled={isCurrent || !!loadingPlan || !businessId}
                    className={`relative w-full py-3 rounded-xl text-sm font-black transition-all duration-200 active:scale-95 disabled:cursor-not-allowed ${isCurrent ? "bg-zinc-800/80 text-zinc-500 border border-zinc-700" : plan.popular ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600"}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                        Opening...
                      </span>
                    ) : isCurrent ? "Current plan" : plan.cta + " →"}
                  </button>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Comparison table */}
      <AnimatedSection delay={700} className="mb-8 sm:mb-10">
        <h2 className="text-base font-black text-zinc-300 mb-4">Full plan comparison</h2>
        <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 text-xs font-black text-zinc-500 uppercase tracking-wider px-4 py-3 border-b border-zinc-800/60 bg-zinc-900/80">
            <div className="col-span-2">Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center text-zinc-300">Starter</div>
            <div className="text-center text-blue-400">Pro</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-5 text-xs px-4 py-3 items-center ${i < COMPARISON.length - 1 ? "border-b border-zinc-800/40" : ""} ${i % 2 === 0 ? "bg-zinc-900/20" : ""}`}>
              <div className="col-span-2 text-zinc-400 font-medium">{row.feature}</div>
              <div className={`text-center font-semibold ${row.free === "✗" ? "text-zinc-700" : "text-zinc-400"}`}>{row.free}</div>
              <div className={`text-center font-semibold ${row.starter === "✗" ? "text-zinc-700" : "text-zinc-300"}`}>{row.starter}</div>
              <div className={`text-center font-bold ${row.pro === "✗" ? "text-zinc-700" : "text-blue-400"}`}>{row.pro}</div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Trust footer */}
      <AnimatedSection delay={850}>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pb-4">
          {[
            { icon: "↩️", text: "Cancel anytime, no questions" },
            { icon: "🎁", text: "14-day free trial on all plans" },
            { icon: "⚡", text: "Instant activation" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span className="text-sm">{item.icon}</span>
              <span className="text-zinc-600 text-xs">{item.text}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>

    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, #060608 100%)" }} />
      </div>
      <div className="relative z-10">
        <DashboardNav />
        <Suspense fallback={
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
            <div className="w-48 h-12 bg-zinc-800 rounded-xl animate-pulse mb-4" />
            <div className="w-full h-32 bg-zinc-900 rounded-2xl animate-pulse" />
          </div>
        }>
          <BillingContent />
        </Suspense>
      </div>
    </div>
  );
}