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
import { getSupabase } from "@/lib/supabase";

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
    <div className="bg-zinc-950/95 border border-zinc-800 rounded-xl px-3.5 py-3 shadow-xl backdrop-blur-sm">
      <p className="text-zinc-500 text-[11px] mb-2.5 font-medium">{label}</p>
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
              <span className="text-zinc-400 text-[13px]">{p.name}</span>
            </div>
            <span className="text-white text-[13px] font-medium tabular-nums">
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
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (data) setBusinessId((data as { id: string }).id);
    }
    loadBiz();
  }, []);

  useEffect(() => {
    if (!businessId) return;
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
            { month: "short", day: "numeric" },
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
  }, [businessId, range]);

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

  return (
    <div className="min-h-screen bg-[#08090b] text-white">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Header */}
          <FadeIn className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[22px] sm:text-2xl font-semibold tracking-tight text-white mb-1">
                Analytics
              </h1>
              <p className="text-zinc-500 text-sm">
                Track how your agent performs over time.
              </p>
            </div>
            <div className="flex items-center bg-zinc-900/60 border border-zinc-800 rounded-lg p-0.5 gap-0.5 self-start">
              {([7, 30, 90] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-colors ${range === r ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  {r} days
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {METRICS.map((m, i) => {
              const isActive = activeMetrics.includes(m.key);
              const extra =
                m.key === "leads" && totals.conversations > 0
                  ? `${convRate}% conversion`
                  : `Last ${range} days`;
              return (
                <FadeIn key={m.key} delay={60 + i * 50}>
                  <button
                    onClick={() => toggleMetric(m.key)}
                    className={`group w-full text-left relative bg-zinc-900/40 border rounded-xl p-4 overflow-hidden transition-all duration-200 ${isActive ? "border-zinc-800 hover:border-zinc-700" : "border-zinc-800/40 opacity-45 hover:opacity-75"}`}
                  >
                    {/* Soft top glow in metric color */}
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
                      <span className="text-zinc-400 text-[13px] font-medium">
                        {m.label}
                      </span>
                    </div>
                    <p className="relative text-[28px] leading-none font-semibold tabular-nums tracking-tight mb-2">
                      {loading ? (
                        <span className="inline-block w-12 h-7 bg-zinc-800/80 rounded animate-pulse" />
                      ) : (
                        totals[m.key].toLocaleString()
                      )}
                    </p>
                    <p className="relative text-zinc-600 text-[11px]">
                      {extra}
                    </p>
                  </button>
                </FadeIn>
              );
            })}
          </div>

          {/* Chart */}
          <FadeIn delay={280}>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-zinc-800/60 gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-white tracking-tight">
                    Activity over time
                  </h2>
                  <p className="text-zinc-500 text-[13px] mt-0.5">
                    Select metrics above to compare
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {METRICS.filter((m) => activeMetrics.includes(m.key)).map(
                    (m) => (
                      <div
                        key={m.key}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium border border-zinc-800 bg-zinc-900/60"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: m.color }}
                        />
                        <span className="text-zinc-400">{m.label}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-56 gap-3">
                    <div className="w-7 h-7 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-zinc-600 text-[13px]">Loading data</p>
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
                        stroke="#1c1c1f"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#52525b", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        interval={range === 7 ? 0 : range === 30 ? 6 : 13}
                      />
                      <YAxis
                        tick={{ fill: "#52525b", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        width={32}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                          stroke: "#3f3f46",
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
          </FadeIn>

          {/* Empty state */}
          {!loading && totals.conversations === 0 && (
            <FadeIn delay={360}>
              <div className="mt-4 flex flex-col items-center justify-center py-14 bg-zinc-900/30 border border-zinc-800/60 rounded-xl text-center px-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-3">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="#52525b"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v18h18M7 14l4-4 3 3 5-6"
                    />
                  </svg>
                </div>
                <p className="text-zinc-300 text-sm font-medium mb-1">
                  No data yet
                </p>
                <p className="text-zinc-600 text-[13px] max-w-xs">
                  Once visitors start chatting with your agent, their activity
                  shows up here.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
