import Link from "next/link";

const STATS = [
  { value: "78%", label: "of leads never get a response within 5 minutes" },
  { value: "$2.4M", label: "average annual revenue lost to slow follow-up" },
  { value: "9x", label: "more likely to convert when contacted instantly" },
];

const PAIN_POINTS = [
  {
    icon: "📵",
    title: "You're asleep. They're buying.",
    desc: "A prospect visits at 11pm, has a question, gets silence. By morning they've signed with your competitor who had a bot.",
  },
  {
    icon: "🔁",
    title: "You're answering the same questions daily.",
    desc: "Pricing. Availability. What's included. Hours of your week, gone. Your agent handles all of it — instantly, accurately, 24/7.",
  },
  {
    icon: "🕳️",
    title: "Your website is a leaky bucket.",
    desc: "Traffic comes in. Nothing captures it. No qualification. No follow-up. Thousands in ad spend, evaporating silently.",
  },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant response, every time",
    desc: "Zero delay. The moment someone lands on your site and asks a question, your agent is already answering — with your voice, your knowledge, your offer.",
  },
  {
    icon: "🎯",
    title: "Qualifies before you speak",
    desc: "Budget. Timeline. Decision maker. Your agent extracts it all naturally, so every call you take is with someone ready to buy.",
  },
  {
    icon: "📧",
    title: "Captures the email, always",
    desc: "When interest is high, your agent asks for the email. No forms. No friction. Just a natural conversation that ends with a lead in your dashboard.",
  },
  {
    icon: "🧠",
    title: "Trained on YOUR business",
    desc: "Not a generic chatbot. Paste your URL and Saim reads everything — services, pricing, FAQs, tone — and becomes an expert on you.",
  },
  {
    icon: "🔌",
    title: "Live in under 5 minutes",
    desc: "One script tag. Paste it before </body>. No engineers. No integrations. No delays. Your agent is live before your next meeting.",
  },
  {
    icon: "📊",
    title: "Every lead, tracked",
    desc: "Full conversation history. Captured emails. Engagement analytics. You see exactly what your visitors are asking and where deals are forming.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$49",
    per: "/mo",
    desc: "For founders ready to stop losing leads",
    popular: false,
    color: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    accent: "#52525b",
    features: [
      "500 conversations/month",
      "Lead capture & email collection",
      "Full conversation dashboard",
      "1 site embed",
      "Email support",
    ],
    cta: "Start capturing leads",
    ctaStyle: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
  },
  {
    name: "Pro",
    price: "$99",
    per: "/mo",
    desc: "For businesses that can't afford to miss a sale",
    popular: true,
    color: "from-blue-950/60 to-zinc-950",
    border: "border-blue-500/50",
    accent: "#3b82f6",
    features: [
      "Unlimited conversations",
      "Lead capture + CRM export",
      "Advanced analytics dashboard",
      "Up to 5 site embeds",
      "Priority support",
      "Custom agent persona",
    ],
    cta: "Start free trial →",
    ctaStyle:
      "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30",
  },
  {
    name: "Scale",
    price: "$199",
    per: "/mo",
    desc: "For agencies running multiple client sites",
    popular: false,
    color: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    accent: "#52525b",
    features: [
      "Unlimited conversations",
      "Unlimited site embeds",
      "White-label widget",
      "Custom AI persona per client",
      "Dedicated account support",
      "Priority API access",
    ],
    cta: "Talk to us",
    ctaStyle: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We went from responding to leads in 4 hours to instantly. Closed 3 deals in the first week that I know we would have lost before.",
    name: "James O.",
    role: "Founder, B2B SaaS",
    avatar: "J",
  },
  {
    quote:
      "Our discovery calls are completely different now. Prospects already know our pricing, our process, and they're pre-sold before they even book.",
    name: "Sarah M.",
    role: "Agency Owner",
    avatar: "S",
  },
  {
    quote:
      "I was spending 2 hours a day answering the same questions. That time is now spent closing. Saim paid for itself in 48 hours.",
    name: "David K.",
    role: "Freelance Consultant",
    avatar: "D",
  },
];

const CHAT = [
  { from: "agent", text: "Hi! 👋 I'm here to help. What brings you in today?" },
  { from: "user", text: "I need help automating my sales follow-up" },
  {
    from: "agent",
    text: "Perfect — that's exactly what we solve. Are you currently losing leads because of slow response times, or is it more about the volume of follow-ups you can't keep up with?",
  },
  {
    from: "user",
    text: "Both honestly. We miss a lot of after-hours enquiries",
  },
  {
    from: "agent",
    text: "Got it. After-hours is where most businesses hemorrhage revenue. With Saim, your agent responds in seconds — at 2am if needed. What does your average deal size look like?",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white font-sans antialiased overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/8 rounded-full blur-[180px]" />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-cyan-600/4 rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, transparent 40%, #060608 100%)",
          }}
        />
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 py-4 border-b border-white/5 bg-[#060608]/85 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/40">
            S
          </div>
          <span className="font-black text-sm tracking-tight text-white">
            Saim
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-zinc-500 hover:text-zinc-200 text-sm transition-colors font-medium"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-zinc-500 hover:text-white text-sm transition-colors hidden sm:block font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="text-xs sm:text-sm bg-white text-black font-bold px-4 sm:px-5 py-2.5 rounded-xl hover:bg-zinc-100 transition-all active:scale-95 shadow-xl shadow-white/10"
          >
            Start free →
          </Link>
        </div>
      </nav>

      <div className="relative z-10">
        {/* HERO */}
        <section className="flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-36 sm:pt-48 pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 text-xs text-red-400 mb-8 font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              Every minute without this, you're losing revenue
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black tracking-tight leading-[1.0] mb-6 sm:mb-8">
              Your website has{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-zinc-400 to-zinc-500 line-through decoration-red-500">
                  visitors.
                </span>
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                It should have customers.
              </span>
            </h1>

            <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
              Saim is an AI sales agent that lives on your website — qualifying
              leads, answering questions, and capturing emails{" "}
              <span className="text-white font-semibold">
                the moment someone shows interest.
              </span>{" "}
              Not an hour later. Not tomorrow. Now.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link
                href="/login"
                className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-base transition-all shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 active:scale-95 overflow-hidden text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">Activate my sales agent →</span>
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors group font-medium"
              >
                <span className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs">
                  ▶
                </span>
                See it live in 60 seconds
              </Link>
            </div>
            <p className="text-zinc-700 text-xs">
              No credit card · 14-day free trial · Live in 5 minutes
            </p>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800/60 rounded-2xl overflow-hidden border border-zinc-800/60">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="bg-[#060608] px-6 sm:px-8 py-8 text-center"
              >
                <div className="text-4xl sm:text-5xl font-black text-white mb-2 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAIN SECTION */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-5">
              <span className="w-1 h-1 bg-red-400 rounded-full" />
              The problem
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              You're working hard.
              <br />
              <span className="text-zinc-500">Your website isn't.</span>
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto">
              Right now, leads are visiting your site, not finding answers, and
              leaving. Permanently.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PAIN_POINTS.map((p, i) => (
              <div
                key={i}
                className="group relative bg-zinc-900/40 border border-zinc-800/60 hover:border-red-500/20 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(300px circle at 50% 0%, rgba(239,68,68,0.04), transparent 70%)",
                  }}
                />
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-bold text-white text-base mb-2">
                  {p.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CHAT DEMO */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-6">
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                Live demo
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-5 leading-tight">
                Watch it qualify a lead
                <br />
                <span className="text-blue-400">in real time.</span>
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">
                This isn't a scripted demo. This is exactly what your visitors
                experience — a natural, intelligent conversation that moves them
                from curious to ready-to-buy.
              </p>
              <div className="space-y-3">
                {[
                  "Responds in under 1 second",
                  "Asks qualifying questions naturally",
                  "Captures contact info without forms",
                  "Hands off to you when they're ready",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-400 text-xs font-bold">
                        ✓
                      </span>
                    </div>
                    <span className="text-zinc-300 text-sm font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat widget mock */}
            <div className="relative">
              <div
                className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-110"
                style={{ animationDuration: "4s" }}
              />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/8">
                <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                        S
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-700" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-none">
                        Saim Agent
                      </p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Online · Responds instantly
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {["bg-red-400", "bg-yellow-400", "bg-green-400"].map(
                      (c) => (
                        <div
                          key={c}
                          className={`w-2.5 h-2.5 rounded-full ${c} opacity-70`}
                        />
                      ),
                    )}
                  </div>
                </div>
                <div className="bg-zinc-950 p-4 space-y-3 min-h-[280px]">
                  {CHAT.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.from === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-zinc-800/90 text-zinc-200 rounded-bl-sm border border-zinc-700/50"}`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-start">
                    <div className="bg-zinc-800/80 border border-zinc-700/50 px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
                      {[0, 150, 300].map((delay) => (
                        <div
                          key={delay}
                          className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900 border-t border-zinc-800/60 px-3 py-3 flex gap-2">
                  <div className="flex-1 bg-zinc-800/60 border border-zinc-700/40 rounded-xl px-3 py-2 text-xs text-zinc-600">
                    Type a message...
                  </div>
                  <div className="bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer hover:bg-blue-500 transition-colors">
                    Send
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-5xl mx-auto"
        >
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-5">
              <span className="w-1 h-1 bg-blue-400 rounded-full" />
              The system
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              A complete revenue engine.
              <br />
              <span className="text-zinc-500">Not just a chatbot.</span>
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto">
              Every feature is designed to do one thing — turn more of your
              existing traffic into paying customers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group relative bg-zinc-900/50 border border-zinc-800/70 hover:border-blue-500/25 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(280px circle at 50% 0%, rgba(59,130,246,0.05), transparent 70%)",
                  }}
                />
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-3xl mx-auto"
        >
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-5">
              <span className="w-1 h-1 bg-violet-400 rounded-full" />
              How it works
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              Live in 5 minutes.
              <br />
              <span className="text-zinc-500">No engineers needed.</span>
            </h2>
          </div>

          <div className="space-y-0">
            {[
              {
                n: "01",
                title: "Tell Saim about your business",
                desc: "Paste your website URL or write a short description. Saim reads everything and becomes an expert on your products, pricing, and tone in seconds.",
              },
              {
                n: "02",
                title: "Customize how your agent speaks",
                desc: "Choose a personality. Set the focus. Make it sound exactly like you — professional, casual, direct, or warm. It's your agent, not a generic bot.",
              },
              {
                n: "03",
                title: "Paste one line of code",
                desc: "Copy the embed snippet and paste it before </body> on your site. Done. Your agent is live, qualifying leads, and capturing emails from this moment.",
              },
            ].map((step, i) => (
              <div key={step.n} className="flex gap-5 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <span className="text-blue-400 text-sm font-black font-mono">
                      {step.n}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-zinc-700/60 to-transparent my-2" />
                  )}
                </div>
                <div className={`pb-8 sm:pb-10 ${i === 2 ? "pb-0" : ""}`}>
                  <h3 className="font-black text-white text-lg mb-2 mt-2">
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

        {/* TESTIMONIALS */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-5">
              <span className="w-1 h-1 bg-emerald-400 rounded-full" />
              Results
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Revenue recovered. Time reclaimed.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-amber-400 text-xs">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-5">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">{t.name}</p>
                    <p className="text-zinc-600 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          className="px-5 sm:px-8 pb-20 sm:pb-32 max-w-5xl mx-auto"
        >
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 mb-5">
              <span className="w-1 h-1 bg-amber-400 rounded-full" />
              Pricing
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 leading-tight">
              Less than one lost deal.
              <br />
              <span className="text-zinc-500">Every single month.</span>
            </h2>
            <p className="text-zinc-500 text-base">
              If Saim captures one extra lead per month, it pays for itself 10x
              over.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {PLANS.map((plan, i) => (
              <div key={plan.name} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-blue-600 text-white text-xs font-black px-5 py-1.5 rounded-full shadow-xl shadow-blue-600/40 tracking-wide uppercase">
                      Most Popular
                    </span>
                  </div>
                )}
                <div
                  className={`relative h-full bg-gradient-to-b ${plan.color} border ${plan.border} rounded-2xl p-6 flex flex-col overflow-hidden group transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl text-left ${plan.popular ? "hover:border-blue-400/60 hover:shadow-blue-500/15" : "hover:border-zinc-700"}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />
                  )}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(280px circle at 50% 0%, ${plan.accent}15, transparent 70%)`,
                    }}
                  />

                  <div className="relative mb-5">
                    <p className="text-zinc-500 text-xs font-black tracking-[0.2em] uppercase mb-3">
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-5xl font-black tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-zinc-500 text-sm mb-1.5">
                        {plan.per}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-xs">{plan.desc}</p>
                  </div>

                  <div className="h-px bg-zinc-800/80 mb-5" />

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-xs text-zinc-300"
                      >
                        <span className="text-emerald-400 mt-0.5 shrink-0 font-black">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/login"
                    className={`relative block w-full py-3 rounded-xl text-sm font-black text-center transition-all duration-200 active:scale-95 ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-700 text-xs">
            {[
              "14-day free trial",
              "No credit card required",
              "Cancel anytime",
              "Live in under 5 minutes",
            ].map((t, i) => (
              <div key={t} className="flex items-center gap-4">
                {i > 0 && (
                  <div className="w-1 h-1 bg-zinc-800 rounded-full hidden sm:block" />
                )}
                <span>{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 sm:px-8 pb-24 sm:pb-36 max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-b from-blue-950/40 to-zinc-950 border border-blue-500/15 rounded-3xl px-6 sm:px-12 py-16 sm:py-24 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
            <div className="absolute inset-0 bg-blue-600/3 rounded-3xl" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-8">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Your competitors are already using AI. Are you?
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-tight">
                Stop watching leads
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  walk out the door.
                </span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Every day without Saim is another day of missed conversations,
                unqualified calls, and revenue left on the table. Set it up in 5
                minutes. Start capturing leads tonight.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black px-10 sm:px-14 py-5 rounded-xl text-base transition-all shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 active:scale-95 overflow-hidden text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">
                    Start free trial — no card needed →
                  </span>
                </Link>
              </div>
              <p className="text-zinc-700 text-xs mt-6">
                14-day trial · Cancel anytime · Setup in 5 minutes
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-900 px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-zinc-600 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-black shadow-sm shadow-blue-500/30">
              S
            </div>
            <span className="text-zinc-400 font-bold">Saim</span>
          </div>
          <div className="flex items-center gap-6 text-zinc-700">
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
          <p>© 2026 Saim. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
