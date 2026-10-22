'use client'

import { useEffect, useState } from 'react'
import { refreshInsights } from '@/src/lib/api/insights'
import { useAuth } from '@/src/hooks/use-auth'
import { canSeeAiStatus, readAiStatus, writeAiStatus, type AiStatus } from '@/src/lib/dev/ai-status'
import AiStatusNote from './AiStatusNote'
import type { Insight } from '@/src/types/insight'

interface RefreshButtonProps {
  onRefreshed: (insights: Insight[]) => void
  compact?: boolean
  /** When given, the parent shows the "no cards" message (as a RefreshNote) instead of the button. */
  onMessage?: (message: string | null) => void
}

export default function RefreshButton({ onRefreshed, compact = false, onMessage }: RefreshButtonProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Demo account only: was the last refresh written by Gemini or by the prepared fallback copy?
  const { user } = useAuth()
  const showAiStatus = canSeeAiStatus(user?.email)
  // Lazy init: this only mounts after the page's data has loaded (never during SSR), and the line
  // is hidden for everyone else anyway.
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(() => (typeof window === 'undefined' ? null : readAiStatus()))
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!showAiStatus) return
    const tick = window.setInterval(() => setNow(Date.now()), 15_000)
    return () => window.clearInterval(tick)
  }, [showAiStatus])

  async function handleRefresh() {
    setLoading(true)
    setErrorMsg(null)
    onMessage?.(null)
    const { data, error } = await refreshInsights()
    setLoading(false)
    if (error) {
      if (onMessage) onMessage(error)
      else setErrorMsg(error)
      return
    }
    if (data) {
      if (showAiStatus) {
        const next: AiStatus = { source: data.generated, at: Date.now() }
        writeAiStatus(next)
        setAiStatus(next)
        setNow(next.at)
      }
      onRefreshed(data.insights)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: onMessage ? 'flex-end' : 'center', gap: 6 }}>
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="ink-btn"
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            8,
          padding:        compact ? '6px 14px' : '10px 22px',
          fontSize:       compact ? 13 : 14,
          background:     'var(--accent-wash)',
          color:          'var(--accent)',
          border:         '1px solid var(--ink-border)',
          cursor:         loading ? 'not-allowed' : 'pointer',
          opacity:        loading ? 0.6 : 1,
          transition:     'opacity 200ms ease',
        }}
      >
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ transform: loading ? 'rotate(360deg)' : 'none', transition: loading ? 'transform 1s linear' : 'none' }}
        >
          <path d="M7 2a5 5 0 1 1-4.33 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M2 2v2.5h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {loading ? 'Refreshing…' : 'Refresh insights'}
      </button>
      {showAiStatus && <AiStatusNote status={aiStatus} now={now} />}
      {errorMsg && (
        <p role="status" style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0, maxWidth: 320, textAlign: 'center' }}>
          {errorMsg}
        </p>
      )}
    </div>
  )
}
