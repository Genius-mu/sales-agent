/**
 * Flat illustrated Lagos street for the footer: three local shops, trees,
 * street lights and a yellow danfo driving past. Chat bubbles pop above
 * each shop in turn ("New lead!"), showing Saim at work for real businesses.
 * Pure SVG + CSS animation (see globals.css, "Lagos street").
 */

function Tree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 322) scale(${s})`}>
      <rect x="-5" y="-70" width="10" height="72" rx="3" fill="#5b4a3f" />
      <ellipse cx="-26" cy="-92" rx="38" ry="34" fill="#16a34a" />
      <ellipse cx="22" cy="-100" rx="42" ry="38" fill="#22c55e" />
      <ellipse cx="0" cy="-128" rx="36" ry="32" fill="#4ade80" />
      <ellipse cx="-8" cy="-136" rx="14" ry="8" fill="#86efac" opacity="0.7" />
    </g>
  );
}

function StreetLight({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="-3" y="150" width="6" height="176" fill="#475569" />
      <path d="M0 154 Q 0 138 22 138 L 40 138" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
      <rect x="32" y="134" width="22" height="9" rx="4" fill="#334155" />
      <ellipse className="ls-lamp" cx="43" cy="146" rx="9" ry="4" fill="#fde68a" />
    </g>
  );
}

interface ShopProps {
  x: number;
  w: number;
  wall: string;
  wallDark: string;
  awningA: string;
  awningB: string;
  sign: string;
  signBg: string;
  signFg: string;
  bubble: string;
  bubbleClass: string;
}

function Shop({ x, w, wall, wallDark, awningA, awningB, sign, signBg, signFg, bubble, bubbleClass }: ShopProps) {
  const stripes = Math.round(w / 34);
  const sw = w / stripes;
  return (
    <g transform={`translate(${x} 0)`}>
      {/* building */}
      <rect x="0" y="112" width={w} height="214" fill={wall} />
      <rect x="0" y="112" width={w} height="16" fill={wallDark} />
      <rect x={w - 14} y="112" width="14" height="214" fill={wallDark} opacity="0.35" />
      {/* sign */}
      <rect x={w * 0.14} y="138" width={w * 0.72} height="40" rx="6" fill={signBg} />
      <text x={w / 2} y="165" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="20" fill={signFg}>
        {sign}
      </text>
      {/* awning */}
      {Array.from({ length: stripes }).map((_, i) => (
        <path
          key={i}
          d={`M ${i * sw} 192 L ${(i + 1) * sw} 192 L ${(i + 1) * sw - 2} 216 Q ${(i + 0.5) * sw} 226 ${i * sw + 2} 216 Z`}
          fill={i % 2 ? awningB : awningA}
        />
      ))}
      <rect x="0" y="188" width={w} height="6" fill={wallDark} />
      {/* window + door */}
      <rect x={w * 0.07} y="234" width={w * 0.52} height="76" rx="3" fill="#bfdbfe" />
      <rect x={w * 0.07} y="234" width={w * 0.52} height="76" rx="3" fill="url(#ls-glass)" />
      <rect x={w * 0.07 + 8} y="282" width={w * 0.16} height="28" rx="2" fill={awningA} opacity="0.85" />
      <rect x={w * 0.27 + 8} y="270" width={w * 0.12} height="40" rx="2" fill={awningB === "#ffffff" ? "#94a3b8" : awningB} opacity="0.9" />
      <rect x={w * 0.66} y="234" width={w * 0.24} height="92" rx="2" fill="#1e293b" />
      <rect x={w * 0.66 + 4} y="238" width={w * 0.24 - 8} height="60" rx="1" fill="#93c5fd" opacity="0.55" />
      <circle cx={w * 0.66 + w * 0.24 - 9} cy="292" r="2.5" fill="#fde68a" />
      <rect x={w * 0.7} y="216" width={w * 0.16} height="12" rx="3" fill="#0f172a" />
      <text x={w * 0.78} y="225.5" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="8" fill="#4ade80">OPEN</text>
      {/* chat bubble */}
      <g className={`ls-bubble ${bubbleClass}`} style={{ transformOrigin: `${w * 0.5}px 100px` }}>
        <rect x={w * 0.5 - 78} y="46" width="156" height="44" rx="14" fill="#ffffff" />
        <path d={`M ${w * 0.5 - 10} 89 L ${w * 0.5} 104 L ${w * 0.5 + 10} 89 Z`} fill="#ffffff" />
        <circle cx={w * 0.5 - 56} cy="68" r="12" fill="#2563eb" />
        <text x={w * 0.5 - 56} y="72.5" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="12" fill="#fff">S</text>
        <text x={w * 0.5 - 38} y="65" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="12" fill="#0f172a">New lead! 🎉</text>
        <text x={w * 0.5 - 38} y="80" fontFamily="system-ui, sans-serif" fontSize="10" fill="#64748b">{bubble}</text>
      </g>
    </g>
  );
}

function Danfo() {
  return (
    <g className="ls-danfo">
      <g className="ls-danfo-body">
        {/* body */}
        <path d="M10 40 Q 12 8 44 6 L 190 6 Q 206 6 214 20 L 236 52 Q 242 60 242 72 L 242 96 Q 242 104 234 104 L 14 104 Q 6 104 6 96 L 6 54 Q 6 44 10 40 Z" fill="#facc15" />
        <path d="M6 70 L 242 70 L 242 78 L 6 78 Z" fill="#111827" />
        <path d="M6 84 L 242 84 L 242 88 L 6 88 Z" fill="#111827" />
        <path d="M44 6 L 190 6 Q 206 6 214 20 L 218 26 L 20 26 Q 24 8 44 6 Z" fill="#fde047" />
        {/* windows */}
        <rect x="22" y="30" width="44" height="30" rx="5" fill="#1e293b" />
        <rect x="72" y="30" width="50" height="30" rx="5" fill="#1e293b" />
        <rect x="128" y="30" width="50" height="30" rx="5" fill="#1e293b" />
        <path d="M184 30 L 212 30 L 230 58 Q 231 60 228 60 L 184 60 Z" fill="#1e293b" />
        <path d="M26 34 L 40 34 L 30 56 L 26 56 Z" fill="#ffffff" opacity="0.18" />
        <path d="M76 34 L 92 34 L 80 56 L 76 56 Z" fill="#ffffff" opacity="0.18" />
        <path d="M132 34 L 148 34 L 136 56 L 132 56 Z" fill="#ffffff" opacity="0.18" />
        {/* passengers */}
        <circle cx="96" cy="46" r="7" fill="#7c4a2d" />
        <circle cx="152" cy="47" r="7" fill="#5b3a29" />
        <circle cx="200" cy="47" r="7" fill="#7c4a2d" />
        {/* door line, lights, bumper */}
        <path d="M126 62 L 126 100" stroke="#ca8a04" strokeWidth="2" />
        <rect x="232" y="76" width="10" height="8" rx="2" fill="#fef3c7" />
        <rect x="6" y="76" width="7" height="8" rx="2" fill="#ef4444" />
        <rect x="2" y="98" width="244" height="8" rx="4" fill="#374151" />
        <text x="60" y="66" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="9" fill="#111827" letterSpacing="1">OSHODI · LEKKI · VI</text>
      </g>
      {/* wheels */}
      {[56, 196].map((cx) => (
        <g key={cx} transform={`translate(${cx} 106)`}>
          <circle r="20" fill="#111827" />
          <g className="ls-wheel">
            <circle r="10" fill="#9ca3af" />
            <path d="M0 -10 L0 10 M-10 0 L10 0 M-7 -7 L7 7 M-7 7 L7 -7" stroke="#4b5563" strokeWidth="2" />
          </g>
          <circle r="3" fill="#374151" />
        </g>
      ))}
    </g>
  );
}

export default function LagosStreet({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 440"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      role="img"
      aria-label="A Lagos street with three shops getting new leads from Saim while a yellow danfo bus drives past"
    >
      <defs>
        <linearGradient id="ls-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* clouds */}
      <g className="ls-clouds" fill="#ffffff">
        <g opacity="0.9"><ellipse cx="180" cy="60" rx="60" ry="18" /><ellipse cx="215" cy="48" rx="38" ry="20" /></g>
        <g opacity="0.8"><ellipse cx="920" cy="38" rx="70" ry="16" /><ellipse cx="960" cy="28" rx="40" ry="18" /></g>
        <g opacity="0.85"><ellipse cx="1420" cy="70" rx="55" ry="15" /><ellipse cx="1450" cy="60" rx="32" ry="16" /></g>
      </g>

      {/* distant skyline */}
      <g fill="#c7d2fe" opacity="0.8">
        <rect x="40" y="150" width="70" height="180" />
        <rect x="560" y="120" width="60" height="210" />
        <rect x="610" y="170" width="44" height="160" />
        <rect x="1030" y="135" width="56" height="195" />
        <rect x="1500" y="160" width="80" height="170" />
        <rect x="1520" y="120" width="26" height="40" />
      </g>

      <Shop x={120} w={400} wall="#fef3c7" wallDark="#f59e0b" awningA="#ef4444" awningB="#ffffff" sign="Mama T Foods" signBg="#b91c1c" signFg="#fff7ed" bubble="Jollof tray for 40 guests" bubbleClass="ls-b1" />
      <Shop x={600} w={400} wall="#dbeafe" wallDark="#2563eb" awningA="#2563eb" awningB="#ffffff" sign="Lekki Homes" signBg="#1e3a8a" signFg="#ffffff" bubble="3 bed, moving in 2 weeks" bubbleClass="ls-b2" />
      <Shop x={1080} w={400} wall="#fce7f3" wallDark="#db2777" awningA="#db2777" awningB="#fdf2f8" sign="Glow Salon" signBg="#831843" signFg="#fdf2f8" bubble="Bridal makeup, Saturday" bubbleClass="ls-b3" />

      <Tree x={70} s={0.95} />
      <Tree x={560} s={0.8} />
      <Tree x={1040} s={0.85} />
      <Tree x={1540} s={1} />
      <StreetLight x={540} />
      <StreetLight x={1020} />

      {/* pavement, curb, road */}
      <rect x="0" y="326" width="1600" height="22" fill="#e2e8f0" />
      <rect x="0" y="346" width="1600" height="6" fill="#94a3b8" />
      <rect x="0" y="352" width="1600" height="88" fill="#4b5563" />
      <g className="ls-lanes">
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={i * 90} y="396" width="48" height="5" rx="2" fill="#f8fafc" opacity="0.8" />
        ))}
      </g>

      <g transform="translate(0 252) scale(1.32)">
        <Danfo />
      </g>
    </svg>
  );
}
