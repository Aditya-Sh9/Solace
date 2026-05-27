import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../../config/env'

// Current GA Gemini Flash model
export const GEMINI_MODEL = 'gemini-2.0-flash'

let _client: GoogleGenerativeAI | null = null

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (!env.GEMINI_API_KEY) return null
  if (!_client) {
    _client = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  }
  return _client
}
