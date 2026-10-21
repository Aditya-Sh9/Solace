'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// `current` is the question number (1-based); anything past `total` reads as finished.
interface Props { current: number; total: number }

export default function ProgressBar({ current, total }: Props) {
  const isDone   = current > total
  const progress = Math.min(current, total) / total

  const trackPath = useMemo(() => {
    const rng = mulberry32(42)
    let d = 'M 0.000 8.000'
    for (let x = 30; x <= 400; x += 30) {
      const y = 8 + (rng() - 0.5) * 4
      d += ` L ${x.toFixed(3)} ${y.toFixed(3)}`
    }
    // The loop stops at 390; finish at the edge so the track spans the caption below it.
    return d + ' L 400.000 8.000'
  }, [])

  return (
    <div>
      {/* Lines only, no closed shapes, so stretching with "none" is safe here. */}
      <svg viewBox="0 0 400 16" preserveAspectRatio="none" aria-hidden="true"
        style={{ width: '100%', height: 16, overflow: 'visible', display: 'block' }}>
        <path d={trackPath} stroke="var(--ink-faint)" strokeWidth={2}
          fill="none" strokeLinecap="round" />
        <motion.path
          d={trackPath}
          stroke="var(--accent)" strokeWidth={3}
          fill="none" strokeLinecap="round"
          initial={false}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </svg>
      <div className="onb-progress-caption">
        <span>{isDone ? 'all done' : `step ${current} of ${total}`}</span>
        <span className="hand onb-progress-hint">no rush.</span>
      </div>
    </div>
  )
}
