import { describe, it, expect } from 'vitest'
import { ironRule, vitaminDRule, magnesiumRule, b12Rule, vitaminCRule } from '../rules/deficiency'
import type { CheckInSnapshot, ProfileSnapshot } from '../types'

const BASE_PROFILE: ProfileSnapshot = { dietaryPattern: 'OMNIVORE', activityLevel: 'MODERATELY_ACTIVE' }
const VEGAN_PROFILE: ProfileSnapshot = { dietaryPattern: 'VEGAN', activityLevel: 'MODERATELY_ACTIVE' }

function makeCheckIn(overrides: Partial<CheckInSnapshot> = {}): CheckInSnapshot {
  return {
    moodScore:       4,
    energyScore:     4,
    sleepHours:      7,
    waterGlasses:    7,
    sunlightMinutes: 30,
    stressLevel:     2,
    symptoms:        [],
    foodGroups:      ['meat', 'vegetables', 'fruits'],
    ...overrides,
  }
}

// ─── ironRule ───────────────────────────────────────────────────────────────

describe('ironRule', () => {
  it('returns null when no fatigue', () => {
    const checkIns = Array.from({ length: 7 }, () => makeCheckIn())
    expect(ironRule(BASE_PROFILE, checkIns)).toBeNull()
  })

  it('returns null when fatigue present but iron-rich foods adequate', () => {
    const checkIns = Array.from({ length: 7 }, () =>
      makeCheckIn({ symptoms: ['fatigue'], foodGroups: ['meat'] })
    )
    expect(ironRule(BASE_PROFILE, checkIns)).toBeNull()
  })

  it('fires when fatigue ≥3 days + low iron foods ≥4 days + cognitive symptom', () => {
    const checkIns = [
      ...Array.from({ length: 4 }, () => makeCheckIn({ symptoms: ['fatigue', 'brain fog'], foodGroups: [] })),
      ...Array.from({ length: 3 }, () => makeCheckIn({ symptoms: ['tired'], foodGroups: [] })),
    ]
    const result = ironRule(BASE_PROFILE, checkIns)
    expect(result).not.toBeNull()
    expect(result!.id).toBe('IRON')
    expect(result!.evidence.length).toBeGreaterThanOrEqual(2)
  })

  it('requires cognitive symptom to fire', () => {
    const checkIns = Array.from({ length: 7 }, () =>
      makeCheckIn({ symptoms: ['fatigue'], foodGroups: [] })
    )
    expect(ironRule(BASE_PROFILE, checkIns)).toBeNull()
  })
})

// ─── vitaminDRule ────────────────────────────────────────────────────────────

describe('vitaminDRule', () => {
  it('returns null on healthy data', () => {
    const checkIns = Array.from({ length: 7 }, () => makeCheckIn())
    expect(vitaminDRule(BASE_PROFILE, checkIns)).toBeNull()
  })

  it('fires when low mood ≥4 days and low sunlight ≥5 days', () => {
    const checkIns = [
      ...Array.from({ length: 5 }, () => makeCheckIn({ moodScore: 2, sunlightMinutes: 5 })),
      ...Array.from({ length: 2 }, () => makeCheckIn({ moodScore: 3, sunlightMinutes: 10 })),
    ]
    const result = vitaminDRule(BASE_PROFILE, checkIns)
    expect(result).not.toBeNull()
    expect(result!.id).toBe('VITAMIN_D')
  })

  it('requires low sunlight threshold (≤15 min)', () => {
    const checkIns = Array.from({ length: 7 }, () =>
      makeCheckIn({ moodScore: 2, sunlightMinutes: 20 })
    )
    expect(vitaminDRule(BASE_PROFILE, checkIns)).toBeNull()
  })
})

// ─── magnesiumRule ───────────────────────────────────────────────────────────

describe('magnesiumRule', () => {
  it('returns null on healthy data', () => {
    const checkIns = Array.from({ length: 7 }, () => makeCheckIn())
    expect(magnesiumRule(BASE_PROFILE, checkIns)).toBeNull()
  })

  it('fires when poor sleep + high stress + anxiety symptom', () => {
    const checkIns = [
      ...Array.from({ length: 4 }, () => makeCheckIn({ sleepHours: 5, stressLevel: 4, symptoms: ['anxiety'] })),
      ...Array.from({ length: 3 }, () => makeCheckIn({ sleepHours: 5.5, stressLevel: 5 })),
    ]
    const result = magnesiumRule(BASE_PROFILE, checkIns)
    expect(result).not.toBeNull()
    expect(result!.id).toBe('MAGNESIUM')
  })

  it('requires anxiety symptom to fire', () => {
    const checkIns = Array.from({ length: 7 }, () =>
      makeCheckIn({ sleepHours: 5, stressLevel: 5 })
    )
    expect(magnesiumRule(BASE_PROFILE, checkIns)).toBeNull()
  })
})

// ─── b12Rule ─────────────────────────────────────────────────────────────────

describe('b12Rule', () => {
  it('returns null for omnivore regardless of symptoms', () => {
    const checkIns = Array.from({ length: 7 }, () =>
      makeCheckIn({ symptoms: ['brain fog', 'fatigue'] })
    )
    expect(b12Rule(BASE_PROFILE, checkIns)).toBeNull()
  })

  it('fires for vegan with brain fog ≥3 days and fatigue ≥2 days', () => {
    const checkIns = [
      ...Array.from({ length: 4 }, () => makeCheckIn({ symptoms: ['brain fog', 'fatigue'] })),
      ...Array.from({ length: 3 }, () => makeCheckIn({ symptoms: ['tired'] })),
    ]
    const result = b12Rule(VEGAN_PROFILE, checkIns)
    expect(result).not.toBeNull()
    expect(result!.id).toBe('B12')
  })

  it('requires fatigue in addition to brain fog', () => {
    const checkIns = Array.from({ length: 7 }, () =>
      makeCheckIn({ symptoms: ['brain fog'] })
    )
    expect(b12Rule(VEGAN_PROFILE, checkIns)).toBeNull()
  })
})

// ─── vitaminCRule ─────────────────────────────────────────────────────────────

describe('vitaminCRule', () => {
  it('returns null on healthy data', () => {
    const checkIns = Array.from({ length: 7 }, () => makeCheckIn())
    expect(vitaminCRule(BASE_PROFILE, checkIns)).toBeNull()
  })

  it('fires when low energy ≥4 days and low fruit/veg ≥4 days', () => {
    const checkIns = [
      ...Array.from({ length: 5 }, () => makeCheckIn({ energyScore: 2, foodGroups: ['grains'] })),
      ...Array.from({ length: 2 }, () => makeCheckIn({ energyScore: 3, foodGroups: [] })),
    ]
    const result = vitaminCRule(BASE_PROFILE, checkIns)
    expect(result).not.toBeNull()
    expect(result!.id).toBe('VITAMIN_C')
  })
})
