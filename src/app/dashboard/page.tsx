"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardNav from "@/app/components/DashboardNav";
import { getSupabase } from "@/lib/supabase";

interface RecentConvo {
  id: string;
  lead_email: string | null;
  created_at: string;
  preview: string;
}

interface Stats {
  conversations: number;
  leads: number;
  messages: number;
  agentReady: boolean;
  hasEmbedded: boolean;
  businessName: string;
  websiteUrl: string;
  recent: RecentConvo[];
}

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 36;
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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const PLANS = [
  {
    name: "Starter",
    price: "₦1,000",
    period: "/mo",
    desc: "For founders ready to stop losing leads",
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
    price: "₦5,000",
    period: "/mo",
    desc: "For businesses that can't afford to miss a sale",
    badge: "Most popular",
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
    price: "₦15,000",
    period: "/mo",
    desc: "For agencies running multiple client sites",
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

const Arrow = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
    <path
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12h14m-7-7 7 7-7 7"
    />
  </svg>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const convCount = useCountUp(stats?.conversations ?? 0);
  const leadsCount = useCountUp(stats?.leads ?? 0);
  const msgCount = useCountUp(stats?.messages ?? 0);

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
        .select("id, lead_email, messages, created_at")
        .eq("business_id", biz.id)
        .order("created_at", { ascending: false });

      const conversations = (convoData ?? []) as {
        id: string;
        lead_email: string | null;
        messages: { role: string; content: string }[];
        created_at: string;
      }[];

      const totalMessages = conversations.reduce(
        (sum, c) => sum + (Array.isArray(c.messages) ? c.messages.length : 0),
        0,
      );

      const recent: RecentConvo[] = conversations.slice(0, 4).map((c) => {
        const msgs = Array.isArray(c.messages) ? c.messages : [];
        const lastUser = [...msgs].reverse().find((m) => m.role === "user");
        return {
          id: c.id,
          lead_email: c.lead_email,
          created_at: c.created_at,
          preview:
            lastUser?.content ||
            msgs[msgs.length - 1]?.content ||
            "New conversation",
        };
      });

      setStats({
        businessName: biz.name || "Your business",
        websiteUrl: biz.website_url || "",
        agentReady: !!(biz.scraped_content || biz.description),
        hasEmbedded: conversations.length > 0,
        conversations: conversations.length,
        leads: conversations.filter((c) => c.lead_email).length,
        messages: totalMessages,
        recent,
      });
      setLoading(false);
    }
    load();
  }, []);

  const conversionRate =
    stats?.conversations && stats.conversations > 0
      ? Math.round((stats.leads / stats.conversations) * 100)
      : 0;

  const STAT_CARDS = [
    {
      label: "Conversations",
      value: loading ? null : convCount,
      sub: "All time",
      color: "#3b82f6",
      badge:
        stats?.conversations && stats.conversations > 0
          ? `${stats.conversations} total`
          : "Waiting",
    },
    {
      label: "Leads",
      value: loading ? null : leadsCount,
      sub: "Emails collected",
      color: "#10b981",
      badge:
        stats?.leads && stats.leads > 0
          ? `${conversionRate}% conversion`
          : "None yet",
    },
    {
      label: "Messages",
      value: loading ? null : msgCount,
      sub: "Sent & received",
      color: "#8b5cf6",
      badge:
        stats?.messages && stats.messages > 0
          ? `${stats.messages} total`
          : "Waiting",
    },
    {
      label: "Agent status",
      value: loading ? null : stats?.agentReady ? "Active" : "Offline",
      sub: stats?.agentReady ? "Responding 24/7" : "Setup needed",
      color: stats?.agentReady ? "#10b981" : "#f59e0b",
      badge: stats?.agentReady ? "Online" : "Action needed",
    },
  ];

  // Onboarding checklist
  const checklist = [
    { label: "Create your account", done: true, href: "/dashboard" },
    {
      label: "Train your agent with business info",
      done: !!stats?.agentReady,
      href: "/dashboard/setup",
    },
    {
      label: "Embed the widget on your site",
      done: !!stats?.hasEmbedded,
      href: "/dashboard/embed",
    },
    {
      label: "Capture your first lead",
      done: !!(stats?.leads && stats.leads > 0),
      href: "/dashboard/conversations",
    },
  ];
  const completedSteps = checklist.filter((c) => c.done).length;
  const allDone = completedSteps === checklist.length;

  return (
    <div className="min-h-screen bg-[#08090b] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Header */}
          <FadeIn className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-7 sm:mb-8">
            <div className="min-w-0 flex-1">
              <p className="text-zinc-500 text-[13px] mb-1">{greeting()} 👋</p>
              <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-white mb-1 leading-tight">
                {loading ? (
                  <span className="inline-block w-44 h-7 bg-zinc-800/80 rounded-lg animate-pulse" />
                ) : (
                  stats?.businessName
                )}
              </h1>
              {!loading && stats?.websiteUrl ? (
                <a
                  href={stats.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 text-[13px] hover:text-zinc-300 transition-colors truncate max-w-xs inline-flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {stats.websiteUrl.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                !loading && (
                  <p className="text-zinc-500 text-[13px]">
                    Here's how your agent is doing.
                  </p>
                )
              )}
            </div>
            {!loading && (
              <Link
                href="/dashboard/embed"
                className="hidden sm:inline-flex items-center gap-2 text-[13px] font-medium bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-4 py-2 rounded-lg transition-colors shrink-0"
              >
                Get embed code
                <Arrow />
              </Link>
            )}
          </FadeIn>

          {/* Agent offline warning */}
          {!loading && !stats?.agentReady && (
            <FadeIn delay={60} className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl px-5 py-4">
                <div className="flex items-start gap-3">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-amber-400 shrink-0 mt-0.5"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                    />
                  </svg>
                  <div>
                    <p className="text-amber-200 font-medium text-[13px]">
                      Your agent isn't live yet
                    </p>
                    <p className="text-zinc-500 text-[12px] mt-0.5">
                      Add a description or website URL to activate it and start
                      capturing leads.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/setup"
                  className="text-[13px] bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium px-4 py-2 rounded-lg transition-colors active:scale-[0.98] shrink-0 w-full sm:w-auto text-center"
                >
                  Set up agent
                </Link>
              </div>
            </FadeIn>
          )}

          {/* Stat cards — now 4, responsive 2x2 on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {STAT_CARDS.map((card, i) => (
              <FadeIn key={card.label} delay={80 + i * 50}>
                <div className="relative bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 sm:p-5 overflow-hidden transition-colors h-full">
                  <div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full blur-2xl"
                    style={{ backgroundColor: card.color, opacity: 0.1 }}
                  />
                  <div className="relative flex items-center justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: card.color }}
                      />
                      <span className="text-zinc-400 text-[13px] font-medium truncate">
                        {card.label}
                      </span>
                    </div>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border shrink-0 hidden sm:inline"
                      style={{
                        color: card.color,
                        backgroundColor: `${card.color}14`,
                        borderColor: `${card.color}33`,
                      }}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <p className="relative text-2xl sm:text-[28px] leading-none font-semibold mb-1.5 tabular-nums tracking-tight">
                    {card.value === null ? (
                      <span className="inline-block w-14 h-7 bg-zinc-800 rounded animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </p>
                  <p className="relative text-zinc-600 text-[12px]">
                    {card.sub}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Two-column: Recent activity + Getting started */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
            {/* Recent activity */}
            <FadeIn delay={280} className="lg:col-span-3">
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
                  <div>
                    <h2 className="text-[15px] font-semibold text-white tracking-tight">
                      Recent activity
                    </h2>
                    <p className="text-zinc-500 text-[12px] mt-0.5">
                      Your latest conversations
                    </p>
                  </div>
                  {!loading && stats && stats.recent.length > 0 && (
                    <Link
                      href="/dashboard/conversations"
                      className="text-[13px] text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      View all
                      <Arrow />
                    </Link>
                  )}
                </div>

                {loading ? (
                  <div className="divide-y divide-zinc-800/40">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-5 py-3.5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div
                            className="h-3 bg-zinc-800 rounded animate-pulse"
                            style={{ width: `${50 + i * 10}%` }}
                          />
                          <div className="h-2.5 bg-zinc-800/60 rounded animate-pulse w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : stats && stats.recent.length > 0 ? (
                  <div className="divide-y divide-zinc-800/40 flex-1">
                    {stats.recent.map((c) => (
                      <Link
                        key={c.id}
                        href="/dashboard/conversations"
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors group"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${c.lead_email ? "bg-emerald-500/10 border-emerald-500/20" : "bg-zinc-800 border-zinc-700/60"}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${c.lead_email ? "bg-emerald-400" : "bg-zinc-500"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-zinc-200 text-[13px] font-medium truncate">
                              {c.lead_email ?? "Anonymous visitor"}
                            </span>
                            {c.lead_email && (
                              <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 shrink-0">
                                Lead
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-500 text-[12px] truncate">
                            {c.preview}
                          </p>
                        </div>
                        <span className="text-zinc-600 text-[12px] shrink-0">
                          {timeAgo(c.created_at)}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 py-12 px-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-3">
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="#52525b"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 10h8M8 14h5M21 12a9 9 0 1 1-4.5-7.8L21 3v9Z"
                        />
                      </svg>
                    </div>
                    <p className="text-zinc-300 text-[13px] font-medium mb-1">
                      No conversations yet
                    </p>
                    <p className="text-zinc-600 text-[12px] max-w-[240px]">
                      Once your widget is live, chats will appear here in real
                      time.
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Getting started checklist */}
            <FadeIn delay={340} className="lg:col-span-2">
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[15px] font-semibold text-white tracking-tight">
                    {allDone ? "You're all set" : "Getting started"}
                  </h2>
                  <span className="text-[12px] text-zinc-500 tabular-nums">
                    {completedSteps}/{checklist.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-5">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${(completedSteps / checklist.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="space-y-1">
                  {checklist.map((step) => (
                    <Link
                      key={step.label}
                      href={step.href}
                      className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-zinc-800/40 transition-colors group"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${step.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-700 text-transparent"}`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span
                        className={`text-[13px] flex-1 ${step.done ? "text-zinc-500 line-through" : "text-zinc-300 group-hover:text-white"}`}
                      >
                        {step.label}
                      </span>
                      {!step.done && (
                        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                          <Arrow />
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
            {[
              {
                href: "/dashboard/setup",
                label: "Configure",
                title: "Train your agent",
                desc: "Tell Saim about your business. The more it knows, the better it sells.",
                cta: "Open setup",
                delay: 400,
                urgent: !stats?.agentReady && !loading,
              },
              {
                href: "/dashboard/embed",
                label: "Deploy",
                title: "Go live on your site",
                desc: "One script tag, pasted anywhere. Your agent starts capturing leads instantly.",
                cta: "Get embed code",
                delay: 450,
                urgent: false,
              },
            ].map((item) => (
              <FadeIn key={item.href} delay={item.delay}>
                <Link
                  href={item.href}
                  className={`group relative block rounded-xl p-5 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 h-full ${item.urgent ? "bg-blue-950/30 border border-blue-500/30 hover:border-blue-500/50" : "bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700"}`}
                >
                  {item.urgent && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                  )}
                  <p
                    className={`text-[11px] tracking-[0.12em] font-medium uppercase mb-3 ${item.urgent ? "text-blue-400" : "text-zinc-600"}`}
                  >
                    {item.label}
                  </p>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 text-[13px] leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[13px] font-medium group-hover:gap-2.5 transition-all ${item.urgent ? "text-blue-400" : "text-zinc-400 group-hover:text-white"}`}
                  >
                    {item.cta}
                    <Arrow />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>

          {/* Tips / resources */}
          <FadeIn delay={500} className="mb-12">
            <div className="flex items-center gap-4 mb-5">
              <h2 className="text-[15px] font-semibold text-zinc-300 shrink-0">
                Tips to close more
              </h2>
              <div className="h-px flex-1 bg-zinc-800/60" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  title: "Write a detailed description",
                  desc: "The richer your business description, the sharper your agent's answers. Include products, pricing, and FAQs.",
                },
                {
                  title: "Respond to leads fast",
                  desc: "Leads are most likely to convert within the first hour. Check your conversations daily.",
                },
                {
                  title: "Match your brand color",
                  desc: "A widget that matches your site feels native and earns more trust from visitors.",
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4"
                >
                  <h3 className="text-zinc-200 text-[13px] font-medium mb-1.5">
                    {tip.title}
                  </h3>
                  <p className="text-zinc-500 text-[12px] leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Pricing */}
          <FadeIn delay={560}>
            <div className="mb-8 text-center">
              <div className="flex items-center gap-4 mb-7">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800/60" />
                <span className="text-zinc-500 text-[11px] tracking-[0.15em] uppercase font-medium">
                  Upgrade
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800/60" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2 leading-tight">
                Less than one lost deal a month
              </h2>
              <p className="text-zinc-500 text-sm max-w-md mx-auto">
                Capture one extra lead a month and Saim pays for itself many
                times over.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={600 + i * 60} className="relative">
                {plan.badge && (
                  <div className="absolute -top-2.5 left-5 z-20">
                    <span className="bg-blue-600 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div
                  className={`relative bg-zinc-900/40 border rounded-xl p-5 h-full flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${plan.popular ? "border-blue-500/30 hover:border-blue-500/50" : "border-zinc-800 hover:border-zinc-700"}`}
                >
                  {plan.popular && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-28 bg-blue-600/[0.12] rounded-full blur-3xl pointer-events-none" />
                    </>
                  )}
                  <div className="relative mb-4">
                    <p className="text-zinc-400 text-[11px] font-medium tracking-[0.12em] uppercase mb-3">
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-[34px] leading-none font-semibold tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-zinc-500 text-[13px] mb-1">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[12px] mt-2 leading-relaxed">
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
                  <Link
                    href="/dashboard/billing"
                    className={`w-full py-2.5 rounded-lg text-[13px] font-medium transition-colors active:scale-[0.98] text-center block ${plan.popular ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={820}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-8">
              {[
                "14-day free trial",
                "No credit card required",
                "Cancel anytime",
              ].map((text) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-zinc-600" />
                  <span className="text-zinc-600 text-[12px]">{text}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
