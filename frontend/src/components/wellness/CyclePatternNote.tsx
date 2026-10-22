'use client'

// One hedged line about how mood and energy have sat across someone's cycle (roadmap 6.27).
// The backend decides whether there's enough to say and writes the words; this only shows them.
// Quiet by design: while loading, or if the fetch fails, it renders nothing — it's a footnote,
// not a feature. `showWaiting` adds the "a few more check-ins" line (Wellness page only).

import { useEffect, useState } from 'react'
import { getCyclePatterns } from '@/src/lib/api/wellness'
import type { CyclePatterns } from '@/src/types/wellness'

interface CyclePatternNoteProps {
  showWaiting?: boolean
  version?:     number
}

export default function CyclePatternNote({ showWaiting = false, version = 0 }: CyclePatternNoteProps) {
  const [patterns, setPatterns] = useState<CyclePatterns | null>(null)

  useEffect(() => {
    let cancelled = false
    getCyclePatterns().then(({ data, error }) => {
      if (cancelled) return
      if (error) console.error('[wellness] patterns failed:', error)
      setPatterns(data)
    })
    return () => { cancelled = true }
  }, [version])

  if (!patterns) return null
  if (patterns.annotation) {
    return <p className="cycle-pattern-note"><span className="hand">across your cycle —</span> {patterns.annotation}</p>
  }
  if (!showWaiting) return null
  return (
    <p className="cycle-pattern-note cycle-pattern-note--waiting">
      <span className="hand">across your cycle —</span> a few more check-ins on different days of your cycle, and
      we&apos;ll gently say what we notice.
    </p>
  )
}
