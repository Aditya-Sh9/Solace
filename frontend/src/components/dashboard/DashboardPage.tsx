'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/src/hooks/use-auth'
import { useInkEntrance } from '@/src/hooks/use-ink-entrance'
import { getDashboard } from '@/src/lib/api/checkin'
import type { DashboardData } from '@/src/types/checkin'

import Greeting                from './Greeting'
import MoodHistoryGraph        from './MoodHistoryGraph'
import QuickStatsRow           from './QuickStatsRow'
import StreakCounter            from './StreakCounter'
import DashboardInsights       from './DashboardInsights'
import PatternPredictionCard   from './PatternPredictionCard'
import DashboardSkeleton       from './DashboardSkeleton'
import DashboardError          from './DashboardError'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const hasFetched = useRef(false)
  const [data,    setData]    = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(false)
    const { data: res, error: err } = await getDashboard()
    setLoading(false)
    if (err || !res) {
      setError(true)
    } else {
      setData(res)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (hasFetched.current) return
    hasFetched.current = true
    fetchData()
  }, [fetchData, authLoading])

  const name = user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? 'there'

  const gridRef = useRef<HTMLDivElement>(null)
  useInkEntrance(gridRef, !loading && !error && data !== null)

  if (loading) return <DashboardSkeleton />
  if (error)   return <DashboardError onRetry={() => { hasFetched.current = false; fetchData() }} />

  const { history, streak, stats, insights } = data!

  // data-enter wrappers stagger in via GSAP. PatternPredictionCard and
  // DashboardInsights are left unwrapped — they already animate with Framer.
  return (
    <div className="dashboard-grid" ref={gridRef}>
      {/* Greeting — embeds today's check-in + journal CTA buttons */}
      <div data-enter><Greeting name={name} /></div>

      {/* Mood + energy history graph */}
      <div data-enter><MoodHistoryGraph history={history} /></div>

      {/* Quick stats */}
      <div data-enter><QuickStatsRow stats={stats} /></div>

      {/* Streak */}
      <div data-enter><StreakCounter streak={streak} /></div>

      {/* Personal ML patterns — independent fetch, silently absent if ML is down */}
      <PatternPredictionCard />

      {/* Insights — populated when available, empty state otherwise */}
      <DashboardInsights initialInsights={insights ?? []} />
    </div>
  )
}
