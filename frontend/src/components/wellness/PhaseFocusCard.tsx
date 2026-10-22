'use client'

// The focused phase card from screens-wellness.jsx. Additions (roadmap 6.15–6.17): movement and
// rest rows, a botanical accent per phase instead of the mock's single plant, and the
// not-medical-advice line every health-adjacent card carries.

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { InkCard, Icon, IllustrationPlant, IllustrationLeaves, IllustrationCup } from '@/src/components/ui'
import { PHASE_BY_ID, dayRangeLabel, type PhaseId } from '@/src/lib/wellness/phases'
import type { PhaseRange } from '@/src/types/wellness'

// Small hand-drawn bloom for the ovulatory card — the open phase.
function Bloom({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M32 58V34" />
      <path d="M32 44c-6-1-10-5-11-10 6 0 10 4 11 10Z" fill="var(--accent-wash)" />
      <path d="M32 20c3-6 9-8 12-6-1 5-6 9-12 10M32 20c-3-6-9-8-12-6 1 5 6 9 12 10" fill="var(--accent-wash)" />
      <path d="M32 24c-2-6 0-12 0-14 2 3 3 9 0 14Z" fill="var(--accent-wash)" />
      <circle cx="32" cy="25" r="2.4" fill="var(--accent)" stroke="none" />
    </svg>
  )
}

const ACCENT: Record<PhaseId, ReactNode> = {
  MENSTRUAL:  <IllustrationLeaves size={56} />,
  FOLLICULAR: <IllustrationPlant size={56} />,
  OVULATORY:  <Bloom />,
  LUTEAL:     <IllustrationCup size={56} />,
}

function Row({ icon, label, text }: { icon: ReactNode; label: string; text: string }) {
  return (
    <div className="phase-row">
      <div className="phase-row-icon" aria-hidden>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 2 }}>{label}</div>
        <div className="phase-row-text">{text}</div>
      </div>
    </div>
  )
}

interface PhaseFocusCardProps {
  phase:     PhaseId
  range:     PhaseRange | undefined
  isCurrent: boolean
}

export default function PhaseFocusCard({ phase, range, isCurrent }: PhaseFocusCardProps) {
  const p = PHASE_BY_ID[phase]
  return (
    <InkCard hand handIntensity={2.6} variant="paper" style={{ padding: 32, position: 'relative', minHeight: '100%' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          <div className="phase-focus-accent">{ACCENT[phase]}</div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {range ? dayRangeLabel(range.startDay, range.endDay) : ''}{isCurrent ? ' · where you are now' : ''}
          </div>
          <h3 className="serif italic phase-focus-name">{p.name}</h3>
          <div className="hand phase-focus-short">“{p.short}”</div>
          <p className="phase-focus-body">{p.body}</p>
          <div className="phase-rows">
            <Row icon={<Icon.Sparkle size={14} />} label="What's likely" text={p.expect} />
            <Row icon={<Icon.Heart size={14} />} label="Kind to try" text={p.suggest.join(' · ')} />
            <Row icon={<Icon.Leaf size={14} />} label="Foods" text={p.foods} />
            <Row icon={<Icon.Sun size={14} />} label="Movement" text={p.movement} />
            <Row icon={<Icon.Moon size={14} />} label="Rest" text={p.rest} />
          </div>
          <p className="phase-focus-fine">Gentle patterns, not medical advice. Every body writes its own version.</p>
        </motion.div>
      </AnimatePresence>
    </InkCard>
  )
}
