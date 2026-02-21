import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <span className="font-semibold text-sm tracking-tight">
            SalesAgent
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/dashboard"
            className="text-sm bg-white text-black font-semibold px-4 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-8">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Powered by Claude AI
          </div>
          <h1 className="text-6xl font-bold tracking-tight leading-tight mb-6">
            Your AI sales agent,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              live on your site in minutes
            </span>
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste your website URL. We train an AI agent on your business. It
            qualifies leads, answers questions, and books meetings — 24/7.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/20"
            >
              Start free trial →
            </Link>
            <a
              href="#features"
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              See how it works ↓
            </a>
          </div>
          <p className="text-zinc-600 text-xs mt-5">
            No credit card required · 14-day free trial
          </p>
        </div>
      </section>

      {/* Widget preview */}
      <section className="flex justify-center px-6 pb-28">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-150" />
          <div className="relative flex flex-col w-[340px] border border-zinc-700/60 rounded-2xl shadow-2xl bg-zinc-900 overflow-hidden">
            <div className="bg-blue-600 px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-semibold">
                Sales Assistant
              </span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { from: "agent", text: "Hi! 👋 How can I help you today?" },
                {
                  from: "user",
                  text: "What does your enterprise plan include?",
                },
                {
                  from: "agent",
                  text: "Great question! Our enterprise plan includes unlimited seats, SSO, priority support, and a dedicated onboarding call. Want me to walk you through it?",
                },
                { from: "user", text: "Yes please — what's the pricing?" },
                {
                  from: "agent",
                  text: "It starts at $499/mo. I can set up a quick call with our team — what's your email?",
                },
              ].map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.from === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-zinc-800 text-zinc-200 rounded-bl-none"}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800 px-3 py-2 flex gap-2">
              <div className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-500">
                Type a message...
              </div>
              <div className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-medium">
                Send
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 pb-28 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Everything you need to close more deals
          </h2>
          <p className="text-zinc-400 text-lg">
            Set up in under 5 minutes. No engineers required.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
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
          ].map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2 text-sm">
                {f.title}
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-28 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Up and running in 3 steps
        </h2>
        <p className="text-zinc-400 mb-14">No technical knowledge needed.</p>
        <div className="space-y-4 text-left">
          {[
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
          ].map((step) => (
            <div
              key={step.n}
              className="flex gap-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <span className="text-3xl font-bold text-zinc-700 font-mono">
                {step.n}
              </span>
              <div>
                <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 pb-28 max-w-md mx-auto text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Simple pricing
        </h2>
        <p className="text-zinc-400 mb-10">
          One plan. Everything included. Cancel anytime.
        </p>
        <div className="bg-zinc-900 border border-blue-500/40 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <div className="mb-6">
            <div className="text-5xl font-bold mb-1">$49</div>
            <div className="text-zinc-400 text-sm">
              per month · billed monthly
            </div>
          </div>
          <ul className="text-left space-y-3 mb-8">
            {[
              "1 AI sales agent",
              "Unlimited conversations",
              "Lead capture & dashboard",
              "Website scraper & auto-training",
              "One-line embed for any site",
              "14-day free trial",
              "Email support",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-zinc-300"
              >
                <span className="text-green-400 text-xs">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard"
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors text-center"
          >
            Start free trial →
          </Link>
          <p className="text-zinc-600 text-xs mt-3">No credit card required</p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28 max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl px-8 py-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Ready to turn visitors into customers?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Join businesses using SalesAgent to qualify leads around the clock.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/20"
          >
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-8 py-8 flex items-center justify-between text-zinc-600 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <span>SalesAgent</span>
        </div>
        <p>© 2026 SalesAgent. All rights reserved.</p>
      </footer>
    </div>
  );
}
