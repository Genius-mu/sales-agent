"use client";

import { useEffect, useState, useRef } from "react";
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
      } else {
        setValue(Math.floor(current));
      }
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
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
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
    desc: "Perfect for solo founders and small sites",
    color: "from-zinc-800 to-zinc-900",
    border: "border-zinc-700",
    accent: "#71717a",
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
    desc: "For growing businesses that need more power",
    color: "from-blue-950 to-zinc-900",
    border: "border-blue-500/50",
    accent: "#3b82f6",
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
    desc: "For agencies and high-traffic businesses",
    color: "from-zinc-800 to-zinc-900",
    border: "border-zinc-700",
    accent: "#71717a",
    features: [
      "Unlimited agents",
      "Unlimited conversations",
      "White-label widget",
      "Embed on unlimited sites",
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

  const convCount = useCountUp(stats?.conversations ?? 0);
  const leadsCount = useCountUp(stats?.leads ?? 0);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
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
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Header */}
          <div
            className="mb-10"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <p className="text-zinc-500 text-xs mb-1 tracking-widest uppercase">
              Welcome back
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              {loading ? (
                <span className="inline-block w-48 h-9 bg-zinc-800 rounded-lg animate-pulse" />
              ) : (
                stats?.businessName
              )}
            </h1>
          </div>

          {/* Warning banner */}
          {!loading && !stats?.agentReady && (
            <AnimatedCard delay={200} className="mb-8">
              <div className="flex items-center justify-between bg-amber-500/8 border border-amber-500/25 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
                    ⚠
                  </div>
                  <div>
                    <p className="text-amber-300 font-semibold text-sm">
                      Agent not configured yet
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Add your website URL so the agent knows what to say
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/setup"
                  className="text-sm bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  Set up now →
                </Link>
              </div>
            </AnimatedCard>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              {
                label: "Total Conversations",
                value: loading ? null : convCount,
                icon: "💬",
                sub: "All time",
                delay: 150,
              },
              {
                label: "Leads Captured",
                value: loading ? null : leadsCount,
                icon: "🎯",
                sub: "Emails collected",
                delay: 250,
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
                  ? "Trained on your site"
                  : "Needs configuration",
                highlight: stats?.agentReady,
                delay: 350,
              },
            ].map((card) => (
              <AnimatedCard
                key={card.label}
                delay={card.delay}
                className="group"
              >
                <div className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </span>
                    {card.highlight !== undefined && (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 ${card.highlight ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}
                      >
                        {card.highlight && (
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        )}
                        {card.highlight ? "Online" : "Offline"}
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1 tabular-nums">
                    {card.value === null ? (
                      <span className="inline-block w-12 h-8 bg-zinc-800 rounded animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </p>
                  <p className="text-zinc-400 text-xs font-medium">
                    {card.label}
                  </p>
                  <p className="text-zinc-600 text-xs mt-0.5">{card.sub}</p>
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
                title: "Configure Agent",
                desc: "Add your website URL and customize how the agent talks to visitors.",
                cta: "Go to Setup →",
                delay: 400,
              },
              {
                href: "/dashboard/embed",
                icon: "🔌",
                title: "Get Embed Code",
                desc: "Copy the script tag and paste it into any website to activate the agent.",
                cta: "Get Code →",
                delay: 500,
              },
            ].map((item) => (
              <AnimatedCard key={item.href} delay={item.delay}>
                <Link
                  href={item.href}
                  className="group block bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/5 h-full"
                >
                  <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="text-blue-400 text-sm mt-4 group-hover:translate-x-1.5 transition-transform duration-300">
                    {item.cta}
                  </p>
                </Link>
              </AnimatedCard>
            ))}
          </div>

          {/* Pricing */}
          <AnimatedCard delay={600}>
            <div className="mb-8 text-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-zinc-800" />
                <p className="text-zinc-500 text-xs tracking-widest uppercase">
                  Upgrade your plan
                </p>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>
              <h2 className="text-2xl font-bold mb-1">
                Simple, transparent pricing
              </h2>
              <p className="text-zinc-500 text-sm">
                Start free. Upgrade when you're ready.
              </p>
            </div>
          </AnimatedCard>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {PLANS.map((plan, i) => (
              <AnimatedCard
                key={plan.name}
                delay={700 + i * 100}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-blue-500/30">
                      Most Popular
                    </span>
                  </div>
                )}
                <div
                  className={`relative bg-gradient-to-b ${plan.color} border ${plan.border} rounded-2xl p-6 h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group ${plan.popular ? "hover:shadow-blue-500/10" : "hover:shadow-black/40"}`}
                >
                  {/* Hover shimmer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(400px circle at 50% 0%, ${plan.accent}10, transparent 60%)`,
                    }}
                  />
                  <div className="mb-6">
                    <p className="text-zinc-400 text-xs font-semibold tracking-widest uppercase mb-3">
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-zinc-500 text-sm mb-1">/mo</span>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-xs text-zinc-300"
                      >
                        <span className="mt-0.5 flex-shrink-0 text-green-400">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${plan.popular ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedCard delay={1100}>
            <p className="text-center text-zinc-600 text-xs pb-8">
              All plans include a 14-day free trial · No credit card required ·
              Cancel anytime
            </p>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
