'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getInsight } from '@/src/lib/api/insights'
import type { Insight } from '@/src/types/insight'
import InkCard from '@/src/components/ui/InkCard'
import InkButton from '@/src/components/ui/InkButton'
import InsightCard from '@/src/components/ui/InsightCard'
import type { InsightType } from '@/src/components/ui/InsightCard'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const NOT_FOUND_MESSAGE = 'That insight could not be found.'

interface InsightDetailPageProps {
  id: string
}

export default function InsightDetailPage({ id }: InsightDetailPageProps) {
  const hasFetched = useRef(false)
  const [insight, setInsight] = useState<Insight | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)

  const fetchInsight = useCallback(async () => {
    setLoading(true)
    setNotFound(false)
    setError(false)
    const { data, error: fetchError } = await getInsight(id)
    setLoading(false)
    // The backend returns this exact message for a genuine 404 — anything else
    // (network failure, 500, timeout) is a retryable problem, not "not found".
    if (fetchError === NOT_FOUND_MESSAGE) { setNotFound(true); return }
    if (fetchError || !data) { setError(true); return }
    setInsight(data)
  }, [id])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchInsight()
  }, [fetchInsight])

  if (loading) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{
          height: 200, borderRadius: '18px 16px 20px 17px / 17px 18px 16px 19px',
          background: 'var(--surface)', animation: 'ink-pulse 1.6s ease infinite',
        }} />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/insights" style={{ fontSize: 13, color: 'var(--ink-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          ← Back to insights
        </Link>
        <InkCard variant="soft" style={{ padding: '32px 36px' }}>
          <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>
            Something got in the way.
          </p>
          <p style={{ margin: '0 0 20px', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
            Not your fault — try again in a moment?
          </p>
          <InkButton variant="ghost" onClick={() => { hasFetched.current = false; fetchInsight() }}>Try again</InkButton>
        </InkCard>
      </div>
    )
  }

  if (notFound || !insight) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/insights" style={{ fontSize: 13, color: 'var(--ink-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          ← Back to insights
        </Link>
        <InkCard variant="soft" style={{ padding: '32px 36px' }}>
          <p style={{ margin: 0, color: 'var(--ink-soft)' }}>That insight could not be found.</p>
        </InkCard>
      </div>
    )
  }

  const d = new Date(insight.createdAt)
  const dateLabel = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <Link href="/insights" style={{ fontSize: 13, color: 'var(--ink-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
        ← Back to insights
      </Link>

      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 16px' }}>
        {dateLabel}
      </p>

      <InsightCard
        id={insight.id}
        type={insight.type as InsightType}
        title={insight.title}
        body={insight.body}
        flags={insight.flags}
      />

      {insight.flags.length > 0 && (
        <InkCard variant="soft" style={{ marginTop: 20, padding: '22px 28px' }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 12px' }}>
            What we noticed
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {insight.flags.map((flag) => (
              <li key={flag} style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                {humaniseFlag(flag)}
              </li>
            ))}
          </ul>
        </InkCard>
      )}
    </div>
  )
}

function humaniseFlag(flag: string): string {
  const map: Record<string, string> = {
    IRON:             'Iron-rich food intake was low on several days alongside fatigue and cognitive symptoms',
    VITAMIN_D:        'Low mood and limited sunlight overlapped on multiple days',
    MAGNESIUM:        'Poor sleep and elevated stress were both present alongside anxiety symptoms',
    B12:              'Brain fog and fatigue on a plant-based diet over several days',
    VITAMIN_C:        'Low energy and low fruit and vegetable intake over the past week',
    SLEEP_DEBT:       'Average sleep was below 6.5 hours, with several nights under 6 hours',
    DEHYDRATION:      'Water intake was consistently low across the week',
    SEDENTARY:        'Very little outdoor time alongside a low-activity lifestyle',
    SUSTAINED_STRESS: 'Stress levels were high on five or more days this past week',
  }
  return map[flag] ?? flag
}
