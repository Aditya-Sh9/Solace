import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../../config/env'

// Google retires Flash models every few months (gemini-2.0-flash and 2.5-flash both went 404 and
// insights silently fell back to canned copy). So the model is config, and there's a chain:
// the primary (GEMINI_MODEL), an older-but-steady generation (brand-new models are often
// overloaded: 3.8 and 3.7 returned 503 while 3.6 and 3.5 answered in ~2s), then the `*-latest`
// lite alias, which follows Google's current generation and so outlives any pinned retirement.
export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash'
const FALLBACK_GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-flash-lite-latest']

export function geminiModelChain(): string[] {
  const primary = env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL
  return [primary, ...FALLBACK_GEMINI_MODELS.filter(m => m !== primary)]
}

let _client: GoogleGenerativeAI | null = null

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (!env.GEMINI_API_KEY) return null
  if (!_client) {
    _client = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  }
  return _client
}
