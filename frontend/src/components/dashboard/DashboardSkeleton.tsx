// Skeleton for dashboard loading state — animated ink-pulse rectangles, no spinner.

function SkeletonBlock({ width = '100%', height = 20, radius = 8, className = '' }: {
  width?: string | number; height?: number; radius?: number; className?: string;
}) {
  return (
    <div
      className={`ink-pulse ${className}`}
      style={{
        width, height, borderRadius: radius,
        background: 'var(--surface-2)',
        animation: 'ink-pulse 1.4s ease infinite',
      }}
    />
  )
}

export default function DashboardSkeleton() {
  return (
    <div className="dashboard-grid">
      {/* Greeting skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SkeletonBlock width={220} height={36} radius={10} />
        <SkeletonBlock width={160} height={18} />
      </div>

      {/* CTA card skeleton */}
      <SkeletonBlock height={80} radius={16} />

      {/* Graph skeleton */}
      <div>
        <SkeletonBlock width={100} height={14} radius={6} />
        <div style={{ marginTop: 10 }}>
          <SkeletonBlock height={160} radius={14} />
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className="dashboard-stats-row">
        {[0, 1, 2, 3].map(i => (
          <SkeletonBlock key={i} height={88} radius={14} />
        ))}
      </div>

      {/* Streak skeleton */}
      <SkeletonBlock height={100} radius={16} />

      {/* Insights skeleton */}
      <SkeletonBlock height={80} radius={14} />
    </div>
  )
}
