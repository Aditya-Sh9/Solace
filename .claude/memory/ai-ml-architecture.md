# SOLACE — AI/ML Architecture

## Three-Layer System

### Layer 1 — Rule Engine (TypeScript)

Location: `src/lib/rule-engine/`

Deterministic logic mapping symptom combinations to deficiency flags.
Pure functions. Fully testable. No external API calls.

Example mappings:
- Fatigue + brain fog + irritability + low iron-rich foods → Iron flag
- Low mood + indoors + winter → Vitamin D flag
- Poor sleep + anxiety + muscle tension → Magnesium flag

All rules sourced from peer-reviewed nutritional science.
Rule sources documented in `src/lib/rule-engine/sources.md`.

### Layer 2 — Emotion Classifier (Hugging Face)

Model: `j-hartmann/emotion-english-distilroberta-base`
Input: free-text from check-in notes (NOT journal entries)
Output: classification across joy, sadness, anger, fear, disgust, surprise

Called via Python ML service for unified ML access.

### Layer 3 — Personal Pattern Model (scikit-learn)

Trains on individual user's logged data after 14+ check-ins.
Features: sleep, water, sunlight, food groups, stress, day of week, cycle phase.
Target: mood score, energy score.

Model type: Gradient Boosting Regressor (light, fast, interpretable).
Re-trains weekly per user.

### Layer 4 — LLM Synthesis (Gemini Flash)

Takes all signals → produces human, warm, specific advice.

Prompt template lives in `src/lib/gemini/prompts/`.
Output is structured JSON parsed into UI cards.

## Privacy Boundary

**Journal entries NEVER feed any AI/ML layer.**
They are client-side encrypted before storage.
This boundary is architecturally enforced, not policy-enforced.

## Cost Strategy

- Gemini Flash: free tier (1M tokens/day) — generous
- Hugging Face: free inference API
- ML Service: Railway/Render free tier
- All under $0/month for personal portfolio scale.