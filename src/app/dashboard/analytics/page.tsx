"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardNav from "@/app/components/DashboardNav";
import Reveal from "@/app/components/Reveal";
import { getSupabase } from "@/lib/supabase";
import LockedFeature from "@/app/components/LockedFeature";
import { hasFeature } from "@/lib/plans";

type Range = 7 | 30 | 90;

interface DayData {
  date: string;
  conversations: number;
  leads: number;
  messages: number;
  activeSessions: number;
}

type MetricKey = "conversations" | "leads" | "messages" | "activeSessions";

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: "conversations", label: "Conversations", color: "#3b82f6" },
  { key: "leads", label: "Leads", color: "#10b981" },
  { key: "messages", label: "Messages", color: "#8b5cf6" },
  { key: "activeSessions", label: "Active sessions", color: "#f59e0b" },
];

function buildEmptyDays(days: number): DayData[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      conversations: 0,
      leads: 0,
      messages: 0,
      activeSessions: 0,
    };
  });
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; color: string; name: string; value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-3 shadow-xl backdrop-blur-sm">
      <p className="text-slate-500 text-[11px] mb-2.5 font-medium">{label}</p>
      <div className="space-y-1.5">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-8"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-slate-500 text-[13px]">{p.name}</span>
            </div>
            <span className="text-slate-900 text-[13px] font-medium tabular-nums">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [range, setRange] = useState<Range>(30);
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>([
    "conversations",
    "leads",
    "messages",
    "activeSessions",
  ]);

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) =>
      prev.includes(key)
        ? prev.length > 1
          ? prev.filter((m) => m !== key)
          : prev
        : [...prev, key],
    );
  };

  useEffect(() => {
    async function loadBiz() {
      const sb = getSupabase();
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (!session?.user) return;
      const { data } = await sb
        .from("businesses")
        .select("id, plan")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (data) {
        const biz = data as { id: string; plan: string | null };
        setPlan(biz.plan || "free");
        setBusinessId(biz.id);
      } else {
        setPlan("free");
      }
    }
    loadBiz();
  }, []);

  const unlocked = hasFeature(plan, "analytics");

  useEffect(() => {
    // Don't load analytics data for plans that don't include it
    if (!businessId || !unlocked) return;
    async function load() {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - range);
      const sb = getSupabase();
      const { data: conversations } = await sb
        .from("conversations")
        .select("created_at, lead_email, messages")
        .eq("business_id", businessId)
        .gte("created_at", since.toISOString());

      const days = buildEmptyDays(range);
      conversations?.forEach(
        (convo: {
          created_at: string;
          lead_email: string | null;
          messages: unknown[];
        }) => {
          const dateStr = new Date(convo.created_at).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            },
          );
          const day = days.find((d) => d.date === dateStr);
          if (!day) return;
          day.conversations += 1;
          if (convo.lead_email) day.leads += 1;
          const msgs = Array.isArray(convo.messages) ? convo.messages : [];
          day.messages += msgs.length;
          if (msgs.length >= 4) day.activeSessions += 1;
        },
      );

      setData(days);
      setLoading(false);
    }
    load();
  }, [businessId, range, unlocked]);

  const totals = data.reduce(
    (acc, d) => ({
      conversations: acc.conversations + d.conversations,
      leads: acc.leads + d.leads,
      messages: acc.messages + d.messages,
      activeSessions: acc.activeSessions + d.activeSessions,
    }),
    { conversations: 0, leads: 0, messages: 0, activeSessions: 0 },
  );

  const convRate =
    totals.conversations > 0
      ? Math.round((totals.leads / totals.conversations) * 100)
      : 0;

  if (plan !== null && !unlocked) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
        <DashboardNav />
        <LockedFeature
          feature="analytics"
          title="See what turns visitors into leads"
          points={[
            "Conversations, leads and messages over time",
            "Your lead conversion rate",
            "Which days bring in the most chats",
          ]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Header */}
          <Reveal
            distance={20}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-[22px] sm:text-2xl font-semibold tracking-tight text-slate-900 mb-1">
                Analytics
              </h1>
              <p className="text-slate-500 text-sm">
                Track how your agent performs over time.
              </p>
            </div>
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 gap-0.5 self-start">
              {([7, 30, 90] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-colors ${range === r ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                >
                  {r} days
                </button>
              ))}
            </div>
          </Reveal>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {METRICS.map((m, i) => {
              const isActive = activeMetrics.includes(m.key);
              const extra =
                m.key === "leads" && totals.conversations > 0
                  ? `${convRate}% conversion`
                  : `Last ${range} days`;
              return (
                <Reveal key={m.key} delay={i * 70} distance={22}>
                  <button
                    onClick={() => toggleMetric(m.key)}
                    className={`group w-full text-left relative bg-white border rounded-xl p-4 overflow-hidden transition-all duration-200 h-full ${isActive ? "border-slate-200 hover:border-slate-300" : "border-slate-200 opacity-45 hover:opacity-75"}`}
                  >
                    <div
                      className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-20 rounded-full blur-2xl transition-opacity duration-300"
                      style={{
                        backgroundColor: m.color,
                        opacity: isActive ? 0.14 : 0,
                      }}
                    />
                    <div
                      className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(to right, transparent, ${m.color}, transparent)`,
                        opacity: isActive ? 0.5 : 0,
                      }}
                    />
                    <div className="relative flex items-center gap-2 mb-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="text-slate-500 text-[13px] font-medium">
                        {m.label}
                      </span>
                    </div>
                    <p className="relative text-[28px] leading-none font-semibold tabular-nums tracking-tight mb-2">
                      {loading ? (
                        <span className="inline-block w-12 h-7 bg-slate-100 rounded animate-pulse" />
                      ) : (
                        totals[m.key].toLocaleString()
                      )}
                    </p>
                    <p className="relative text-slate-400 text-[11px]">
                      {extra}
                    </p>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* Chart */}
          <Reveal>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-slate-200 gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">
                    Activity over time
                  </h2>
                  <p className="text-slate-500 text-[13px] mt-0.5">
                    Select metrics above to compare
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {METRICS.filter((m) => activeMetrics.includes(m.key)).map(
                    (m) => (
                      <div
                        key={m.key}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium border border-slate-200 bg-white"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: m.color }}
                        />
                        <span className="text-slate-500">{m.label}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-56 gap-3">
                    <div className="w-7 h-7 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-slate-400 text-[13px]">Loading data</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart
                      data={data}
                      margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
                    >
                      <defs>
                        {METRICS.map((m) => (
                          <linearGradient
                            key={m.key}
                            id={`grad-${m.key}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={m.color}
                              stopOpacity={0.18}
                            />
                            <stop
                              offset="100%"
                              stopColor={m.color}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        interval={range === 7 ? 0 : range === 30 ? 6 : 13}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        width={32}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                          stroke: "#cbd5e1",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                      />
                      {METRICS.filter((m) => activeMetrics.includes(m.key)).map(
                        (m) => (
                          <Area
                            key={m.key}
                            type="monotone"
                            dataKey={m.key}
                            name={m.label}
                            stroke={m.color}
                            strokeWidth={2}
                            fill={`url(#grad-${m.key})`}
                            dot={false}
                            activeDot={{
                              r: 3.5,
                              fill: m.color,
                              strokeWidth: 0,
                            }}
                          />
                        ),
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </Reveal>

          {/* Empty state */}
          {!loading && totals.conversations === 0 && (
            <Reveal delay={80}>
              <div className="mt-4 flex flex-col items-center justify-center py-14 bg-white border border-slate-200 rounded-xl text-center px-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v18h18M7 14l4-4 3 3 5-6"
                    />
                  </svg>
                </div>
                <p className="text-slate-700 text-sm font-medium mb-1">
                  No data yet
                </p>
                <p className="text-slate-400 text-[13px] max-w-xs">
                  Once visitors start chatting with your agent, their activity
                  shows up here.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
