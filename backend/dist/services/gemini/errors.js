"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiSchemaError = exports.GeminiTimeout = exports.GeminiUnavailable = void 0;
class GeminiUnavailable extends Error {
    constructor() { super('Gemini API key not configured'); }
}
exports.GeminiUnavailable = GeminiUnavailable;
class GeminiTimeout extends Error {
    constructor() { super('Gemini request timed out'); }
}
exports.GeminiTimeout = GeminiTimeout;
class GeminiSchemaError extends Error {
    constructor(msg) { super(`Gemini response did not match expected schema: ${msg}`); }
}
exports.GeminiSchemaError = GeminiSchemaError;
