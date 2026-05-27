'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Insight } from '@/src/types/insight'
import InsightCard from '@/src/components/ui/InsightCard'
import type { InsightType } from '@/src/components/ui/InsightCard'
import RefreshButton from '@/src/components/insights/RefreshButton'
import InsightsEmptyState from './InsightsEmptyState'

interface DashboardInsightsProps {
  initialInsights: Insight[]
}

export default function DashboardInsights({ initialInsights }: DashboardInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>(initialInsights)

  function handleRefreshed(fresh: Insight[]) {
    if (fresh.length > 0) {
      setInsights(prev => [...fresh, ...prev].slice(0, 3))
    }
  }

  if (insights.length === 0) {
    return <InsightsEmptyState />
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <p className="stat-card-label" style={{ margin: 0 }}>Recent insights</p>
        <RefreshButton onRefreshed={handleRefreshed} compact />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {insights.slice(0, 3).map((insight, i) => (
          <Link key={insight.id} href={`/insights/${insight.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <InsightCard
              id={insight.id}
              type={insight.type as InsightType}
              title={insight.title}
              body={insight.body}
              flags={insight.flags}
              delay={i * 0.08}
            />
          </Link>
        ))}
        <Link href="/insights" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', textAlign: 'right', display: 'block', marginTop: 4 }}>
          View all insights →
        </Link>
      </div>
    </div>
  )
}
