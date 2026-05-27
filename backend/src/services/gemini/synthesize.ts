import { getGeminiClient, GEMINI_MODEL } from './client'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts/weekly-insight'
import { geminiResponseSchema, type GeminiResponse } from './schema'
import { GeminiUnavailable, GeminiTimeout, GeminiSchemaError } from './errors'
import type { RuleEngineResult } from '../rule-engine/types'

const TIMEOUT_MS = 10_000

export async function synthesizeInsights(result: RuleEngineResult): Promise<GeminiResponse> {
  const client = getGeminiClient()
  if (!client) throw new GeminiUnavailable()

  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json',
    },
  })

  const userPrompt = buildUserPrompt(result)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let rawText: string
  try {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    })
    rawText = response.response.text()
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new GeminiTimeout()
    }
    throw err
  } finally {
    clearTimeout(timer)
  }

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

  return validated.data
}
