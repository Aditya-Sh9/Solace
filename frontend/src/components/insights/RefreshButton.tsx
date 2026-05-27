'use client'

import { useState } from 'react'
import { refreshInsights } from '@/src/lib/api/insights'
import type { Insight } from '@/src/types/insight'

interface RefreshButtonProps {
  onRefreshed: (insights: Insight[]) => void
  compact?: boolean
}

export default function RefreshButton({ onRefreshed, compact = false }: RefreshButtonProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleRefresh() {
    setLoading(true)
    setErrorMsg(null)
    const { data, error } = await refreshInsights()
    setLoading(false)
    if (error) {
      setErrorMsg(error)
      return
    }
    if (data) {
      onRefreshed(data.insights)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: compact ? 'flex-start' : 'center', gap: 6 }}>
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
      {errorMsg && (
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0, maxWidth: 320 }}>
          {errorMsg}
        </p>
      )}
    </div>
  )
}
