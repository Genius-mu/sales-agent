import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import Logo from "@/app/components/Logo";
import LandingPricing from "@/app/components/LandingPricing";
import Tilt3D from "@/app/components/Tilt3D";
import LiveChatDemo from "@/app/components/LiveChatDemo";
import RoiCalculator from "@/app/components/RoiCalculator";
import PageEffects from "@/app/components/PageEffects";
import TagButton from "@/app/components/TagButton";
import { Sparkle } from "@/app/components/Illustrations";
import DeviceMockup from "@/app/components/DeviceMockup";
import PhysicsTags, { type Tag } from "@/app/components/PhysicsTags";
import ScrollStack from "@/app/components/ScrollStack";
import LagosStreet from "@/app/components/LagosStreet";
import { LegalLinks } from "@/app/components/LegalPage";
import { cookies, headers } from "next/headers";
import { CURRENCY_COOKIE, PLANS, currencyForCountry, isCurrency } from "@/lib/plans";

const SIGNUP = "/login?mode=signup";

const INDUSTRY_TAGS: Tag[] = [
  { label: "Real estate", bg: "#2563eb", fg: "#ffffff" },
  { label: "Clinics", bg: "#fde047", fg: "#0f172a" },
  { label: "Online stores", bg: "#0f172a", fg: "#ffffff" },
  { label: "Agencies", bg: "#f9a8d4", fg: "#0f172a" },
  { label: "Schools", bg: "#86efac", fg: "#0f172a" },
  { label: "Consultants", bg: "#c4b5fd", fg: "#0f172a" },
  { label: "Shortlets", bg: "#fb923c", fg: "#0f172a" },
  { label: "SaaS", bg: "#dbeafe", fg: "#1e3a8a" },
  { label: "Law firms", bg: "#4f46e5", fg: "#ffffff" },
  { label: "Event planners", bg: "#14b8a6", fg: "#ffffff" },
  { label: "Car dealers", bg: "#fecdd3", fg: "#0f172a" },
  { label: "Gyms", bg: "#ef4444", fg: "#ffffff" },
  { label: "Restaurants", bg: "#fef3c7", fg: "#0f172a" },
  { label: "Logistics", bg: "#22c55e", fg: "#ffffff" },
  { label: "Coaches", bg: "#e0e7ff", fg: "#3730a3" },
  { label: "Fintech", bg: "#111827", fg: "#ffffff" },
];

const FAQ = [
  { q: "Will it make things up?", a: "No. It only answers from the info you give it, and you can read every chat." },
  { q: "Will it work on my site?", a: "If you can paste a line of code (WordPress, Wix, Shopify, Webflow…), yes." },
  { q: "Do I need a card?", a: `No. The Free plan gives you ${PLANS.free.monthlyLimit} chats a month.` },
  { q: "Can I cancel?", a: "Anytime, in one click. You drop back to the Free plan." },
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
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 font-sans antialiased overflow-x-clip">
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

          <Reveal repeat={false} delay={120} distance={24} className="relative mx-auto w-full max-w-[560px]">
            <DeviceMockup />
          </Reveal>
        </section>

        {/* INDUSTRIES: physics pile */}
        <section className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-end bg-white border-2 border-slate-900 rounded-[32px] shadow-[5px_6px_0_#0f172a] overflow-hidden">
            <Reveal className="p-7 sm:p-10 lg:border-r-2 border-slate-900/10 self-stretch flex flex-col justify-between">
              <div>
                <p className="text-[56px] sm:text-[72px] font-bold leading-none tracking-tight text-blue-600 mb-3">01</p>
                <h2 className="text-[34px] sm:text-[48px] font-bold tracking-tight leading-[1.04]">
                  Made for every business that sells by chatting.
                </h2>
              </div>
              <p className="hidden lg:block text-slate-400 text-[14px] mt-8">👆 Go on, grab one and throw it.</p>
            </Reveal>
            <PhysicsTags tags={INDUSTRY_TAGS} className="h-[380px] sm:h-[440px] w-full" />
          </div>
        </section>

        {/* HOW IT WORKS: scroll stack */}
        <section id="how" className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-5xl mx-auto scroll-mt-28">
          <Heading kicker="How it works" title={<>From visitor to <span className="text-blue-600">customer</span></>} />
          <ScrollStack />
        </section>

        {/* DEMO */}
        <section id="demo" className="px-5 sm:px-8 pb-16 sm:pb-24 max-w-5xl mx-auto scroll-mt-28">
          <Heading kicker="Watch it work" title={<>Question in. <span className="text-blue-600">Lead out.</span></>} />
          <Reveal className="max-w-xl mx-auto">
            <Tilt3D max={4} glare={false}>
              <LiveChatDemo />
            </Tilt3D>
          </Reveal>
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
        <section className="px-5 sm:px-8 pb-6 sm:pb-10 max-w-5xl mx-auto">
          <Reveal distance={28}>
            <div className="relative overflow-hidden bg-blue-600 border-2 border-slate-900 rounded-[32px] px-6 sm:px-12 py-10 sm:py-12 shadow-[6px_7px_0_#0f172a] text-center">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#fff 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} aria-hidden="true" />
              <div className="relative flex flex-col items-center">
                <h2 className="text-[32px] sm:text-5xl font-bold tracking-tight leading-[1.05] text-white mb-3">Never miss a lead again.</h2>
                <p className="text-blue-100 text-lg mb-7">Set it up tonight. Wake up to leads.</p>
                <TagButton href={SIGNUP} variant="light" slant="right" width={236} height={52}>
                  Get my free agent →
                </TagButton>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Lagos street scene (footer illustration) */}
        <div className="relative">
          <LagosStreet className="block w-full h-[260px] sm:h-[340px] lg:h-auto" />
        </div>

        <footer className="bg-[#4b5563] text-slate-300 [&_a:hover]:text-white [&_span.font-bold]:text-white px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-[13px]">
          <div className="flex items-center gap-2">
            <Logo size={24} className="w-6 h-6 shrink-0" />
            <span className="font-bold">Saim</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Link href="/login">Login</Link>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-center sm:text-right">
            <LegalLinks className="justify-center sm:justify-end" />
            <p>© 2026 Saim</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
