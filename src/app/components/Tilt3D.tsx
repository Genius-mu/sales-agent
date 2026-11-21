"use client";

import { useEffect, useRef } from "react";

/**
 * Tilts its child in 3D toward the cursor, with a soft glare.
 * Cheap: only CSS transforms, updated at most once per animation frame.
 * Turns itself off on touch screens and for reduced-motion users.
 */
export default function Tilt3D({
  children,
  className = "",
  max = 8,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees */
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    let frame = 0;
    let x = 0.5;
    let y = 0.5;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = (e.clientX - rect.left) / rect.width;
      y = (e.clientY - rect.top) / rect.height;
      el.dataset.active = "true";
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      x = 0.5;
      y = 0.5;
      el.dataset.active = "false";
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt-3d ${className}`}>
      <div className="tilt-3d-inner">
        {children}
        {glare && <div className="tilt-3d-glare" aria-hidden="true" />}
      </div>
    </div>
  );
}
