"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(4000),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:3000'),
    DATABASE_URL: zod_1.z.string(),
    SUPABASE_URL: zod_1.z.string(),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().min(1),
    GEMINI_API_KEY: zod_1.z.string().optional(),
    ML_SERVICE_URL: zod_1.z.string().default('http://localhost:8000'),
});
exports.env = envSchema.parse(process.env);
