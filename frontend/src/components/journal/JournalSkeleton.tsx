// Loading state for the journal — ink-pulse blocks shaped like the spine + open page, no spinner.

function Block({ width = '100%', height, radius = 10 }: { width?: string | number; height: number; radius?: number }) {
  return (
    <div style={{ width, height, borderRadius: radius, background: 'var(--surface-2)', animation: 'ink-pulse 1.4s ease infinite' }} />
  )
}

export default function JournalSkeleton() {
  return (
    <div className="journal-layout" aria-busy="true" aria-label="Opening your journal">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Block width={90} height={26} />
        {[0, 1, 2, 3].map(i => <Block key={i} height={44} />)}
      </div>
      <Block height={560} radius={18} />
    </div>
  )
}
