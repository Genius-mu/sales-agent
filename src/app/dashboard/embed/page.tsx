"use client";

import { useState } from "react";
import DashboardNav from "@/app/components/DashboardNav";
import { Button } from "@/app/components/Button";

const BUSINESS_ID = "3f6505b0-ac65-487e-8dee-f3b2cd9d73fa";

export default function EmbedPage() {
  const [copied, setCopied] = useState(false);

  const embedCode = `<!-- SalesAgent Widget -->
<script>
  window.SalesAgentConfig = { businessId: "${BUSINESS_ID}" };
  (function(d, s) {
    var js = d.createElement(s);
    js.src = "https://yourapp.com/widget.js";
    js.async = true;
    d.body.appendChild(js);
  })(document, "script");
</script>`;

  const copy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <DashboardNav />
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Embed Your Agent
          </h1>
          <p className="text-zinc-400 text-sm">
            Paste this snippet before the closing{" "}
            <code className="text-blue-400">&lt;/body&gt;</code> tag on any
            website.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
              <span className="text-zinc-400 text-xs font-mono">
                embed snippet
              </span>
              <Button
                onClick={copy}
                size="sm"
                className={`text-xs h-7 px-3 transition-all ${copied ? "bg-green-600 hover:bg-green-600" : "bg-zinc-700 hover:bg-zinc-600"}`}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="p-5 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
              {embedCode}
            </pre>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">How to install</h3>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Copy the snippet above",
                  desc: "Click the Copy button to copy the embed code.",
                },
                {
                  step: "2",
                  title: "Open your website's HTML",
                  desc: "Go to your website builder or CMS and find your site's HTML.",
                },
                {
                  step: "3",
                  title: "Paste before </body>",
                  desc: "Paste the snippet just before the closing body tag on every page you want the agent to appear.",
                },
                {
                  step: "4",
                  title: "Publish your site",
                  desc: "Save and publish — the chat widget will appear in the bottom-right corner.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-3">
              Quick tips by platform
            </h3>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>
                <span className="text-zinc-200 font-medium">Webflow:</span>{" "}
                Project Settings → Custom Code → Footer Code
              </p>
              <p>
                <span className="text-zinc-200 font-medium">WordPress:</span>{" "}
                Appearance → Theme Editor → footer.php
              </p>
              <p>
                <span className="text-zinc-200 font-medium">Shopify:</span>{" "}
                Online Store → Themes → Edit Code → theme.liquid
              </p>
              <p>
                <span className="text-zinc-200 font-medium">Framer:</span> Site
                Settings → Custom Code → End of body tag
              </p>
              <p>
                <span className="text-zinc-200 font-medium">Wix:</span> Settings
                → Custom Code → Add to all pages (body)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
