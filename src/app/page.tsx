import Link from "next/link";

const FEATURES = [
  {
    icon: "🧠",
    title: "Trained on your business",
    desc: "Paste your website URL and we extract everything — services, pricing, FAQs — and use it to train the agent automatically.",
  },
  {
    icon: "🎯",
    title: "Qualifies every lead",
    desc: "The agent asks the right questions to understand needs, budget, and timeline — so you only talk to the right people.",
  },
  {
    icon: "📧",
    title: "Captures contact info",
    desc: "When a visitor is ready, the agent collects their email and saves it directly to your dashboard.",
  },
  {
    icon: "🔌",
    title: "One-line install",
    desc: "Copy a single script tag and paste it into any website — Webflow, WordPress, Shopify, Framer. Done.",
  },
  {
    icon: "⚡",
    title: "Always on",
    desc: "Your agent works nights, weekends, and holidays — responding instantly when you're not available.",
  },
  {
    icon: "📊",
    title: "Live dashboard",
    desc: "See every conversation, every lead captured, and your agent's status — all in one clean dashboard.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Add your website URL",
    desc: "We scrape your site and use it to train your agent on your products, services, and tone.",
  },
  {
    n: "02",
    title: "Customize the agent",
    desc: "Pick a personality, set your agent's name, and configure what it should focus on.",
  },
  {
    n: "03",
    title: "Paste the embed code",
    desc: "Copy a one-line script tag into your website and your AI agent goes live instantly.",
  },
];

const PRICING_FEATURES = [
  "1 AI sales agent",
  "Unlimited conversations",
  "Lead capture & dashboard",
  "Website scraper & auto-training",
  "One-line embed for any site",
  "14-day free trial",
  "Email support",
];

const CHAT = [
  { from: "agent", text: "Hi! 👋 How can I help you today?" },
  { from: "user", text: "What does your enterprise plan include?" },
  {
    from: "agent",
    text: "Great question! Our enterprise plan includes unlimited seats, SSO, priority support, and a dedicated onboarding call. Want me to walk you through it?",
  },
  { from: "user", text: "Yes — what's the pricing?" },
  {
    from: "agent",
    text: "It starts at $499/mo. I can connect you with our team — what's your email?",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080809] text-white font-sans antialiased overflow-x-hidden">
      {/* Global background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/6 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-cyan-600/4 rounded-full blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.013]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, transparent 50%, #080809 100%)",
          }}
        />
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 py-4 border-b border-zinc-800/50 bg-[#080809]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/30">
            S
          </div>
          <span className="font-bold text-sm tracking-tight">SalesAgent</span>
        </div>

        {/* Desktop nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-zinc-500 hover:text-zinc-200 text-sm transition-colors"
          >
            Features
          </a>
          <a
            href="#how"
            className="text-zinc-500 hover:text-zinc-200 text-sm transition-colors"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-zinc-500 hover:text-zinc-200 text-sm transition-colors"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="text-zinc-400 hover:text-white text-sm transition-colors hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="text-xs sm:text-sm bg-white text-black font-bold px-4 sm:px-5 py-2 rounded-xl hover:bg-zinc-100 transition-all active:scale-95 shadow-lg shadow-white/10"
          >
            Get started →
          </Link>
        </div>
      </nav>

      <div className="relative z-10">
        {/* ── HERO ── */}
        <section className="flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-32 sm:pt-44 pb-16 sm:pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2.5 bg-zinc-900/80 border border-zinc-800 rounded-full px-4 sm:px-5 py-2 text-xs text-zinc-400 mb-8 sm:mb-10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span>Powered by Claude AI · Live on 200+ sites</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-5 sm:mb-7">
              Your AI sales agent,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400">
                live in minutes
              </span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Paste your website URL. We train an AI agent on your business. It
              qualifies leads, answers questions, and books meetings —{" "}
              <span className="text-zinc-300">24/7, on autopilot.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
              <Link
                href="/login"
                className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 sm:px-10 py-4 rounded-xl text-sm transition-all shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 active:scale-95 overflow-hidden text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative">Start free trial →</span>
              </Link>
              <a
                href="#how"
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-sm transition-colors group"
              >
                See how it works
                <svg
                  className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M12 5v14m-7-7 7 7 7-7"
                  />
                </svg>
              </a>
            </div>
            <p className="text-zinc-700 text-xs">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </section>

        {/* ── CHAT PREVIEW ── */}
        <section className="flex justify-center px-5 sm:px-6 pb-20 sm:pb-32">
          <div className="relative w-full max-w-[360px]">
            <div
              className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-150 animate-pulse"
              style={{ animationDuration: "4s" }}
            />
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full blur-lg" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-500/20 rounded-full blur-lg" />

            <div
              className="relative flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                      S
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-none">
                      Sales Assistant
                    </p>
                    <p className="text-blue-200 text-xs mt-0.5">
                      Online · Typically replies instantly
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((c) => (
                    <div
                      key={c}
                      className={`w-2.5 h-2.5 rounded-full ${c} opacity-80`}
                    />
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="bg-zinc-950/90 backdrop-blur-sm p-4 space-y-3">
                {CHAT.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.from === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-zinc-800/80 text-zinc-200 rounded-bl-sm border border-zinc-700/50"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div className="flex justify-start">
                  <div className="bg-zinc-800/80 border border-zinc-700/50 px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/90 border-t border-zinc-800/60 px-3 py-3 flex gap-2 backdrop-blur-sm">
                <div className="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2 text-xs text-zinc-600">
                  Type a message...
                </div>
                <div className="bg-blue-600 text-white text-xs px-3.5 py-2 rounded-xl font-semibold cursor-pointer hover:bg-blue-500 transition-colors">
                  Send
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section
          id="features"
          className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-5xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-5 sm:mb-6">
              <span className="w-1 h-1 bg-blue-400 rounded-full" />
              Features
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Everything you need to
              <br className="hidden sm:block" /> close more deals
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg">
              Set up in under 5 minutes. No engineers required.
            </p>
          </div>

          {/* 1 col mobile, 2 cols sm, 3 cols lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 backdrop-blur-sm overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(300px circle at 50% 0%, rgba(59,130,246,0.04), transparent 70%)",
                  }}
                />
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-xl mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">
                  {f.title}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          id="how"
          className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-3xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-5 sm:mb-6">
              <span className="w-1 h-1 bg-violet-400 rounded-full" />
              How it works
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Up and running
              <br />
              in 3 steps
            </h2>
            <p className="text-zinc-500">No technical knowledge needed.</p>
          </div>

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <div key={step.n} className="flex gap-5 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <span className="text-zinc-500 text-xs sm:text-sm font-bold font-mono">
                      {step.n}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-zinc-700 to-transparent my-2" />
                  )}
                </div>
                <div
                  className={`pb-8 sm:pb-10 ${i === STEPS.length - 1 ? "pb-0" : ""}`}
                >
                  <h3 className="font-bold text-white text-base sm:text-lg mb-2 mt-2">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section
          id="pricing"
          className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-sm mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-5 sm:mb-6">
            <span className="w-1 h-1 bg-amber-400 rounded-full" />
            Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
            Simple pricing
          </h2>
          <p className="text-zinc-500 mb-8 sm:mb-10">
            One plan. Everything included.
          </p>

          <div className="relative bg-zinc-900/80 border border-blue-500/30 rounded-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-40 bg-blue-500/8 blur-3xl" />

            <div className="relative mb-6 sm:mb-7">
              <div className="flex items-end justify-center gap-1.5 mb-1">
                <span className="text-5xl sm:text-6xl font-bold tracking-tight">
                  $49
                </span>
                <span className="text-zinc-500 text-sm mb-2">/mo</span>
              </div>
              <p className="text-zinc-500 text-xs">
                Billed monthly · No contracts
              </p>
            </div>

            <div className="h-px bg-zinc-800/80 mb-6 sm:mb-7" />

            <ul className="text-left space-y-3 mb-7 sm:mb-8">
              {PRICING_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <span className="text-emerald-400 text-xs font-bold">
                      ✓
                    </span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="group relative block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-blue-600/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <span className="relative">Start free trial →</span>
            </Link>
            <p className="text-zinc-700 text-xs mt-3">
              No credit card required
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800/60 rounded-3xl px-6 sm:px-8 py-14 sm:py-20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="absolute inset-0 bg-blue-600/3 rounded-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-6 sm:mb-8">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Join 200+ businesses
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
                Ready to turn visitors
                <br />
                into customers?
              </h2>
              <p className="text-zinc-500 mb-8 sm:mb-10 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Deploy your AI sales agent today and start qualifying leads
                while you sleep.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/login"
                  className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 sm:px-12 py-4 rounded-xl text-sm transition-all shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 active:scale-95 overflow-hidden text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Get started free →</span>
                </Link>
              </div>
              <p className="text-zinc-700 text-xs mt-5">
                No credit card required · Setup in 5 minutes
              </p>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-zinc-800/60 px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 text-zinc-600 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-500/30">
              S
            </div>
            <span className="text-zinc-500 font-medium">SalesAgent</span>
          </div>
          <div className="flex items-center gap-5 sm:gap-6 text-zinc-700">
            <a
              href="#features"
              className="hover:text-zinc-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-zinc-400 transition-colors"
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="hover:text-zinc-400 transition-colors"
            >
              Login
            </Link>
          </div>
          <p className="text-center sm:text-right">
            © 2026 SalesAgent. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
