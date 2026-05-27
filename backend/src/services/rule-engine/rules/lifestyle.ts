import type { CheckInSnapshot, ProfileSnapshot, Flag } from '../types'

type RuleFn = (profile: ProfileSnapshot, checkIns: CheckInSnapshot[]) => Flag | null

const SEDENTARY_ACTIVITY = ['SEDENTARY', 'LIGHTLY_ACTIVE']

function avg(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

export const sleepDebtRule: RuleFn = (_profile, checkIns) => {
  const sleepValues = checkIns
    .map(c => c.sleepHours)
    .filter((h): h is number => h !== null)
  if (sleepValues.length < 4) return null

  const avgSleep   = avg(sleepValues)
  const shortNights = sleepValues.filter(h => h < 6).length

  if (avgSleep >= 6.5 || shortNights < 3) return null

  return {
    id: 'SLEEP_DEBT',
    evidence: [
      `Average sleep across ${sleepValues.length} logged days: ${avgSleep.toFixed(1)}h (below 6.5h threshold)`,
      `${shortNights} nights with fewer than 6 hours of sleep`,
    ],
    confidence: Math.min(0.9, 0.5 + shortNights * 0.1),
  }
}

export const dehydrationRule: RuleFn = (_profile, checkIns) => {
  const waterValues = checkIns
    .map(c => c.waterGlasses)
    .filter((w): w is number => w !== null)
  if (waterValues.length < 4) return null

  const avgWater     = avg(waterValues)
  const dryDays      = waterValues.filter(w => w <= 4).length

  if (avgWater >= 5 || dryDays < 4) return null

  return {
    id: 'DEHYDRATION',
    evidence: [
      `Average water intake across ${waterValues.length} logged days: ${avgWater.toFixed(1)} glasses (below 5 threshold)`,
      `${dryDays} days with ≤4 glasses of water`,
    ],
    confidence: 0.7,
  }
}

export const sedentaryRule: RuleFn = (profile, checkIns) => {
  if (!profile.activityLevel || !SEDENTARY_ACTIVITY.includes(profile.activityLevel)) return null

  const sunValues    = checkIns.filter(c => c.sunlightMinutes !== null)
  if (sunValues.length < 4) return null

  const lowSunDays   = sunValues.filter(c => (c.sunlightMinutes ?? 0) <= 10).length

  if (lowSunDays < 5) return null

  return {
    id: 'SEDENTARY',
    evidence: [
      `Self-reported activity level: ${profile.activityLevel.toLowerCase().replace('_', ' ')}`,
      `${lowSunDays} days with ≤10 minutes of outdoor sunlight`,
    ],
    confidence: 0.65,
  }
}
