import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import Logo from "@/app/components/Logo";
import LandingPricing from "@/app/components/LandingPricing";
import Tilt3D from "@/app/components/Tilt3D";
import HeroOrb from "@/app/components/HeroOrb";
import LiveChatDemo from "@/app/components/LiveChatDemo";
import RoiCalculator from "@/app/components/RoiCalculator";
import PageEffects from "@/app/components/PageEffects";
import { cookies, headers } from "next/headers";
import { CURRENCY_COOKIE, PLANS, currencyForCountry, isCurrency } from "@/lib/plans";

const SIGNUP = "/login?mode=signup";

const FACTS = [
  { value: "24/7", label: "Answers visitors while you sleep, eat and close deals" },
  { value: "1 line", label: "of code to install. Works on almost any website" },
  { value: "0 forms", label: "Visitors just chat. Saim collects the details" },
];

const INDUSTRIES = [
  "Real estate", "Clinics & dentists", "Agencies", "Online stores", "Schools & tutors",
  "Consultants", "Hotels & shortlets", "SaaS", "Law firms", "Event planners", "Car dealers", "Gyms & studios",
];

const PAIN_POINTS = [
  { title: "You're asleep. They're buying.", desc: "A prospect visits at 11pm with one question. Nobody answers. By morning they've paid a competitor who did." },
  { title: "You answer the same questions daily.", desc: "Price. Availability. What's included. Hours of your week, gone. Saim answers them instantly, accurately, every time." },
  { title: "Your traffic leaks out.", desc: "You pay for ads and content to bring people in. Most leave without a word, and you never even learn who they were." },
];

const FEATURES = [
  { icon: "⚡", title: "Replies in seconds", desc: "The moment someone asks a question, your agent answers in your voice, with your knowledge. Day or night." },
  { icon: "🎯", title: "Qualifies before you talk", desc: "Budget, timeline, decision maker. Saim asks naturally, so every call you take is with someone ready to buy." },
  { icon: "✉️", title: "Captures the email", desc: "When interest peaks, it asks for contact details. No forms, no friction. Just a lead in your dashboard." },
  { icon: "🧠", title: "Trained on your business", desc: "Paste your URL. Saim reads your services, prices and FAQs, and only answers from what you've given it." },
  { icon: "🚀", title: "Live in 5 minutes", desc: "One script tag before </body>. No developers, no integrations. Live before your next meeting." },
  { icon: "📊", title: "Every lead, tracked", desc: "Full conversation history, captured emails and analytics. See what visitors ask and where sales start." },
];

const STEPS = [
  { n: "1", title: "Tell Saim about your business", desc: "Paste your website URL or write a short description. Saim learns your products, prices and tone in seconds." },
  { n: "2", title: "Choose how it talks", desc: "Professional, casual, direct or warm. Set what it should focus on, so it sounds like you on your best day." },
  { n: "3", title: "Paste one line of code", desc: "Drop the snippet into your site. From that moment it's answering, qualifying and capturing leads." },
];

const FAQ = [
  { q: "Will it make things up?", a: "Saim is instructed to answer only from the information you give it: your website and your description. You can read every conversation in your dashboard, so you always see exactly what it said." },
  { q: "Does it work on my website?", a: "If your site lets you add a small piece of code (WordPress, Webflow, Shopify, Wix, custom sites and most builders do), Saim works on it. It's one script tag." },
  { q: "Do I need a card to start?", a: `No. The Free plan gives you ${PLANS.free.monthlyLimit} conversations a month with no card. Upgrade only when you want more.` },
  { q: "What happens if I hit my monthly limit?", a: "Your widget pauses for the rest of the month and we email you. Upgrade any time and it switches straight back on." },
  { q: "Can I cancel?", a: "Yes, from your billing page, any time. Your account moves back to the Free plan. No calls, no forms." },
  { q: "Why are naira and dollar prices both shown?", a: "Visitors in Nigeria see naira and everyone else sees dollars. Naira prices are the dollar prices converted at the CBN official rate, so it's the same price either way." },
];

const Check = ({ className = "" }: { className?: string }) => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className={className}>
    <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
  </svg>
);

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-blue-400/80 text-[11px] tracking-[0.18em] uppercase font-medium mb-4">{children}</p>;
}

export default async function LandingPage() {
  const savedCurrency = (await cookies()).get(CURRENCY_COOKIE)?.value;
  const initialCurrency = isCurrency(savedCurrency)
    ? savedCurrency
    : currencyForCountry((await headers()).get("x-vercel-ip-country"));

  return (
    <div className="min-h-screen bg-[#08090b] text-white font-sans antialiased overflow-x-hidden">
      <PageEffects />

      {/* Ambient background (static blurs: cheap to paint) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[150px]" />
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-indigo-600/[0.05] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -left-40 w-[450px] h-[450px] bg-cyan-600/[0.04] rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at 50% 0%, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, #000 30%, transparent 80%)",
          }}
        />
      </div>
      <style>{`
        @keyframes shimmer { 0% { background-position:0% center; } 100% { background-position:200% center; } }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 py-3.5 border-b border-white/5 bg-[#08090b]/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={28} className="w-7 h-7 shrink-0" />
          <span className="font-semibold text-[15px] tracking-tight text-white">Saim</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {[["Demo", "#demo"], ["Features", "#features"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([label, href]) => (
            <a key={label} href={href} className="text-zinc-400 hover:text-white text-[13px] transition-colors font-medium">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-zinc-400 hover:text-white text-[13px] transition-colors hidden sm:block font-medium">Sign in</Link>
          <Link href={SIGNUP} className="text-[13px] bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors active:scale-[0.98]">Start free</Link>
        </div>
      </nav>

      <div className="relative z-10">
        {/* HERO */}
        <section className="relative flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-20">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[760px] max-w-[95vw] h-[420px] pointer-events-none">
            <div className="absolute inset-0 bg-blue-600/15 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Reveal delay={0} distance={16} repeat={false}>
              <HeroOrb className="mx-auto -mb-6 scale-[0.7] sm:scale-100" />
            </Reveal>

            <Reveal delay={60} distance={20} repeat={false}>
              <div className="inline-flex items-center gap-2 bg-zinc-900/70 border border-blue-500/20 rounded-full px-4 py-1.5 text-[12px] text-zinc-200 mb-7 font-medium shadow-[0_0_24px_-4px_rgba(59,130,246,0.4)] backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Your 24/7{" "}
                <span className="word-swap text-blue-300" style={{ perspective: "400px" }}>
                  <span>sales rep</span>
                  <span>receptionist</span>
                  <span>lead qualifier</span>
                  <span>follow-up machine</span>
                </span>
              </div>
            </Reveal>

            <Reveal delay={120} distance={24} repeat={false}>
              <h1 className="relative text-[40px] sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6">
                <span className="relative bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent">
                  Your website has visitors.
                </span>
                <br />
                <span className="relative bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_6s_linear_infinite] motion-reduce:animate-none">
                  It should have customers.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={180} distance={20} repeat={false}>
              <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-9 leading-relaxed">
                Saim is an AI sales agent that lives on your website. It answers questions, finds out what each visitor needs and what they can spend, and collects their email, all in your voice, day or night. <span className="text-zinc-200">You wake up to leads, not lost sales.</span>
              </p>
            </Reveal>

            <Reveal delay={240} distance={18} repeat={false}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
                <Link href={SIGNUP} className="group relative w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-7 py-3.5 rounded-xl text-[15px] transition-all active:scale-[0.98] text-center shadow-[0_0_30px_-6px_rgba(59,130,246,0.7)] hover:shadow-[0_0_44px_-4px_rgba(59,130,246,0.95)] overflow-hidden">
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative">Get my free sales agent →</span>
                </Link>
                <a href="#demo" className="w-full sm:w-auto text-zinc-300 hover:text-white text-[14px] transition-colors font-medium px-7 py-3.5 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/40 text-center backdrop-blur-sm">
                  Watch it close a lead
                </a>
              </div>
              <p className="text-zinc-500 text-[12px]">Free plan · No card needed · Live in 5 minutes</p>
            </Reveal>
          </div>
        </section>

        {/* FACTS */}
        <section className="px-5 sm:px-8 pb-12 sm:pb-16 max-w-4xl mx-auto">
          <Reveal>
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800/60 rounded-xl overflow-hidden border border-zinc-800 shadow-[0_0_40px_-12px_rgba(59,130,246,0.15)]">
              {FACTS.map((fact) => (
                <div key={fact.value} className="bg-[#08090b] px-6 py-7 text-center">
                  <div className="text-3xl sm:text-4xl font-semibold mb-2 tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">{fact.value}</div>
                  <div className="text-zinc-500 text-[13px] leading-relaxed">{fact.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* INDUSTRIES MARQUEE */}
        <section className="pb-20 sm:pb-28">
          <p className="text-center text-zinc-600 text-[12px] mb-5">Built for businesses that sell through conversations</p>
          <div className="marquee overflow-hidden">
            <div className="marquee-track">
              {[...INDUSTRIES, ...INDUSTRIES].map((name, i) => (
                <span key={i} className="shrink-0 text-[13px] text-zinc-400 bg-zinc-900/60 border border-zinc-800 rounded-full px-4 py-2">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PAIN */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionLabel>The problem</SectionLabel>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3 leading-tight">You&apos;re working hard. Your website isn&apos;t.</h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto leading-relaxed">Right now, people are visiting your site, not finding answers, and leaving for good.</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PAIN_POINTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90} direction="up" className="h-full">
                <Tilt3D max={6}>
                  <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 h-full overflow-hidden">
                    <div className="text-red-400/80 text-[11px] font-medium tracking-[0.14em] uppercase mb-3">Problem 0{i + 1}</div>
                    <h3 className="font-medium text-white text-[16px] mb-2">{p.title}</h3>
                    <p className="text-zinc-500 text-[13px] leading-relaxed">{p.desc}</p>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </section>

        {/* LIVE DEMO */}
        <section id="demo" className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center">
            <Reveal direction="left">
              <div>
                <SectionLabel>See it work</SectionLabel>
                <h2 className="text-[26px] sm:text-4xl font-semibold tracking-tight mb-4 leading-tight">From &ldquo;how much?&rdquo; to a qualified lead in under a minute</h2>
                <p className="text-zinc-400 text-[15px] leading-relaxed mb-6">This is the kind of conversation your visitors get. Saim answers the question, learns what they need and when, then collects their email so you can close the sale.</p>
                <div className="space-y-2.5 mb-8">
                  {["Answers instantly, in your voice", "Asks qualifying questions naturally", "Collects contact details without forms", "Sends the lead to your dashboard"].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <span className="text-emerald-400 shrink-0"><Check className="w-4 h-4" /></span>
                      <span className="text-zinc-300 text-[14px]">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href={SIGNUP} className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-[14px] font-medium transition-colors">
                  Put this on my website →
                </Link>
              </div>
            </Reveal>
            <Reveal direction="right" delay={120}>
              <div className="relative">
                <div className="absolute -inset-6 bg-blue-600/10 blur-3xl rounded-full" />
                <Tilt3D max={5} glare={false}>
                  <LiveChatDemo />
                </Tilt3D>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ROI CALCULATOR */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto">
          <Reveal className="text-center mb-10">
            <SectionLabel>Do the maths</SectionLabel>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3 leading-tight">How much is your silent website costing you?</h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto leading-relaxed">Plug in your own numbers and see what answering every visitor could be worth.</p>
          </Reveal>
          <Reveal>
            <RoiCalculator initialCurrency={initialCurrency} />
          </Reveal>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto scroll-mt-24">
          <Reveal className="text-center mb-12">
            <SectionLabel>What you get</SectionLabel>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3 leading-tight">A salesperson, not just a chatbot</h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto leading-relaxed">Every feature does one job: turn more of the traffic you already have into paying customers.</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 90} direction="up" className="h-full">
                <Tilt3D max={7}>
                  <div className="relative bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 h-full overflow-hidden transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[18px] mb-4">
                      {f.icon}
                    </div>
                    <h3 className="font-medium text-white text-[15px] mb-2">{f.title}</h3>
                    <p className="text-zinc-500 text-[13px] leading-relaxed">{f.desc}</p>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-2xl mx-auto scroll-mt-24">
          <Reveal className="text-center mb-12">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3 leading-tight">Live in five minutes. No developer needed.</h2>
          </Reveal>
          <div>
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 110} direction="left">
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-blue-500/20 to-blue-500/5 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_-6px_rgba(59,130,246,0.6)]">
                      <span className="text-blue-200 text-[13px] font-medium tabular-nums">{step.n}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-blue-500/30 to-zinc-800 my-1.5" />}
                  </div>
                  <div className={i === STEPS.length - 1 ? "" : "pb-8"}>
                    <h3 className="font-medium text-white text-[15px] mb-1 mt-1">{step.title}</h3>
                    <p className="text-zinc-500 text-[13px] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto scroll-mt-24">
          <Reveal className="text-center mb-8">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight mb-3 leading-tight">Costs less than one lost customer</h2>
            <p className="text-zinc-500 text-base max-w-md mx-auto">
              Start free with {PLANS.free.monthlyLimit} conversations a month. Upgrade when the leads start coming in.
            </p>
          </Reveal>
          <LandingPricing initialCurrency={initialCurrency} />
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-500 text-[12px]">
              {["Free plan, no card needed", "Cancel anytime", "Live in under 5 minutes", "Same price in $ or ₦"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500/70" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-3xl mx-auto scroll-mt-24">
          <Reveal className="text-center mb-10">
            <SectionLabel>Questions</SectionLabel>
            <h2 className="text-[28px] sm:text-4xl font-semibold tracking-tight leading-tight">Straight answers</h2>
          </Reveal>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 50}>
                <details className="group bg-zinc-900/40 border border-zinc-800 open:border-zinc-700 rounded-2xl px-5 py-4 transition-colors">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-white text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="shrink-0 w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="text-zinc-400 text-[14px] leading-relaxed mt-3 form-swap">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 sm:px-8 pb-24 sm:pb-32 max-w-4xl mx-auto text-center">
          <Reveal distance={32} scale>
            <div className="relative bg-zinc-900/40 border border-blue-500/20 rounded-3xl px-6 sm:px-12 py-14 sm:py-20 overflow-hidden shadow-[0_0_60px_-20px_rgba(59,130,246,0.35)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-56 bg-blue-600/15 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-[32px] sm:text-5xl font-semibold tracking-tight mb-4 leading-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">Tonight, someone will visit your site with a question.</h2>
                <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-9 leading-relaxed">Make sure someone answers. Set up Saim in five minutes and start capturing the leads you&apos;re missing today.</p>
                <Link href={SIGNUP} className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-10 py-3.5 rounded-xl text-[15px] transition-all active:scale-[0.98] text-center shadow-[0_0_28px_-6px_rgba(59,130,246,0.7)] hover:shadow-[0_0_36px_-4px_rgba(59,130,246,0.9)]">Get my free sales agent →</Link>
                <p className="text-zinc-500 text-[12px] mt-5">Free plan · No card needed · Cancel anytime</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-900 px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-zinc-600 text-[12px]">
          <div className="flex items-center gap-2.5">
            <Logo size={24} className="w-6 h-6 shrink-0" />
            <span className="text-zinc-300 font-medium">Saim</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-zinc-300 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-zinc-300 transition-colors">FAQ</a>
            <Link href="/login" className="hover:text-zinc-300 transition-colors">Login</Link>
          </div>
          <p>© 2026 Saim. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
