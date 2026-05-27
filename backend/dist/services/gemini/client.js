"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_MODEL = void 0;
exports.getGeminiClient = getGeminiClient;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../../config/env");
// Current GA Gemini Flash model
exports.GEMINI_MODEL = 'gemini-2.0-flash';
let _client = null;
function getGeminiClient() {
    if (!env_1.env.GEMINI_API_KEY)
        return null;
    if (!_client) {
        _client = new generative_ai_1.GoogleGenerativeAI(env_1.env.GEMINI_API_KEY);
    }
    return _client;
}
