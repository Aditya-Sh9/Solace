'use client'

// Myths vs facts (roadmap 6.22–6.24). The mock shows two columns of three; with thirteen pairs,
// each fact sits beside its own myth so they read as a pair, sources in small print under the
// fact. The first four show; the rest open on request so the page stays calm.

import { useState } from 'react'
import { InkButton } from '@/src/components/ui'
import { MYTHS } from '@/src/lib/wellness/myths'
import MythFactPair from './MythFactPair'

const INITIAL = 4

export default function MythsFacts() {
  const [isAll, setIsAll] = useState(false)
  const shown = isAll ? MYTHS : MYTHS.slice(0, INITIAL)

  return (
    <section aria-labelledby="myths-title">
      <div className="myths-head">
        <h3 id="myths-title" className="serif italic">What you might have heard</h3>
        <h3 className="serif italic myths-head-right" aria-hidden>What&apos;s actually true</h3>
      </div>
      <div className="myths-list">
        {shown.map(m => <MythFactPair key={m.id} pair={m} />)}
      </div>
      {MYTHS.length > INITIAL && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <InkButton size="sm" variant="ghost" onClick={() => setIsAll(v => !v)} aria-expanded={isAll}>
            {isAll ? 'Fewer, please' : `${MYTHS.length - INITIAL} more worth knowing`}
          </InkButton>
        </div>
      )}
    </section>
  )
}
