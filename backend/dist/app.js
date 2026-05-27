"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const onboarding_1 = __importDefault(require("./routes/onboarding"));
const profile_1 = __importDefault(require("./routes/profile"));
const checkin_1 = __importDefault(require("./routes/checkin"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const insights_1 = __importDefault(require("./routes/insights"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.env.FRONTEND_URL }));
app.use(express_1.default.json({ limit: '100kb' }));
// Global rate limiter: 100 req / 15 min per IP
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { data: null, error: 'Too many requests — please slow down a little.' },
});
app.use(globalLimiter);
// Strict limiter for write endpoints that have real cost or abuse risk
const onboardingLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { data: null, error: 'Too many requests — please try again later.' },
});
const checkinLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { data: null, error: 'Too many requests — please try again later.' },
});
// 5 insight requests per hour per IP (per-user 6h gate enforced in pipeline)
const insightLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { data: null, error: 'Too many requests — please try again later.' },
});
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'solace-backend' });
});
app.use('/api/onboarding', onboardingLimiter, onboarding_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/checkin', checkinLimiter, checkin_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/insights', insightLimiter, insights_1.default);
// Central error handler — catches all unhandled async errors thrown by routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
    const timestamp = new Date().toISOString();
    const route = `${req.method} ${req.path}`;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[${timestamp}] ERROR ${route}: ${message}`);
    if (err instanceof Error && err.stack) {
        console.error(err.stack);
    }
    res.status(500).json({ data: null, error: 'Something went wrong. Please try again.' });
});
exports.default = app;
