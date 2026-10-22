import { getGeminiClient, geminiModelChain } from './client'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts/weekly-insight'
import { geminiResponseSchema, type GeminiResponse } from './schema'
import { GeminiUnavailable, GeminiTimeout, GeminiSchemaError, GeminiExhausted } from './errors'
import type { RuleEngineResult } from '../rule-engine/types'

// Per attempt, enforced by the SDK (it aborts the HTTP request). The old AbortController here was
// never passed to the request, so it did nothing. Lite models can take ~8s, hence 12s.
const ATTEMPT_TIMEOUT_MS = 12_000
// Whole refresh budget across retries and models — a user is waiting on this request.
const TOTAL_BUDGET_MS = 28_000
const RETRY_PAUSE_MS = 800

type Failure = 'skip-model' | 'retry' | 'stop'

// 404 = model retired or unknown -> next model. 429/5xx/timeouts/network -> one retry, then next
// model. Anything else (400 bad request, 401/403 key problems) won't be fixed by trying again.
function classify(err: unknown): { kind: Failure; status: number | null } {
  const status = typeof (err as { status?: unknown })?.status === 'number' ? (err as { status: number }).status : null
  if (status === 404) return { kind: 'skip-model', status }
  if (status === 429 || (status !== null && status >= 500)) return { kind: 'retry', status }
  if (status === null) return { kind: 'retry', status } // timeout / network
  return { kind: 'stop', status }
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

async function generate(modelName: string, userPrompt: string): Promise<string> {
  const client = getGeminiClient()
  if (!client) throw new GeminiUnavailable()
  const model = client.getGenerativeModel(
    {
      model: modelName,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        // Newer Gemini models spend part of this on internal reasoning, so 1024 truncated the JSON.
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    },
    { timeout: ATTEMPT_TIMEOUT_MS },
  )
  const response = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: userPrompt }] }] })
  return response.response.text()
}

export async function synthesizeInsights(result: RuleEngineResult, mlPatterns?: string[]): Promise<GeminiResponse> {
  if (!getGeminiClient()) throw new GeminiUnavailable()

  const userPrompt = buildUserPrompt(result, mlPatterns)
  const deadline = Date.now() + TOTAL_BUDGET_MS
  const attempts: string[] = []
  let sawTimeout = false

  const chain = geminiModelChain()
  for (const [index, modelName] of chain.entries()) {
    // Only the last model gets a second try: while another model is waiting, moving on is faster
    // than waiting out an overloaded one.
    const maxTries = index === chain.length - 1 ? 2 : 1
    for (let tries = 0; tries < maxTries; tries++) {
      if (Date.now() + 2_000 > deadline) break // not enough budget left for a real attempt
      const startedAt = Date.now()
      try {
        const rawText = await generate(modelName, userPrompt)

        let parsed: unknown
        try {
          parsed = JSON.parse(rawText)
        } catch {
          throw new GeminiSchemaError('Response was not valid JSON')
        }
        const validated = geminiResponseSchema.safeParse(parsed)
        if (!validated.success) {
          throw new GeminiSchemaError(validated.error.issues[0]?.message ?? 'Schema mismatch')
        }
        console.log(`[gemini] ${modelName} answered in ${Date.now() - startedAt}ms${attempts.length ? ` (after: ${attempts.join('; ')})` : ''}`)
        return validated.data
      } catch (err) {
        // A model that answered but in the wrong shape isn't an outage — try the next model, don't retry.
        if (err instanceof GeminiSchemaError) { attempts.push(`${modelName}: ${err.message}`); break }

        const { kind, status } = classify(err)
        const name = err instanceof Error ? err.name : 'error'
        if (status === null && /abort|timeout/i.test(`${name} ${(err as Error)?.message ?? ''}`)) sawTimeout = true
        attempts.push(`${modelName}: ${status ?? name} after ${Date.now() - startedAt}ms`)
        if (kind === 'stop') throw new GeminiExhausted(attempts)
        if (kind === 'skip-model') break
        if (tries + 1 < maxTries) await sleep(RETRY_PAUSE_MS)
      }
    }
  }

  if (sawTimeout && attempts.every(a => /abort|timeout|AbortError/i.test(a))) throw new GeminiTimeout()
  throw new GeminiExhausted(attempts)
}
