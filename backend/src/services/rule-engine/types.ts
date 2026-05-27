export type FlagId =
  | 'IRON'
  | 'VITAMIN_D'
  | 'MAGNESIUM'
  | 'B12'
  | 'VITAMIN_C'
  | 'SLEEP_DEBT'
  | 'DEHYDRATION'
  | 'SEDENTARY'
  | 'SUSTAINED_STRESS'

export type InsightType = 'ENCOURAGEMENT' | 'RECOMMENDATION' | 'DEFICIENCY_FLAG' | 'PATTERN'

export interface CheckInSnapshot {
  moodScore:       number        // 1–6
  energyScore:     number        // 1–6
  sleepHours:      number | null
  waterGlasses:    number | null
  sunlightMinutes: number | null
  stressLevel:     number | null // 1–5
  symptoms:        string[]
  foodGroups:      string[]
}

export interface ProfileSnapshot {
  dietaryPattern: string | null
  activityLevel:  string | null
}

export interface Flag {
  id:         FlagId
  evidence:   string[] // human-readable evidence lines (not surfaced to user, used in Gemini prompt)
  confidence: number   // 0–1
}

export interface RuleEngineResult {
  flags:    Flag[]
  profile:  ProfileSnapshot
  summary:  string // one-line human summary for Gemini prompt context
}
