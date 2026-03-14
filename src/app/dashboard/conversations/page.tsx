"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/app/components/DashboardNav";
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
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
        transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
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
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ConversationDrawer({
  convo,
  onClose,
}: {
  convo: Conversation;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative w-full max-w-lg h-full bg-[#0d0d0f] border-l border-zinc-800/80 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">Session</p>
            </div>
            <p className="text-zinc-400 text-xs font-mono mt-0.5 truncate max-w-[260px]">
              {convo.session_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 flex items-center justify-center transition-colors"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-800/40 flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
              <path stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="9" stroke="#71717a" strokeWidth="1.5" />
            </svg>
            <span className="text-zinc-500 text-xs">{timeAgo(convo.created_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
              <path stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M8 8h4" />
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#71717a" strokeWidth="1.5" />
            </svg>
            <span className="text-zinc-500 text-xs">{convo.messages.length} messages</span>
          </div>
          {convo.lead_email && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">{convo.lead_email}</span>
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
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
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
  const [headerVisible, setHeaderVisible] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Load business ID
  useEffect(() => {
    async function load() {
      const sb = getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session?.user) return;
      const { data } = await sb
        .from("businesses")
        .select("id")
        .eq("user_id", session.user.id)
        .single();
      if (data) setBusinessId((data as { id: string }).id);
    }
    load();
  }, []);

  // Load conversations
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
  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0);

  return (
    <div className="min-h-screen bg-[#080809] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/4 rounded-full blur-[120px]" />
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
            background: "radial-gradient(ellipse at center, transparent 40%, #080809 100%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* Header */}
          <div
            className="mb-8 sm:mb-10"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
              transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-medium">Inbox</p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-3">
              Conversations
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Every chat your AI agent has had — browse history, review leads, and read full transcripts.
            </p>
          </div>

          {/* Stats row */}
          <AnimatedCard delay={100} className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            {[
              { label: "Total Chats", value: conversations.length, icon: "💬", color: "text-blue-400" },
              { label: "Leads Captured", value: totalLeads, icon: "🎯", color: "text-emerald-400" },
              { label: "Total Messages", value: totalMessages, icon: "✉️", color: "text-violet-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm"
              >
                <div className="text-lg sm:text-2xl mb-1">{stat.icon}</div>
                <div className={`text-xl sm:text-3xl font-bold tabular-nums ${stat.color}`}>
                  {loading ? "—" : stat.value}
                </div>
                <div className="text-zinc-600 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </AnimatedCard>

          {/* Filters + Search */}
          <AnimatedCard delay={200} className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900/60 border border-zinc-800/80 rounded-xl backdrop-blur-sm">
              {(["all", "leads"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                    filter === f
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {f === "all" ? "All chats" : `Leads (${totalLeads})`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by email, session or message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
          </AnimatedCard>

          {/* Conversation list */}
          <AnimatedCard delay={300}>
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-zinc-600 text-sm">Loading conversations...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="text-4xl">
                    {filter === "leads" ? "🎯" : "💬"}
                  </div>
                  <p className="text-zinc-400 text-sm font-medium">
                    {filter === "leads" ? "No leads captured yet" : search ? "No results found" : "No conversations yet"}
                  </p>
                  <p className="text-zinc-600 text-xs text-center max-w-xs">
                    {filter === "leads"
                      ? "When visitors share their email, they'll appear here."
                      : search
                      ? "Try a different search term."
                      : "Once visitors chat with your agent, conversations will appear here."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {filtered.map((convo, i) => {
                    const lastMsg = convo.messages[convo.messages.length - 1];
                    const userMessages = convo.messages.filter((m) => m.role === "user").length;
                    return (
                      <button
                        key={convo.id}
                        onClick={() => setSelected(convo)}
                        className="w-full text-left px-4 sm:px-5 py-4 hover:bg-zinc-800/40 transition-colors group flex items-start gap-3 sm:gap-4"
                        style={{
                          animationDelay: `${i * 30}ms`,
                        }}
                      >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-600 transition-colors">
                          <span className="text-sm">{convo.lead_email ? "🎯" : "👤"}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-zinc-200 text-sm font-medium truncate">
                                {convo.lead_email ?? "Anonymous visitor"}
                              </span>
                              {convo.lead_email && (
                                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs flex-shrink-0">
                                  Lead
                                </span>
                              )}
                            </div>
                            <span className="text-zinc-600 text-xs flex-shrink-0">
                              {timeAgo(convo.created_at)}
                            </span>
                          </div>

                          <p className="text-zinc-500 text-xs truncate mb-2">
                            {lastMsg?.content ?? "No messages"}
                          </p>

                          <div className="flex items-center gap-3">
                            <span className="text-zinc-700 text-xs">{convo.messages.length} messages</span>
                            <span className="text-zinc-700 text-xs">·</span>
                            <span className="text-zinc-700 text-xs">{userMessages} from visitor</span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <svg
                          className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors flex-shrink-0 mt-2.5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Conversation drawer */}
      {selected && (
        <ConversationDrawer convo={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}