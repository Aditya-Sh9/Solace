export class GeminiUnavailable extends Error {
  constructor() { super('Gemini API key not configured') }
}

export class GeminiTimeout extends Error {
  constructor() { super('Gemini request timed out') }
}

export class GeminiSchemaError extends Error {
  constructor(msg: string) { super(`Gemini response did not match expected schema: ${msg}`) }
}

// Every model in the chain failed. `attempts` is a log-safe summary (model + HTTP status), no keys.
export class GeminiExhausted extends Error {
  constructor(public readonly attempts: string[]) {
    super(`Gemini unavailable after ${attempts.length} attempt(s): ${attempts.join('; ')}`)
  }
}
