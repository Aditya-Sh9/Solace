'use client'

import { InkCard, InkButton, Icon, IllustrationPlant } from '@/src/components/ui'

// EmptyJournal from screens-journal.jsx, copy verbatim.
export default function JournalEmpty({ onNew }: { onNew: () => void }) {
  return (
    <InkCard
      hand
      handIntensity={2.4}
      handSeed={4021}
      className="paper-bg"
      style={{ padding: '60px 28px', textAlign: 'center', minHeight: 480, display: 'grid', placeItems: 'center' }}
    >
      <div>
        <IllustrationPlant size={120} />
        <h3 className="serif" style={{ fontSize: 26, fontWeight: 400, fontStyle: 'italic', marginTop: 16, marginBottom: 8 }}>
          A blank notebook.
        </h3>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>
          Nothing here yet — that&apos;s okay. Start with one sentence.
        </p>
        <InkButton variant="primary" icon={<Icon.Plus size={14} />} onClick={onNew}>Begin a page</InkButton>
      </div>
    </InkCard>
  )
}
