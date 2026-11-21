"use client";

import { useEffect, useRef, useState } from "react";

const SCRIPT = [
  { from: "agent", text: "Hi! 👋 Looking for something specific today?" },
  { from: "user", text: "Do you do websites for restaurants? How much?" },
  { from: "agent", text: "We do! Restaurant sites start from our Basic package. Is this for one location or several?" },
  { from: "user", text: "Two locations. We want online orders too." },
  { from: "agent", text: "Perfect, online ordering comes with Premium. When do you want to launch?" },
  { from: "user", text: "Before December if possible" },
  { from: "agent", text: "Very doable. What's the best email to send you a quote and timeline?" },
  { from: "user", text: "tunde@mykitchen.ng" },
  { from: "lead", text: "New lead captured · 2 locations · online ordering · launch before Dec" },
] as const;

/**
 * An example conversation that plays out message by message when it
 * scrolls into view, then loops. Pure state + CSS, no libraries.
 */
export default function LiveChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(SCRIPT.length);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let timer: ReturnType<typeof setTimeout>;
    if (count >= SCRIPT.length) {
      timer = setTimeout(() => setCount(0), 4500);
      return () => clearTimeout(timer);
    }
    const next = SCRIPT[count];
    if (next.from === "agent") {
      setTyping(true);
      timer = setTimeout(() => {
        setTyping(false);
        setCount((c) => c + 1);
      }, 1100);
    } else {
      timer = setTimeout(() => setCount((c) => c + 1), count === 0 ? 400 : 1300);
    }
    return () => clearTimeout(timer);
  }, [count, inView]);

  useEffect(() => {
    const box = scrollRef.current;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [count, typing]);

  return (
    <div ref={ref} className="relative rounded-3xl overflow-hidden border-2 border-slate-900 bg-white shadow-[5px_6px_0_#0f172a]">
      <div className="bg-blue-600 border-b-2 border-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-[15px]">🤖</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600" />
          </div>
          <div>
            <p className="text-white text-[14px] font-bold leading-none">Saim</p>
            <p className="text-blue-100 text-[11px] mt-0.5">Online · replies instantly</p>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.14em] text-blue-100 font-semibold">Example</span>
      </div>

      <div ref={scrollRef} className="p-4 space-y-2.5 h-[330px] overflow-y-auto no-scrollbar bg-[#f8fafc]">
        {SCRIPT.slice(0, count).map((msg, i) =>
          msg.from === "lead" ? (
            <div key={i} className="chat-pop flex justify-center pt-1">
              <div className="flex items-center gap-2 bg-green-200 border-2 border-slate-900 text-slate-900 font-semibold text-[12px] px-3 py-2 rounded-xl shadow-[2px_2px_0_#0f172a]">
                <span>🎉</span>
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className={`chat-pop flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-sm border-2 border-slate-900"
                    : "bg-white text-slate-800 rounded-bl-sm border-2 border-slate-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ),
        )}
        {typing && (
          <div className="chat-pop flex justify-start">
            <div className="bg-white border-2 border-slate-900 px-3.5 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
              {[0, 150, 300].map((delay) => (
                <div key={delay} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t-2 border-slate-900 px-3 py-3 flex gap-2">
        <div className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-xl px-3 py-2 text-[12px] text-slate-400">Type a message…</div>
        <div className="bg-blue-600 text-white text-[12px] px-4 py-2 rounded-xl font-bold border-2 border-slate-900">Send</div>
      </div>
    </div>
  );
}
