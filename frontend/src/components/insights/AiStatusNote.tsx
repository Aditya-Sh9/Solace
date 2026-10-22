'use client'

// Demo-account-only line under the refresh button: did the last refresh come from Gemini or from
// the prepared fallback copy? (user request 2026-10-22; gate in src/lib/dev/ai-status.ts). No mock —
// a quiet Caveat-free caption in the page's muted ink, deliberately not in the product's voice
// because it's a diagnostic, not copy for people (MISSING_REFERENCES.md).

import type { AiStatus } from '@/src/lib/dev/ai-status'

const WHEN = (at: number, now: number): string => {
  const s = Math.max(0, Math.round((now - at) / 1000))
  if (s < 10) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.round(s / 60)
  return m < 60 ? `${m} min ago` : `${Math.round(m / 60)}h ago`
}

export default function AiStatusNote({ status, now }: { status: AiStatus | null; now: number }) {
  if (!status) {
    return <p className="ai-status ai-status--idle">demo only · refresh to see whether Gemini is answering</p>
  }
  const isGemini = status.source === 'gemini'
  return (
    <p className={`ai-status ai-status--${status.source}`} role="status">
      <i aria-hidden className="ai-status-dot" />
      demo only · {isGemini ? 'written by Gemini' : 'Gemini didn’t answer — prepared notes used'} · {WHEN(status.at, now)}
    </p>
  )
}
