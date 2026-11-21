"use client";

import { useEffect, useRef } from "react";

/**
 * Cards pin to the top as you scroll; each new card slides over the last,
 * and the ones underneath shrink and dim slightly, like a deck.
 * Uses position: sticky plus one rAF-throttled scroll handler.
 */

const STICKY_TOP = 96; // px from the top of the viewport
const STEP = 18; // each later card pins a little lower so the stack edge shows

function VisitorVisual() {
  return (
    <div className="ss-visual bg-white">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-200 bg-slate-50">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 flex-1 text-[11px] text-slate-500 bg-white border border-slate-200 rounded-md px-2 py-0.5">yourbusiness.com/pricing</span>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-3 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
        <div className="h-16 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200" />
        <div className="flex items-center gap-2 pt-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
          </span>
          <span className="text-[12px] text-slate-600 font-medium">Someone is reading your prices…</span>
        </div>
      </div>
    </div>
  );
}

function AnswerVisual() {
  return (
    <div className="ss-visual bg-slate-50 p-4 space-y-2.5">
      <div className="flex justify-end">
        <span className="bg-blue-600 text-white text-[13px] px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%]">Do you deliver to Ikeja?</span>
      </div>
      <div className="flex justify-start">
        <span className="bg-white border border-slate-200 text-slate-800 text-[13px] px-3 py-2 rounded-2xl rounded-bl-sm max-w-[85%] shadow-sm">Yes! Same-day in Ikeja, ₦2,500 delivery. Want me to check stock?</span>
      </div>
      <p className="text-[11px] text-slate-400 text-center">Replied in 2 seconds</p>
    </div>
  );
}

function QualifyVisual() {
  const rows = [
    ["Needs", "3-bedroom flat"],
    ["Budget", "₦4M / year"],
    ["Moving", "In 2 weeks"],
  ];
  return (
    <div className="ss-visual bg-white p-4 space-y-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
          <span className="text-[12px] text-slate-500">{k}</span>
          <span className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
            {v}
            <span className="w-4 h-4 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">✓</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function LeadVisual() {
  return (
    <div className="ss-visual bg-white p-4">
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-white font-bold flex items-center justify-center shrink-0">TA</div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold text-slate-900">Tunde A.</p>
            <span className="text-[10px] font-bold text-orange-700 bg-orange-100 rounded-full px-2 py-0.5">HOT 🔥</span>
          </div>
          <p className="text-[12px] text-slate-500 truncate">tunde@mykitchen.ng · +234 803 •••• 214</p>
          <p className="text-[12px] text-slate-700 mt-1">3-bed in Lekki · ₦4M budget · moving in 2 weeks</p>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 text-center mt-3">Sent to your dashboard and inbox</p>
    </div>
  );
}

const CARDS = [
  { n: "01", title: "A visitor lands", line: "Day or night, someone checks out your site.", bg: "bg-white", Visual: VisitorVisual },
  { n: "02", title: "Saim answers", line: "Instantly, in your voice, from your info.", bg: "bg-yellow-200", Visual: AnswerVisual },
  { n: "03", title: "It qualifies them", line: "Needs, budget and timing, asked naturally.", bg: "bg-pink-200", Visual: QualifyVisual },
  { n: "04", title: "You get the lead", line: "Name, contact and context. Ready to close.", bg: "bg-blue-600 text-white", Visual: LeadVisual },
];

export default function ScrollStack() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)");
    if (reduced || !wide.matches) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      cards.forEach((card, i) => {
        // How many later cards have slid over this one (fractional)
        let covered = 0;
        for (let j = i + 1; j < cards.length; j++) {
          const top = cards[j].getBoundingClientRect().top;
          const pinAt = STICKY_TOP + j * STEP;
          const p = 1 - (top - pinAt) / (vh * 0.6);
          covered += Math.min(1, Math.max(0, p));
        }
        const scale = 1 - covered * 0.05;
        const inner = card.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.style.transform = `scale(${scale})`;
          inner.style.filter = covered > 0 ? `brightness(${1 - covered * 0.06})` : "";
        }
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative">
      {CARDS.map(({ n, title, line, bg, Visual }, i) => (
        <div
          key={n}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          // Stack on tablets/desktops; on phones cards are taller than the
          // screen, so they show as a normal list instead.
          className="md:sticky mb-6 last:mb-0"
          style={{ top: STICKY_TOP + i * STEP, zIndex: i + 1 }}
        >
          <div
            className={`origin-top transition-[filter] rounded-[32px] border-2 border-slate-900 shadow-[5px_6px_0_#0f172a] ${bg} p-6 sm:p-10 grid md:grid-cols-[1fr_1.1fr] gap-6 md:gap-10 items-center min-h-[340px]`}
          >
            <div>
              <p className={`text-[56px] sm:text-[72px] font-bold leading-none tracking-tight mb-3 ${i === 3 ? "text-yellow-300" : "text-blue-600"}`}>{n}</p>
              <h3 className="text-[30px] sm:text-[40px] font-bold tracking-tight leading-[1.05] mb-2">{title}</h3>
              <p className={`text-[16px] sm:text-[18px] ${i === 3 ? "text-blue-100" : "text-slate-600"}`}>{line}</p>
            </div>
            <div className="text-slate-900">
              <Visual />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
