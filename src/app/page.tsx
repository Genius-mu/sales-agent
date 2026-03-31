"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardNav from "@/app/components/DashboardNav";
import { getSupabase } from "@/lib/supabase";

interface Stats {
  conversations: number;
  leads: number;
  agentReady: boolean;
  businessName: string;
  websiteUrl: string;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else setValue(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function AnimatedCard({
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
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.98)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      {children}
    </div>
  );
}

const PLANS = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    desc: "For founders ready to stop losing leads",
    color: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    accent: "#52525b",
    badge: null,
    popular: false,
    features: [
      "500 conversations/mo",
      "Lead capture & dashboard",
      "1 site embed",
      "Email support",
    ],
    cta: "Upgrade to Starter",
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    desc: "For businesses that can't afford to miss a sale",
    color: "from-blue-950/70 to-zinc-950",
    border: "border-blue-500/40",
    accent: "#3b82f6",
    badge: "Most Popular",
    popular: true,
    features: [
      "Unlimited conversations",
      "Lead capture + CRM export",
      "5 site embeds",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
  },
  {
    name: "Scale",
    price: "$199",
    period: "/mo",
    desc: "For agencies running multiple client sites",
    color: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    accent: "#52525b",
    badge: null,
    popular: false,
    features: [
      "Unlimited agents",
      "Unlimited conversations",
      "White-label widget",
      "Unlimited sites",
      "Custom AI persona",
    ],
    cta: "Upgrade to Scale",
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [time, setTime] = useState("");

  const convCount = useCountUp(stats?.conversations ?? 0);
  const leadsCount = useCountUp(stats?.leads ?? 0);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function load() {
      const sb = getSupabase();
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data: bizData } = await sb
        .from("businesses")
        .select("id, name, website_url, scraped_content, description")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!bizData) {
        setLoading(false);
        return;
      }

      const biz = bizData as {
        id: string;
        name: string;
        website_url: string;
        scraped_content: string | null;
        description: string | null;
      };

      const { data: convoData } = await sb
        .from("conversations")
        .select("id, lead_email")
        .eq("business_id", biz.id);

      const conversations = (convoData ?? []) as {
        id: string;
        lead_email: string | null;
      }[];

      setStats({
        businessName: biz.name || "Your Business",
        websiteUrl: biz.website_url || "",
        agentReady: !!(biz.scraped_content || biz.description),
        conversations: conversations.length,
        leads: conversations.filter((c) => c.lead_email).length,
      });
      setLoading(false);
    }
    load();
  }, []);

  const conversionRate =
    stats?.conversations && stats.conversations > 0
      ? Math.round((stats.leads / stats.conversations) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#060608] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 w-[700px] h-[500px] bg-blue-600/6 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-600/4 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/3 rounded-full blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, #060608 100%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div
            className="flex items-start justify-between mb-8 sm:mb-10"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(-16px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-semibold">
                  Revenue Dashboard
                </p>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none mb-1">
                {loading ? (
                  <span className="inline-block w-48 h-10 sm:h-12 bg-zinc-800/80 rounded-xl animate-pulse" />
                ) : (
                  stats?.businessName
                )}
              </h1>
              {!loading && stats?.websiteUrl && (
                <a
                  href={stats.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors mt-1 inline-block truncate max-w-xs"
                >
                  {stats.websiteUrl}
                </a>
              )}
            </div>
            <div className="text-right hidden sm:block shrink-0 ml-6">
              <p className="text-zinc-700 text-xs mb-1 tracking-widest uppercase font-medium">
                Live
              </p>
              <p className="text-zinc-300 text-xl font-mono tabular-nums font-bold">
                {time}
              </p>
            </div>
          </div>

          {/* Agent not configured warning */}
          {!loading && !stats?.agentReady && (
            <AnimatedCard delay={100} className="mb-6 sm:mb-8">
              <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-red-500/5 border border-red-500/15 rounded-2xl px-5 sm:px-6 py-5">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />
                <div className="relative flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-lg shrink-0">
                    ⚠
                  </div>
                  <div>
                    <p className="text-red-300 font-bold text-sm">
                      Your agent is offline — you're losing leads right now
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Add a description or website URL to activate your agent
                      and start capturing leads.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/setup"
                  className="relative text-xs bg-red-500 hover:bg-red-400 text-white font-black px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/20 shrink-0 w-full sm:w-auto text-center"
                >
                  Activate now →
                </Link>
              </div>
            </AnimatedCard>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              {
                label: "Total Conversations",
                value: loading ? null : convCount,
                icon: "💬",
                sub: "All time",
                badge:
                  stats?.conversations && stats.conversations > 0
                    ? `+${stats.conversations} total`
                    : "Waiting for traffic",
                badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                delay: 100,
              },
              {
                label: "Leads Captured",
                value: loading ? null : leadsCount,
                icon: "🎯",
                sub: "Emails collected",
                badge:
                  stats?.leads && stats.leads > 0
                    ? `${conversionRate}% conversion`
                    : "No leads yet",
                badgeColor:
                  stats?.leads && stats.leads > 0
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-zinc-500 bg-zinc-800 border-zinc-700",
                delay: 200,
              },
              {
                label: "Agent Status",
                value: loading
                  ? null
                  : stats?.agentReady
                    ? "Active"
                    : "Offline",
                icon: "🤖",
                sub: stats?.agentReady
                  ? "Responding to visitors"
                  : "Configuration needed",
                badge: stats?.agentReady ? "Online" : "Setup required",
                badgeColor: stats?.agentReady
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-amber-400 bg-amber-500/10 border-amber-500/20",
                delay: 300,
                pulse: stats?.agentReady,
              },
            ].map((card) => (
              <AnimatedCard
                key={card.label}
                delay={card.delay}
                className="group"
              >
                <div className="relative bg-zinc-900/50 border border-zinc-800/70 hover:border-zinc-700 rounded-2xl p-5 sm:p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background:
                        "radial-gradient(350px circle at 50% -20%, rgba(59,130,246,0.05), transparent 60%)",
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${card.badgeColor}`}
                      >
                        {card.pulse && (
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        )}
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-3xl sm:text-4xl font-black mb-1.5 tabular-nums tracking-tight">
                      {card.value === null ? (
                        <span className="inline-block w-20 h-9 bg-zinc-800 rounded-lg animate-pulse" />
                      ) : (
                        card.value
                      )}
                    </p>
                    <p className="text-zinc-200 text-sm font-bold">
                      {card.label}
                    </p>
                    <p className="text-zinc-600 text-xs mt-0.5">{card.sub}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-12 sm:mb-16">
            {[
              {
                href: "/dashboard/setup",
                icon: "⚙️",
                label: "CONFIGURE",
                title: "Train Your Agent",
                desc: "Tell Saim about your business. The more it knows, the better it sells.",
                cta: "Open Setup",
                delay: 400,
                urgent: !stats?.agentReady && !loading,
              },
              {
                href: "/dashboard/embed",
                icon: "🚀",
                label: "DEPLOY",
                title: "Go Live on Your Site",
                desc: "One script tag. Paste it anywhere. Your agent starts capturing leads instantly.",
                cta: "Get Embed Code",
                delay: 500,
                urgent: false,
              },
            ].map((item) => (
              <AnimatedCard key={item.href} delay={item.delay}>
                <Link
                  href={item.href}
                  className={`group relative block rounded-2xl p-5 sm:p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl h-full ${item.urgent ? "bg-blue-950/40 border border-blue-500/30 hover:border-blue-400/50 hover:shadow-blue-500/10" : "bg-zinc-900/50 border border-zinc-800/70 hover:border-zinc-700 hover:shadow-black/50"}`}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background: `radial-gradient(350px circle at 0% 100%, rgba(59,130,246,0.05), transparent 60%)`,
                    }}
                  />
                  {item.urgent && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                  )}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs tracking-[0.2em] font-black uppercase ${item.urgent ? "text-blue-400" : "text-zinc-600"}`}
                      >
                        {item.label}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-5">
                      {item.desc}
                    </p>
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all duration-300 ${item.urgent ? "text-blue-400" : "text-zinc-400 group-hover:text-white"}`}
                    >
                      {item.cta}
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14m-7-7 7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>

          {/* Revenue insight banner */}
          {!loading &&
            stats?.conversations !== undefined &&
            stats.conversations > 0 && (
              <AnimatedCard delay={600} className="mb-12 sm:mb-16">
                <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/40 to-zinc-950 border border-emerald-500/15 rounded-2xl px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl shrink-0">
                      📈
                    </div>
                    <div>
                      <p className="text-emerald-300 font-black text-sm">
                        Your agent is working
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {stats.conversations} conversations handled ·{" "}
                        {stats.leads} leads captured · {conversionRate}%
                        conversion rate
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/conversations"
                    className="relative text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 w-full sm:w-auto text-center"
                  >
                    View all conversations →
                  </Link>
                </div>
              </AnimatedCard>
            )}

          {/* Pricing */}
          <AnimatedCard delay={700}>
            <div className="mb-8 sm:mb-10 text-center">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800/60" />
                <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-zinc-400 text-xs tracking-[0.2em] uppercase font-semibold">
                    Upgrade
                  </span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800/60" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 leading-tight">
                Less than one lost deal.
                <br />
                <span className="text-zinc-500">Every month.</span>
              </h2>
              <p className="text-zinc-500 text-sm">
                If Saim captures one extra lead per month, it pays for itself
                10x over.
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {PLANS.map((plan, i) => (
              <AnimatedCard
                key={plan.name}
                delay={800 + i * 100}
                className="relative"
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-xl shadow-blue-600/40 tracking-wide uppercase">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div
                  className={`relative bg-gradient-to-b ${plan.color} border ${plan.border} rounded-2xl p-5 sm:p-6 h-full flex flex-col overflow-hidden group transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${plan.popular ? "hover:shadow-blue-500/10 hover:border-blue-400/50" : "hover:shadow-black/60 hover:border-zinc-700"}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                  )}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(280px circle at 50% 0%, ${plan.accent}15, transparent 70%)`,
                    }}
                  />
                  <div className="relative mb-5">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-zinc-500 text-xs font-black tracking-[0.2em] uppercase">
                        {plan.name}
                      </p>
                      {plan.popular && (
                        <span className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">
                          Best value
                        </span>
                      )}
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-zinc-500 text-sm mb-1.5">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>
                  <div className="h-px bg-zinc-800/80 mb-4 sm:mb-5" />
                  <ul className="space-y-2.5 flex-1 mb-5 sm:mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-xs text-zinc-300"
                      >
                        <span className="mt-0.5 shrink-0 text-emerald-400 font-black">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard/billing"
                    className={`w-full py-3 rounded-xl text-sm font-black transition-all duration-200 active:scale-95 text-center block ${plan.popular ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30" : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600"}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedCard delay={1100}>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pb-8">
              {[
                "14-day free trial",
                "No credit card required",
                "Cancel anytime",
              ].map((text, i) => (
                <div key={text} className="flex items-center gap-4">
                  {i > 0 && (
                    <div className="w-1 h-1 bg-zinc-800 rounded-full hidden sm:block" />
                  )}
                  <span className="text-zinc-700 text-xs">{text}</span>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
