"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiResponseSchema = exports.geminiInsightSchema = exports.insightTypeSchema = void 0;
const zod_1 = require("zod");
exports.insightTypeSchema = zod_1.z.enum([
    'ENCOURAGEMENT',
    'RECOMMENDATION',
    'DEFICIENCY_FLAG',
    'PATTERN',
]);
exports.geminiInsightSchema = zod_1.z.object({
    type: exports.insightTypeSchema,
    title: zod_1.z.string().min(1).max(120),
    body: zod_1.z.string().min(10).max(500),
    flags: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.geminiResponseSchema = zod_1.z.object({
    insights: zod_1.z.array(exports.geminiInsightSchema).min(1).max(4),
});
