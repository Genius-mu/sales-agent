"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import Reveal from "@/app/components/Reveal";
import { getSupabase } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  session_id: string;
  business_id: string;
  messages: Message[];
  lead_email: string | null;
  created_at: string;
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

function ConversationDrawer({
  convo,
  onClose,
}: {
  convo: Conversation;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg h-full bg-[#0a0b0d] border-l border-zinc-800 flex flex-col shadow-2xl animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 shrink-0">
          <div className="min-w-0">
            <p className="text-[11px] text-zinc-500 font-medium tracking-[0.12em] uppercase mb-0.5">
              Session
            </p>
            <p className="text-zinc-400 text-[13px] font-mono truncate max-w-[260px]">
              {convo.session_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 flex items-center justify-center transition-colors shrink-0"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path
                stroke="#a1a1aa"
                strokeWidth="2.5"
                strokeLinecap="round"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-800/40 shrink-0 flex-wrap">
          <span className="text-zinc-500 text-[13px]">
            {timeAgo(convo.created_at)}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500 text-[13px]">
            {convo.messages.length} messages
          </span>
          {convo.lead_email && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-[12px] font-medium">
                {convo.lead_email}
              </span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {convo.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ConversationsPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [filter, setFilter] = useState<"all" | "leads">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  useEffect(() => {
    if (!businessId) return;
    async function load() {
      setLoading(true);
      const sb = getSupabase();
      const { data, error } = await sb
        .from("conversations")
        .select("id, session_id, business_id, messages, lead_email, created_at")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });
      if (!error && data) setConversations(data as Conversation[]);
      setLoading(false);
    }
    load();
  }, [businessId]);

  const filtered = conversations.filter((c) => {
    if (filter === "leads" && !c.lead_email) return false;
    if (search) {
      const q = search.toLowerCase();
      const hasMatch =
        c.lead_email?.toLowerCase().includes(q) ||
        c.session_id.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q));
      if (!hasMatch) return false;
    }
    return true;
  });

  const totalLeads = conversations.filter((c) => c.lead_email).length;
  const totalMessages = conversations.reduce(
    (sum, c) => sum + c.messages.length,
    0,
  );

  const STATS = [
    { label: "Conversations", value: conversations.length, color: "#3b82f6" },
    { label: "Leads", value: totalLeads, color: "#10b981" },
    { label: "Messages", value: totalMessages, color: "#8b5cf6" },
  ];

  return (
    <div className="min-h-screen bg-[#08090b] text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Header */}
          <Reveal distance={20} className="mb-7">
            <h1 className="text-[22px] sm:text-2xl font-semibold tracking-tight text-white mb-1">
              Conversations
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Every chat your agent has had. Browse history, review leads, read
              full transcripts.
            </p>
          </Reveal>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 70} distance={22}>
                <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 overflow-hidden h-full">
                  <div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-16 rounded-full blur-2xl"
                    style={{ backgroundColor: stat.color, opacity: 0.1 }}
                  />
                  <div className="relative flex items-center gap-2 mb-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="text-zinc-400 text-[13px] font-medium">
                      {stat.label}
                    </span>
                  </div>
                  <div className="relative text-2xl sm:text-[26px] leading-none font-semibold tabular-nums">
                    {loading ? (
                      <span className="inline-block w-10 h-6 bg-zinc-800/80 rounded animate-pulse" />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Filters + Search */}
          <Reveal delay={120} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex items-center gap-0.5 p-0.5 bg-zinc-900/60 border border-zinc-800 rounded-lg">
              {(["all", "leads"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${filter === f ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  {f === "all" ? "All" : `Leads (${totalLeads})`}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M21 21l-4.35-4.35"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by email, session, or message"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-[13px] text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
          </Reveal>

          {/* Conversation list */}
          <Reveal delay={180} repeat={false}>
            <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-7 h-7 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-zinc-600 text-[13px]">
                    Loading conversations
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 px-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="#52525b"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h8M8 14h5M21 12a9 9 0 1 1-4.5-7.8L21 3v9Z"
                      />
                    </svg>
                  </div>
                  <p className="text-zinc-300 text-sm font-medium">
                    {filter === "leads"
                      ? "No leads yet"
                      : search
                        ? "No results"
                        : "No conversations yet"}
                  </p>
                  <p className="text-zinc-600 text-[13px] text-center max-w-xs">
                    {filter === "leads"
                      ? "When visitors share their email, they'll show up here."
                      : search
                        ? "Try a different search term."
                        : "Once visitors chat with your agent, conversations land here."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {filtered.map((convo) => {
                    const lastMsg = convo.messages[convo.messages.length - 1];
                    const userMessages = convo.messages.filter(
                      (m) => m.role === "user",
                    ).length;
                    return (
                      <button
                        key={convo.id}
                        onClick={() => setSelected(convo)}
                        className="w-full text-left px-4 sm:px-5 py-3.5 hover:bg-zinc-800/30 transition-colors group flex items-start gap-3"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${convo.lead_email ? "bg-emerald-500/10 border-emerald-500/20" : "bg-zinc-800 border-zinc-700/60"}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${convo.lead_email ? "bg-emerald-400" : "bg-zinc-500"}`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-zinc-200 text-[13px] font-medium truncate">
                                {convo.lead_email ?? "Anonymous visitor"}
                              </span>
                              {convo.lead_email && (
                                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-[11px] shrink-0">
                                  Lead
                                </span>
                              )}
                            </div>
                            <span className="text-zinc-600 text-[12px] shrink-0">
                              {timeAgo(convo.created_at)}
                            </span>
                          </div>

                          <p className="text-zinc-500 text-[13px] truncate mb-1.5">
                            {lastMsg?.content ?? "No messages"}
                          </p>

                          <div className="flex items-center gap-2 text-zinc-600 text-[12px]">
                            <span>{convo.messages.length} messages</span>
                            <span>·</span>
                            <span>{userMessages} from visitor</span>
                          </div>
                        </div>

                        <svg
                          className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0 mt-2"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 18l6-6-6-6"
                          />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {selected && (
        <ConversationDrawer
          convo={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
