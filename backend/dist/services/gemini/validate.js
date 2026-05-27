"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTone = validateTone;
// Banned phrases — case-insensitive. Any hit rejects that insight body.
// Covers: prescriptive language, clinical register, soft-clinical phrasing (Correction D).
const BANNED_PHRASES = [
    'optimize',
    'you should',
    'you must',
    'you need to',
    'you are deficient',
    'diagnose',
    'treatment',
    'cure',
    'condition',
    'disorder',
    'prescribe',
    'medication',
    'unfortunately',
    'research suggests',
    'studies show',
    'evidence indicates',
    'clinical',
    'supplement',
    'deficiency',
];
function validateTone(text) {
    const lower = text.toLowerCase();
    const hits = BANNED_PHRASES.filter(phrase => lower.includes(phrase));
    return { ok: hits.length === 0, hits };
}
