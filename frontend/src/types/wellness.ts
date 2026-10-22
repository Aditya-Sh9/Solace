import type { PhaseId } from '@/src/lib/wellness/phases'

export interface CycleSettings {
  lastPeriodStart: string   // YYYY-MM-DD
  cycleLength:     number
  periodLength:    number
}

export interface PhaseRange {
  phase:    PhaseId
  startDay: number
  endDay:   number
}

export interface CycleToday {
  day:           number
  phase:         PhaseId
  daysUntilNext: number
  nextPhase:     PhaseId
  projected:     boolean
}

export interface SymptomLog {
  symptoms:  string[]
  intensity: 1 | 2 | 3 | null
}

export interface CycleOverview {
  settings: CycleSettings | null
  today:    CycleToday | null
  ranges:   PhaseRange[]
  log:      SymptomLog
  date:     string   // server's today, YYYY-MM-DD
}

export interface SymptomLogEntry extends SymptomLog {
  date:  string
  phase: PhaseId | null
}

export type PhaseBand = 'lower' | 'steady' | 'brighter'

export interface CyclePatterns {
  phases: { phase: PhaseId; count: number; mood: PhaseBand | null; energy: PhaseBand | null }[]
  annotation: string | null
  needed:     number
}
