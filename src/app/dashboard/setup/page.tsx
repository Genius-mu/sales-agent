"use client";

import { useState, useEffect } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import { getSupabase } from "@/lib/supabase";

const BUSINESS_ID = "3f6505b0-ac65-487e-8dee-f3b2cd9d73fa";

const PERSONAS = [
  {
    value: "friendly and professional",
    label: "Friendly & Professional",
    icon: "🤝",
    desc: "Warm, helpful, builds trust",
  },
  {
    value: "direct and concise",
    label: "Direct & Concise",
    icon: "⚡",
    desc: "Gets to the point fast",
  },
  {
    value: "enthusiastic and energetic",
    label: "Enthusiastic & Energetic",
    icon: "🚀",
    desc: "High energy, exciting",
  },
  {
    value: "warm and consultative",
    label: "Warm & Consultative",
    icon: "💡",
    desc: "Advisory, thoughtful",
  },
];

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition:
          "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}

export default function SetupPage() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [persona, setPersona] = useState(PERSONAS[0].value);
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scraped, setScraped] = useState(false);
  const [preview, setPreview] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function loadBusiness() {
      const { data } = await getSupabase()
        .from("businesses")
        .select("name, website_url, agent_persona, scraped_content")
        .eq("id", BUSINESS_ID)
        .single();
      if (data) {
        const d = data as {
          name: string;
          website_url: string;
          agent_persona: string;
          scraped_content: string | null;
        };
        setName(d.name || "");
        setUrl(d.website_url || "");
        setPersona(d.agent_persona || PERSONAS[0].value);
        if (d.scraped_content) {
          setScraped(true);
          setPreview(d.scraped_content.slice(0, 300));
          setCharCount(d.scraped_content.length);
        }
      }
    }
    loadBusiness();
  }, []);

  const handleScrape = async () => {
    if (!url) return;
    setError("");
    setSuccess("");
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, businessId: BUSINESS_ID }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setScraped(true);
        setPreview(data.preview);
        setCharCount(data.characters || 0);
        setSuccess("Website content loaded successfully");
      }
    } catch {
      setError("Failed to scrape website. Check the URL and try again.");
    } finally {
      setScraping(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    const { error } = await getSupabase()
      .from("businesses")
      .update({ name, agent_persona: persona })
      .eq("id", BUSINESS_ID);
    if (error) setError("Failed to save settings.");
    else setSuccess("Settings saved successfully!");
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#080809] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/4 rounded-full blur-[110px]" />
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

        <div className="max-w-2xl mx-auto px-8 py-12">
          {/* Header */}
          <div
            className="mb-12"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-medium">
                Configuration
              </p>
            </div>
            <h1 className="text-5xl font-bold tracking-tight leading-none mb-3">
              Agent Setup
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Train your agent with your business info so it can qualify leads
              and answer questions 24/7.
            </p>
          </div>

          {/* Step indicators */}
          <AnimatedSection delay={100}>
            <div className="flex items-center gap-3 mb-8">
              {[
                { n: "1", label: "Business Name", done: !!name },
                { n: "2", label: "Website Content", done: scraped },
                { n: "3", label: "Personality", done: true },
              ].map((step, i) => (
                <div key={step.n} className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 ${step.done ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${step.done ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"}`}
                    >
                      {step.done ? "✓" : step.n}
                    </span>
                    {step.label}
                  </div>
                  {i < 2 && <div className="w-6 h-px bg-zinc-800" />}
                </div>
              ))}
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {/* Business Name */}
            <AnimatedSection delay={200}>
              <div className="group bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm">
                    🏢
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-200">
                      Business Name
                    </label>
                    <p className="text-zinc-600 text-xs">
                      How should the agent refer to your company?
                    </p>
                  </div>
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full bg-zinc-800/80 border border-zinc-700/80 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 focus:bg-zinc-800 focus:shadow-lg focus:shadow-blue-500/5"
                />
              </div>
            </AnimatedSection>

            {/* Website URL */}
            <AnimatedSection delay={300}>
              <div className="group bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm">
                    🌐
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-200">
                      Website Content
                    </label>
                    <p className="text-zinc-600 text-xs">
                      We'll read your site and use it to train the agent
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                    className="flex-1 bg-zinc-800/80 border border-zinc-700/80 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 focus:bg-zinc-800"
                  />
                  <button
                    onClick={handleScrape}
                    disabled={scraping || !url}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-blue-500/20 whitespace-nowrap disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {scraping ? (
                      <>
                        <svg
                          className="animate-spin w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Reading...
                      </>
                    ) : scraped ? (
                      "Re-scrape"
                    ) : (
                      "Load Site"
                    )}
                  </button>
                </div>

                {scraped && preview && (
                  <div className="relative bg-zinc-800/50 border border-zinc-700/60 rounded-xl p-4 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/60 to-transparent rounded-t-xl" />
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <p className="text-emerald-400 text-xs font-semibold">
                          Content loaded
                        </p>
                      </div>
                      <span className="text-zinc-600 text-xs">
                        {charCount.toLocaleString()} characters
                      </span>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
                      {preview}…
                    </p>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Persona */}
            <AnimatedSection delay={400}>
              <div className="group bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm">
                    🎭
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-200">
                      Agent Personality
                    </label>
                    <p className="text-zinc-600 text-xs">
                      How should your agent communicate with visitors?
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PERSONAS.map((p) => {
                    const active = persona === p.value;
                    return (
                      <button
                        key={p.value}
                        onClick={() => setPersona(p.value)}
                        className={`relative group/btn text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 border overflow-hidden ${active ? "bg-blue-600/15 border-blue-500/50 text-white" : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 hover:bg-zinc-800"}`}
                      >
                        {active && (
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                        )}
                        <div className="flex items-start gap-3">
                          <span className="text-base mt-0.5">{p.icon}</span>
                          <div>
                            <p
                              className={`font-semibold text-xs mb-0.5 ${active ? "text-blue-300" : "text-zinc-300"}`}
                            >
                              {p.label}
                            </p>
                            <p className="text-zinc-600 text-xs">{p.desc}</p>
                          </div>
                        </div>
                        {active && (
                          <div className="absolute top-3 right-3">
                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                              <svg
                                width="8"
                                height="8"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>

            {/* Feedback */}
            {error && (
              <AnimatedSection delay={0}>
                <div className="flex items-start gap-3 text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
                  <span className="text-base mt-0.5 shrink-0">⚠</span>
                  <p className="text-sm">{error}</p>
                </div>
              </AnimatedSection>
            )}
            {success && (
              <AnimatedSection delay={0}>
                <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <span className="text-base shrink-0">✓</span>
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </AnimatedSection>
            )}

            {/* Save button */}
            <AnimatedSection delay={500}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full relative bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] hover:shadow-xl hover:shadow-blue-500/20 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </span>
              </button>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
