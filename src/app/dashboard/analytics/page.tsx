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

const BUSINESS_ID = "3f6505b0-ac65-487e-8dee-f3b2cd9d73fa";

type Range = 7 | 30 | 90;

interface DayData {
  date: string;
  conversations: number;
  leads: number;
  messages: number;
  activeSessions: number;
}

type MetricKey = "conversations" | "leads" | "messages" | "activeSessions";

const METRICS: {
  key: MetricKey;
  label: string;
  color: string;
  icon: string;
}[] = [
  {
    key: "conversations",
    label: "Conversations",
    color: "#3b82f6",
    icon: "💬",
  },
  { key: "leads", label: "Leads Captured", color: "#22c55e", icon: "🎯" },
  { key: "messages", label: "Messages Sent", color: "#a78bfa", icon: "✉️" },
  {
    key: "activeSessions",
    label: "Active Sessions",
    color: "#f59e0b",
    icon: "⚡",
  },
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
    <div className="bg-zinc-900/95 border border-zinc-700/80 rounded-2xl px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-sm">
      <p className="text-zinc-400 text-xs mb-3 font-medium">{label}</p>
      <div className="space-y-2">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-zinc-400 text-xs">{p.name}</span>
            </div>
            <span className="text-white text-xs font-bold tabular-nums">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>(30);
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>([
    "conversations",
    "leads",
    "messages",
    "activeSessions",
  ]);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

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
    async function load() {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - range);
      const sb = getSupabase();
      const { data: conversations } = await sb
        .from("conversations")
        .select("created_at, lead_email, messages")
        .eq("business_id", BUSINESS_ID)
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
  }, [range]);

  const totals = data.reduce(
    (acc, d) => ({
      conversations: acc.conversations + d.conversations,
      leads: acc.leads + d.leads,
      messages: acc.messages + d.messages,
      activeSessions: acc.activeSessions + d.activeSessions,
    }),
    { conversations: 0, leads: 0, messages: 0, activeSessions: 0 },
  );

  return (
    <div className="min-h-screen bg-[#080809] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-violet-600/4 rounded-full blur-[110px]" />
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-medium">
                  Analytics
                </p>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-2">
                Performance
              </h1>
              <p className="text-zinc-500 text-sm">
                Real-time insights into your agent's activity
              </p>
            </div>

            {/* Range selector */}
            <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl p-1 gap-1 backdrop-blur-sm self-start sm:self-auto">
              {([7, 30, 90] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${range === r ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"}`}
                >
                  {r}d
                </button>
              ))}
            </div>
          </div>

          {/* Stat cards — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {METRICS.map((m, i) => {
              const isActive = activeMetrics.includes(m.key);
              return (
                <AnimatedCard key={m.key} delay={100 + i * 80}>
                  <button
                    onClick={() => toggleMetric(m.key)}
                    className={`group w-full text-left relative bg-zinc-900/60 border rounded-2xl p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm ${isActive ? "border-zinc-700 hover:border-zinc-600" : "border-zinc-800/50 opacity-50 hover:opacity-70"}`}
                  >
                    {/* Top color bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-opacity duration-300"
                      style={{
                        backgroundColor: m.color,
                        opacity: isActive ? 1 : 0,
                      }}
                    />

                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-sm sm:text-base">
                        {m.icon}
                      </div>
                      <div
                        className="w-2 h-2 rounded-full mt-1 transition-all duration-300"
                        style={{
                          backgroundColor: m.color,
                          opacity: isActive ? 1 : 0.3,
                        }}
                      />
                    </div>

                    <p className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight mb-1">
                      {loading ? (
                        <span className="inline-block w-10 h-7 bg-zinc-800 rounded animate-pulse" />
                      ) : (
                        totals[m.key].toLocaleString()
                      )}
                    </p>
                    {/* Full label on md+, short on mobile */}
                    <p className="text-zinc-400 text-xs font-medium hidden sm:block">
                      {m.label}
                    </p>
                    <p className="text-zinc-400 text-xs font-medium sm:hidden">
                      {m.label.split(" ")[0]}
                    </p>
                    <p className="text-zinc-600 text-xs mt-0.5">
                      Last {range}d
                    </p>
                  </button>
                </AnimatedCard>
              );
            })}
          </div>

          {/* Chart */}
          <AnimatedCard delay={450}>
            <div className="relative bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
              {/* Chart header — stacks on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-zinc-800/60 gap-3">
                <div>
                  <h2 className="font-semibold text-white text-base">
                    Performance over time
                  </h2>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    Tap metric cards to toggle visibility
                  </p>
                </div>
                {/* Active metric pills — wraps on mobile */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {METRICS.filter((m) => activeMetrics.includes(m.key)).map(
                    (m) => (
                      <div
                        key={m.key}
                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium border border-zinc-700/80 bg-zinc-800/60"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: m.color }}
                        />
                        {/* Only show label on sm+ */}
                        <span className="text-zinc-300 hidden sm:inline">
                          {m.label}
                        </span>
                        <span className="text-zinc-300 sm:hidden">
                          {m.label.split(" ")[0]}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Chart body */}
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-48 sm:h-72 gap-3">
                    <div className="w-8 h-8 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-zinc-600 text-sm">
                      Loading chart data...
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart
                      data={data}
                      margin={{ top: 10, right: 4, left: -24, bottom: 0 }}
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
                              stopOpacity={0.15}
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
                        stroke="#27272a"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#52525b", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        interval={range === 7 ? 0 : range === 30 ? 6 : 13}
                      />
                      <YAxis
                        tick={{ fill: "#52525b", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
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
                            activeDot={{ r: 4, fill: m.color, strokeWidth: 0 }}
                          />
                        ),
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Bottom summary bar — 2x2 on mobile, row on desktop */}
              {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-4 px-4 sm:px-6 py-4 border-t border-zinc-800/60 bg-zinc-950/30 gap-3 sm:gap-0">
                  {METRICS.map((m) => (
                    <div
                      key={m.key}
                      className={`text-center transition-opacity duration-300 ${activeMetrics.includes(m.key) ? "opacity-100" : "opacity-30"}`}
                    >
                      <p
                        className="text-base sm:text-lg font-bold tabular-nums"
                        style={{ color: m.color }}
                      >
                        {totals[m.key].toLocaleString()}
                      </p>
                      <p className="text-zinc-600 text-xs hidden sm:block">
                        {m.label}
                      </p>
                      <p className="text-zinc-600 text-xs sm:hidden">
                        {m.label.split(" ")[0]}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedCard>

          {/* Empty state */}
          {!loading && totals.conversations === 0 && (
            <AnimatedCard delay={600}>
              <div className="mt-6 flex flex-col items-center justify-center py-10 sm:py-12 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl text-center px-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl mb-4">
                  📭
                </div>
                <p className="text-zinc-400 text-sm font-medium mb-1">
                  No data yet
                </p>
                <p className="text-zinc-600 text-xs">
                  Start conversations via your embedded widget to see stats
                  here.
                </p>
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  );
}
