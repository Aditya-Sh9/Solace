import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MlUnavailable, MlTimeout, MlSchemaError } from '../errors'

// Mutable env so tests can swap values without module re-loading
const mockEnv = {
  ML_API_KEY: 'test-key' as string | undefined,
  ML_SERVICE_URL: 'http://localhost:8000' as string | undefined,
}
vi.mock('../../../config/env', () => ({ env: mockEnv }))

// Import client once — mock is in place before first load
const { predictPatterns } = await import('../client')

beforeEach(() => {
  mockEnv.ML_API_KEY = 'test-key'
  mockEnv.ML_SERVICE_URL = 'http://localhost:8000'
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('ml-client / predictPatterns', () => {
  it('throws MlUnavailable when ML_API_KEY is not set', async () => {
    mockEnv.ML_API_KEY = undefined
    await expect(predictPatterns([])).rejects.toBeInstanceOf(MlUnavailable)
  })

  it('throws MlUnavailable when ML_SERVICE_URL is not set', async () => {
    mockEnv.ML_SERVICE_URL = undefined
    await expect(predictPatterns([])).rejects.toBeInstanceOf(MlUnavailable)
  })

  it('throws MlTimeout on 4s abort', async () => {
    // Stub fetch to reject when the abort signal fires
    vi.stubGlobal('fetch', (_url: string, opts?: RequestInit) =>
      new Promise<never>((_resolve, reject) => {
        opts?.signal?.addEventListener('abort', () =>
          reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
        )
      })
    )
    vi.useFakeTimers()
    const promise = predictPatterns([])
    vi.advanceTimersByTime(4100)
    await expect(promise).rejects.toBeInstanceOf(MlTimeout)
  })

  it('throws MlSchemaError when response shape is wrong', async () => {
    vi.stubGlobal('fetch', () =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ unexpected: true }) })
    )
    await expect(predictPatterns([])).rejects.toBeInstanceOf(MlSchemaError)
  })

  it('returns typed response on valid stub reply', async () => {
    const stub = {
      trained: false, n_samples: 0, prediction: null, patterns: [], quality: null,
    }
    vi.stubGlobal('fetch', () =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(stub) })
    )
    const result = await predictPatterns([])
    expect(result.trained).toBe(false)
    expect(result.patterns).toEqual([])
    expect(result.n_samples).toBe(0)
  })

  it('throws MlUnavailable on non-ok HTTP response', async () => {
    vi.stubGlobal('fetch', () =>
      Promise.resolve({ ok: false, status: 401 })
    )
    await expect(predictPatterns([])).rejects.toBeInstanceOf(MlUnavailable)
  })
})
