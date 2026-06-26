"use client";

import { useState, useEffect } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import Reveal from "@/app/components/Reveal";
import { getSupabase, getBusinessId } from "@/lib/supabase";

const PERSONAS = [
  {
    value: "friendly and professional",
    label: "Friendly & professional",
    desc: "Warm, helpful, builds trust",
  },
  {
    value: "direct and concise",
    label: "Direct & concise",
    desc: "Gets to the point fast",
  },
  {
    value: "enthusiastic and energetic",
    label: "Enthusiastic & energetic",
    desc: "High energy, exciting",
  },
  {
    value: "warm and consultative",
    label: "Warm & consultative",
    desc: "Advisory, thoughtful",
  },
];

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#dc2626",
  "#059669",
  "#d97706",
  "#0891b2",
  "#db2777",
  "#000000",
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-colors">
      <div className="mb-3.5">
        <label className="block text-[13px] font-medium text-zinc-200">
          {label}
        </label>
        <p className="text-zinc-500 text-[12px] mt-0.5">{hint}</p>
      </div>
      {children}
    </div>
  );
}

export default function SetupPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [persona, setPersona] = useState(PERSONAS[0].value);
  const [agentName, setAgentName] = useState("Sales Assistant");
  const [widgetColor, setWidgetColor] = useState("#2563eb");
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scraped, setScraped] = useState(false);
  const [preview, setPreview] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingBiz, setLoadingBiz] = useState(true);

  useEffect(() => {
    async function loadBusiness() {
      const id = await getBusinessId();
      if (!id) {
        setLoadingBiz(false);
        return;
      }
      setBusinessId(id);

      const { data } = await getSupabase()
        .from("businesses")
        .select(
          "id, name, website_url, agent_persona, scraped_content, description, agent_name, widget_color",
        )
        .eq("id", id)
        .maybeSingle();

      if (data) {
        const d = data as {
          id: string;
          name: string;
          website_url: string;
          agent_persona: string;
          scraped_content: string | null;
          description: string | null;
          agent_name?: string;
          widget_color?: string;
        };
        setName(d.name || "");
        setUrl(d.website_url || "");
        setPersona(d.agent_persona || PERSONAS[0].value);
        setDescription(d.description || "");
        setAgentName(d.agent_name || "Sales Assistant");
        setWidgetColor(d.widget_color || "#2563eb");
        if (d.scraped_content) {
          setScraped(true);
          setPreview(d.scraped_content.slice(0, 300));
          setCharCount(d.scraped_content.length);
        }
      }
      setLoadingBiz(false);
    }
    loadBusiness();
  }, []);

  const handleScrape = async () => {
    if (!url || !businessId) return;
    setError("");
    setSuccess("");
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, businessId }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setScraped(true);
        setPreview(data.preview);
        setCharCount(data.characters || 0);
        setSuccess("Website content loaded.");
      }
    } catch {
      setError("Couldn't read that website. Check the URL and try again.");
    } finally {
      setScraping(false);
    }
  };

  const handleSave = async () => {
    if (!businessId) return;
    setError("");
    setSuccess("");
    setSaving(true);
    const { error } = await getSupabase()
      .from("businesses")
      .update({
        name,
        website_url: url,
        agent_persona: persona,
        description,
        agent_name: agentName,
        widget_color: widgetColor,
      })
      .eq("id", businessId);
    if (error) setError("Couldn't save your settings. Try again.");
    else setSuccess("Settings saved.");
    setSaving(false);
  };

  const descWordCount = description.trim()
    ? description.trim().split(/\s+/).length
    : 0;

  const inputCls =
    "w-full bg-zinc-800/60 border border-zinc-700/80 focus:border-blue-500/60 rounded-lg px-3.5 py-2.5 text-[13px] text-white placeholder:text-zinc-600 outline-none transition-colors focus:bg-zinc-800";

  return (
    <div className="min-h-screen bg-[#08090b] text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Header */}
          <Reveal distance={20}>
            <div className="mb-7">
              <h1 className="text-[22px] sm:text-2xl font-semibold tracking-tight text-white mb-1">
                Agent setup
              </h1>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Train your agent on your business so it can qualify leads and
                answer questions around the clock.
              </p>
            </div>
          </Reveal>

          {/* Step indicators */}
          <Reveal delay={60}>
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              {[
                { n: "1", label: "Name", done: !!name },
                { n: "2", label: "Description", done: !!description },
                { n: "3", label: "Website", done: scraped },
                { n: "4", label: "Personality", done: true },
              ].map((step, i) => (
                <div key={step.n} className="flex items-center gap-2 shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[12px] font-medium whitespace-nowrap transition-colors ${step.done ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-zinc-900/60 border-zinc-800 text-zinc-500"}`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${step.done ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"}`}
                    >
                      {step.done ? "✓" : step.n}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                  {i < 3 && <div className="w-4 h-px bg-zinc-800 shrink-0" />}
                </div>
              ))}
            </div>
          </Reveal>

          {loadingBiz ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 animate-pulse"
                >
                  <div className="w-28 h-3.5 bg-zinc-800 rounded mb-3" />
                  <div className="w-full h-9 bg-zinc-800 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Business Name */}
              <Reveal delay={80}>
                <Field
                  label="Business name"
                  hint="How should the agent refer to your company?"
                >
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Acme Inc."
                    className={inputCls}
                  />
                </Field>
              </Reveal>

              {/* Description */}
              <Reveal delay={80}>
                <Field
                  label="Business description"
                  hint="What your business does — this is the agent's core knowledge."
                >
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="We're a SaaS company helping e-commerce brands automate support with AI. Our chat widget integrates with Shopify and cuts support tickets by 60%…"
                    rows={5}
                    className={`${inputCls} resize-none leading-relaxed overflow-hidden`}
                    style={{ minHeight: "110px" }}
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.style.height = "auto";
                      t.style.height = t.scrollHeight + "px";
                    }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-zinc-600 text-[12px]">
                      The more detail, the better the answers.
                    </p>
                    <span
                      className={`text-[12px] tabular-nums ${descWordCount > 20 ? "text-emerald-500" : "text-zinc-600"}`}
                    >
                      {descWordCount} words
                    </span>
                  </div>
                </Field>
              </Reveal>

              {/* Website */}
              <Reveal delay={80}>
                <Field
                  label="Website content"
                  hint="We'll read your site and use it to train the agent."
                >
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                      className={`flex-1 ${inputCls}`}
                    />
                    <button
                      onClick={handleScrape}
                      disabled={scraping || !url || !businessId}
                      className="sm:w-auto w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-[13px] font-medium rounded-lg transition-colors active:scale-[0.98] whitespace-nowrap disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                          Reading…
                        </>
                      ) : scraped ? (
                        "Re-scan"
                      ) : (
                        "Load site"
                      )}
                    </button>
                  </div>
                  {scraped && preview && (
                    <div className="bg-zinc-800/40 border border-zinc-700/60 rounded-lg p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <p className="text-emerald-400 text-[12px] font-medium">
                            Content loaded
                          </p>
                        </div>
                        <span className="text-zinc-600 text-[12px]">
                          {charCount.toLocaleString()} chars
                        </span>
                      </div>
                      <p className="text-zinc-500 text-[12px] leading-relaxed line-clamp-3">
                        {preview}…
                      </p>
                    </div>
                  )}
                </Field>
              </Reveal>

              {/* Agent Name */}
              <Reveal delay={80}>
                <Field
                  label="Agent name"
                  hint="What should the chat widget call your agent?"
                >
                  <input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Sales Assistant"
                    className={inputCls}
                  />
                </Field>
              </Reveal>

              {/* Widget Color */}
              <Reveal delay={80}>
                <Field
                  label="Widget color"
                  hint="The main color for your chat widget."
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="color"
                      value={widgetColor}
                      onChange={(e) => setWidgetColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-700 bg-transparent p-0.5 shrink-0"
                    />
                    <div className="flex items-center gap-1.5 flex-1">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setWidgetColor(c)}
                          className="w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 active:scale-95 shrink-0"
                          style={{
                            backgroundColor: c,
                            borderColor:
                              widgetColor === c ? "#fff" : "transparent",
                          }}
                        />
                      ))}
                    </div>
                    <code className="text-zinc-500 text-[12px] font-mono">
                      {widgetColor}
                    </code>
                  </div>
                  {/* Preview */}
                  <div className="mt-3.5 flex items-center gap-3 p-3 bg-zinc-800/40 rounded-lg">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: widgetColor }}
                    >
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#fff"
                          d="M12 3C6.477 3 2 6.925 2 11.75c0 2.412 1.064 4.593 2.793 6.15L4 21l3.578-1.433C8.944 20.166 10.43 20.5 12 20.5c5.523 0 10-3.925 10-8.75S17.523 3 12 3Z"
                        />
                      </svg>
                    </div>
                    <div
                      className="flex-1 h-7 rounded-md flex items-center px-3"
                      style={{ backgroundColor: widgetColor }}
                    >
                      <span className="text-white text-[12px] font-medium">
                        {agentName}
                      </span>
                    </div>
                    <span className="text-zinc-600 text-[12px]">Preview</span>
                  </div>
                </Field>
              </Reveal>

              {/* Persona */}
              <Reveal delay={80}>
                <Field
                  label="Personality"
                  hint="How should your agent talk to visitors?"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PERSONAS.map((p) => {
                      const active = persona === p.value;
                      return (
                        <button
                          key={p.value}
                          onClick={() => setPersona(p.value)}
                          className={`relative text-left px-3.5 py-3 rounded-lg transition-colors border ${active ? "bg-blue-600/15 border-blue-500/50" : "bg-zinc-800/40 border-zinc-700/60 hover:border-zinc-600 hover:bg-zinc-800/70"}`}
                        >
                          <p
                            className={`font-medium text-[13px] mb-0.5 ${active ? "text-blue-300" : "text-zinc-200"}`}
                          >
                            {p.label}
                          </p>
                          <p className="text-zinc-500 text-[12px]">{p.desc}</p>
                          {active && (
                            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
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
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </Reveal>

              {/* Feedback */}
              {error && (
                <div className="flex items-start gap-2.5 text-red-400 bg-red-500/[0.07] border border-red-500/20 rounded-lg px-4 py-3">
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="shrink-0 mt-0.5"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                    />
                  </svg>
                  <p className="text-[13px]">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2.5 text-emerald-400 bg-emerald-500/[0.07] border border-emerald-500/20 rounded-lg px-4 py-3">
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="shrink-0"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-[13px] font-medium">{success}</p>
                </div>
              )}

              {/* Save */}
              <Reveal delay={80}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium py-3 rounded-lg text-[13px] transition-colors active:scale-[0.99] disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
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
                      Saving…
                    </>
                  ) : (
                    "Save settings"
                  )}
                </button>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
