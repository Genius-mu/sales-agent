import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import Logo from "@/app/components/Logo";
import LandingPricing from "@/app/components/LandingPricing";
import Tilt3D from "@/app/components/Tilt3D";
import LiveChatDemo from "@/app/components/LiveChatDemo";
import RoiCalculator from "@/app/components/RoiCalculator";
import PageEffects from "@/app/components/PageEffects";
import TagButton from "@/app/components/TagButton";
import {
  Mascot,
  IconBolt,
  IconTarget,
  IconMail,
  IconMoon,
  IconLink,
  IconVoice,
  IconCode,
  Sparkle,
} from "@/app/components/Illustrations";
import { cookies, headers } from "next/headers";
import { CURRENCY_COOKIE, PLANS, currencyForCountry, isCurrency } from "@/lib/plans";

const SIGNUP = "/login?mode=signup";

const BENEFITS = [
  { Icon: IconBolt, title: "Instant replies", desc: "Answers in seconds." },
  { Icon: IconTarget, title: "Qualifies leads", desc: "Needs, budget, timing." },
  { Icon: IconMail, title: "Grabs emails", desc: "No forms needed." },
  { Icon: IconMoon, title: "Never sleeps", desc: "Works 24/7." },
];

const STEPS = [
  { Icon: IconLink, title: "Paste your link", desc: "Saim learns your business." },
  { Icon: IconVoice, title: "Pick its voice", desc: "Friendly, formal, or fun." },
  { Icon: IconCode, title: "Add one line", desc: "Live on your site." },
];

const INDUSTRIES = [
  "🏠 Real estate", "🦷 Clinics", "🎨 Agencies", "🛍️ Online stores", "🎓 Schools",
  "💼 Consultants", "🏨 Shortlets", "💻 SaaS", "⚖️ Law firms", "🎉 Event planners", "🚗 Car dealers", "🏋️ Gyms",
];

const FAQ = [
  { q: "Will it make things up?", a: "No. It only answers from the info you give it, and you can read every chat." },
  { q: "Will it work on my site?", a: "If you can paste a line of code (WordPress, Wix, Shopify, Webflow…), yes." },
  { q: "Do I need a card?", a: `No. The Free plan gives you ${PLANS.free.monthlyLimit} chats a month.` },
  { q: "Can I cancel?", a: "Anytime, in one click. You drop back to the Free plan." },
];

const CHIPS = [
  { text: "⚡ Replied in 2s", className: "top-[8%] -left-2 sm:left-0" },
  { text: "🎯 Lead qualified", className: "top-[44%] -right-2 sm:right-0 [animation-delay:-2s]" },
  { text: "✉️ Email captured", className: "bottom-[10%] left-[4%] [animation-delay:-4s]" },
];

function Heading({ kicker, title }: { kicker: string; title: React.ReactNode }) {
  return (
    <Reveal className="text-center mb-10 sm:mb-12">
      <span className="inline-block text-[12px] font-semibold text-blue-700 bg-blue-100 border-2 border-slate-900 rounded-full px-3 py-1 mb-4 shadow-[2px_2px_0_#0f172a]">
        {kicker}
      </span>
      <h2 className="text-[30px] sm:text-[44px] font-bold tracking-tight leading-[1.08] text-slate-900">{title}</h2>
    </Reveal>
  );
}

export default async function LandingPage() {
  const savedCurrency = (await cookies()).get(CURRENCY_COOKIE)?.value;
  const initialCurrency = isCurrency(savedCurrency)
    ? savedCurrency
    : currencyForCountry((await headers()).get("x-vercel-ip-country"));

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 font-sans antialiased overflow-x-hidden">
      <PageEffects />

      {/* Soft pastel background + dot grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-32 w-[560px] h-[560px] bg-blue-200/50 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] bg-pink-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[520px] h-[420px] bg-yellow-100/60 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
      </div>

      {/* HEADER: floating pill */}
      <header className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-6">
        <nav className="mx-auto max-w-5xl flex items-center justify-between bg-white/85 backdrop-blur-md border-2 border-slate-900 rounded-2xl pl-3 pr-2 py-2 shadow-[3px_4px_0_#0f172a]">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={30} className="w-[30px] h-[30px] shrink-0" />
            <span className="font-bold text-[17px] tracking-tight">Saim</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[["How it works", "#how"], ["Demo", "#demo"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([label, href]) => (
              <a key={label} href={href} className="text-[14px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block text-[14px] font-medium text-slate-600 hover:text-slate-900 px-3">Sign in</Link>
            <TagButton href={SIGNUP} variant="primary" slant="right" width={118} height={38} className="[&_.tag-btn-label]:text-[14px] [&_.tag-btn-label]:px-3">
              Start free
            </TagButton>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* HERO */}
        <section className="px-5 sm:px-8 pt-28 sm:pt-36 pb-14 sm:pb-20 max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-6 items-center">
          <div className="text-center lg:text-left">
            <Reveal repeat={false} distance={16}>
              <div className="inline-flex items-center gap-1.5 bg-white border-2 border-slate-900 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6 shadow-[2px_3px_0_#0f172a]">
                <Sparkle className="w-4 h-4" />
                Your 24/7{" "}
                <span className="word-swap text-blue-600" style={{ perspective: "400px" }}>
                  <span>sales rep</span>
                  <span>receptionist</span>
                  <span>lead catcher</span>
                  <span>closer</span>
                </span>
              </div>
            </Reveal>
            <Reveal repeat={false} delay={80} distance={20}>
              <h1 className="text-[44px] sm:text-6xl lg:text-[72px] font-bold tracking-tight leading-[1.02] mb-5">
                Turn visitors
                <br />
                into{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">customers.</span>
                  <svg className="absolute left-0 -bottom-1 w-full h-4 z-0" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M3 11 Q 50 3, 100 9 T 197 7" fill="none" stroke="#facc15" strokeWidth="9" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </Reveal>
            <Reveal repeat={false} delay={140} distance={18}>
              <p className="text-slate-600 text-lg sm:text-xl max-w-md mx-auto lg:mx-0 mb-8">
                An AI agent that chats with every visitor and hands you the leads.
              </p>
            </Reveal>
            <Reveal repeat={false} delay={200} distance={16}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-1.5 mb-4">
                <TagButton href={SIGNUP} variant="primary" slant="right" width={232} height={52}>
                  Get my free agent →
                </TagButton>
                <TagButton href="#demo" variant="secondary" slant="left" width={176} height={52}>
                  See it work
                </TagButton>
              </div>
              <p className="text-slate-500 text-[13px]">Free plan · No card · 5-minute setup</p>
            </Reveal>
          </div>

          <Reveal repeat={false} delay={120} distance={24} className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute inset-[12%] rounded-full bg-gradient-to-br from-blue-200 via-indigo-100 to-pink-100 blur-2xl" aria-hidden="true" />
            <div className="absolute inset-[6%] rounded-full border-2 border-dashed border-slate-300 spin-slow" aria-hidden="true" />
            <Tilt3D max={10} glare={false}>
              <Mascot className="relative w-full h-auto" />
            </Tilt3D>
            {CHIPS.map((c) => (
              <div key={c.text} className={`absolute chip-float ${c.className}`}>
                <span className="block bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-[13px] font-semibold shadow-[2px_3px_0_#0f172a] whitespace-nowrap">
                  {c.text}
                </span>
              </div>
            ))}
            <Sparkle className="absolute top-[18%] right-[14%] w-6 h-6 chip-float [animation-delay:-1s]" color="#f9a8d4" />
            <Sparkle className="absolute bottom-[30%] left-[10%] w-5 h-5 chip-float [animation-delay:-3s]" color="#93c5fd" />
          </Reveal>
        </section>

        {/* BENEFITS */}
        <section className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {BENEFITS.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80} className="h-full">
                <Tilt3D max={10}>
                  <div className="h-full bg-white border-2 border-slate-900 rounded-3xl p-5 text-center shadow-[4px_5px_0_#0f172a]">
                    <Icon className="w-20 h-20 mx-auto mb-2 icon-bob" />
                    <h3 className="font-bold text-[17px] mb-0.5">{title}</h3>
                    <p className="text-slate-500 text-[14px]">{desc}</p>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </section>

        {/* INDUSTRIES */}
        <section className="pb-16 sm:pb-24">
          <p className="text-center text-slate-500 text-[14px] font-medium mb-4">Made for businesses that sell by chatting</p>
          <div className="marquee overflow-hidden py-2">
            <div className="marquee-track">
              {[...INDUSTRIES, ...INDUSTRIES].map((name, i) => (
                <span key={i} className="shrink-0 text-[14px] font-medium bg-white border-2 border-slate-900 rounded-full px-4 py-2 shadow-[2px_2px_0_#0f172a]">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-5xl mx-auto scroll-mt-28">
          <Heading kicker="How it works" title={<>Live in <span className="text-blue-600">5 minutes</span></>} />
          <div className="grid sm:grid-cols-3 gap-5">
            {STEPS.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 100} className="h-full">
                <Tilt3D max={8}>
                  <div className="relative h-full bg-white border-2 border-slate-900 rounded-3xl p-6 pt-8 text-center shadow-[4px_5px_0_#0f172a]">
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-yellow-300 border-2 border-slate-900 flex items-center justify-center font-bold shadow-[2px_2px_0_#0f172a]">
                      {i + 1}
                    </span>
                    <Icon className="w-24 h-24 mx-auto mb-3 icon-bob" />
                    <h3 className="font-bold text-[18px] mb-1">{title}</h3>
                    <p className="text-slate-500 text-[14px]">{desc}</p>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </section>

        {/* DEMO */}
        <section id="demo" className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-5xl mx-auto scroll-mt-28">
          <Heading kicker="Watch it work" title={<>Question in. <span className="text-blue-600">Lead out.</span></>} />
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-center">
            <Reveal direction="left" className="hidden lg:block">
              <Mascot className="w-full max-w-[300px] mx-auto h-auto" waving={false} />
            </Reveal>
            <Reveal direction="right">
              <Tilt3D max={4} glare={false}>
                <LiveChatDemo />
              </Tilt3D>
            </Reveal>
          </div>
        </section>

        {/* ROI */}
        <section className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-5xl mx-auto">
          <Heading kicker="Do the maths" title={<>What are you <span className="text-blue-600">missing?</span></>} />
          <Reveal>
            <RoiCalculator initialCurrency={initialCurrency} />
          </Reveal>
        </section>

        {/* PRICING */}
        <section id="pricing" className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-5xl mx-auto scroll-mt-28">
          <Heading kicker="Pricing" title={<>Less than <span className="text-blue-600">one lost sale</span></>} />
          <LandingPricing initialCurrency={initialCurrency} />
          <p className="text-center text-slate-500 text-[14px]">
            Or start on the <Link href={SIGNUP} className="font-semibold text-slate-900 underline decoration-yellow-400 decoration-4 underline-offset-2">Free plan</Link>: {PLANS.free.monthlyLimit} chats a month, no card.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-3xl mx-auto scroll-mt-28">
          <Heading kicker="FAQ" title="Quick answers" />
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 50}>
                <details className="group bg-white border-2 border-slate-900 rounded-2xl px-5 py-4 shadow-[3px_4px_0_#0f172a]">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-[16px] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="shrink-0 w-7 h-7 rounded-full bg-yellow-300 border-2 border-slate-900 flex items-center justify-center font-bold transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="text-slate-600 text-[15px] mt-3 form-swap">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 sm:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto">
          <Reveal distance={28}>
            <div className="relative overflow-hidden bg-blue-600 border-2 border-slate-900 rounded-[32px] px-6 sm:px-12 py-10 sm:py-12 shadow-[6px_7px_0_#0f172a] grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#fff 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} aria-hidden="true" />
              <div className="relative text-center md:text-left">
                <h2 className="text-[32px] sm:text-5xl font-bold tracking-tight leading-[1.05] text-white mb-3">Never miss a lead again.</h2>
                <p className="text-blue-100 text-lg mb-7">Set it up tonight. Wake up to leads.</p>
                <TagButton href={SIGNUP} variant="light" slant="right" width={236} height={52}>
                  Get my free agent →
                </TagButton>
              </div>
              <Mascot className="relative hidden md:block w-[230px] h-auto" />
            </div>
          </Reveal>
        </section>

        <footer className="border-t-2 border-slate-900/10 px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-slate-500 text-[13px]">
          <div className="flex items-center gap-2">
            <Logo size={24} className="w-6 h-6 shrink-0" />
            <span className="font-bold text-slate-900">Saim</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
            <Link href="/login" className="hover:text-slate-900">Login</Link>
          </div>
          <p>© 2026 Saim</p>
        </footer>
      </main>
    </div>
  );
}
