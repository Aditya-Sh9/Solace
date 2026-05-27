// Local types for check-in domain — not imported from shared/ (Phase 1 decision)
import type { Insight } from './insight'

export interface CheckInFormData {
  moodScore:       number        // 1–6
  energyScore:     number        // 1–6
  sleepHours:      number | null
  waterGlasses:    number | null
  sunlightMinutes: number | null
  stressLevel:     number | null // 1–5
  symptoms:        string[]
  foodGroups:      string[]
  notes:           string
}

export interface CheckInRecord {
  id:              string
  userId:          string
  date:            string        // ISO date string from API
  moodScore:       number
  energyScore:     number
  sleepHours:      number | null
  waterGlasses:    number | null
  sunlightMinutes: number | null
  stressLevel:     number | null
  symptoms:        string[]
  foodGroups:      string[]
  notes:           string | null
  createdAt:       string
}

export interface QuickStats {
  avgMood:    number | null
  avgEnergy:  number | null
  avgSleep:   number | null
  daysLogged: number
}

export interface DashboardData {
  today:    CheckInRecord | null
  history:  CheckInRecord[]
  streak:   number
  stats:    QuickStats
  insights: Insight[]
}
