import { env } from '../../config/env'
import { MlUnavailable, MlTimeout, MlSchemaError } from './errors'
import type { CheckInPayload, MlPredictResponse } from './schema'
import { PredictResponseSchema } from './schema'

// Insight refresh waits on ML before Gemini, so it keeps the short budget.
export const ML_TIMEOUT_MS = 4000
// The dashboard card loads on its own behind a skeleton; on Render's free tier training on ~70
// check-ins takes longer than 4s (~0.5s locally), so the card gets more room (2026-10-22, user).
export const ML_CARD_TIMEOUT_MS = 12000

export async function predictPatterns(
  checkins: CheckInPayload[],
  timeoutMs: number = ML_TIMEOUT_MS,
): Promise<MlPredictResponse> {
  if (!env.ML_API_KEY || !env.ML_SERVICE_URL) {
    throw new MlUnavailable()
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${env.ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.ML_API_KEY,
      },
      body: JSON.stringify({ checkins }),
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new MlUnavailable()
    }

    const json: unknown = await res.json()
    const parsed = PredictResponseSchema.safeParse(json)
    if (!parsed.success) {
      throw new MlSchemaError(parsed.error.message)
    }
    return parsed.data
  } catch (err) {
    if (err instanceof MlUnavailable || err instanceof MlSchemaError) throw err
    if (err instanceof Error && err.name === 'AbortError') throw new MlTimeout()
    throw new MlUnavailable()
  } finally {
    clearTimeout(timer)
  }
}
