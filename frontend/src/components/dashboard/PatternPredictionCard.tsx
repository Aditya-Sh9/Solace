'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import InkCard from '@/src/components/ui/InkCard'
import { Icon } from '@/src/components/ui/Icons'
import { getPatterns } from '@/src/lib/api/patterns'
import type { PatternsData, PatternEntry, PatternPrediction } from '@/src/types/pattern'

type State =
  | { status: 'loading' }
  | { status: 'hidden' }               // ML down, error, or confidence too low
  | { status: 'learning'; n: number }  // < 14 check-ins
  | { status: 'ready'; data: Extract<PatternsData, { trained: true }> }

export default function PatternPredictionCard() {
  const hasFetched = useRef(false)
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    getPatterns().then(({ data, error }) => {
      if (error || data === null || data === undefined) {
        setState({ status: 'hidden' })
        return
      }
      if (!data.trained) {
        setState({ status: 'learning', n: data.n_samples })
        return
      }
      setState({ status: 'ready', data })
    })
  }, [])

  if (state.status === 'loading') {
    return (
      <div
        className="ink-pulse"
        style={{ height: 80, borderRadius: 14, background: 'var(--surface-2)' }}
      />
    )
  }

  if (state.status === 'hidden') return null

  if (state.status === 'learning') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      >
        <InkCard
          hand
          variant="note"
          style={{
            padding: 22,
            background: 'color-mix(in oklab, var(--paper) 80%, var(--accent-wash))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <Icon.Sparkle size={15} />
            <div className="eyebrow">Your patterns</div>
          </div>
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
            We&rsquo;re still getting to know you — a few more check-ins and something worth noticing might start to emerge.
          </p>
        </InkCard>
      </motion.div>
    )
  }

  // state.status === 'ready'
  const { confidence, prediction, patterns } = state.data

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
    >
      <InkCard
        hand
        variant="note"
        style={{
          padding: 22,
          background: 'color-mix(in oklab, var(--paper) 70%, var(--accent-wash))',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <Icon.Sparkle size={15} />
          <div className="eyebrow">Your patterns</div>
        </div>

        {/* Confidence wording */}
        <p
          className="hand"
          style={{ fontSize: 14, color: 'var(--ink-muted)', marginBottom: 14, fontStyle: 'italic' }}
        >
          {confidence}
        </p>

        {/* Prediction bands */}
        {prediction && (
          <div
            style={{
              display:      'flex',
              gap:          10,
              marginBottom: patterns.length > 0 ? 16 : 0,
              flexWrap:     'wrap',
            }}
          >
            <PredictionBand label="mood tomorrow" band={prediction.mood} />
            <PredictionBand label="energy tomorrow" band={prediction.energy} />
          </div>
        )}

        {/* Pattern copy lines */}
        {patterns.length > 0 && (
          <ul
            style={{
              listStyle:     'none',
              padding:       0,
              margin:        0,
              display:       'flex',
              flexDirection: 'column',
              gap:           8,
            }}
          >
            {patterns.map((p: PatternEntry, i: number) => (
              <li
                key={i}
                style={{
                  fontSize:    14.5,
                  color:       'var(--ink-soft)',
                  lineHeight:  1.5,
                  paddingLeft: 14,
                  position:    'relative',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position:    'absolute',
                    left:        0,
                    top:         '0.45em',
                    width:       5,
                    height:      5,
                    borderRadius: '50%',
                    background:  'var(--accent-soft)',
                    display:     'inline-block',
                  }}
                />
                {p.copy}
              </li>
            ))}
          </ul>
        )}
      </InkCard>
    </motion.div>
  )
}

function PredictionBand({ label, band }: { label: string; band: PatternPrediction['mood'] }) {
  const colorMap: Record<'lower' | 'steady' | 'brighter', string> = {
    lower:    'var(--ink-faint)',
    steady:   'var(--accent-soft)',
    brighter: 'var(--accent)',
  }

  return (
    <div
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          6,
        padding:      '4px 12px',
        borderRadius: '14px 6px 12px 8px / 8px 14px 6px 12px',
        background:   'var(--surface)',
        border:       '1px solid var(--ink-border)',
        fontSize:     13,
      }}
    >
      <span style={{ color: 'var(--ink-muted)', textTransform: 'lowercase' }}>{label}</span>
      <span style={{ color: colorMap[band], fontWeight: 500, fontSize: 13.5 }}>{band}</span>
    </div>
  )
}
