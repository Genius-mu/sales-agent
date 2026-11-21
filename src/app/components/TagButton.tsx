"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type Variant = "primary" | "secondary" | "light";
/**
 * Which edge carries the slant.
 * - "right": the original. Right edge slants from the top (longer) down
 *   to the bottom (shorter).
 * - "left":  the original turned 180°. Left edge slants with the bottom
 *   longer than the top.
 * A "right" button followed by a "left" button interlocks like two halves
 * of one button cut on a diagonal.
 */
type Slant = "right" | "left";

/** Colours tuned for the light theme: bold navy outline = cartoon look. */
const COLORS: Record<Variant, { face: string; rim: string; depth: string; swipe: string; outline: string; text: string }> = {
  primary: { face: "#2563eb", rim: "#93c5fd", depth: "#1e3a8a", swipe: "#3b82f6", outline: "#0f172a", text: "text-white" },
  secondary: { face: "#ffffff", rim: "#ffffff", depth: "#cbd5e1", swipe: "#eff6ff", outline: "#0f172a", text: "text-slate-900" },
  light: { face: "#fde047", rim: "#fef9c3", depth: "#ca8a04", swipe: "#facc15", outline: "#0f172a", text: "text-slate-900" },
};

/** Builds the tag outline for any width/height (the 180×40 original, generalised). */
function tagPath(w: number, h: number, slant: Slant) {
  // "left" is the same shape rotated 180° around the centre.
  const X = (v: number) => (slant === "right" ? v : w - v);
  const Y = (v: number) => (slant === "right" ? v : h - v);
  const p = (x: number, y: number) => `${X(x)},${Y(y)}`;
  return [
    `M ${p(12, 0)}`,
    `L ${p(w - 14, 0)}`,
    `Q ${p(w, 0)} ${p(w - 2, h * 0.25)}`,
    `L ${p(w - 12, h * 0.8)}`,
    `Q ${p(w - 14, h)} ${p(w - 28, h)}`,
    `L ${p(12, h)}`,
    `Q ${p(0, h)} ${p(0, h - 10)}`,
    `L ${p(0, 10)}`,
    `Q ${p(0, 0)} ${p(12, 0)}`,
    "Z",
  ].join(" ");
}

interface TagButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: Variant;
  slant?: Slant;
  /** Fixed width in px (ignored when fullWidth) */
  width?: number;
  height?: number;
  /** Stretch to the parent's width */
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function TagButton({
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  slant = "right",
  width = 220,
  height = 46,
  fullWidth = false,
  className = "",
  ariaLabel,
}: TagButtonProps) {
  const clipId = `tag-clip-${useId().replace(/:/g, "")}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(width);

  useEffect(() => {
    if (!fullWidth || !wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(([entry]) => {
      setMeasured(Math.max(120, Math.round(entry.contentRect.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fullWidth]);

  const w = fullWidth ? measured : width;
  const h = height;
  const d = tagPath(w, h, slant);
  const c = COLORS[variant];

  const inner = (
    <>
      <svg
        className="tag-btn-svg absolute left-0 top-0 overflow-visible pointer-events-none"
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        shapeRendering="geometricPrecision"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={d} />
          </clipPath>
        </defs>

        {/* Cartoon "thickness": a darker copy sitting underneath */}
        <path className="tag-btn-depth" d={d} fill={c.depth} stroke={c.outline} strokeWidth="2" />

        <g className="tag-btn-face">
          <path d={d} fill={c.face} />
          <g clipPath={`url(#${clipId})`}>
            {/* Swipe fill, grows from the left on hover */}
            <rect className="tag-btn-swipe" x="0" y="0" width={w} height={h} fill={c.swipe} />
            {/* Glossy top highlight */}
            <rect x="0" y="0" width={w} height={h * 0.42} fill="#ffffff" opacity={variant === "primary" ? 0.16 : 0.45} />
            {/* Shine that sweeps across on hover */}
            <rect className="tag-btn-shine" x="-60" y={-h} width="26" height={h * 3} fill="#ffffff" opacity="0.35" />
          </g>
          {/* Inner rim + bold outline for the cartoon look */}
          <path d={d} fill="none" stroke={c.rim} strokeOpacity={variant === "secondary" ? 0 : 0.6} strokeWidth="1.5" transform="translate(0 0.75)" />
          <path d={d} fill="none" stroke={c.outline} strokeWidth="2" />
        </g>
      </svg>
      <span className={`tag-btn-label relative z-10 flex items-center justify-center gap-2 px-6 font-semibold text-[15px] whitespace-nowrap ${c.text}`}>
        {children}
      </span>
    </>
  );

  const shared = {
    className: `tag-btn group relative inline-flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl ${
      disabled ? "opacity-50 pointer-events-none" : ""
    }`,
    style: { width: w, height: h, "--w": `${w}px` } as React.CSSProperties,
    "aria-label": ariaLabel,
  };

  let control: React.ReactNode;
  if (href && !disabled) {
    control = href.startsWith("#") || href.startsWith("http") ? (
      <a href={href} {...shared}>{inner}</a>
    ) : (
      <Link href={href} {...shared}>{inner}</Link>
    );
  } else {
    control = (
      <button type={type} onClick={onClick} disabled={disabled} {...shared}>
        {inner}
      </button>
    );
  }

  return (
    <div ref={wrapRef} className={`${fullWidth ? "w-full" : "inline-block"} ${className}`} style={{ height: h + 6 }}>
      {control}
    </div>
  );
}
