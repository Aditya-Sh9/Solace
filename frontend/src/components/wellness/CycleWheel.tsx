'use client'

// The circular phase calendar from screens-wellness.jsx. Deviations: arcs come from the person's
// own phase ranges (cycle length aware) instead of fixed angles; geometry uses the deterministic
// sinDeg/cosDeg (the mock used Math.cos/sin, which can break hydration — coding-rules.md); the
// current phase gets a Framer watercolour wash (roadmap 6.8). Arcs are mouse targets only — the
// mini phase cards below are the keyboard path, so the wheel is one labelled image to a reader.

import { motion, useReducedMotion } from 'framer-motion'
import { polar } from '@/src/lib/geometry/circle'
import { PHASE_BY_ID, type PhaseId } from '@/src/lib/wellness/phases'
import type { PhaseRange } from '@/src/types/wellness'

const SIZE = 320
const C = SIZE / 2
const RING_R = 108
const RING_W = 28
const GAP_DEG = 1.4
const f = (n: number) => n.toFixed(3)

function arcPath(startDeg: number, spanDeg: number, r1: number, r2: number): string {
  const [x1, y1] = polar(C, C, r2, startDeg)
  const [x2, y2] = polar(C, C, r2, startDeg + spanDeg)
  const [x3, y3] = polar(C, C, r1, startDeg + spanDeg)
  const [x4, y4] = polar(C, C, r1, startDeg)
  const large = spanDeg > 180 ? 1 : 0
  return `M ${f(x1)} ${f(y1)} A ${r2} ${r2} 0 ${large} 1 ${f(x2)} ${f(y2)} L ${f(x3)} ${f(y3)} A ${r1} ${r1} 0 ${large} 0 ${f(x4)} ${f(y4)} Z`
}

interface CycleWheelProps {
  ranges:       PhaseRange[]
  cycleLength:  number
  day:          number | null      // null → not set up; no marker
  currentPhase: PhaseId | null
  selected:     PhaseId
  onSelect:     (phase: PhaseId) => void
}

export default function CycleWheel({ ranges, cycleLength, day, currentPhase, selected, onSelect }: CycleWheelProps) {
  const degPerDay = 360 / cycleLength
  const angleOf = (d: number) => (d - 1) * degPerDay
  const markers = [1, Math.round(cycleLength / 4) + 1, Math.round(cycleLength / 2) + 1, Math.round((3 * cycleLength) / 4) + 1]
  const label = day
    ? `Day ${day} of about ${cycleLength}, ${PHASE_BY_ID[currentPhase ?? selected].name.toLowerCase()} phase`
    : 'Your cycle, in four phases'
  const current = ranges.find(r => r.phase === currentPhase)
  // The wash breathes slowly; under reduced motion it simply sits there.
  const isStill = useReducedMotion()

  return (
    <div className="cycle-wheel">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={label}>
        <defs>
          {/* Watercolour edge: a fixed-seed turbulence wobble, so it's identical every render. */}
          <filter id="cycle-wash" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="6" />
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {current && (
          <motion.path
            key={current.phase}
            d={arcPath(angleOf(current.startDay) - 2, (current.endDay - current.startDay + 1) * degPerDay + 4, RING_R - RING_W / 2 - 6, RING_R + RING_W / 2 + 6)}
            fill="var(--accent-wash)"
            filter="url(#cycle-wash)"
            initial={{ opacity: 0 }}
            animate={{ opacity: isStill ? 0.7 : [0.55, 0.9, 0.55] }}
            transition={isStill ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {ranges.map(r => {
          const isSelected = r.phase === selected
          const isCurrent = r.phase === currentPhase
          const start = angleOf(r.startDay) + GAP_DEG / 2
          const span = (r.endDay - r.startDay + 1) * degPerDay - GAP_DEG
          return (
            <path
              key={r.phase}
              aria-hidden
              data-phase={r.phase}
              d={arcPath(start, span, RING_R - RING_W / 2, RING_R + RING_W / 2)}
              className="cycle-wheel-arc"
              fill={isSelected ? 'var(--accent-wash)' : 'color-mix(in oklab, var(--accent-wash) 40%, var(--surface))'}
              stroke={isCurrent ? 'var(--accent)' : 'var(--ink-border)'}
              strokeWidth={isCurrent ? 1.4 : 0.8}
              onClick={() => onSelect(r.phase)}
            />
          )
        })}

        {ranges.map(r => {
          const mid = angleOf(r.startDay) + ((r.endDay - r.startDay + 1) * degPerDay) / 2
          const [x, y] = polar(C, C, RING_R + 30, mid)
          const isSelected = r.phase === selected
          return (
            <text key={`${r.phase}-label`} x={f(x)} y={f(y)} textAnchor="middle" dominantBaseline="middle"
              className="cycle-wheel-label" data-selected={isSelected || undefined}>
              {PHASE_BY_ID[r.phase].short.toLowerCase()}
            </text>
          )
        })}

        {markers.map(d => {
          const [x, y] = polar(C, C, RING_R - RING_W / 2 - 10, angleOf(d))
          return (
            <text key={d} x={f(x)} y={f(y)} textAnchor="middle" dominantBaseline="middle" className="cycle-wheel-marker">{d}</text>
          )
        })}

        {day !== null && (() => {
          const [x, y] = polar(C, C, RING_R, angleOf(day) + degPerDay / 2)
          return (
            <g className="cycle-wheel-today">
              <circle cx={f(x)} cy={f(y)} r="9" fill="var(--accent)" opacity="0.25" />
              <circle cx={f(x)} cy={f(y)} r="5.5" fill="var(--accent)" />
              <circle cx={f(x)} cy={f(y)} r="2" fill="var(--paper)" />
            </g>
          )
        })()}

        <text x={C} y={C - 6} textAnchor="middle" className="cycle-wheel-center">
          {PHASE_BY_ID[selected].name.toLowerCase()}
        </text>
        <text x={C} y={C + 16} textAnchor="middle" className="cycle-wheel-center-sub">
          {day !== null && selected === currentPhase ? `day ${day}` : 'phase'}
        </text>
      </svg>
    </div>
  )
}
