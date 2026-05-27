"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
if (!env_1.env.GEMINI_API_KEY) {
    console.warn('[solace-backend] GEMINI_API_KEY not set — insight generation will use rule-engine fallback copy only');
}
app_1.default.listen(env_1.env.PORT, () => {
    console.log(`[solace-backend] running on port ${env_1.env.PORT} (${env_1.env.NODE_ENV})`);
});
