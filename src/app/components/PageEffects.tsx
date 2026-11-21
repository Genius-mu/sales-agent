"use client";

import { useEffect, useRef } from "react";

/**
 * Two light page-wide effects:
 * - a thin scroll-progress bar at the top
 * - a soft spotlight that follows the cursor
 * Both update CSS variables once per frame; nothing re-renders in React.
 */
export default function PageEffects() {
  const barRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 3;

    const apply = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      barRef.current?.style.setProperty("transform", `scaleX(${progress})`);
      if (spotRef.current && finePointer && !reduced) {
        spotRef.current.style.setProperty("--mx", `${mx}px`);
        spotRef.current.style.setProperty("--my", `${my}px`);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      schedule();
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    if (finePointer && !reduced) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={barRef}
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />
      <div ref={spotRef} className="cursor-spotlight" aria-hidden="true" />
    </>
  );
}
