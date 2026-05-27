export class GeminiUnavailable extends Error {
  constructor() { super('Gemini API key not configured') }
}

export class GeminiTimeout extends Error {
  constructor() { super('Gemini request timed out') }
}

export class GeminiSchemaError extends Error {
  constructor(msg: string) { super(`Gemini response did not match expected schema: ${msg}`) }
}
