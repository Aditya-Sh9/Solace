import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { RuleEngineResult } from '../../rule-engine/types'

// Fake SDK: each call to generateContent consumes the next scripted outcome for that model.
const script: Record<string, (Error | string)[]> = {}
const calls: string[] = []
const mockEnv = { GEMINI_API_KEY: 'test-key', GEMINI_MODEL: undefined as string | undefined }

vi.mock('../../../config/env', () => ({ env: mockEnv }))
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel({ model }: { model: string }) {
      return {
        generateContent: async () => {
          calls.push(model)
          const next = script[model]?.shift()
          if (next === undefined) throw Object.assign(new Error('no script'), { status: 500 })
          if (next instanceof Error) throw next
          return { response: { text: () => next } }
        },
      }
    }
  },
}))

const { synthesizeInsights } = await import('../synthesize')
const { GeminiExhausted } = await import('../errors')

const httpError = (status: number) => Object.assign(new Error(`[${status}]`), { status })
const GOOD = JSON.stringify({ insights: [{ type: 'PATTERN', title: 'A quiet pattern', body: 'Something seems to shift on days you sleep less.', flags: [] }] })
const RESULT: RuleEngineResult = {
  flags:   [{ id: 'SLEEP_DEBT', evidence: ['averaged 5.5h over the last 7 days'], confidence: 0.7 }],
  profile: { dietaryPattern: 'OMNIVORE', activityLevel: 'LIGHTLY_ACTIVE' },
  summary: 'Short sleep most of the week.',
}

beforeEach(() => {
  for (const k of Object.keys(script)) delete script[k]
  calls.length = 0
  mockEnv.GEMINI_MODEL = undefined
})

describe('synthesizeInsights model chain', () => {
  it('uses the primary model when it answers', async () => {
    script['gemini-3.8-flash'] = [GOOD]
    await synthesizeInsights(RESULT)
    expect(calls).toEqual(['gemini-3.8-flash'])
  })

  it('moves to the next model on 404 (retired model) without retrying', async () => {
    script['gemini-3.8-flash'] = [httpError(404)]
    script['gemini-3.6-flash'] = [GOOD]
    await synthesizeInsights(RESULT)
    expect(calls).toEqual(['gemini-3.8-flash', 'gemini-3.6-flash'])
  })

  it('moves on from an overloaded (503) model instead of waiting it out', async () => {
    script['gemini-3.8-flash'] = [httpError(503)]
    script['gemini-3.6-flash'] = [GOOD]
    await synthesizeInsights(RESULT)
    expect(calls).toEqual(['gemini-3.8-flash', 'gemini-3.6-flash'])
  })

  it('retries once on the last model before giving up', async () => {
    script['gemini-3.8-flash'] = [httpError(503)]
    script['gemini-3.6-flash'] = [httpError(503)]
    script['gemini-flash-lite-latest'] = [httpError(503), GOOD]
    await synthesizeInsights(RESULT)
    expect(calls).toEqual(['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-flash-lite-latest', 'gemini-flash-lite-latest'])
  })

  it('honours GEMINI_MODEL as the primary', async () => {
    mockEnv.GEMINI_MODEL = 'gemini-9-flash'
    script['gemini-9-flash'] = [GOOD]
    await synthesizeInsights(RESULT)
    expect(calls).toEqual(['gemini-9-flash'])
  })

  it('stops immediately on a key problem (403) — another model will not help', async () => {
    script['gemini-3.8-flash'] = [httpError(403)]
    await expect(synthesizeInsights(RESULT)).rejects.toBeInstanceOf(GeminiExhausted)
    expect(calls).toEqual(['gemini-3.8-flash'])
  })

  it('tries the next model when the answer is the wrong shape', async () => {
    script['gemini-3.8-flash'] = ['not json']
    script['gemini-3.6-flash'] = [GOOD]
    await synthesizeInsights(RESULT)
    expect(calls).toEqual(['gemini-3.8-flash', 'gemini-3.6-flash'])
  })

  it('reports every attempt (model + status, no key) when everything fails', async () => {
    script['gemini-3.8-flash'] = [httpError(404)]
    script['gemini-3.6-flash'] = [httpError(404)]
    script['gemini-flash-lite-latest'] = [httpError(404)]
    const err = await synthesizeInsights(RESULT).catch(e => e)
    expect(err).toBeInstanceOf(GeminiExhausted)
    expect(err.message).toMatch(/gemini-3\.8-flash: 404 after \d+ms/)
    expect(err.message).toMatch(/gemini-3\.6-flash: 404 after \d+ms/)
    expect(err.message).toMatch(/gemini-flash-lite-latest: 404 after \d+ms/)
    expect(err.message).not.toContain('test-key')
  })

  it('gives up with GeminiExhausted when both models return junk', async () => {
    script['gemini-3.8-flash'] = ['x']
    script['gemini-3.6-flash'] = ['y']
    script['gemini-flash-lite-latest'] = ['z']
    await expect(synthesizeInsights(RESULT)).rejects.toBeInstanceOf(GeminiExhausted)
  })
})
