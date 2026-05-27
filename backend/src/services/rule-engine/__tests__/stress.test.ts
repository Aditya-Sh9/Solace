import { describe, it, expect } from 'vitest'
import { sustainedStressRule } from '../rules/stress'
import type { CheckInSnapshot, ProfileSnapshot } from '../types'

const PROFILE: ProfileSnapshot = { dietaryPattern: 'OMNIVORE', activityLevel: 'MODERATELY_ACTIVE' }

function makeCheckIn(stressLevel: number | null): CheckInSnapshot {
  return {
    moodScore: 4, energyScore: 4, sleepHours: 7, waterGlasses: 7,
    sunlightMinutes: 30, stressLevel, symptoms: [], foodGroups: [],
  }
}

describe('sustainedStressRule', () => {
  it('returns null when stress logged on fewer than 5 days', () => {
    const checkIns = [
      ...Array.from({ length: 4 }, () => makeCheckIn(5)),
      makeCheckIn(null),
      makeCheckIn(null),
      makeCheckIn(null),
    ]
    expect(sustainedStressRule(PROFILE, checkIns)).toBeNull()
  })

  it('returns null when high stress on fewer than 5 days', () => {
    const checkIns = [
      ...Array.from({ length: 4 }, () => makeCheckIn(4)),
      ...Array.from({ length: 3 }, () => makeCheckIn(2)),
    ]
    expect(sustainedStressRule(PROFILE, checkIns)).toBeNull()
  })

  it('fires when stress ≥4 on ≥5 days', () => {
    const checkIns = [
      ...Array.from({ length: 5 }, () => makeCheckIn(4)),
      ...Array.from({ length: 2 }, () => makeCheckIn(5)),
    ]
    const result = sustainedStressRule(PROFILE, checkIns)
    expect(result).not.toBeNull()
    expect(result!.id).toBe('SUSTAINED_STRESS')
    expect(result!.evidence.length).toBeGreaterThanOrEqual(1)
  })

  it('stress=3 does not count as high stress', () => {
    const checkIns = Array.from({ length: 7 }, () => makeCheckIn(3))
    expect(sustainedStressRule(PROFILE, checkIns)).toBeNull()
  })
})
