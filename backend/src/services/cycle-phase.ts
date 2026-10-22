// Cycle phase detection — pure functions, no DB. Dates are calendar days (YYYY-MM-DD or a Date
// at UTC midnight, the way Prisma returns @db.Date), so time zones never shift a day.
//
// Boundaries scale with the person's own cycle length. The luteal half is the steadier one
// (~14 days), so ovulation is placed at cycleLength − 14 and given a 3-day window; follicular
// fills the gap after the period. For 28/5 this is exactly the design reference: 1–5, 6–13,
// 14–16, 17–28. Every phase keeps at least one day, however short the cycle.

export type CyclePhaseId = 'MENSTRUAL' | 'FOLLICULAR' | 'OVULATORY' | 'LUTEAL'

export const PHASE_ORDER: CyclePhaseId[] = ['MENSTRUAL', 'FOLLICULAR', 'OVULATORY', 'LUTEAL']

export const CYCLE_LENGTH_MIN = 21
export const CYCLE_LENGTH_MAX = 45
export const PERIOD_LENGTH_MIN = 2
export const PERIOD_LENGTH_MAX = 10

export interface CycleSettings {
  lastPeriodStart: string   // YYYY-MM-DD
  cycleLength:     number
  periodLength:    number
}

export interface PhaseRange {
  phase:    CyclePhaseId
  startDay: number   // 1-based, inclusive
  endDay:   number   // inclusive
}

export interface CycleToday {
  day:           number
  phase:         CyclePhaseId
  daysUntilNext: number   // days until the next phase begins (1 = tomorrow)
  nextPhase:     CyclePhaseId
  // True once more than one cycle has passed since the logged start: the day is projected
  // forward from an older anchor, so the UI invites "it started today".
  projected:     boolean
}

const DAY_MS = 86_400_000

export function toDayNumber(date: string | Date): number {
  const iso = typeof date === 'string' ? date.slice(0, 10) : date.toISOString().slice(0, 10)
  return Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY_MS)
}

export function phaseRanges(cycleLength: number, periodLength: number): PhaseRange[] {
  const len = clamp(Math.round(cycleLength), CYCLE_LENGTH_MIN, CYCLE_LENGTH_MAX)
  const menstrualEnd = clamp(Math.round(periodLength), PERIOD_LENGTH_MIN, PERIOD_LENGTH_MAX)
  // At least one follicular day after the period, and at least one luteal day at the end.
  const ovulatoryStart = clamp(len - 14, menstrualEnd + 2, len - 3)
  const ovulatoryEnd = Math.min(ovulatoryStart + 2, len - 1)
  return [
    { phase: 'MENSTRUAL',  startDay: 1,                endDay: menstrualEnd },
    { phase: 'FOLLICULAR', startDay: menstrualEnd + 1, endDay: ovulatoryStart - 1 },
    { phase: 'OVULATORY',  startDay: ovulatoryStart,   endDay: ovulatoryEnd },
    { phase: 'LUTEAL',     startDay: ovulatoryEnd + 1, endDay: len },
  ]
}

export function phaseForDay(day: number, ranges: PhaseRange[]): CyclePhaseId {
  return (ranges.find(r => day >= r.startDay && day <= r.endDay) ?? ranges[ranges.length - 1]).phase
}

// Day-in-cycle for any calendar date on or after the anchor. Earlier dates belong to a cycle we
// know nothing reliable about, so they return null rather than a guess.
export function cycleDayFor(settings: CycleSettings, date: string | Date): { day: number; projected: boolean } | null {
  const since = toDayNumber(date) - toDayNumber(settings.lastPeriodStart)
  if (since < 0) return null
  const len = clamp(Math.round(settings.cycleLength), CYCLE_LENGTH_MIN, CYCLE_LENGTH_MAX)
  return { day: (since % len) + 1, projected: since >= len }
}

export function phaseOn(settings: CycleSettings, date: string | Date): CyclePhaseId | null {
  const at = cycleDayFor(settings, date)
  if (!at) return null
  return phaseForDay(at.day, phaseRanges(settings.cycleLength, settings.periodLength))
}

export function cycleToday(settings: CycleSettings, today: string | Date): CycleToday | null {
  const at = cycleDayFor(settings, today)
  if (!at) return null
  const ranges = phaseRanges(settings.cycleLength, settings.periodLength)
  const idx = ranges.findIndex(r => at.day >= r.startDay && at.day <= r.endDay)
  const current = ranges[idx === -1 ? ranges.length - 1 : idx]
  const next = ranges[(ranges.indexOf(current) + 1) % ranges.length]
  return {
    day:           at.day,
    phase:         current.phase,
    daysUntilNext: current.endDay - at.day + 1,
    nextPhase:     next.phase,
    projected:     at.projected,
  }
}

// "It started today": the observed gap nudges the average a third of the way, and only when it
// looks like a real cycle (21–45 days). A single odd month shouldn't rewrite someone's rhythm.
export function learnCycleLength(previousStart: string | Date | null, newStart: string | Date, cycleLength: number): number {
  if (!previousStart) return cycleLength
  const gap = toDayNumber(newStart) - toDayNumber(previousStart)
  if (gap < CYCLE_LENGTH_MIN || gap > CYCLE_LENGTH_MAX) return cycleLength
  return clamp(Math.round((2 * cycleLength + gap) / 3), CYCLE_LENGTH_MIN, CYCLE_LENGTH_MAX)
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}
