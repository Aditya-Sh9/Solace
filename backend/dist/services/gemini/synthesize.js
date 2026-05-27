"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthesizeInsights = synthesizeInsights;
const client_1 = require("./client");
const weekly_insight_1 = require("./prompts/weekly-insight");
const schema_1 = require("./schema");
const errors_1 = require("./errors");
const TIMEOUT_MS = 10_000;
async function synthesizeInsights(result) {
    const client = (0, client_1.getGeminiClient)();
    if (!client)
        throw new errors_1.GeminiUnavailable();
    const model = client.getGenerativeModel({
        model: client_1.GEMINI_MODEL,
        systemInstruction: weekly_insight_1.SYSTEM_PROMPT,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json',
        },
    });
    const userPrompt = (0, weekly_insight_1.buildUserPrompt)(result);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let rawText;
    try {
        const response = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        });
        rawText = response.response.text();
    }
    catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw new errors_1.GeminiTimeout();
        }
        throw err;
    }
    finally {
        clearTimeout(timer);
    }
    let parsed;
    try {
        parsed = JSON.parse(rawText);
    }
    catch {
        throw new errors_1.GeminiSchemaError('Response was not valid JSON');
    }
    const validated = schema_1.geminiResponseSchema.safeParse(parsed);
    if (!validated.success) {
        throw new errors_1.GeminiSchemaError(validated.error.issues[0]?.message ?? 'Schema mismatch');
    }
    return validated.data;
}
