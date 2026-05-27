import app from "./app";
import { env } from "./config/env";

if (!env.GEMINI_API_KEY) {
  console.warn('[solace-backend] GEMINI_API_KEY not set — insight generation will use rule-engine fallback copy only');
}

app.listen(env.PORT, () => {
  console.log(`[solace-backend] running on port ${env.PORT} (${env.NODE_ENV})`);
});
