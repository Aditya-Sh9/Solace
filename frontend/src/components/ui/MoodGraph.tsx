'use client';

import { useMemo } from 'react';

// Bitwise PRNG — identical output on every JS engine.
// Math.sin is "implementation-approximated" per ECMAScript spec and can diverge
// between Node.js SSR and browser V8 for large arguments, causing hydration mismatches.
function rand32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface MoodGraphProps {
  data:    number[];
  energy?: number[];   // optional second series drawn in --accent-soft
  width?:  number;
  height?: number;
  wobble?: number;
}

export default function MoodGraph({ data, energy, width = 600, height = 240, wobble = 0.2 }: MoodGraphProps) {
  const padX = 28;
  const padTop = 18;
  const padBottom = 18;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;
  const N = data.length;
  const step = innerW / Math.max(N - 1, 1);
  const amp = 1.7;
  const baseline = padTop + innerH * 0.5;

  const pts = useMemo(() => data.map((v, i) => ({
    x: padX + i * step,
    y: baseline - ((v / 5) - 0.5) * innerH * amp,
    v,
  })), [data, width, height]); // eslint-disable-line react-hooks/exhaustive-deps

  const buildPath = (pointSet: { x: number; y: number }[], seed: number) => {
    if (pointSet.length === 0) return '';
    const rng = rand32(seed);
    const j = (scale: number) => (rng() - 0.5) * 2 * scale;
    const f = (n: number) => n.toFixed(3);
    let d = `M ${f(pointSet[0].x + j(5 * wobble))} ${f(pointSet[0].y + j(3 * wobble))}`;
    const tension = 0.5;
    for (let i = 0; i < pointSet.length - 1; i++) {
      const p0 = pointSet[Math.max(0, i - 1)];
      const p1 = pointSet[i];
      const p2 = pointSet[i + 1];
      const p3 = pointSet[Math.min(pointSet.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) * tension / 2 + j(5 * wobble);
      const cp1y = p1.y + (p2.y - p0.y) * tension / 2 + j(3 * wobble);
      const cp2x = p2.x - (p3.x - p1.x) * tension / 2 + j(5 * wobble);
      const cp2y = p2.y - (p3.y - p1.y) * tension / 2 + j(3 * wobble);
      const ex   = p2.x + j(5 * wobble);
      const ey   = p2.y + j(3 * wobble);
      d += ` C ${f(cp1x)} ${f(cp1y)}, ${f(cp2x)} ${f(cp2y)}, ${f(ex)} ${f(ey)}`;
    }
    return d;
  };

  const path = useMemo(() => buildPath(pts, pts.length * 97), [pts, wobble]); // eslint-disable-line react-hooks/exhaustive-deps

  const energyPts = useMemo(() => (energy ?? []).map((v, i) => ({
    x: padX + i * step,
    y: baseline - ((v / 5) - 0.5) * innerH * amp,
  })), [energy, width, height]); // eslint-disable-line react-hooks/exhaustive-deps

  const energyPath = useMemo(
    () => buildPath(energyPts, energyPts.length * 131),
    [energyPts, wobble], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const refs = [1, 2.5, 4];

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <filter id="ink-soften" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
        <filter id="ink-blob-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      {refs.map((r, i) => {
        const y = baseline - ((r / 5) - 0.5) * innerH * amp;
        return (
          <line key={i} x1={padX} x2={width - padX} y1={y} y2={y}
            stroke="var(--ink-faint)" strokeWidth="0.7" strokeDasharray="3 5" opacity="0.55" />
        );
      })}
      {energyPath && (
        <path d={energyPath} fill="none" stroke="var(--accent-soft)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3"
          filter="url(#ink-soften)" opacity="0.75" />
      )}
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.6"
        strokeLinecap="round" strokeLinejoin="round" filter="url(#ink-soften)" />
      {pts.map((p, i) => {
        const isLast = i === pts.length - 1;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={isLast ? 16 : 7} fill="var(--accent)"
              opacity={isLast ? 0.28 : 0.22} filter="url(#ink-blob-soft)" />
            <circle cx={p.x} cy={p.y} r={isLast ? 9.5 : 4.4} fill="var(--accent)" />
          </g>
        );
      })}
    </svg>
  );
}
