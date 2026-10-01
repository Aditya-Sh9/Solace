import { describe, it, expect } from 'vitest'
import { hasCycleAccess } from '../cycle-access'

describe('hasCycleAccess', () => {
  it('grants access to FEMALE', () => expect(hasCycleAccess('FEMALE')).toBe(true))
  it('grants access to UNDISCLOSED', () => expect(hasCycleAccess('UNDISCLOSED')).toBe(true))
  it('grants access when never asked (null/undefined)', () => {
    expect(hasCycleAccess(null)).toBe(true)
    expect(hasCycleAccess(undefined)).toBe(true)
  })
  it('withholds access from MALE', () => expect(hasCycleAccess('MALE')).toBe(false))
})
