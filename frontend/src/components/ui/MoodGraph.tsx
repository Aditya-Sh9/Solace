'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, MOTION_OK, DRAW, hidePath, drawPath } from '@/src/lib/motion';

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

// Unit-circle points every 45° — hardcoded so blob geometry never touches
// Math.sin/cos (engine-approximated → SSR hydration mismatches).
const UNIT_OCTAGON: [number, number][] = [
  [1, 0], [0.7071, 0.7071], [0, 1], [-0.7071, 0.7071],
  [-1, 0], [-0.7071, -0.7071], [0, -1], [0.7071, -0.7071],
];

/** Closed, slightly wobbly ink blot around (cx, cy) — Catmull-Rom through jittered octagon points. */
function inkBlotPath(cx: number, cy: number, r: number, seed: number): string {
  const rng = rand32(seed);
  const pts = UNIT_OCTAGON.map(([ux, uy]) => {
    const rr = r * (0.88 + rng() * 0.24);
    return { x: cx + ux * rr, y: cy + uy * rr };
  });
  const f = (n: number) => n.toFixed(3);
  const n = pts.length;
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d += ` C ${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)},`
      + ` ${f(p2.x - (p3.x - p1.x) / 6)} ${f(p2.y - (p3.y - p1.y) / 6)},`
      + ` ${f(p2.x)} ${f(p2.y)}`;
  }
  return `${d} Z`;
}

interface MoodGraphProps {
  data:    number[];
  energy?: number[];   // optional second series drawn in --accent-soft
  width?:  number;
  height?: number;
  wobble?: number;
  drawOnMount?: boolean; // ink-draw the mood line whenever its data changes
}

export default function MoodGraph({ data, energy, width: initialWidth = 600, height = 240, wobble = 0.2, drawOnMount = false }: MoodGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Lay out in real pixels so dots stay round. With a fixed viewBox and
  // preserveAspectRatio="none" every circle stretched into an oval whenever
  // the card was wider than `width`. SSR (and first client render) still use
  // the `width` prop, so hydration output is unchanged.
  const [width, setWidth] = useState(initialWidth);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w > 0) setWidth(w);
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  const padX = 28;
  const padTop = 18;
  const padBottom = 18;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;
  const N = data.length;
  const isSingle = N === 1;
  const step = innerW / Math.max(N - 1, 1);
  // A lone first check-in sits in the middle, not pinned to the left edge
  const xAt = (i: number) => (isSingle ? width / 2 : padX + i * step);
  const amp = 1.7;
  const baseline = padTop + innerH * 0.5;

  const pts = useMemo(() => data.map((v, i) => ({
    x: xAt(i),
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
    x: xAt(i),
    y: baseline - ((v / 5) - 0.5) * innerH * amp,
  })), [energy, width, height]); // eslint-disable-line react-hooks/exhaustive-deps

  const energyPath = useMemo(
    () => buildPath(energyPts, energyPts.length * 131),
    [energyPts, wobble], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const refs = [1, 2.5, 4];

  // Mood line draws in, dots appear as the ink passes them, then the energy
  // line fades in. The energy line is never stroke-drawn — a dashoffset draw
  // would wipe out its "6 3" dash pattern.
  useGSAP(() => {
    const svg = svgRef.current;
    if (!drawOnMount || !svg) return;
    gsap.matchMedia().add(MOTION_OK, () => {
      const line = svg.querySelector<SVGPathElement>('[data-line="mood"]');
      const energyLine = svg.querySelector('[data-line="energy"]');
      const dots = svg.querySelectorAll('[data-dot]');
      const tl = gsap.timeline();
      if (line) {
        hidePath(line);
        tl.add(drawPath(line), 0);
      }
      if (dots.length) {
        tl.from(dots, {
          opacity: 0,
          duration: 0.3,
          stagger: (DRAW.duration * 0.8) / dots.length,
          ease: 'power1.out',
          clearProps: 'opacity',
        }, 0.1);
      }
      const blot = svg.querySelector('[data-blot]');
      if (blot) {
        tl.from(blot, {
          opacity: 0, scale: 0.6, transformOrigin: '50% 50%',
          duration: 0.6, ease: 'ink-spring', clearProps: 'opacity,transform',
        }, 0.1);
        tl.from(svg.querySelectorAll('[data-lead]'), {
          opacity: 0, duration: 0.6, ease: 'power1.out', clearProps: 'opacity',
        }, 0.3);
      }
      if (energyLine) {
        tl.from(energyLine, { opacity: 0, duration: 0.6, ease: 'power1.out', clearProps: 'opacity' }, 0.6);
      }
    });
  }, { scope: svgRef, dependencies: [path, energyPath, isSingle, drawOnMount], revertOnUpdate: true });

  return (
    <svg
      ref={svgRef}
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
      </defs>
      {refs.map((r, i) => {
        const y = baseline - ((r / 5) - 0.5) * innerH * amp;
        return (
          <line key={i} x1={padX} x2={width - padX} y1={y} y2={y}
            stroke="var(--ink-faint)" strokeWidth="0.7" strokeDasharray="3 5" opacity="0.55" />
        );
      })}
      {energyPath && (
        <path data-line="energy" d={energyPath} fill="none" stroke="var(--accent-soft)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3"
          filter="url(#ink-soften)" opacity="0.75" />
      )}
      <path data-line="mood" d={path} fill="none" stroke="var(--accent)" strokeWidth="2.6"
        strokeLinecap="round" strokeLinejoin="round" filter="url(#ink-soften)" />
      {isSingle ? (() => {
        const p = pts[0];
        const e = energyPts[0];
        return (
          <>
            {/* Dashed lead-in — the line that will grow from here */}
            <path data-lead d={`M ${padX} ${p.y.toFixed(3)} L ${(p.x - 26).toFixed(3)} ${p.y.toFixed(3)}`}
              fill="none" stroke="var(--ink-faint)" strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round" />
            {e && (
              <circle data-lead cx={e.x + 30} cy={e.y} r={4.5} fill="var(--paper)"
                stroke="var(--accent-soft)" strokeWidth="1.6" />
            )}
            <g data-blot>
              <circle cx={p.x} cy={p.y} r={18} fill="var(--accent-wash)" />
              <path d={inkBlotPath(p.x, p.y, 7.5, 211)} fill="var(--accent)" />
            </g>
            {/* Centred so it fits narrow (mobile) cards; sits on whichever side of
                the blot has room, so it never collides with the date labels below */}
            <text data-lead x={p.x} y={p.y > height / 2 ? p.y - 32 : p.y + 44} textAnchor="middle" fill="var(--ink-muted)"
              style={{ fontFamily: 'var(--font-hand)', fontSize: 19 }}>
              day one — the line starts here
            </text>
          </>
        );
      })() : pts.map((p, i) => {
        const isLast = i === pts.length - 1;
        // Last point is a little ink blot with a wash ring; no blur filter —
        // blurred halos read as smudges rather than ink.
        return (
          <g key={i} data-dot>
            <circle cx={p.x} cy={p.y} r={isLast ? 15 : 7} fill="var(--accent-wash)" />
            {isLast
              ? <path d={inkBlotPath(p.x, p.y, 7, 173 + i)} fill="var(--accent)" />
              : <circle cx={p.x} cy={p.y} r={4.4} fill="var(--accent)" />}
          </g>
        );
      })}
    </svg>
  );
}
