// One myth beside its fact — card styles from screens-wellness.jsx (MythCard / FactCard).
// The myth gets a soft accent strikethrough, the fact a warm check, sources in small print.

import { InkCard } from '@/src/components/ui'
import type { MythFact } from '@/src/lib/wellness/myths'

export default function MythFactPair({ pair }: { pair: MythFact }) {
  return (
    <div className="myth-pair">
      <InkCard variant="soft" style={{ padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span className="myth-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M6 17 18 7" />
          </svg>
        </span>
        <p className="myth-text"><span className="sr-only">Myth: </span>{pair.myth}</p>
      </InkCard>
      <InkCard className="fact-card" style={{ padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span className="fact-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5 10 17 19 7" />
          </svg>
        </span>
        <div style={{ minWidth: 0 }}>
          <p className="fact-text"><span className="sr-only">What&apos;s true: </span>{pair.fact}</p>
          <p className="fact-sources">
            {pair.sources.map((s, i) => (
              <span key={s.label}>
                {i > 0 && ' · '}
                {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a> : s.label}
              </span>
            ))}
          </p>
        </div>
      </InkCard>
    </div>
  )
}
