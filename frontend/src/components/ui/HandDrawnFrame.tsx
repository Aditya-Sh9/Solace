'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function mulberry32(a: number): () => number {
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roughRectPath(
  w: number,
  h: number,
  opts: { seed?: number; jitter?: number; radius?: number; edgeSamples?: number } = {}
): string {
  const { seed = 1, jitter = 1.6, radius = 14, edgeSamples = 5 } = opts;
  if (w <= 0 || h <= 0) return '';
  const r = Math.min(radius, Math.min(w, h) / 2);
  const rand = mulberry32(Math.floor(seed * 977 + 1));
  const j  = () => (rand() - 0.5) * 2 * jitter;
  const jc = () => (rand() - 0.5) * jitter;
  const pts: [number, number][] = [];
  const cs = 5;

  for (let i = 0; i <= edgeSamples; i++) pts.push([r + (i * (w - 2 * r)) / edgeSamples + j(), j()]);
  for (let i = 1; i <= cs; i++) { const a = -Math.PI / 2 + (i / cs) * (Math.PI / 2); pts.push([w - r + r * Math.cos(a) + jc(), r + r * Math.sin(a) + jc()]); }
  for (let i = 1; i <= edgeSamples; i++) pts.push([w + j(), r + (i * (h - 2 * r)) / edgeSamples + j()]);
  for (let i = 1; i <= cs; i++) { const a = (i / cs) * (Math.PI / 2); pts.push([w - r + r * Math.cos(a) + jc(), h - r + r * Math.sin(a) + jc()]); }
  for (let i = 1; i <= edgeSamples; i++) pts.push([w - r - (i * (w - 2 * r)) / edgeSamples + j(), h + j()]);
  for (let i = 1; i <= cs; i++) { const a = Math.PI / 2 + (i / cs) * (Math.PI / 2); pts.push([r + r * Math.cos(a) + jc(), h - r + r * Math.sin(a) + jc()]); }
  for (let i = 1; i <= edgeSamples; i++) pts.push([j(), h - r - (i * (h - 2 * r)) / edgeSamples + j()]);
  for (let i = 1; i <= cs; i++) { const a = Math.PI + (i / cs) * (Math.PI / 2); pts.push([r + r * Math.cos(a) + jc(), r + r * Math.sin(a) + jc()]); }

  const N = pts.length;
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    const t = 0.5;
    const cp1x = p1[0] + ((p2[0] - p0[0]) * t) / 6;
    const cp1y = p1[1] + ((p2[1] - p0[1]) * t) / 6;
    const cp2x = p2[0] - ((p3[0] - p1[0]) * t) / 6;
    const cp2y = p2[1] - ((p3[1] - p1[1]) * t) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + ' Z';
}

export interface HandDrawnFrameProps {
  seed?: number;
  jitter?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  dashed?: boolean;
}

export default function HandDrawnFrame({
  seed = 1,
  jitter = 1.6,
  fill = 'var(--surface)',
  stroke = 'var(--ink-soft)',
  strokeWidth = 1.5,
  radius,
  dashed = false,
}: HandDrawnFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const autoRadius = radius != null ? radius : Math.max(10, Math.min(size.w, size.h) * 0.06);

  useEffect(() => {
    const wrap = containerRef.current;
    if (!wrap) return;
    const parent = wrap.parentElement;
    if (!parent) return;
    const measure = () => {
      const { width, height } = parent.getBoundingClientRect();
      setSize({ w: width, h: height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  const path = useMemo(
    () => roughRectPath(size.w, size.h, { seed, jitter, radius: autoRadius }),
    [size.w, size.h, seed, jitter, autoRadius]
  );

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      {size.w > 0 && size.h > 0 && (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
          aria-hidden
        >
          <path
            d={path}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={dashed ? '6 5' : undefined}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </div>
  );
}
