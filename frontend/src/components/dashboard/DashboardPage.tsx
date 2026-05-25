'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/src/hooks/use-auth'
import { getDashboard } from '@/src/lib/api/checkin'
import type { DashboardData } from '@/src/types/checkin'

import Greeting           from './Greeting'
import CheckInTodayCTA    from './CheckInTodayCTA'
import MoodHistoryGraph   from './MoodHistoryGraph'
import QuickStatsRow      from './QuickStatsRow'
import StreakCounter       from './StreakCounter'
import InsightsEmptyState from './InsightsEmptyState'
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

  const { today, history, streak, stats } = data!

  return (
    <div className="dashboard-grid">
      {/* Greeting */}
      <Greeting name={name} hasCheckedIn={today !== null} />

      {/* Check-in CTA — only shown if not yet checked in today */}
      {today === null && <CheckInTodayCTA />}

      {/* Mood + energy history graph */}
      <MoodHistoryGraph history={history} />

      {/* Quick stats */}
      <QuickStatsRow stats={stats} />

      {/* Streak */}
      <StreakCounter streak={streak} />

      {/* Insights — empty state in Phase 2 */}
      <InsightsEmptyState />
    </div>
  )
}
