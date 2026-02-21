"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DashboardNav from "@/app/components/DashboardNav";
import { supabase } from "@/lib/supabase";

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

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: "conversations", label: "Conversations", color: "#3b82f6" },
  { key: "leads", label: "Leads Captured", color: "#22c55e" },
  { key: "messages", label: "Messages Sent", color: "#a78bfa" },
  { key: "activeSessions", label: "Active Sessions", color: "#f59e0b" },
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-zinc-400 text-xs mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-zinc-300">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
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

      const { data: conversations } = await supabase
        .from("conversations")
        .select("created_at, lead_email, messages")
        .eq("business_id", BUSINESS_ID)
        .gte("created_at", since.toISOString());

      const days = buildEmptyDays(range);

      conversations?.forEach((convo) => {
        const dateStr = new Date(convo.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const day = days.find((d) => d.date === dateStr);
        if (!day) return;

        day.conversations += 1;
        if (convo.lead_email) day.leads += 1;

        const msgs = Array.isArray(convo.messages) ? convo.messages : [];
        day.messages += msgs.length;

        // Active session = conversation with 4+ messages
        if (msgs.length >= 4) day.activeSessions += 1;
      });

      setData(days);
      setLoading(false);
    }

    load();
  }, [range]);

  // Summary totals
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
    <div className="min-h-screen bg-zinc-950 text-white">
      <DashboardNav />

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Analytics
            </h1>
            <p className="text-zinc-500 text-sm">
              Track your agent's performance over time
            </p>
          </div>

          {/* Range selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1">
            {([7, 30, 90] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  range === r
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {METRICS.map((m) => (
            <div
              key={m.key}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: m.color }}
                />
                <span className="text-zinc-400 text-xs">{m.label}</span>
              </div>
              <p className="text-3xl font-bold">
                {loading ? "—" : totals[m.key].toLocaleString()}
              </p>
              <p className="text-zinc-600 text-xs mt-1">Last {range} days</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">Performance over time</h2>

            {/* Metric toggles */}
            <div className="flex items-center gap-2">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => toggleMetric(m.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    activeMetrics.includes(m.key)
                      ? "border-zinc-600 text-white bg-zinc-800"
                      : "border-zinc-800 text-zinc-600 bg-transparent"
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full transition-opacity"
                    style={{
                      backgroundColor: m.color,
                      opacity: activeMetrics.includes(m.key) ? 1 : 0.3,
                    }}
                  />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-72 text-zinc-600 text-sm">
              Loading chart data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={range === 7 ? 0 : range === 30 ? 4 : 9}
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {METRICS.filter((m) => activeMetrics.includes(m.key)).map(
                  (m) => (
                    <Line
                      key={m.key}
                      type="monotone"
                      dataKey={m.key}
                      name={m.label}
                      stroke={m.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                  ),
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Empty state hint */}
        {!loading && totals.conversations === 0 && (
          <div className="mt-6 text-center text-zinc-600 text-sm">
            No data yet for this period. Start conversations via your embedded
            widget to see stats here.
          </div>
        )}
      </div>
    </div>
  );
}
