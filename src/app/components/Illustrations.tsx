/**
 * Hand-drawn SVG illustrations in a soft "clay 3D" cartoon style:
 * gradient bodies, a darker underside for thickness, white highlights,
 * a bold navy outline and a ground shadow. A few kilobytes each, sharp
 * at any size, and animated with CSS (see globals.css, "Illustrations").
 */

const INK = "#0f172a";

/* ─────────────────────────── Mascot: Saim the bot ─────────────────────────── */

export function Mascot({ className = "", waving = true }: { className?: string; waving?: boolean }) {
  return (
    <svg viewBox="0 0 320 340" className={className} role="img" aria-label="Saim, a friendly robot sales assistant">
      <defs>
        <radialGradient id="m-head" cx="38%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#eef2ff" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </radialGradient>
        <radialGradient id="m-body" cx="35%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="65%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
        <linearGradient id="m-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0b1222" />
        </linearGradient>
        <radialGradient id="m-ball" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse className="ill-shadow" cx="160" cy="320" rx="92" ry="12" fill={INK} opacity="0.12" />

      <g className="ill-float">
        {/* antenna */}
        <g className="mascot-antenna">
          <path d="M160 62 L160 30" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <circle cx="160" cy="24" r="13" fill="url(#m-ball)" stroke={INK} strokeWidth="4" />
          <circle cx="155" cy="19" r="4" fill="#fff" opacity="0.9" />
        </g>

        {/* left arm (static) */}
        <g>
          <rect x="62" y="214" width="34" height="70" rx="17" fill="#1e40af" stroke={INK} strokeWidth="4" transform="rotate(18 79 214)" />
          <circle cx="66" cy="282" r="17" fill="url(#m-head)" stroke={INK} strokeWidth="4" />
        </g>

        {/* right arm (waving) */}
        <g className={waving ? "mascot-wave" : ""} style={{ transformOrigin: "236px 222px" }}>
          <rect x="226" y="150" width="34" height="78" rx="17" fill="#1e40af" stroke={INK} strokeWidth="4" transform="rotate(40 243 228)" />
          <circle cx="294" cy="164" r="18" fill="url(#m-head)" stroke={INK} strokeWidth="4" />
          <circle cx="288" cy="158" r="5" fill="#fff" />
        </g>

        {/* body: depth, face, highlight */}
        <rect x="92" y="200" width="136" height="104" rx="42" fill="#1e3a8a" stroke={INK} strokeWidth="4" transform="translate(0 6)" />
        <rect x="92" y="200" width="136" height="104" rx="42" fill="url(#m-body)" stroke={INK} strokeWidth="4" />
        <ellipse cx="128" cy="222" rx="22" ry="9" fill="#fff" opacity="0.35" />
        {/* chest badge: chat bubble */}
        <g transform="translate(138 236)">
          <rect x="0" y="0" width="44" height="32" rx="12" fill="#fff" stroke={INK} strokeWidth="3.5" />
          <path d="M10 30 L8 42 L20 31" fill="#fff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="13" cy="16" r="3.5" fill="#2563eb" />
          <circle cx="22" cy="16" r="3.5" fill="#2563eb" />
          <circle cx="31" cy="16" r="3.5" fill="#2563eb" />
        </g>

        {/* headset ears */}
        <circle cx="58" cy="134" r="22" fill="#1e40af" stroke={INK} strokeWidth="4" />
        <circle cx="262" cy="134" r="22" fill="#1e40af" stroke={INK} strokeWidth="4" />
        <circle cx="53" cy="128" r="6" fill="#fff" opacity="0.5" />

        {/* head: depth, face, highlight */}
        <rect x="62" y="60" width="196" height="148" rx="58" fill="#a5b4fc" stroke={INK} strokeWidth="4" transform="translate(0 7)" />
        <rect x="62" y="60" width="196" height="148" rx="58" fill="url(#m-head)" stroke={INK} strokeWidth="4" />
        <ellipse cx="108" cy="82" rx="26" ry="10" fill="#fff" opacity="0.9" transform="rotate(-14 108 82)" />

        {/* mic boom */}
        <path d="M262 150 C 262 196, 230 204, 204 196" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <circle cx="200" cy="195" r="8" fill="#334155" stroke={INK} strokeWidth="3.5" />

        {/* face screen */}
        <rect x="88" y="92" width="144" height="88" rx="38" fill="url(#m-screen)" stroke={INK} strokeWidth="4" />
        <ellipse cx="118" cy="104" rx="16" ry="5" fill="#fff" opacity="0.12" />

        {/* eyes (blink) */}
        <g className="mascot-blink" style={{ transformOrigin: "160px 132px" }}>
          <rect x="118" y="116" width="22" height="30" rx="11" fill="#67e8f9" />
          <rect x="180" y="116" width="22" height="30" rx="11" fill="#67e8f9" />
          <circle cx="125" cy="124" r="4" fill="#fff" />
          <circle cx="187" cy="124" r="4" fill="#fff" />
        </g>
        {/* smile + cheeks */}
        <path d="M140 156 Q160 172 180 156" fill="none" stroke="#67e8f9" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="106" cy="160" rx="9" ry="5" fill="#f9a8d4" opacity="0.85" />
        <ellipse cx="214" cy="160" rx="9" ry="5" fill="#f9a8d4" opacity="0.85" />
      </g>
    </svg>
  );
}

/* ─────────────────────────── Clay icon tiles ─────────────────────────── */

type TileTone = "blue" | "yellow" | "pink" | "green" | "violet" | "orange";

const TONES: Record<TileTone, [string, string, string]> = {
  // light, mid, depth
  blue: ["#dbeafe", "#93c5fd", "#60a5fa"],
  yellow: ["#fef9c3", "#fde047", "#eab308"],
  pink: ["#fce7f3", "#f9a8d4", "#ec4899"],
  green: ["#dcfce7", "#86efac", "#22c55e"],
  violet: ["#ede9fe", "#c4b5fd", "#8b5cf6"],
  orange: ["#ffedd5", "#fdba74", "#f97316"],
};

function Tile({ tone, id, children, className = "" }: { tone: TileTone; id: string; children: React.ReactNode; className?: string }) {
  const [light, mid, depth] = TONES[tone];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`t-${id}`} cx="35%" cy="25%" r="85%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={mid} />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="40" ry="6" fill={INK} opacity="0.1" />
      <rect x="14" y="14" width="92" height="88" rx="28" fill={depth} stroke={INK} strokeWidth="3.5" transform="translate(0 5)" />
      <rect x="14" y="14" width="92" height="88" rx="28" fill={`url(#t-${id})`} stroke={INK} strokeWidth="3.5" />
      <ellipse cx="40" cy="27" rx="14" ry="5" fill="#fff" opacity="0.8" transform="rotate(-12 40 27)" />
      {children}
    </svg>
  );
}

export function IconLink({ className = "" }: { className?: string }) {
  return (
    <Tile tone="blue" id="link" className={className}>
      <rect x="30" y="36" width="60" height="46" rx="9" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <path d="M30 48 H90" stroke={INK} strokeWidth="3.5" />
      <circle cx="38" cy="42" r="2.5" fill="#f87171" />
      <circle cx="46" cy="42" r="2.5" fill="#facc15" />
      <circle cx="54" cy="42" r="2.5" fill="#4ade80" />
      <rect x="38" y="56" width="44" height="6" rx="3" fill="#bfdbfe" />
      <rect x="38" y="67" width="28" height="6" rx="3" fill="#bfdbfe" />
      <path d="M70 60 L70 92 L78 84 L84 96 L90 93 L84 81 L95 80 Z" fill="#fff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M62 56 l-6 -6 M70 52 v-8 M78 56 l6 -6" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" />
    </Tile>
  );
}

export function IconVoice({ className = "" }: { className?: string }) {
  return (
    <Tile tone="pink" id="voice" className={className}>
      <path d="M32 40 h56 a10 10 0 0 1 10 10 v20 a10 10 0 0 1 -10 10 h-30 l-14 12 v-12 h-12 a10 10 0 0 1 -10 -10 v-20 a10 10 0 0 1 10 -10 z" fill="#fff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="48" cy="58" r="4" fill={INK} />
      <circle cx="72" cy="58" r="4" fill={INK} />
      <path d="M50 68 Q60 76 70 68" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="42" cy="68" rx="4" ry="2.5" fill="#f9a8d4" />
      <ellipse cx="78" cy="68" rx="4" ry="2.5" fill="#f9a8d4" />
    </Tile>
  );
}

export function IconCode({ className = "" }: { className?: string }) {
  return (
    <Tile tone="violet" id="code" className={className}>
      <rect x="28" y="36" width="64" height="48" rx="10" fill="#1e1b4b" stroke={INK} strokeWidth="3.5" />
      <path d="M46 52 L38 60 L46 68" fill="none" stroke="#a5b4fc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M74 52 L82 60 L74 68" fill="none" stroke="#a5b4fc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M64 48 L56 72" stroke="#f9a8d4" strokeWidth="4" strokeLinecap="round" />
    </Tile>
  );
}

export function IconBolt({ className = "" }: { className?: string }) {
  return (
    <Tile tone="yellow" id="bolt" className={className}>
      <path d="M66 28 L38 64 H56 L50 92 L82 52 H62 Z" fill="#facc15" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" transform="translate(0 3)" opacity="0.5" />
      <path d="M66 28 L38 64 H56 L50 92 L82 52 H62 Z" fill="#fff7cc" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M62 38 L48 58" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </Tile>
  );
}

export function IconTarget({ className = "" }: { className?: string }) {
  return (
    <Tile tone="orange" id="target" className={className}>
      <circle cx="60" cy="62" r="28" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <circle cx="60" cy="62" r="19" fill="#fb7185" stroke={INK} strokeWidth="3" />
      <circle cx="60" cy="62" r="10" fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx="60" cy="62" r="4" fill="#e11d48" />
      <path d="M60 62 L88 34" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M84 30 L94 30 L90 40 Z" fill="#2563eb" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Tile>
  );
}

export function IconMail({ className = "" }: { className?: string }) {
  return (
    <Tile tone="green" id="mail" className={className}>
      <rect x="28" y="40" width="64" height="44" rx="8" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <path d="M30 44 L60 66 L90 44" fill="none" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="86" cy="40" r="12" fill="#22c55e" stroke={INK} strokeWidth="3.5" />
      <path d="M80 40 L85 45 L92 36" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </Tile>
  );
}

export function IconMoon({ className = "" }: { className?: string }) {
  return (
    <Tile tone="violet" id="moon" className={className}>
      <path d="M70 32 A30 30 0 1 0 88 76 A24 24 0 1 1 70 32 Z" fill="#fef08a" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="54" cy="66" r="3" fill="#eab308" opacity="0.6" />
      <path d="M86 34 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M36 38 l1.8 3.6 3.6 1.8 -3.6 1.8 -1.8 3.6 -1.8 -3.6 -3.6 -1.8 3.6 -1.8z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </Tile>
  );
}

/* ─────────────────────────── Floating chips ─────────────────────────── */

export function Sparkle({ className = "", color = "#facc15" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 1 L14.5 9.5 L23 12 L14.5 14.5 L12 23 L9.5 14.5 L1 12 L9.5 9.5 Z" fill={color} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
