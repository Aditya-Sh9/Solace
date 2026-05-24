'use client'

import type { ReactNode } from 'react'
import { Icon } from '@/src/components/ui/Icons'

interface Props {
  heading:  string
  sub?:     string
  children: ReactNode
  onBack:   () => void
  isFirst?: boolean
}

export default function StepFrame({ heading, sub, children, onBack, isFirst }: Props) {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        {!isFirst && (
          <button
            onClick={onBack}
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ink-muted)', fontSize: 13, marginBottom: 24,
              padding: 0, transition: 'color 200ms ease',
            }}
          >
            <Icon.ChevronLeft size={16} /> Back
          </button>
        )}
        <h2 className="serif" style={{
          fontSize: 28, fontWeight: 500,
          letterSpacing: '-0.01em', lineHeight: 1.2,
          margin: '0 0 10px', color: 'var(--ink)',
        }}>
          {heading}
        </h2>
        {sub && (
          <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
            {sub}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}
