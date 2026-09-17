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

  // Phase 4 — causation verbs
  it('rejects "improves"', () => {
    const { ok, hits } = validateTone("Sleep improves your mood significantly.")
    expect(ok).toBe(false)
    expect(hits).toContain('improves')
  })

  it('rejects "causes"', () => {
    const { ok, hits } = validateTone("Dehydration causes brain fog.")
    expect(ok).toBe(false)
    expect(hits).toContain('causes')
  })

  it('rejects "leads to"', () => {
    const { ok, hits } = validateTone("Poor sleep leads to lower energy.")
    expect(ok).toBe(false)
    expect(hits).toContain('leads to')
  })

  it('rejects "because of"', () => {
    const { ok, hits } = validateTone("You feel tired because of low iron.")
    expect(ok).toBe(false)
    expect(hits).toContain('because of')
  })

  it('passes pattern copy with hedging language and no causation', () => {
    const copy = "On days with more sleep, your mood tends to feel a little steadier."
    expect(validateTone(copy).ok).toBe(true)
  })
})
