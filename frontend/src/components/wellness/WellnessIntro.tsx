// Intro card from screens-wellness.jsx. One deviation: the mock's last line ended "not to
// optimise yourself" — "optimize" is banned in every spelling (motto-and-voice.md), so it now
// ends "not to fix yourself".

import { InkCard, IllustrationLeaves } from '@/src/components/ui'

export default function WellnessIntro() {
  return (
    <InkCard hand handIntensity={2.4} className="wellness-intro" style={{ padding: '28px 32px' }}>
      <div style={{ flex: '0 0 auto' }}>
        <IllustrationLeaves size={80} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>A friend who&apos;s done this before</div>
        <h2 className="serif italic" style={{ fontSize: 26, fontWeight: 400, marginBottom: 6 }}>
          Your body has rhythms. Here&apos;s a soft way to listen.
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14.5, maxWidth: 640, margin: 0 }}>
          This isn&apos;t a tracker. It&apos;s a gentle guide. Use as much or as little as is useful — the
          goal is to understand yourself, not to fix yourself.
        </p>
      </div>
    </InkCard>
  )
}
