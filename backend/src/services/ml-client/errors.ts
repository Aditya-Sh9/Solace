export class MlUnavailable extends Error {
  constructor() { super('ML service not configured or unreachable') }
}

export class MlTimeout extends Error {
  constructor() { super('ML service request timed out') }
}

export class MlSchemaError extends Error {
  constructor(msg: string) { super(`ML response did not match expected schema: ${msg}`) }
}
