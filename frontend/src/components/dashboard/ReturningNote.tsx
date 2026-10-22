'use client'

// Shown once when someone pressed Google on the sign-up page but picked a Google account that
// already has Solace: they're signed in to that account, and this says so instead of the
// sign-up quietly turning into a login (bug, 2026-10-22). The flag rides in on ?returning=1
// from app/auth/callback; it's read after mount and stripped so a refresh doesn't repeat it.
// No mock (MISSING_REFERENCES.md) — the journal's "Page removed." note card, as a dismissible line.

import { useEffect, useState } from 'react'
import { InkCard, Icon } from '@/src/components/ui'

export default function ReturningNote() {
  // Only ever mounts after the dashboard's data has loaded (the server renders the skeleton),
  // so reading the URL in the initializer can't cause a hydration mismatch.
  const [isShown, setIsShown] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('returning'),
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('returning')) return
    params.delete('returning')
    const query = params.toString()
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
  }, [])

  if (!isShown) return null
  return (
    <InkCard variant="note" tilt={-0.6} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <p role="status" style={{ margin: 0, flex: 1, fontSize: 14.5, color: 'var(--ink)' }}>
        You already have a Solace account with this Google account — welcome back.
      </p>
      <button type="button" className="returning-note-close" aria-label="Dismiss" onClick={() => setIsShown(false)}>
        <Icon.Plus size={14} />
      </button>
    </InkCard>
  )
}
