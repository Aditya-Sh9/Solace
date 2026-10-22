import app from "./app";
import { env } from "./config/env";
import { geminiModelChain } from "./services/gemini/client";

if (!env.GEMINI_API_KEY) {
  console.warn('[solace-backend] GEMINI_API_KEY not set — insight generation will use rule-engine fallback copy only');
} else {
  console.log(`[solace-backend] Gemini models (in order): ${geminiModelChain().join(' -> ')}`);
}

app.listen(env.PORT, () => {
  console.log(`[solace-backend] running on port ${env.PORT} (${env.NODE_ENV})`);
});
