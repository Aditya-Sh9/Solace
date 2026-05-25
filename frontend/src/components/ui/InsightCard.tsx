'use client'

import { motion } from 'framer-motion'
import InkCard from './InkCard'

export type InsightType = 'ENCOURAGEMENT' | 'RECOMMENDATION' | 'DEFICIENCY_FLAG' | 'PATTERN'

export interface InsightCardProps {
  id:     string
  type:   InsightType
  title:  string
  body:   string
  flags?: string[]
  delay?: number
}

const EYEBROW: Record<InsightType, string> = {
  ENCOURAGEMENT:   'A note',
  RECOMMENDATION:  'Worth trying',
  DEFICIENCY_FLAG: 'Worth noticing',
  PATTERN:         'A pattern',
}

export default function InsightCard({ type, title, body, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      <InkCard variant="note" style={{ padding: 24 }}>
        <p style={{
          fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 8px',
        }}>
          {EYEBROW[type]}
        </p>
        <h3 className="serif" style={{
          fontSize: 19, fontWeight: 500, margin: '0 0 10px', color: 'var(--ink)',
        }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          {body}
        </p>
      </InkCard>
    </motion.div>
  )
}
