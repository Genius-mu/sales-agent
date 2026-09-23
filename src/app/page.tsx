import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import Logo from "@/app/components/Logo";

const STATS = [
  { value: "78%", label: "of leads never get a response within 5 minutes" },
  { value: "$2.4M", label: "average annual revenue lost to slow follow-up" },
  { value: "9x", label: "more likely to convert when contacted instantly" },
];

const PAIN_POINTS = [
  { title: "You're asleep. They're buying.", desc: "A prospect visits at 11pm, has a question, gets silence. By morning they've signed with a competitor who answered." },
  { title: "You answer the same questions daily.", desc: "Pricing. Availability. What's included. Hours of your week, gone. Your agent handles all of it — instantly, accurately, around the clock." },
  { title: "Your website is a leaky bucket.", desc: "Traffic comes in. Nothing captures it. No qualification, no follow-up. Ad spend evaporating, silently." },
];

const FEATURES = [
  { title: "Instant response, every time", desc: "The moment someone lands and asks a question, your agent is already answering — in your voice, with your knowledge." },
  { title: "Qualifies before you speak", desc: "Budget, timeline, decision maker. Your agent extracts it naturally, so every call you take is with someone ready to buy." },
  { title: "Captures the email, always", desc: "When interest is high, it asks for the email. No forms, no friction — just a conversation that ends with a lead in your dashboard." },
  { title: "Trained on your business", desc: "Not a generic bot. Paste your URL and Saim reads your services, pricing, FAQs, and tone — then becomes an expert on you." },
  { title: "Live in under five minutes", desc: "One script tag before </body>. No engineers, no integrations. Your agent is live before your next meeting." },
  { title: "Every lead, tracked", desc: "Full conversation history, captured emails, engagement analytics. See exactly what visitors ask and where deals form." },
];

const PLANS = [
  {
    name: "Starter",
    price: "₦1,000",
    per: "/mo",
    desc: "For founders ready to stop losing leads",
    popular: false,
    features: ["500 conversations/month", "Lead capture & email collection", "Full conversation dashboard", "1 site embed", "Email support"],
    cta: "Start capturing leads",
  },
  {
    name: "Pro",
    price: "₦5,000",
    per: "/mo",
    desc: "For businesses that can't afford to miss a sale",
    popular: true,
    features: ["Unlimited conversations", "Lead capture + CRM export", "Advanced analytics dashboard", "Up to 5 site embeds", "Priority support", "Custom agent persona"],
    cta: "Start free trial",
  },
  {
    name: "Scale",
    price: "₦15,000",
    per: "/mo",
    desc: "For agencies running multiple client sites",
    popular: false,
    features: ["Unlimited conversations", "Unlimited site embeds", "White-label widget", "Custom AI persona per client", "Dedicated account support", "Priority API access"],
    cta: "Talk to us",
  },
];

const TESTIMONIALS = [
  { quote: "We went from responding to leads in four hours to instantly. Closed three deals in the first week we'd have lost before.", name: "James O.", role: "Founder, B2B SaaS", avatar: "J" },
  { quote: "Our discovery calls are completely different now. Prospects already know our pricing and process — they're pre-sold before they book.", name: "Sarah M.", role: "Agency owner", avatar: "S" },
  { quote: "I spent two hours a day answering the same questions. That time is now spent closing. Saim paid for itself in 48 hours.", name: "David K.", role: "Freelance consultant", avatar: "D" },
];

const CHAT = [
  { from: "agent", text: "Hi! I'm here to help. What brings you in today?" },
  { from: "user", text: "I need help automating my sales follow-up" },
  { from: "agent", text: "Perfect — that's exactly what we solve. Are you losing leads to slow response times, or is it more the volume you can't keep up with?" },
  { from: "user", text: "Both honestly. We miss a lot of after-hours enquiries" },
  { from: "agent", text: "Got it. After-hours is where most businesses lose revenue. With Saim, your agent responds in seconds — even at 2am. What's your average deal size?" },
];

const Check = ({ className = "" }: { className?: string }) => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className={className}>
    <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08090b] text-white font-sans antialiased overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[150px] animate-[pulseGlow_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-indigo-600/[0.05] rounded-full blur-[140px] animate-[pulseSide_10s_ease-in-out_infinite_1s]" />
        <div className="absolute bottom-1/4 -left-40 w-[450px] h-[450px] bg-cyan-600/[0.04] rounded-full blur-[130px] animate-[pulseSide_12s_ease-in-out_infinite_2s]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at 50% 0%, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, #000 30%, transparent 80%)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 45%, #08090b 100%)" }} />
      </div>
      <style>{`
        @keyframes pulseGlow { 0%,100% { opacity:0.6; transform:translateX(-50%) scale(1); } 50% { opacity:1; transform:translateX(-50%) scale(1.08); } }
        @keyframes pulseSide { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes heroPulse { 0%,100% { opacity:0.7; transform:scale(1); } 50% { opacity:1; transform:scale(1.1); } }
        @keyframes shimmer { 0% { background-position:0% center; } 100% { background-position:200% center; } }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 py-3.5 border-b border-white/5 bg-[#08090b]/85 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <Logo size={28} className="w-7 h-7 shrink-0" />
          <span className="font-semibold text-[15px] tracking-tight text-white">Saim</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-zinc-400 hover:text-white text-[13px] transition-colors font-medium">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-zinc-400 hover:text-white text-[13px] transition-colors hidden sm:block font-medium">Sign in</Link>
          <Link href="/login" className="text-[13px] bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors active:scale-[0.98]">Start free</Link>
        </div>
      </nav>

      <div className="relative z-10">
        {/* HERO */}
        <section className="relative flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-32 sm:pt-44 pb-16 sm:pb-20">
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[760px] max-w-[95vw] h-[420px] pointer-events-none">
            <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-[120px] animate-[heroPulse_6s_ease-in-out_infinite]" />
            <div className="absolute inset-x-24 top-8 h-44 bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[360px] h-[360px] pointer-events-none opacity-40">
            <div className="absolute inset-0 rounded-full blur-2xl animate-[spin_18s_linear_infinite]" style={{ background: "conic-gradient(from 0deg, transparent, rgba(59,130,246,0.18), transparent, rgba(34,211,238,0.12), transparent)" }} />
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Reveal delay={0} distance={20}>
              <div className="inline-flex items-center gap-2 bg-zinc-900/70 border border-blue-500/20 rounded-full px-4 py-1.5 text-[12px] text-zinc-200 mb-7 font-medium shadow-[0_0_24px_-4px_rgba(59,130,246,0.4)] backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
                </span>
                AI sales agent for your website
              </div>
            </Reveal>

            <Reveal delay={80} distance={24}>
              <h1 className="relative text-[40px] sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6">
                <span className="relative bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_2px_30px_rgba(255,255,255,0.12)]">
                  Your website has visitors.
                </span>
                <br />
                <span className="relative bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_6s_linear_infinite]">
                  It should have customers.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160} distance={20}>
              <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-9 leading-relaxed">
                Saim is an AI sales agent that lives on your site — qualifying leads, answering questions, and capturing emails the moment someone shows interest. Not an hour later. Now.
              </p>
            </Reveal>

            <Reveal delay={240} distance={18}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
                <Link href="/login" className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-7 py-3 rounded-lg text-[15px] transition-all active:scale-[0.98] text-center shadow-[0_0_30px_-6px_rgba(59,130,246,0.7)] hover:shadow-[0_0_44px_-4px_rgba(59,130,246,0.95)] overflow-hidden">
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative">Activate my sales agent</span>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto text-zinc-300 hover:text-white text-[14px] transition-colors font-medium px-7 py-3 rounded-lg border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/40 text-center backdrop-blur-sm">
                  See how it works
                </a>
              </div>
              <p className="text-zinc-600 text-[12px]">No credit card · 14-day free trial · Live in 5 minutes</p>
            </Reveal>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-4xl mx-auto">
          <Reveal>
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800/60 rounded-xl overflow-hidden border border-zinc-800 shadow-[0_0_40px_-12px_rgba(59,130,246,0.15)]">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-[#08090b] px-6 py-7 text-center">
                  <div className="text-3xl sm:text-4xl font-semibold mb-2 tabular-nums tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-zinc-500 text-[13px] leading-relaxed">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* PAIN SECTION */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-zinc-500 text-[11px] tracking-[0.15em] uppercase font-medium mb-4">The problem</p>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3 leading-tight">You're working hard. Your website isn't.</h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto leading-relaxed">Right now, leads are visiting your site, not finding answers, and leaving. Permanently.</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAIN_POINTS.map((p, i) => (
              <Reveal key={i} delay={i * 90} direction="up">
                <div className="group relative bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-colors overflow-hidden h-full">
                  <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="font-medium text-white text-[15px] mb-2">{p.title}</h3>
                  <p className="text-zinc-500 text-[13px] leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CHAT DEMO */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center">
            <Reveal direction="left">
              <div>
                <p className="text-zinc-500 text-[11px] tracking-[0.15em] uppercase font-medium mb-4">Live demo</p>
                <h2 className="text-[26px] sm:text-3xl font-semibold tracking-tight mb-4 leading-tight">Watch it qualify a lead in real time</h2>
                <p className="text-zinc-400 text-[15px] leading-relaxed mb-6">This is exactly what your visitors experience — a natural, intelligent conversation that moves them from curious to ready-to-buy.</p>
                <div className="space-y-2.5">
                  {["Responds in under a second", "Asks qualifying questions naturally", "Captures contact info without forms", "Hands off to you when they're ready"].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <span className="text-emerald-400 shrink-0"><Check className="w-4 h-4" /></span>
                      <span className="text-zinc-300 text-[14px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={120}>
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-full" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-zinc-800 ring-1 ring-white/5">
                  <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[12px] font-semibold">S</div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-900" />
                      </div>
                      <div>
                        <p className="text-white text-[13px] font-medium leading-none">Sales Assistant</p>
                        <p className="text-zinc-500 text-[11px] mt-0.5">Online · Responds instantly</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0a0b0d] p-4 space-y-2.5 min-h-[280px]">
                    {CHAT.map((msg, i) => (
                      <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${msg.from === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-zinc-800/80 text-zinc-200 rounded-bl-sm border border-zinc-700/50"}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-start">
                      <div className="bg-zinc-800/80 border border-zinc-700/50 px-3.5 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                        {[0, 150, 300].map((delay) => (
                          <div key={delay} className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900 border-t border-zinc-800 px-3 py-3 flex gap-2">
                    <div className="flex-1 bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-3 py-2 text-[12px] text-zinc-600">Type a message…</div>
                    <div className="bg-blue-600 text-white text-[12px] px-4 py-2 rounded-lg font-medium">Send</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-zinc-500 text-[11px] tracking-[0.15em] uppercase font-medium mb-4">The system</p>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3 leading-tight">A complete revenue engine, not just a chatbot</h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto leading-relaxed">Every feature is built to do one thing — turn more of your existing traffic into paying customers.</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={(i % 3) * 90} direction="up">
                <div className="group relative bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden h-full">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(300px circle at 50% 0%, rgba(59,130,246,0.06), transparent 70%)" }} />
                  <div className="absolute -top-px left-5 right-5 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="relative font-medium text-white text-[14px] mb-2">{f.title}</h3>
                  <p className="relative text-zinc-500 text-[13px] leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-2xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-zinc-500 text-[11px] tracking-[0.15em] uppercase font-medium mb-4">How it works</p>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3 leading-tight">Live in five minutes, no engineers</h2>
          </Reveal>
          <div className="space-y-0">
            {[
              { n: "1", title: "Tell Saim about your business", desc: "Paste your website URL or write a short description. Saim reads everything and becomes an expert on your products, pricing, and tone in seconds." },
              { n: "2", title: "Customize how your agent speaks", desc: "Choose a personality and set the focus. Make it sound exactly like you — professional, casual, direct, or warm." },
              { n: "3", title: "Paste one line of code", desc: "Copy the embed snippet and drop it before </body>. Your agent is live, qualifying leads, and capturing emails from that moment." },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 110} direction="left">
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <span className="text-zinc-400 text-[13px] font-medium tabular-nums">{step.n}</span>
                    </div>
                    {i < 2 && <div className="w-px flex-1 bg-zinc-800 my-1.5" />}
                  </div>
                  <div className={i === 2 ? "" : "pb-7"}>
                    <h3 className="font-medium text-white text-[15px] mb-1 mt-0.5">{step.title}</h3>
                    <p className="text-zinc-500 text-[13px] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto">
          <Reveal className="text-center mb-10">
            <p className="text-zinc-500 text-[11px] tracking-[0.15em] uppercase font-medium mb-4">Results</p>
            <h2 className="text-[26px] sm:text-3xl font-semibold tracking-tight">Revenue recovered. Time reclaimed.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 90} direction="up">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 h-full">
                  <div className="flex gap-0.5 mb-3.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-zinc-300 text-[13px] leading-relaxed mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-[12px] font-medium shrink-0">{t.avatar}</div>
                    <div>
                      <p className="text-white text-[12px] font-medium">{t.name}</p>
                      <p className="text-zinc-600 text-[12px]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-zinc-500 text-[11px] tracking-[0.15em] uppercase font-medium mb-4">Pricing</p>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3 leading-tight">Less than one lost deal a month</h2>
            <p className="text-zinc-500 text-base max-w-md mx-auto">Capture one extra lead a month and Saim pays for itself many times over.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 90} direction="up" className="relative">
                {plan.popular && (
                  <div className="absolute -top-2.5 left-5 z-20">
                    <span className="bg-blue-600 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">Most popular</span>
                  </div>
                )}
                <div className={`relative h-full bg-zinc-900/40 border rounded-xl p-5 flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 text-left ${plan.popular ? "border-blue-500/30 hover:border-blue-500/50 shadow-[0_0_40px_-12px_rgba(59,130,246,0.4)]" : "border-zinc-800 hover:border-zinc-700"}`}>
                  {plan.popular && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-blue-600/[0.18] rounded-full blur-3xl pointer-events-none" />
                    </>
                  )}
                  <div className="relative mb-4">
                    <p className="text-zinc-400 text-[11px] font-medium tracking-[0.12em] uppercase mb-3">{plan.name}</p>
                    <div className="flex items-end gap-1 mb-1.5">
                      <span className="text-[34px] leading-none font-semibold tracking-tight">{plan.price}</span>
                      <span className="text-zinc-500 text-[13px] mb-1">{plan.per}</span>
                    </div>
                    <p className="text-zinc-500 text-[12px] leading-relaxed">{plan.desc}</p>
                  </div>
                  <div className="h-px bg-zinc-800/80 mb-4" />
                  <ul className="space-y-2.5 flex-1 mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                        <span className="text-emerald-400 mt-0.5 shrink-0"><Check className="w-3.5 h-3.5" /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login" className={`block w-full py-2.5 rounded-lg text-[13px] font-medium text-center transition-colors active:scale-[0.98] ${plan.popular ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"}`}>
                    {plan.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-600 text-[12px]">
              {["14-day free trial", "No credit card required", "Cancel anytime", "Live in under 5 minutes"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-zinc-600" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 sm:px-8 pb-24 sm:pb-32 max-w-4xl mx-auto text-center">
          <Reveal distance={32} scale>
            <div className="relative bg-zinc-900/40 border border-blue-500/20 rounded-2xl px-6 sm:px-12 py-14 sm:py-20 overflow-hidden shadow-[0_0_60px_-20px_rgba(59,130,246,0.35)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-56 bg-blue-600/15 rounded-full blur-3xl animate-[pulseGlow_8s_ease-in-out_infinite]" />
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="relative">
                <h2 className="text-[32px] sm:text-5xl font-semibold tracking-tight mb-4 leading-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">Stop watching leads walk out the door</h2>
                <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-9 leading-relaxed">Every day without Saim is another day of missed conversations and revenue left on the table. Set it up in five minutes. Start capturing leads tonight.</p>
                <Link href="/login" className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-10 py-3.5 rounded-lg text-[15px] transition-all active:scale-[0.98] text-center shadow-[0_0_28px_-6px_rgba(59,130,246,0.7)] hover:shadow-[0_0_36px_-4px_rgba(59,130,246,0.9)]">Start free trial</Link>
                <p className="text-zinc-600 text-[12px] mt-5">14-day trial · Cancel anytime · Setup in 5 minutes</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-900 px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-zinc-600 text-[12px]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-[12px] font-semibold">S</div>
            <span className="text-zinc-300 font-medium">Saim</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-zinc-300 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-zinc-300 transition-colors">Login</Link>
          </div>
          <p>© 2026 Saim. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}