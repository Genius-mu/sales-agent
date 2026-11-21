"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type Variant = "primary" | "secondary" | "light";
/**
 * Which way the right edge slants.
 * - "down": top-right corner sticks out, edge slants inward going down
 * - "up":   bottom-right corner sticks out, edge slants inward going up
 * Put a "down" button next to an "up" one so a pair reads as a set.
 */
type Slant = "down" | "up";

const COLORS: Record<Variant, { face: string; rim: string; depth: string; swipe: string; outline: string; text: string }> = {
  primary: { face: "#2563eb", rim: "#93c5fd", depth: "#1e3a8a", swipe: "#3b82f6", outline: "#0b1a4a", text: "text-white" },
  secondary: { face: "#1b1e2c", rim: "#52525b", depth: "#050608", swipe: "#2b2f44", outline: "#000000", text: "text-zinc-100" },
  light: { face: "#ffffff", rim: "#ffffff", depth: "#9ca3af", swipe: "#e4e4e7", outline: "#27272a", text: "text-black" },
};

/** Builds the tag outline for any width/height (the 180×40 original, generalised). */
function tagPath(w: number, h: number, slant: Slant) {
  const y = (v: number) => (slant === "down" ? v : h - v);
  const pts = [
    `M 12,${y(0)}`,
    `L ${w - 14},${y(0)}`,
    `Q ${w},${y(0)} ${w - 2},${y(h * 0.25)}`,
    `L ${w - 12},${y(h * 0.8)}`,
    `Q ${w - 14},${y(h)} ${w - 28},${y(h)}`,
    `L 12,${y(h)}`,
    `Q 0,${y(h)} 0,${y(h - 10)}`,
    `L 0,${y(10)}`,
    `Q 0,${y(0)} 12,${y(0)}`,
    "Z",
  ];
  return pts.join(" ");
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
  slant = "down",
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
            <rect x="0" y="0" width={w} height={h * 0.42} fill="#ffffff" opacity={variant === "light" ? 0.5 : 0.13} />
            {/* Shine that sweeps across on hover */}
            <rect className="tag-btn-shine" x="-60" y={-h} width="26" height={h * 3} fill="#ffffff" opacity="0.35" />
          </g>
          {/* Inner rim + bold outline for the cartoon look */}
          <path d={d} fill="none" stroke={c.rim} strokeOpacity={variant === "light" ? 0 : 0.55} strokeWidth="1.5" transform={`translate(0 0.75)`} />
          <path d={d} fill="none" stroke={c.outline} strokeWidth="2" />
        </g>
      </svg>
      <span className={`tag-btn-label relative z-10 flex items-center justify-center gap-2 px-6 font-semibold text-[15px] whitespace-nowrap ${c.text}`}>
        {children}
      </span>
    </>
  );

  const shared = {
    className: `tag-btn group relative inline-flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded-xl ${
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
