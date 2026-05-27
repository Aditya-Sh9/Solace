import { describe, it, expect } from 'vitest'
import { validateTone } from '../validate'

describe('validateTone', () => {
  it('passes clean warm copy', () => {
    const clean = "On days when energy is low and iron-rich foods have been a little scarce, there's a quiet connection worth noticing. It might be worth sitting with that pattern."
    expect(validateTone(clean).ok).toBe(true)
    expect(validateTone(clean).hits).toHaveLength(0)
  })

  it('rejects "you should"', () => {
    const { ok, hits } = validateTone("You should take a supplement.")
    expect(ok).toBe(false)
    expect(hits).toContain('you should')
  })

  it('rejects "optimize"', () => {
    const { ok, hits } = validateTone("Try to optimize your sleep schedule.")
    expect(ok).toBe(false)
    expect(hits).toContain('optimize')
  })

  it('rejects "deficiency" (the noun)', () => {
    const { ok, hits } = validateTone("This could indicate an iron deficiency.")
    expect(ok).toBe(false)
    expect(hits).toContain('deficiency')
  })

  it('rejects "research suggests" (Correction D)', () => {
    const { ok, hits } = validateTone("Research suggests magnesium helps with sleep.")
    expect(ok).toBe(false)
    expect(hits).toContain('research suggests')
  })

  it('rejects "clinical"', () => {
    const { ok, hits } = validateTone("From a clinical perspective, this pattern is significant.")
    expect(ok).toBe(false)
    expect(hits).toContain('clinical')
  })

  it('rejects "supplement"', () => {
    const { ok, hits } = validateTone("Consider taking a B12 supplement.")
    expect(ok).toBe(false)
    expect(hits).toContain('supplement')
  })

  it('rejects "unfortunately"', () => {
    const { ok, hits } = validateTone("Unfortunately, your sleep data is concerning.")
    expect(ok).toBe(false)
    expect(hits).toContain('unfortunately')
  })

  it('is case-insensitive', () => {
    const { ok } = validateTone("YOU SHOULD get more sleep.")
    expect(ok).toBe(false)
  })

  it('reports multiple hits', () => {
    const { hits } = validateTone("You should take a supplement to cure this deficiency.")
    expect(hits.length).toBeGreaterThan(1)
  })
})
