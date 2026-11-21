"use client";

import { useEffect, useRef } from "react";
import { createPill, createWorld, hitTest, pose, step, type Drag, type World } from "@/lib/pill-physics";

export interface Tag {
  label: string;
  bg: string;
  fg: string;
}

const PILL_H = 52;
/** Share of the box the tags may cover; more than this and they jam and never settle. */
const FILL_RATIO = 0.42;
/** Hard stop for the simulation (ms), as a safety net for battery life. */
const MAX_RUN_MS = 12000;

/** A pill looks identical turned 180°, so keep labels the right way up. */
function uprightAngle(a: number) {
  while (a > Math.PI / 2) a -= Math.PI;
  while (a < -Math.PI / 2) a += Math.PI;
  return a;
}

/**
 * Tags that drop in and pile up with real physics when the section scrolls
 * into view. Grab and throw them. The simulation sleeps once everything
 * settles, so it costs nothing while idle.
 */
export default function PhysicsTags({ tags, className = "" }: { tags: Tag[]; className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let els = pillRefs.current.filter((e): e is HTMLDivElement => !!e);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let world: World | null = null;
    let drag: Drag | null = null;
    let frame = 0;
    let calm = 0;
    let started = false;
    let wokeAt = 0;

    const render = () => {
      if (!world) return;
      world.pills.forEach((p, i) => {
        const el = els[i];
        const { x, y, angle } = pose(p);
        el.style.transform = `translate3d(${x - el.offsetWidth / 2}px, ${y - PILL_H / 2}px, 0) rotate(${uprightAngle(angle)}rad)`;
      });
    };

    const loop = () => {
      if (!world) return;
      const motion = step(world, drag);
      render();
      calm = !drag && motion < world.pills.length * 0.15 ? calm + 1 : 0;
      const timedOut = !drag && performance.now() - wokeAt > MAX_RUN_MS;
      frame = calm > 45 || timedOut ? 0 : requestAnimationFrame(loop);
    };

    const wake = () => {
      calm = 0;
      wokeAt = performance.now();
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (started) return;
      started = true;
      const W = box.clientWidth;
      const H = box.clientHeight;
      // Only drop as many tags as fit comfortably (fewer on phones)
      let area = 0;
      const budget = W * H * FILL_RATIO;
      const fitting = els.filter((el) => {
        area += Math.min(el.offsetWidth, W - 8) * PILL_H;
        return area <= budget;
      });
      els.forEach((el) => {
        if (!fitting.includes(el)) el.style.display = "none";
      });
      els = fitting;
      const pills = els.map((el, i) => {
        const w = Math.min(el.offsetWidth, W - 8);
        const x = w / 2 + ((i * 0.618034 * W) % Math.max(1, W - w));
        const p = createPill(x, -PILL_H - i * 46, w, PILL_H, (((i * 47) % 140) - 70) * (Math.PI / 180));
        // a little initial spin so they tumble as they fall
        const spin = ((i % 2 ? 1 : -1) * (1 + (i % 3))) * 0.6;
        p.a.py += spin;
        p.b.py -= spin;
        return p;
      });
      world = createWorld(W, H, pills);
      els.forEach((el) => (el.style.opacity = "1"));
      if (reduced) {
        for (let i = 0; i < 900; i++) step(world);
        render();
      } else {
        wake();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(box);

    const ro = new ResizeObserver(() => {
      if (!world) return;
      world.width = box.clientWidth;
      world.height = box.clientHeight;
      if (!reduced) wake();
    });
    ro.observe(box);

    const local = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (e: PointerEvent) => {
      if (!world || reduced) return;
      const { x, y } = local(e);
      const hit = hitTest(world, x, y);
      if (!hit) return;
      drag = hit;
      box.setPointerCapture(e.pointerId);
      box.dataset.dragging = "true";
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const { x, y } = local(e);
      drag.x = x;
      drag.y = y;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag) return;
      drag = null;
      box.dataset.dragging = "false";
      if (box.hasPointerCapture(e.pointerId)) box.releasePointerCapture(e.pointerId);
      wake();
    };

    box.addEventListener("pointerdown", onDown);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerup", onUp);
    box.addEventListener("pointercancel", onUp);

    return () => {
      io.disconnect();
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
      box.removeEventListener("pointerdown", onDown);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerup", onUp);
      box.removeEventListener("pointercancel", onUp);
    };
  }, [tags]);

  return (
    <div ref={boxRef} className={`physics-box relative overflow-hidden select-none ${className}`}>
      {tags.map((t, i) => (
        <div
          key={t.label}
          ref={(el) => {
            pillRefs.current[i] = el;
          }}
          className="physics-pill absolute left-0 top-0 flex items-center whitespace-nowrap rounded-full border-2 border-slate-900 px-[26px] text-[18px] font-semibold shadow-[2px_3px_0_#0f172a]"
          style={{ height: PILL_H, background: t.bg, color: t.fg, opacity: 0 }}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}
