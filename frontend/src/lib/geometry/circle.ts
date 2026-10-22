// Engine-identical sine/cosine for SVG geometry. Math.sin/cos are "implementation-approximated"
// (coding-rules.md, defects.md 2026-05-23) and can differ between Node SSR and the browser;
// +, −, × and ÷ are exactly rounded IEEE operations, so a Taylor series built from them gives the
// same bits everywhere. Accurate to ~1e-12 after range reduction — far below a pixel.

const PI = 3.141592653589793

// Angle in degrees → sine. Reduced to [-90°, 90°] first so the series converges fast.
export function sinDeg(deg: number): number {
  let d = deg % 360
  if (d > 180) d -= 360
  if (d < -180) d += 360
  if (d > 90) d = 180 - d
  if (d < -90) d = -180 - d
  const x = (d * PI) / 180
  const x2 = x * x
  let term = x
  let sum = x
  for (let n = 1; n <= 9; n++) {
    term = (-term * x2) / ((2 * n) * (2 * n + 1))
    sum += term
  }
  return sum
}

export function cosDeg(deg: number): number {
  return sinDeg(deg + 90)
}

// Point on a circle, 0° at 12 o'clock, clockwise — the way a clock (and the cycle wheel) reads.
export function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  return [cx + sinDeg(deg) * r, cy - cosDeg(deg) * r]
}
