"use client";

import { useState, useEffect } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import Reveal from "@/app/components/Reveal";
import { getBusinessId } from "@/lib/supabase";

const PLATFORMS = [
  { name: "Webflow", path: "Project Settings → Custom Code → Footer Code" },
  { name: "WordPress", path: "Appearance → Theme Editor → footer.php" },
  { name: "Shopify", path: "Online Store → Themes → Edit Code → theme.liquid" },
  { name: "Framer", path: "Site Settings → Custom Code → End of body tag" },
  { name: "Wix", path: "Settings → Custom Code → Add to all pages (body)" },
];

const STEPS = [
  {
    n: "1",
    title: "Copy the snippet",
    desc: "Click Copy above to grab your embed code.",
  },
  {
    n: "2",
    title: "Open your site's HTML",
    desc: "Go to your website builder, CMS, or codebase.",
  },
  {
    n: "3",
    title: "Paste before </body>",
    desc: "Drop the snippet just before the closing body tag on every page.",
  },
  {
    n: "4",
    title: "Publish",
    desc: "Save and deploy — the chat bubble appears bottom-right instantly.",
  },
];

export default function EmbedPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getBusinessId().then((id) => {
      if (id) setBusinessId(id);
    });
  }, []);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://yourapp.com";

  const embedCode = `<!-- Saim Widget -->
<script>
  window.SaimConfig = {
    businessId: "${businessId ?? "loading..."}",
    baseUrl: "${appUrl}"
  };
  (function(d, s) {
    var js = d.createElement(s);
    js.src = "${appUrl}/widget.js";
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
    <div className="min-h-screen bg-[#08090b] text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <DashboardNav />

        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Header */}
          <Reveal distance={20} className="mb-7">
            <h1 className="text-[22px] sm:text-2xl font-semibold tracking-tight text-white mb-1">
              Embed your agent
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              One snippet. Paste it before the closing{" "}
              <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-[12px] font-mono">
                &lt;/body&gt;
              </code>{" "}
              tag and your agent goes live.
            </p>
          </Reveal>

          <div className="space-y-4">
            {/* Code block */}
            <Reveal delay={60}>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-zinc-800/60">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    </div>
                    <span className="text-zinc-600 text-[12px] font-mono">
                      embed.html
                    </span>
                  </div>
                  <button
                    onClick={copy}
                    disabled={!businessId}
                    className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-md font-medium transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${copied ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300"}`}
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
                        Copied
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
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Code */}
                <div className="overflow-x-auto">
                  <pre className="p-4 sm:p-5 text-[12px] font-mono leading-relaxed">
                    <code>
                      {embedCode.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="w-6 sm:w-7 shrink-0 text-zinc-700 select-none text-right mr-3">
                            {i + 1}
                          </span>
                          <span
                            className={
                              line.includes("<!--")
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
                <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-t border-zinc-800/60 bg-zinc-950/40">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${businessId ? "bg-emerald-400" : "bg-zinc-600 animate-pulse"}`}
                  />
                  <span className="text-zinc-600 text-[12px] shrink-0">
                    Business ID
                  </span>
                  <code
                    className={`text-[12px] font-mono truncate ${businessId ? "text-zinc-400" : "text-zinc-600"}`}
                  >
                    {businessId ?? "Loading…"}
                  </code>
                </div>
              </div>
            </Reveal>

            {/* Install steps */}
            <Reveal delay={80}>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
                <div className="mb-5">
                  <h3 className="font-semibold text-white text-[15px]">
                    Installation
                  </h3>
                  <p className="text-zinc-500 text-[13px] mt-0.5">
                    Under two minutes, start to finish.
                  </p>
                </div>
                <div className="space-y-0">
                  {STEPS.map((step, i) => (
                    <div key={step.n} className="flex gap-3.5">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-md bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0">
                          <span className="text-zinc-400 text-[12px] font-medium tabular-nums">
                            {step.n}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className="w-px flex-1 bg-zinc-800 my-1" />
                        )}
                      </div>
                      <div className={i === STEPS.length - 1 ? "" : "pb-4"}>
                        <p className="text-[13px] font-medium text-zinc-200 mb-0.5 mt-0.5">
                          {step.title}
                        </p>
                        <p className="text-zinc-500 text-[12px] leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Platform tips */}
            <Reveal delay={80}>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
                <div className="mb-4">
                  <h3 className="font-semibold text-white text-[15px]">
                    Where to paste
                  </h3>
                  <p className="text-zinc-500 text-[13px] mt-0.5">
                    Common builders and where the snippet goes.
                  </p>
                </div>
                <div className="space-y-1.5">
                  {PLATFORMS.map((p) => (
                    <div
                      key={p.name}
                      className="group flex items-center gap-3 px-3 py-2.5 bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-800/60 hover:border-zinc-700 rounded-lg transition-colors"
                    >
                      <span className="text-zinc-200 text-[13px] font-medium w-20 shrink-0">
                        {p.name}
                      </span>
                      <p className="text-zinc-500 text-[12px] font-mono truncate flex-1 hidden sm:block">
                        {p.path}
                      </p>
                      <p className="text-zinc-500 text-[12px] font-mono truncate flex-1 sm:hidden">
                        {p.path.split(" → ").pop()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Help note */}
            <Reveal delay={80}>
              <div className="flex items-start gap-2.5 px-4 py-3.5 bg-blue-500/[0.06] border border-blue-500/15 rounded-xl">
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="shrink-0 mt-0.5"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                  />
                  <path
                    stroke="#60a5fa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M12 8v.01M12 11v5"
                  />
                </svg>
                <p className="text-zinc-400 text-[13px] leading-relaxed">
                  Configure your agent first — add your website URL on the{" "}
                  <span className="text-zinc-200 font-medium">Setup</span> page
                  before embedding. The widget won't respond without it.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
