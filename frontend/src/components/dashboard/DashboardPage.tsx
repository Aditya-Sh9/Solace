'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/src/hooks/use-auth'
import { getDashboard } from '@/src/lib/api/checkin'
import type { DashboardData } from '@/src/types/checkin'

import Greeting           from './Greeting'
import MoodHistoryGraph   from './MoodHistoryGraph'
import QuickStatsRow      from './QuickStatsRow'
import StreakCounter       from './StreakCounter'
import DashboardInsights from './DashboardInsights'
import DashboardSkeleton  from './DashboardSkeleton'
import DashboardError     from './DashboardError'

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

  if (loading) return <DashboardSkeleton />
  if (error)   return <DashboardError onRetry={() => { hasFetched.current = false; fetchData() }} />

  const { history, streak, stats, insights } = data!

  return (
    <div className="dashboard-grid">
      {/* Greeting — embeds today's check-in + journal CTA buttons */}
      <Greeting name={name} />

      {/* Mood + energy history graph */}
      <MoodHistoryGraph history={history} />

      {/* Quick stats */}
      <QuickStatsRow stats={stats} />

      {/* Streak */}
      <StreakCounter streak={streak} />

      {/* Insights — populated when available, empty state otherwise */}
      <DashboardInsights initialInsights={insights ?? []} />
    </div>
  )
}
