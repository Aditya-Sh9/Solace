import { describe, it, expect } from 'vitest'
import { sleepDebtRule, dehydrationRule, sedentaryRule } from '../rules/lifestyle'
import type { CheckInSnapshot, ProfileSnapshot } from '../types'

const BASE_PROFILE: ProfileSnapshot = { dietaryPattern: 'OMNIVORE', activityLevel: 'MODERATELY_ACTIVE' }
const SEDENTARY_PROFILE: ProfileSnapshot = { dietaryPattern: 'OMNIVORE', activityLevel: 'SEDENTARY' }

function makeCheckIn(overrides: Partial<CheckInSnapshot> = {}): CheckInSnapshot {
  return {
    moodScore: 4, energyScore: 4, sleepHours: 7.5, waterGlasses: 8,
    sunlightMinutes: 30, stressLevel: 2, symptoms: [], foodGroups: ['vegetables', 'fruits'],
    ...overrides,
  }
}

// ─── sleepDebtRule ────────────────────────────────────────────────────────────

describe('sleepDebtRule', () => {
  it('returns null on adequate sleep', () => {
    const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ sleepHours: 7.5 }))
    expect(sleepDebtRule(BASE_PROFILE, checkIns)).toBeNull()
  })

  it('fires when avg < 6.5h and ≥3 nights < 6h', () => {
    const checkIns = [
      ...Array.from({ length: 4 }, () => makeCheckIn({ sleepHours: 5 })),
      ...Array.from({ length: 3 }, () => makeCheckIn({ sleepHours: 5.5 })),
    ]
    const result = sleepDebtRule(BASE_PROFILE, checkIns)
    expect(result).not.toBeNull()
    expect(result!.id).toBe('SLEEP_DEBT')
  })

  it('requires at least 3 nights below 6h', () => {
    const checkIns = [
      ...Array.from({ length: 2 }, () => makeCheckIn({ sleepHours: 5 })),
      ...Array.from({ length: 5 }, () => makeCheckIn({ sleepHours: 6 })),
    ]
    // avg = (10 + 30) / 7 = 5.71 but shortNights = 2
    expect(sleepDebtRule(BASE_PROFILE, checkIns)).toBeNull()
  })
})

// ─── dehydrationRule ──────────────────────────────────────────────────────────

describe('dehydrationRule', () => {
  it('returns null on adequate hydration', () => {
    const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ waterGlasses: 8 }))
    expect(dehydrationRule(BASE_PROFILE, checkIns)).toBeNull()
  })

  it('fires when avg < 5 glasses and ≥4 days with ≤4 glasses', () => {
    const checkIns = [
      ...Array.from({ length: 5 }, () => makeCheckIn({ waterGlasses: 3 })),
      ...Array.from({ length: 2 }, () => makeCheckIn({ waterGlasses: 4 })),
    ]
    const result = dehydrationRule(BASE_PROFILE, checkIns)
    expect(result).not.toBeNull()
    expect(result!.id).toBe('DEHYDRATION')
  })
})

// ─── sedentaryRule ────────────────────────────────────────────────────────────

describe('sedentaryRule', () => {
  it('returns null for moderately active users', () => {
    const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ sunlightMinutes: 5 }))
    expect(sedentaryRule(BASE_PROFILE, checkIns)).toBeNull()
  })

  it('fires for sedentary profile with low sunlight ≥5 days', () => {
    const checkIns = [
      ...Array.from({ length: 5 }, () => makeCheckIn({ sunlightMinutes: 5 })),
      ...Array.from({ length: 2 }, () => makeCheckIn({ sunlightMinutes: 10 })),
    ]
    const result = sedentaryRule(SEDENTARY_PROFILE, checkIns)
    expect(result).not.toBeNull()
    expect(result!.id).toBe('SEDENTARY')
  })

  it('requires ≥5 days with ≤10 min sunlight', () => {
    const checkIns = [
      ...Array.from({ length: 3 }, () => makeCheckIn({ sunlightMinutes: 5 })),
      ...Array.from({ length: 4 }, () => makeCheckIn({ sunlightMinutes: 60 })),
    ]
    expect(sedentaryRule(SEDENTARY_PROFILE, checkIns)).toBeNull()
  })
})
