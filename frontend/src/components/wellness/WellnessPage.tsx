'use client'

// Wellness orchestrator (Phase 6) — built to screens-wellness.jsx: intro → [where you are | focused
// phase] → four phase cards → today's gentle log → myths vs facts. Added: setup state, symptom
// history + cycle pattern line, responsive stacking. Loading / error / ready per the Page State
// Pattern. The focused phase follows today unless someone picks one (or peeks at another day).

import { useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { InkCard } from '@/src/components/ui'
import { useWellness } from '@/src/hooks/use-wellness'
import { useInkEntrance } from '@/src/hooks/use-ink-entrance'
import DashboardError from '@/src/components/dashboard/DashboardError'
import type { PhaseId } from '@/src/lib/wellness/phases'
import WellnessIntro from './WellnessIntro'
import CycleWhereYouAre from './CycleWhereYouAre'
import PhaseFocusCard from './PhaseFocusCard'
import PhaseMiniCards from './PhaseMiniCards'
import SymptomLogCard from './SymptomLogCard'
import SymptomHistory from './SymptomHistory'
import CyclePatternNote from './CyclePatternNote'
import MythsFacts from './MythsFacts'
import WellnessSkeleton from './WellnessSkeleton'

export default function WellnessPage() {
  const wellness = useWellness()
  const { status, overview, log, logState } = wellness
  const [picked, setPicked] = useState<PhaseId | null>(null)
  const [historyVersion, setHistoryVersion] = useState(0)
  const [prevLogState, setPrevLogState] = useState(logState)

  // A kept log refreshes the history below it (derived during render, React's documented pattern).
  if (prevLogState !== logState) {
    setPrevLogState(logState)
    if (logState === 'saved') setHistoryVersion(v => v + 1)
  }

  const scopeRef = useRef<HTMLDivElement>(null)
  useInkEntrance(scopeRef, status === 'ready')

  if (status === 'loading') return <WellnessSkeleton />
  if (status === 'error' || !overview) return <DashboardError onRetry={wellness.retry} />

  const current = overview.today?.phase ?? null
  const selected: PhaseId = picked ?? current ?? 'MENSTRUAL'

  return (
    <MotionConfig reducedMotion="user">
      <div ref={scopeRef} className="wellness-page">
        <div data-enter><WellnessIntro /></div>

        <div className="wellness-top">
          <div data-enter style={{ minWidth: 0 }}>
            <CycleWhereYouAre
              overview={overview}
              selected={selected}
              onSelect={setPicked}
              onSaveSettings={wellness.saveSettings}
              onStarted={wellness.periodStarted}
              onStop={wellness.stopTracking}
            />
          </div>
          <div data-enter style={{ minWidth: 0 }}>
            <PhaseFocusCard
              phase={selected}
              range={overview.ranges.find(r => r.phase === selected)}
              isCurrent={selected === current}
            />
          </div>
        </div>

        <div data-enter>
          <PhaseMiniCards ranges={overview.ranges} selected={selected} current={current} onSelect={setPicked} />
        </div>

        <div data-enter>
          <InkCard hand handIntensity={2.4} style={{ padding: 28 }}>
            <SymptomLogCard log={log} state={logState} onChange={wellness.updateLog} />
            <div className="symptom-history-wrap">
              <div className="eyebrow" style={{ marginBottom: 10 }}>The last five weeks</div>
              <SymptomHistory today={overview.date} version={historyVersion} />
              {overview.settings && <CyclePatternNote showWaiting version={historyVersion} />}
            </div>
          </InkCard>
        </div>

        <div data-enter><MythsFacts /></div>
      </div>
    </MotionConfig>
  )
}
