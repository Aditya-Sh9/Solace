// How mood and energy have sat across someone's cycle phases (roadmap 6.26–6.27). Pure: takes
// check-ins that already carry a phase. Speaks only when there's enough to say anything, and
// then in one hedged line — never a rule, never a cause.

import { validateTone } from './gemini/validate'
import { PHASE_ORDER, type CyclePhaseId } from './cycle-phase'

export interface PhasedCheckIn {
  cyclePhase:  CyclePhaseId | null
  moodScore:   number   // 1–6
  energyScore: number   // 1–6
}

export interface PhaseSummary {
  phase:       CyclePhaseId
  count:       number
  // Banded, like the ML card: raw averages never reach the UI.
  mood:        'lower' | 'steady' | 'brighter' | null
  energy:      'lower' | 'steady' | 'brighter' | null
}

export interface CyclePatterns {
  phases:     PhaseSummary[]
  annotation: string | null
  needed:     number   // more phased check-ins before we'll say anything (0 = enough)
}

export const MIN_PER_PHASE = 3
export const MIN_PHASES = 2
// On the 1–6 scale, half a point away from someone's own average is where it starts to show.
const NOTICEABLE = 0.5

const PHASE_WORDS: Record<CyclePhaseId, string> = {
  MENSTRUAL:  'menstrual',
  FOLLICULAR: 'follicular',
  OVULATORY:  'ovulatory',
  LUTEAL:     'luteal',
}

const FALLBACK_STEADY = 'So far your mood and energy look fairly even across your cycle. That can change as more days come in.'

export function summarisePhases(checkIns: PhasedCheckIn[]): CyclePatterns {
  const phased = checkIns.filter((c): c is PhasedCheckIn & { cyclePhase: CyclePhaseId } => c.cyclePhase !== null)
  const groups = PHASE_ORDER.map(phase => {
    const rows = phased.filter(c => c.cyclePhase === phase)
    return {
      phase,
      count:  rows.length,
      mood:   mean(rows.map(r => r.moodScore)),
      energy: mean(rows.map(r => r.energyScore)),
    }
  })

  const ready = groups.filter(g => g.count >= MIN_PER_PHASE)
  const needed = ready.length >= MIN_PHASES
    ? 0
    : (MIN_PHASES - ready.length) * MIN_PER_PHASE - sumShortfallCredit(groups)

  const overallMood   = mean(phased.map(r => r.moodScore))
  const overallEnergy = mean(phased.map(r => r.energyScore))

  const phases: PhaseSummary[] = groups.map(g => ({
    phase:  g.phase,
    count:  g.count,
    mood:   g.count >= MIN_PER_PHASE ? band(g.mood! - overallMood!) : null,
    energy: g.count >= MIN_PER_PHASE ? band(g.energy! - overallEnergy!) : null,
  }))

  if (needed > 0) return { phases, annotation: null, needed }

  // The single clearest difference, energy or mood.
  let best: { phase: CyclePhaseId; metric: 'mood' | 'energy'; delta: number } | null = null
  for (const g of groups.filter(x => x.count >= MIN_PER_PHASE)) {
    for (const metric of ['energy', 'mood'] as const) {
      const delta = g[metric]! - (metric === 'mood' ? overallMood! : overallEnergy!)
      if (Math.abs(delta) >= NOTICEABLE && (!best || Math.abs(delta) > Math.abs(best.delta))) {
        best = { phase: g.phase, metric, delta }
      }
    }
  }

  const annotation = best ? annotate(best.phase, best.metric, best.delta) : FALLBACK_STEADY
  return { phases, annotation: validateTone(annotation).ok ? annotation : FALLBACK_STEADY, needed: 0 }
}

function annotate(phase: CyclePhaseId, metric: 'mood' | 'energy', delta: number): string {
  const where = `your ${PHASE_WORDS[phase]} days`
  if (delta < 0) {
    return metric === 'energy'
      ? `Your energy has tended to sit a little lower in ${where}. Worth noticing — not a rule.`
      : `Your mood has tended to feel a little heavier in ${where}. That's real, and worth noticing.`
  }
  return metric === 'energy'
    ? `Your energy has tended to run a little higher in ${where}. Something to notice.`
    : `Your mood has tended to lift a little in ${where}. Something to notice.`
}

function band(delta: number): 'lower' | 'steady' | 'brighter' {
  if (delta <= -NOTICEABLE) return 'lower'
  if (delta >= NOTICEABLE) return 'brighter'
  return 'steady'
}

function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null
}

// Check-ins already sitting in not-yet-ready phases count toward what's still needed.
function sumShortfallCredit(groups: { count: number }[]): number {
  const partial = groups.filter(g => g.count < MIN_PER_PHASE).map(g => g.count).sort((a, b) => b - a)
  const ready = groups.filter(g => g.count >= MIN_PER_PHASE).length
  return partial.slice(0, Math.max(0, MIN_PHASES - ready)).reduce((a, b) => a + b, 0)
}
