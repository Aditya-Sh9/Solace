import { describe, it, expect } from 'vitest'
import { patternToCopy, bandPrediction, confidenceToWording } from '../translate'
import type { MlPattern } from '../schema'

// ---------------------------------------------------------------------------
// patternToCopy
// ---------------------------------------------------------------------------

describe('patternToCopy', () => {
  const features = [
    'sleep_hours',
    'water_glasses',
    'sunlight_minutes',
    'stress_level',
    'food_group_count',
    'symptom_count',
  ] as const

  const directions = ['positive', 'negative'] as const
  const targets    = ['mood', 'energy'] as const

  // Every combination should produce non-null voice copy
  for (const feature of features) {
    for (const direction of directions) {
      for (const target of targets) {
        it(`returns copy for ${feature} / ${direction} / ${target}`, () => {
          const pattern: MlPattern = { feature, direction, target, strength: 0.5 }
          const copy = patternToCopy(pattern)
          expect(copy).not.toBeNull()
          expect(typeof copy).toBe('string')
          expect((copy as string).length).toBeGreaterThan(10)
        })
      }
    }
  }

  it('returns null for an unknown feature', () => {
    const pattern: MlPattern = { feature: 'unknown_field', direction: 'positive', target: 'mood', strength: 0.5 }
    expect(patternToCopy(pattern)).toBeNull()
  })

  it('all returned copies pass tone validation', () => {
    // Spot-check every combination against the banned-phrase list via patternToCopy
    // (patternToCopy calls validateTone internally and returns null on failure)
    for (const feature of features) {
      for (const direction of directions) {
        for (const target of targets) {
          const copy = patternToCopy({ feature, direction, target, strength: 0.4 })
          expect(copy).not.toBeNull() // null = tone check failed
        }
      }
    }
  })

  it('copy does not contain causation language', () => {
    const causationVerbs = ['improves', 'causes', 'leads to', 'because of']
    for (const feature of features) {
      for (const direction of directions) {
        for (const target of targets) {
          const copy = patternToCopy({ feature, direction, target, strength: 0.4 }) ?? ''
          for (const verb of causationVerbs) {
            expect(copy.toLowerCase()).not.toContain(verb)
          }
        }
      }
    }
  })
})

// ---------------------------------------------------------------------------
// bandPrediction
// ---------------------------------------------------------------------------

describe('bandPrediction', () => {
  it('score 1 → "lower"', () => {
    expect(bandPrediction(1)).toBe('lower')
  })

  it('score 2 → "lower"', () => {
    expect(bandPrediction(2)).toBe('lower')
  })

  it('score 2.5 → boundary → "steady"', () => {
    // (2.5 - 1) / 5 * 10 = 3.0 — exactly at threshold, falls into "steady"
    expect(bandPrediction(2.5)).toBe('steady')
  })

  it('score 3 → "steady"', () => {
    expect(bandPrediction(3)).toBe('steady')
  })

  it('score 4 → "steady"', () => {
    expect(bandPrediction(4)).toBe('steady')
  })

  it('score 4.5 → "brighter"', () => {
    // (4.5 - 1) / 5 * 10 = 7.0 — exactly at upper threshold, falls into "brighter"
    expect(bandPrediction(4.5)).toBe('brighter')
  })

  it('score 5 → "brighter"', () => {
    expect(bandPrediction(5)).toBe('brighter')
  })

  it('score 6 → "brighter"', () => {
    expect(bandPrediction(6)).toBe('brighter')
  })
})

// ---------------------------------------------------------------------------
// confidenceToWording
// ---------------------------------------------------------------------------

describe('confidenceToWording', () => {
  it('0.0 → "still learning"', () => {
    expect(confidenceToWording(0)).toBe('still learning')
  })

  it('0.29 → "still learning"', () => {
    expect(confidenceToWording(0.29)).toBe('still learning')
  })

  it('0.3 → "there might be a pattern here"', () => {
    expect(confidenceToWording(0.3)).toBe('there might be a pattern here')
  })

  it('0.59 → "there might be a pattern here"', () => {
    expect(confidenceToWording(0.59)).toBe('there might be a pattern here')
  })

  it('0.6 → "worth noticing"', () => {
    expect(confidenceToWording(0.6)).toBe('worth noticing')
  })

  it('1.0 → "worth noticing"', () => {
    expect(confidenceToWording(1.0)).toBe('worth noticing')
  })
})
