"use client";

import { useEffect, useRef } from "react";

/**
 * A lightweight 3D "agent core": glowing sphere with orbiting rings and
 * message particles, built entirely with CSS 3D transforms (no WebGL).
 * It leans toward the cursor across the whole hero.
 */
export default function HeroOrb({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !finePointer) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--orb-rx", `${ty * -14}deg`);
      el.style.setProperty("--orb-ry", `${tx * 18}deg`);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`orb-scene ${className}`} aria-hidden="true">
      <div className="orb-stage">
        <div className="orb-core" />
        <div className="orb-ring orb-ring-1"><span className="orb-dot" /></div>
        <div className="orb-ring orb-ring-2"><span className="orb-dot orb-dot-cyan" /></div>
        <div className="orb-ring orb-ring-3"><span className="orb-dot orb-dot-emerald" /></div>
      </div>
    </div>
  );
}
