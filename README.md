# SOLACE

**You're not imagining it.**
There's more to how you feel — and maybe a pattern in it.

SOLACE is an emotionally intelligent AI wellness companion. It's not a medical app and it's not
a chatbot — it's built to feel like a personal health detective with a warm, human soul: something
that helps you notice the quiet, hard-to-name things (low energy, brain fog, mood swings, "just off")
and surfaces honest, non-clinical patterns in your own data, without ever diagnosing or prescribing.

> 🚧 **Status: in active development.** This is a solo portfolio project, built in public phases.
> Phases 0–6 are complete; Phase 7 (polish and hardening) is next — see [Progress](#progress) below.

---

## Live

| Service | URL |
|---|---|
| App (frontend) | [solace-frontend-yk6x.vercel.app](https://solace-frontend-yk6x.vercel.app) |
| API (backend) | [solace-backend-tfpm.onrender.com](https://solace-backend-tfpm.onrender.com) |
| ML service | [solace-ml-api.onrender.com](https://solace-ml-api.onrender.com) (called only by the backend) |

Backend and ML service run on Render's free tier, which sleeps after 15 minutes of inactivity — the
first request after a while can take 30–50 seconds to wake up.

---

## What SOLACE actually does

- **Daily check-ins** — mood, energy, sleep, water, sunlight, stress, symptoms, food — in under two minutes.
- **A rule engine** that maps symptom patterns to possible nutrient/lifestyle flags (iron, vitamin D,
  magnesium, B12, vitamin C, sleep debt, dehydration, sedentary behavior, sustained stress), sourced
  from peer-reviewed nutrition research.
- **Gemini-powered insight cards** that turn those flags into warm, specific, hedged language — never
  "you have a deficiency," always "there might be a pattern here."
- **A personal pattern model** (scikit-learn, trained per-user, stateless) that learns *your* data after
  14+ check-ins and surfaces an honest next-day mood/energy prediction — banded into plain language
  ("steadier," "brighter") rather than raw numbers, and hidden entirely when the model isn't confident.
- **A private journal** encrypted in your browser before it's saved, so the server only ever holds
  ciphertext. Many pages a day, a mood per page, on-device-only dictation, and the last version of
  an edited page kept (still encrypted). Edits scribble the old words out; deleting crumples the page.
- **A cycle-aware wellness section** — a cycle wheel, what each phase often feels like, a gentle
  symptom log, 13 sourced myths vs facts, and cycle phases drawn behind the dashboard mood graph.
- **Email or Google sign-in**, then a paper-page onboarding that shapes the first insights.

### What it deliberately doesn't do

No diagnoses. No medical claims. No supplement or affiliate pushing. No dark patterns. The journal
never feeds any AI/ML layer, and neither does cycle data — that boundary is architectural, not a setting.

---

## Progress

| Phase | Scope | Status |
|---|---|---|
| 0 | Monorepo, deploy pipeline, Supabase | ✅ Done |
| 1 | Auth + animated onboarding | ✅ Done |
| 2 | Daily check-in + dashboard | ✅ Done |
| 3 | Rule engine + Gemini insights | ✅ Done |
| 4 | Personal ML pattern model | ✅ Done |
| 5 | Encrypted journal | ✅ Done |
| 6 | Cycle-aware wellness section | ✅ Done |
| 7 | Polish, accessibility, docs, deploy hardening | ⬜ Not started |

An emotion-classification layer (reading tone from check-in notes) is intentionally deferred to
Phase 7 — free-tier serverless inference wasn't reliable enough to ship earlier.

---

## Architecture

Three independently deployed services:

```
Next.js (Vercel)  →  Express + TypeScript API (Render)  →  Supabase Postgres (via Prisma)
                              │                        └──→  Google Gemini Flash
                              └──────────────────────────→  Python FastAPI ML service (Render)
```

- **Frontend never talks to the database, Gemini, or the ML service directly** — everything routes
  through the backend.
- **The ML service is stateless.** No per-user model files — the backend sends a user's check-in
  history with each call and the service trains a small gradient-boosted model in memory, in
  milliseconds. `GET /api/patterns` is decoupled from the main dashboard load, so a cold ML service
  never blocks the rest of the app.
- **Journal encryption happens entirely in the browser** (Web Crypto: PBKDF2 → AES-GCM 256). The key
  comes from your password (or a journal passphrase for Google-only accounts), never leaves the
  browser, and the server stores only ciphertext — it can't read a page even with full DB access.
- **Gemini models are configuration, not code.** The backend tries a chain of Flash models and falls
  back to pre-written copy if none answer, logging why.
- **Tests:** 122 backend (Vitest) + 60 ML service (pytest), plus browser end-to-end checks.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, GSAP, Lenis, Tiptap, custom hand-drawn UI kit |
| Backend | Express 5, TypeScript, Prisma, Zod |
| ML service | Python 3.12, FastAPI, scikit-learn, pandas, numpy, scipy |
| Auth & DB | Supabase (Postgres + Auth) |
| AI | Google Gemini Flash |
| Deploy | Vercel (frontend), Render (backend + ML), Supabase Cloud |

---

## Repo layout

```
/frontend      Next.js UI
/backend       Express API — business logic, DB access, Gemini + ML integration
/ml-service    Python FastAPI — personal pattern model
/shared        Shared TypeScript types
```

Each service is independently deployable and has its own `package.json` / dependency file.

---

## Running it locally

Requires Node 20+, Python 3.12+ (Render runs 3.12; local dev uses 3.14), and a Supabase project.

```bash
npm install               # installs all workspaces
py -3.14 -m pip install -r ml-service/requirements.txt

# each service needs its own .env — see the corresponding .env.example
npm run dev                # frontend (:3000) + backend (:4000)
npm run dev:ml             # ml-service (:8000), separate terminal
```

`dev:ml` uses the Windows `py` launcher to pick Python 3.14 explicitly. On macOS/Linux, run
`cd ml-service && python3 -m uvicorn app.main:app --port 8000` instead. Without the ML service the
dashboard's "Your patterns" card simply stays hidden.

---

## About

Built by [Aditya Sharma](https://github.com/Aditya-Sh9) as a portfolio project — an attempt at a real
distributed system (separate frontend/backend/ML services, independent scaling, a genuine security
boundary around the journal) rather than a single Next.js app pretending to be one.
