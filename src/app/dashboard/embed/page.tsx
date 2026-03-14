"use client";

import { useState, useEffect } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import { getSupabase } from "@/lib/supabase";

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

const PLATFORMS = [
  {
    name: "Webflow",
    icon: "▲",
    path: "Project Settings → Custom Code → Footer Code",
  },
  {
    name: "WordPress",
    icon: "⚡",
    path: "Appearance → Theme Editor → footer.php",
  },
  {
    name: "Shopify",
    icon: "🛍",
    path: "Online Store → Themes → Edit Code → theme.liquid",
  },
  {
    name: "Framer",
    icon: "◈",
    path: "Site Settings → Custom Code → End of body tag",
  },
  {
    name: "Wix",
    icon: "✦",
    path: "Settings → Custom Code → Add to all pages (body)",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Copy the snippet",
    desc: "Click the Copy button above to grab the embed code.",
  },
  {
    n: "02",
    title: "Open your site HTML",
    desc: "Navigate to your website builder, CMS, or codebase.",
  },
  {
    n: "03",
    title: "Paste before </body>",
    desc: "Drop the snippet just before the closing body tag on every page.",
  },
  {
    n: "04",
    title: "Publish & go live",
    desc: "Save and deploy — the chat bubble appears bottom-right instantly.",
  },
];

export default function EmbedPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

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
        .single();
      if (data) setBusinessId((data as { id: string }).id);
    }
    load();
  }, []);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://yourapp.com";

  const embedCode = `<!-- Saim Widget -->
<script>
  window.SaimConfig = {
    businessId: "${businessId ?? "loading..."}",
    baseUrl: "${appUrl}"gi
  };
  (function(d, s) {
    var js = d.createElement(s);
    js.src = "${appUrl}widget.js";
    js.async = true;
    d.body.appendChild(js);
  })(document, "script");
</script>`;

  const copy = () => {
    if (!businessId) return;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080809] text-white">
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
            background:
              "radial-gradient(ellipse at center, transparent 40%, #080809 100%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div
            className="mb-8 sm:mb-12"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(-12px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-medium">
                Deploy
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-3">
              Embed Agent
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              One snippet. Paste before the closing{" "}
              <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md text-xs font-mono">
                &lt;/body&gt;
              </code>{" "}
              tag and your AI agent goes live instantly.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Code block */}
            <AnimatedSection delay={150}>
              <div className="relative bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-zinc-800/60">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    </div>
                    <span className="text-zinc-600 text-xs font-mono">
                      embed.html
                    </span>
                  </div>
                  <button
                    onClick={copy}
                    disabled={!businessId}
                    className={`flex items-center gap-1.5 sm:gap-2 text-xs px-3 sm:px-4 py-1.5 rounded-lg font-semibold transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${copied ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400" : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300"}`}
                  >
                    {copied ? (
                      <>
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <span className="hidden sm:inline">Copy code</span>
                        <span className="sm:hidden">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code */}
                <div className="overflow-x-auto">
                  <pre className="p-4 sm:p-6 text-xs font-mono leading-relaxed min-w-0">
                    <code>
                      {embedCode.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="w-6 sm:w-8 shrink-0 text-zinc-700 select-none text-right mr-3 sm:mr-4">
                            {i + 1}
                          </span>
                          <span
                            className={
                              line.includes("<!--") || line.includes("//")
                                ? "text-zinc-600"
                                : line.includes("window.")
                                  ? "text-violet-400"
                                  : line.includes('"')
                                    ? "text-emerald-400"
                                    : line.includes("<script") ||
                                        line.includes("</script")
                                      ? "text-blue-400"
                                      : line.includes("var ") ||
                                          line.includes("function")
                                        ? "text-violet-400"
                                        : "text-zinc-300"
                            }
                          >
                            {line || " "}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Business ID badge */}
                <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-t border-zinc-800/60 bg-zinc-950/40 overflow-hidden">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${businessId ? "bg-blue-400" : "bg-zinc-600 animate-pulse"}`}
                  />
                  <span className="text-zinc-600 text-xs shrink-0">
                    Business ID:
                  </span>
                  <code
                    className={`text-xs font-mono truncate ${businessId ? "text-blue-400" : "text-zinc-600"}`}
                  >
                    {businessId ?? "Loading..."}
                  </code>
                </div>
              </div>
            </AnimatedSection>

            {/* Install steps */}
            <AnimatedSection delay={300}>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shrink-0">
                    📋
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      Installation steps
                    </h3>
                    <p className="text-zinc-600 text-xs">
                      Takes less than 2 minutes
                    </p>
                  </div>
                </div>
                <div className="space-y-0">
                  {STEPS.map((step, i) => (
                    <div key={step.n} className="flex gap-3 sm:gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0">
                          <span className="text-blue-400 text-xs font-bold font-mono">
                            {step.n}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className="w-px flex-1 bg-zinc-800/60 my-1" />
                        )}
                      </div>
                      <div
                        className={`pb-4 sm:pb-5 ${i === STEPS.length - 1 ? "pb-0" : ""}`}
                      >
                        <p className="text-sm font-semibold text-zinc-200 mb-1 mt-1">
                          {step.title}
                        </p>
                        <p className="text-zinc-500 text-xs leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Platform tips */}
            <AnimatedSection delay={450}>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shrink-0">
                    🧩
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      Platform guides
                    </h3>
                    <p className="text-zinc-600 text-xs">
                      Where to paste on popular builders
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {PLATFORMS.map((p) => (
                    <div
                      key={p.name}
                      className="group flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-800/60 hover:border-zinc-700 rounded-xl transition-all duration-200 cursor-default"
                    >
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs shrink-0">
                        {p.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-zinc-200 text-xs font-semibold">
                          {p.name}
                        </span>
                        <p className="text-zinc-600 text-xs mt-0.5 font-mono truncate hidden sm:block">
                          {p.path}
                        </p>
                        <p className="text-zinc-600 text-xs mt-0.5 font-mono truncate sm:hidden">
                          {p.path.split(" → ").pop()}
                        </p>
                      </div>
                      <svg
                        className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0"
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
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Help note */}
            <AnimatedSection delay={550}>
              <div className="flex items-start gap-3 px-4 sm:px-5 py-4 bg-blue-500/5 border border-blue-500/15 rounded-2xl">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      d="M12 8v4m0 4h.01"
                    />
                  </svg>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Make sure your agent is{" "}
                  <span className="text-zinc-300 font-medium">
                    configured first
                  </span>{" "}
                  — visit the Setup page to add your website URL before
                  embedding. The widget won't respond without it.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
