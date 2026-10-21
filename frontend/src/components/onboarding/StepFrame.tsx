'use client'

// Built to screens-onboarding.jsx's StepCard: hand-drawn paper card, eyebrow, italic serif
// title, sub-line, back/next footer. Deviations (2026-10-21): a corner illustration (`art`) and
// a Caveat margin note (`note`) — our flow asks ten questions to the mock's four, and the bare
// pages read as empty. Neither is in the reference; both reuse existing Illustrations.
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import InkCard from '@/src/components/ui/InkCard'
import InkButton from '@/src/components/ui/InkButton'
import { Icon } from '@/src/components/ui/Icons'
import { MarginDoodle } from '@/src/components/ui/Illustrations'

interface Props {
  eyebrow:   string
  heading:   string
  sub?:      string
  note?:     string
  art?:      ReactNode
  children:  ReactNode
  onBack:    () => void
  onNext:    () => void
  nextLabel?: string
  canNext?:  boolean
  /** Off when the step autofocuses its own input instead. */
  focusHeading?: boolean
}

export default function StepFrame({
  eyebrow, heading, sub, note, art, children,
  onBack, onNext, nextLabel = 'next', canNext = true, focusHeading = true,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  // A new page replaced the old one; move screen-reader and keyboard focus to its question.
  useEffect(() => {
    if (focusHeading) headingRef.current?.focus({ preventScroll: true })
  }, [focusHeading])

  return (
    <InkCard hand handIntensity={2.4} className="onb-page">
      <div className="onb-page-head">
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>
          <h2 ref={headingRef} tabIndex={-1} className="serif italic onb-title">
            {heading}
          </h2>
          {sub && <p className="onb-sub">{sub}</p>}
        </div>
        {art && <div className="onb-art" aria-hidden="true">{art}</div>}
      </div>

      {children}

      {note && (
        <p className="hand onb-note">
          <span aria-hidden="true" className="onb-note-doodle"><MarginDoodle kind="leaf" /></span>
          {note}
        </p>
      )}

      <div className="onb-footer">
        <InkButton variant="ghost" size="sm" onClick={onBack} icon={<Icon.ChevronLeft size={14} />}>
          back
        </InkButton>
        <InkButton
          variant="primary"
          onClick={onNext}
          disabled={!canNext}
          iconRight={<Icon.ChevronRight size={14} />}
        >
          {nextLabel}
        </InkButton>
      </div>
    </InkCard>
  )
}
