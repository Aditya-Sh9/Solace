// Loading state for the Wellness page: wobbly ink-pulse blocks in the page's own layout, no spinner.

const BLOCK = { background: 'var(--surface-2)', borderRadius: '18px 16px 20px 17px / 17px 18px 16px 19px' } as const

export default function WellnessSkeleton() {
  return (
    <div className="wellness-page" aria-busy="true" aria-label="Loading your wellness page">
      <div className="ink-pulse" style={{ ...BLOCK, height: 132 }} />
      <div className="wellness-top">
        <div className="ink-pulse" style={{ ...BLOCK, height: 440 }} />
        <div className="ink-pulse" style={{ ...BLOCK, height: 440 }} />
      </div>
      <div className="phase-mini-grid">
        {[0, 1, 2, 3].map(i => <div key={i} className="ink-pulse" style={{ ...BLOCK, height: 96 }} />)}
      </div>
    </div>
  )
}
