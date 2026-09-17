import { env } from '../../config/env'
import { MlUnavailable, MlTimeout, MlSchemaError } from './errors'
import type { CheckInPayload, MlPredictResponse } from './schema'
import { PredictResponseSchema } from './schema'

const ML_TIMEOUT_MS = 4000

export async function predictPatterns(checkins: CheckInPayload[]): Promise<MlPredictResponse> {
  if (!env.ML_API_KEY || !env.ML_SERVICE_URL) {
    throw new MlUnavailable()
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ML_TIMEOUT_MS)

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
