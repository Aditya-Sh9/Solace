'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getInsights } from '@/src/lib/api/insights'
import type { Insight } from '@/src/types/insight'
import InsightCard from '@/src/components/ui/InsightCard'
import type { InsightType } from '@/src/components/ui/InsightCard'
import InsightsHeader from './InsightsHeader'
import InsightsEmpty  from './InsightsEmpty'
import RefreshButton  from './RefreshButton'

export default function InsightsListPage() {
  const hasFetched = useRef(false)
  const [insights, setInsights]   = useState<Insight[]>([])
  const [loading,  setLoading]    = useState(true)
  const [hasData,  setHasData]    = useState(true) // assume enough data until API says otherwise

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    const { data } = await getInsights({ limit: 20 })
    setLoading(false)
    if (data) setInsights(data)
  }, [])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchInsights()
  }, [fetchInsights])

  function handleRefreshed(fresh: Insight[]) {
    if (fresh.length === 0) setHasData(false)
    else setInsights(prev => [...fresh, ...prev])
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <InsightsHeader />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: 100, borderRadius: '18px 16px 20px 17px / 17px 18px 16px 19px',
              background: 'var(--surface)', animation: 'ink-pulse 1.6s ease infinite',
            }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <InsightsHeader />
        <RefreshButton onRefreshed={handleRefreshed} />
      </div>

      {insights.length === 0 ? (
        <InsightsEmpty hasEnoughData={hasData} onRefreshed={handleRefreshed} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {insights.map((insight, i) => (
            <Link
              key={insight.id}
              href={`/insights/${insight.id}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <InsightCard
                id={insight.id}
                type={insight.type as InsightType}
                title={insight.title}
                body={insight.body}
                flags={insight.flags}
                delay={i * 0.06}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
