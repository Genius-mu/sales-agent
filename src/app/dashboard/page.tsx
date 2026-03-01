"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardNav from "@/app/components/DashboardNav";
import { getSupabase } from "@/lib/supabase";

const BUSINESS_ID = "3f6505b0-ac65-487e-8dee-f3b2cd9d73fa";

interface Stats {
  conversations: number;
  leads: number;
  agentReady: boolean;
  businessName: string;
  websiteUrl: string;
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 50;
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
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(24px) scale(0.98)",
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
    desc: "For solo founders testing the waters",
    color: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    accent: "#52525b",
    badge: null,
    features: [
      "1 AI sales agent",
      "500 conversations/mo",
      "Lead capture",
      "Embed on 1 site",
      "Email support",
    ],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    desc: "For businesses serious about growth",
    color: "from-blue-950/80 to-zinc-950",
    border: "border-blue-500/40",
    accent: "#3b82f6",
    badge: "Most Popular",
    features: [
      "3 AI sales agents",
      "Unlimited conversations",
      "Lead capture + CRM export",
      "Embed on 5 sites",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Scale",
    price: "$199",
    period: "/mo",
    desc: "For agencies running at full speed",
    color: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    accent: "#52525b",
    badge: null,
    features: [
      "Unlimited agents",
      "Unlimited conversations",
      "White-label widget",
      "Unlimited sites",
      "Custom AI persona",
      "Dedicated support",
    ],
    cta: "Contact us",
    popular: false,
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
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function load() {
      const sb = getSupabase();
      const [{ data: bizData }, { data: convoData }] = await Promise.all([
        sb
          .from("businesses")
          .select("name, website_url, scraped_content")
          .eq("id", BUSINESS_ID)
          .single(),
        sb
          .from("conversations")
          .select("id, lead_email")
          .eq("business_id", BUSINESS_ID),
      ]);
      const business = bizData as {
        name: string;
        website_url: string;
        scraped_content: string | null;
      } | null;
      const conversations = (convoData ?? []) as {
        id: string;
        lead_email: string | null;
      }[];
      setStats({
        businessName: business?.name || "Unnamed Business",
        websiteUrl: business?.website_url || "",
        agentReady: !!business?.scraped_content,
        conversations: conversations.length,
        leads: conversations.filter((c) => c.lead_email).length,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#080809] text-white overflow-x-hidden">
      {/* Rich layered background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Primary orbs */}
        <div className="absolute -top-32 left-1/3 w-[600px] h-[600px] bg-blue-600/6 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/4 rounded-full blur-[100px]" />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Vignette */}
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

        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Header row */}
          <div
            className="flex items-start justify-between mb-12"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(-16px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-medium">
                  Dashboard
                </p>
              </div>
              <h1 className="text-5xl font-bold tracking-tight leading-none">
                {loading ? (
                  <span className="inline-block w-56 h-12 bg-zinc-800/80 rounded-xl animate-pulse" />
                ) : (
                  <span>{stats?.businessName}</span>
                )}
              </h1>
            </div>
            {/* Live clock */}
            <div className="text-right mt-1">
              <p className="text-zinc-600 text-xs mb-1 tracking-widest uppercase">
                Local time
              </p>
              <p className="text-zinc-300 text-lg font-mono tabular-nums">
                {time}
              </p>
            </div>
          </div>

          {/* Warning banner */}
          {!loading && !stats?.agentReady && (
            <AnimatedCard delay={150} className="mb-8">
              <div className="relative overflow-hidden flex items-center justify-between bg-amber-500/5 border border-amber-500/20 rounded-2xl px-6 py-4">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent" />
                <div className="relative flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400 text-base shrink-0">
                    ⚠
                  </div>
                  <div>
                    <p className="text-amber-200 font-semibold text-sm">
                      Agent not configured
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Add your website URL so the agent knows what to say
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/setup"
                  className="relative text-xs bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 shrink-0"
                >
                  Configure now →
                </Link>
              </div>
            </AnimatedCard>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Conversations",
                value: loading ? null : convCount,
                icon: "💬",
                sub: "All time total",
                trend: "+12%",
                delay: 100,
              },
              {
                label: "Leads Captured",
                value: loading ? null : leadsCount,
                icon: "🎯",
                sub: "Emails collected",
                trend: "+8%",
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
                sub: stats?.agentReady ? "Trained on your site" : "Needs setup",
                highlight: stats?.agentReady,
                delay: 300,
              },
            ].map((card) => (
              <AnimatedCard
                key={card.label}
                delay={card.delay}
                className="group"
              >
                <div className="relative bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-6 h-full overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 backdrop-blur-sm">
                  {/* Subtle inner glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background:
                        "radial-gradient(400px circle at 50% -20%, rgba(59,130,246,0.04), transparent 60%)",
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      {card.highlight !== undefined ? (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 border ${card.highlight ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"}`}
                        >
                          {card.highlight && (
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          )}
                          {card.highlight ? "Online" : "Offline"}
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                          {card.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-4xl font-bold mb-2 tabular-nums tracking-tight">
                      {card.value === null ? (
                        <span className="inline-block w-16 h-9 bg-zinc-800 rounded-lg animate-pulse" />
                      ) : (
                        card.value
                      )}
                    </p>
                    <p className="text-zinc-300 text-sm font-medium">
                      {card.label}
                    </p>
                    <p className="text-zinc-600 text-xs mt-1">{card.sub}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-4 mb-16">
            {[
              {
                href: "/dashboard/setup",
                icon: "⚙️",
                label: "CONFIGURE",
                title: "Set Up Agent",
                desc: "Connect your website and teach the agent your business inside out.",
                cta: "Open Setup",
                delay: 350,
              },
              {
                href: "/dashboard/embed",
                icon: "🔌",
                label: "DEPLOY",
                title: "Embed on Site",
                desc: "One script tag is all it takes to activate your AI agent anywhere.",
                cta: "Get Code",
                delay: 450,
              },
            ].map((item) => (
              <AnimatedCard key={item.href} delay={item.delay}>
                <Link
                  href={item.href}
                  className="group relative block bg-zinc-900/60 border border-zinc-800/80 hover:border-blue-500/30 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/5 backdrop-blur-sm h-full"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background:
                        "radial-gradient(400px circle at 0% 100%, rgba(59,130,246,0.04), transparent 60%)",
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-zinc-600 text-xs tracking-[0.2em] font-semibold">
                        {item.label}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-5">
                      {item.desc}
                    </p>
                    <span className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all duration-300">
                      {item.cta}
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
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

          {/* Pricing section */}
          <AnimatedCard delay={550}>
            <div className="mb-10 text-center">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
                <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-zinc-400 text-xs tracking-[0.2em] uppercase font-medium">
                    Pricing
                  </span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Simple, honest pricing
              </h2>
              <p className="text-zinc-500 text-sm">
                No hidden fees. No surprises. Start free for 14 days.
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-3 gap-5 mb-8">
            {PLANS.map((plan, i) => (
              <AnimatedCard
                key={plan.name}
                delay={650 + i * 120}
                className="relative"
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl shadow-blue-500/30 tracking-wide">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div
                  className={`relative bg-gradient-to-b ${plan.color} border ${plan.border} rounded-2xl p-6 h-full flex flex-col overflow-hidden group transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${plan.popular ? "hover:shadow-blue-500/10 hover:border-blue-400/50" : "hover:shadow-black/60 hover:border-zinc-700"}`}
                >
                  {/* Top accent line for popular */}
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                  )}

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(300px circle at 50% 0%, ${plan.accent}12, transparent 70%)`,
                    }}
                  />

                  <div className="relative mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <p className="text-zinc-400 text-xs font-bold tracking-[0.2em] uppercase">
                        {plan.name}
                      </p>
                      {plan.popular && (
                        <span className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                          Best value
                        </span>
                      )}
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-5xl font-bold tracking-tight">
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

                  <div className="relative h-px bg-zinc-800/80 mb-5" />

                  <ul className="relative space-y-3 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-xs text-zinc-300"
                      >
                        <span className="mt-0.5 flex-shrink-0 text-emerald-400 font-bold">
                          ✓
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`relative w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 tracking-wide ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
                        : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedCard delay={1050}>
            <div className="flex items-center justify-center gap-6 pb-8">
              {[
                "14-day free trial",
                "No credit card required",
                "Cancel anytime",
              ].map((text, i) => (
                <div key={text} className="flex items-center gap-4">
                  {i > 0 && (
                    <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                  )}
                  <span className="text-zinc-600 text-xs">{text}</span>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
