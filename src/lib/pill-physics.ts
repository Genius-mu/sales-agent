/**
 * A tiny 2D physics engine for pill-shaped tags (capsules).
 *
 * Each pill is two particles joined by a rigid stick (Verlet integration),
 * so rotation, stacking and toppling come for free. Collisions use the
 * closest points between the two pills' centre segments. ~150 lines, no deps.
 */

export interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
}

export interface Pill {
  a: Particle;
  b: Particle;
  /** Radius = half the pill height */
  r: number;
  /** Distance between the two end-cap centres = width - height */
  len: number;
}

export interface World {
  pills: Pill[];
  width: number;
  height: number;
  gravity: number;
  /** Velocity kept each step (air drag), 0..1 */
  damping: number;
  /** Sideways velocity kept when touching the floor, 0..1 */
  friction: number;
  iterations: number;
}

export function createPill(cx: number, cy: number, width: number, height: number, angle: number): Pill {
  const r = height / 2;
  const len = Math.max(0, width - height);
  const dx = (Math.cos(angle) * len) / 2;
  const dy = (Math.sin(angle) * len) / 2;
  return {
    a: { x: cx - dx, y: cy - dy, px: cx - dx, py: cy - dy },
    b: { x: cx + dx, y: cy + dy, px: cx + dx, py: cy + dy },
    r,
    len,
  };
}

export function createWorld(width: number, height: number, pills: Pill[] = []): World {
  return { pills, width, height, gravity: 0.5, damping: 0.99, friction: 0.82, iterations: 8 };
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Closest points between segments p1-q1 and p2-q2. Returns params s, t on each. */
function closestParams(
  p1x: number, p1y: number, q1x: number, q1y: number,
  p2x: number, p2y: number, q2x: number, q2y: number,
): [number, number] {
  const d1x = q1x - p1x, d1y = q1y - p1y;
  const d2x = q2x - p2x, d2y = q2y - p2y;
  const rx = p1x - p2x, ry = p1y - p2y;
  const a = d1x * d1x + d1y * d1y;
  const e = d2x * d2x + d2y * d2y;
  const f = d2x * rx + d2y * ry;
  let s: number, t: number;
  if (a <= 1e-9 && e <= 1e-9) return [0, 0];
  if (a <= 1e-9) {
    s = 0;
    t = clamp01(f / e);
  } else {
    const c = d1x * rx + d1y * ry;
    if (e <= 1e-9) {
      t = 0;
      s = clamp01(-c / a);
    } else {
      const b = d1x * d2x + d1y * d2y;
      const denom = a * e - b * b;
      s = denom > 1e-9 ? clamp01((b * f - c * e) / denom) : 0;
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = clamp01(-c / a);
      } else if (t > 1) {
        t = 1;
        s = clamp01((b - c) / a);
      }
    }
  }
  return [s, t];
}

/** Moves the point at parameter s along a pill by (dx, dy), spreading it over both ends. */
function pushPill(p: Pill, s: number, dx: number, dy: number) {
  const wa = 1 - s;
  const wb = s;
  const k = 1 / (wa * wa + wb * wb);
  p.a.x += dx * wa * k;
  p.a.y += dy * wa * k;
  p.b.x += dx * wb * k;
  p.b.y += dy * wb * k;
}

function solveStick(p: Pill) {
  const dx = p.b.x - p.a.x;
  const dy = p.b.y - p.a.y;
  const d = Math.hypot(dx, dy) || 1e-6;
  const diff = (d - p.len) / d / 2;
  p.a.x += dx * diff;
  p.a.y += dy * diff;
  p.b.x -= dx * diff;
  p.b.y -= dy * diff;
}

function solveBounds(w: World, pt: Particle, r: number) {
  if (pt.y > w.height - r) {
    pt.y = w.height - r;
    // floor friction: bleed off sideways speed
    pt.px = pt.x - (pt.x - pt.px) * w.friction;
  }
  if (pt.x < r) {
    pt.x = r;
  } else if (pt.x > w.width - r) {
    pt.x = w.width - r;
  }
}

function solvePair(A: Pill, B: Pill) {
  const [s, t] = closestParams(A.a.x, A.a.y, A.b.x, A.b.y, B.a.x, B.a.y, B.b.x, B.b.y);
  const ax = A.a.x + (A.b.x - A.a.x) * s;
  const ay = A.a.y + (A.b.y - A.a.y) * s;
  const bx = B.a.x + (B.b.x - B.a.x) * t;
  const by = B.a.y + (B.b.y - B.a.y) * t;
  let nx = ax - bx;
  let ny = ay - by;
  const minD = A.r + B.r;
  const d2 = nx * nx + ny * ny;
  if (d2 >= minD * minD) return;
  let d = Math.sqrt(d2);
  if (d < 1e-6) {
    nx = 0;
    ny = -1;
    d = 1e-6;
  } else {
    nx /= d;
    ny /= d;
  }
  const overlap = (minD - d) / 2;
  pushPill(A, s, nx * overlap, ny * overlap);
  pushPill(B, t, -nx * overlap, -ny * overlap);
}

export interface Drag {
  pill: Pill;
  /** 0 = end a, 1 = end b, between = grabbed along the body */
  s: number;
  x: number;
  y: number;
}

/** Advances the world by one fixed step. Returns total motion (for sleep detection). */
export function step(w: World, drag?: Drag | null): number {
  let motion = 0;
  for (const p of w.pills) {
    for (const pt of [p.a, p.b]) {
      const vx = (pt.x - pt.px) * w.damping;
      const vy = (pt.y - pt.py) * w.damping;
      pt.px = pt.x;
      pt.py = pt.y;
      pt.x += vx;
      pt.y += vy + w.gravity;
      motion += Math.abs(vx) + Math.abs(vy);
    }
  }

  for (let it = 0; it < w.iterations; it++) {
    if (drag) {
      const p = drag.pill;
      const gx = p.a.x + (p.b.x - p.a.x) * drag.s;
      const gy = p.a.y + (p.b.y - p.a.y) * drag.s;
      pushPill(p, drag.s, (drag.x - gx) * 0.5, (drag.y - gy) * 0.5);
    }
    const n = w.pills.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) solvePair(w.pills[i], w.pills[j]);
    }
    for (const p of w.pills) {
      solveStick(p);
      solveBounds(w, p.a, p.r);
      solveBounds(w, p.b, p.r);
    }
  }
  return motion;
}

/** Centre position and rotation (radians) for rendering. */
export function pose(p: Pill) {
  return {
    x: (p.a.x + p.b.x) / 2,
    y: (p.a.y + p.b.y) / 2,
    angle: Math.atan2(p.b.y - p.a.y, p.b.x - p.a.x),
  };
}

/** Finds the pill under a point and where along it the point is. */
export function hitTest(w: World, x: number, y: number): Drag | null {
  for (let i = w.pills.length - 1; i >= 0; i--) {
    const p = w.pills[i];
    const dx = p.b.x - p.a.x;
    const dy = p.b.y - p.a.y;
    const l2 = dx * dx + dy * dy;
    const s = l2 > 0 ? clamp01(((x - p.a.x) * dx + (y - p.a.y) * dy) / l2) : 0;
    const cx = p.a.x + dx * s;
    const cy = p.a.y + dy * s;
    if (Math.hypot(x - cx, y - cy) <= p.r) return { pill: p, s, x, y };
  }
  return null;
}
