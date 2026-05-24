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

interface Props { step: number; total: number }

export default function ProgressBar({ step, total }: Props) {
  const progress = step / (total - 1)

  const trackPath = useMemo(() => {
    const rng = mulberry32(42)
    let d = 'M 0.000 8.000'
    for (let x = 30; x <= 400; x += 30) {
      const y = 8 + (rng() - 0.5) * 4
      d += ` L ${x.toFixed(3)} ${y.toFixed(3)}`
    }
    return d
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg viewBox="0 0 400 16" style={{ flex: 1, height: 16, overflow: 'visible' }}>
        <path d={trackPath} stroke="var(--ink-faint)" strokeWidth={2}
          fill="none" strokeLinecap="round" />
        <motion.path
          d={trackPath}
          stroke="var(--accent)" strokeWidth={3}
          fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </svg>
      <span style={{
        fontSize: 12, color: 'var(--ink-muted)',
        whiteSpace: 'nowrap', fontWeight: 500,
      }}>
        {step + 1} / {total}
      </span>
    </div>
  )
}
