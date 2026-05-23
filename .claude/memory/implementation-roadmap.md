# SOLACE — Implementation Roadmap

> This is a living document. Claude must update this file automatically
> when a phase or task is completed. Never leave this file stale.
>
> Status legend:
> ⬜ Not started
> 🔄 In progress  
> ✅ Complete
> ⚠️ Blocked

---

## Auto-Update Rules (Claude must follow these)

After completing any phase or task:
1. Change the status emoji on that phase/task
2. Add completion date in the [Completed: ] field
3. Add any important notes in the [Notes: ] field
4. Update state.md to reflect the new current phase
5. Do this WITHOUT being asked — it is mandatory

---

## Project Overview

Total Phases: 8 (Phase 0 through Phase 7)
Current Phase: ⬜ Phase 0 — Setup
Project Start: [DATE — fill when you begin]
Target Completion: [DATE — estimate 9–10 weeks from start]

---

## ⬜ Phase 0 — Project Setup & Infrastructure
**Status:** ⬜ Not started  
**Estimated time:** 4–5 days  
**Completed:** —  
**Output folder:** `.claude/outputs/phase-0-setup/`

### Goal
Get the entire monorepo, tooling, and deployment pipeline ready
before writing a single line of product code. Everything that comes
after depends on this being solid.

### Tasks

- ⬜ 0.1 — Initialize monorepo root with workspaces package.json
- ⬜ 0.2 — Create Next.js 14 frontend with TypeScript, Tailwind, App Router
- ⬜ 0.3 — Create Express + TypeScript backend with proper folder structure
- ⬜ 0.4 — Create Python FastAPI ml-service with base structure
- ⬜ 0.5 — Create `/shared` TypeScript types package
- ⬜ 0.6 — Set up Supabase project (database + auth enabled)
- ⬜ 0.7 — Write initial Prisma schema (all tables — see Architecture doc)
- ⬜ 0.8 — Run first Prisma migration against Supabase
- ⬜ 0.9 — Connect backend to Supabase via Prisma (test query works)
- ⬜ 0.10 — Set up all .env files (frontend, backend, ml-service)
- ⬜ 0.11 — Deploy blank frontend to Vercel (just the Next.js welcome page)
- ⬜ 0.12 — Deploy blank backend to Railway (health check endpoint returns 200)
- ⬜ 0.13 — Deploy blank ml-service to Railway (health check returns 200)
- ⬜ 0.14 — Wire environment variables across all three services
- ⬜ 0.15 — First full repo commit with all .claude/ memory files in place
- ⬜ 0.16 — Verify root `npm run dev` spins up both frontend and backend

### Architecture Decisions This Phase
- Monorepo with npm workspaces (frontend + backend + shared + ml-service)
- Frontend → Vercel, Backend → Railway, ML → Railway (separate service)
- Supabase handles auth JWT — backend verifies token on every request

### Definition of Done
All three services deployed and reachable. DB connected. 
A developer cloning the repo can run `npm run dev` and 
have frontend + backend running locally in under 5 minutes.

### Risks
- Supabase free tier region latency (pick region closest to you)
- Railway free tier sleep after inactivity (acceptable for portfolio)
- Environment variable misconfiguration between services

### Notes
[Claude fills this in on completion]

---

## ⬜ Phase 1 — Auth + Onboarding
**Status:** ⬜ Not started  
**Estimated time:** 1 week  
**Completed:** —  
**Depends on:** Phase 0 complete  
**Output folder:** `.claude/outputs/phase-1-auth-onboarding/`

### Goal
A new user can discover SOLACE, sign up or log in, complete an
animated onboarding flow, have their profile saved, and see a
first AI-generated insight before they ever log a check-in.
This is the first impression — it must feel stunning.

### Tasks

**Auth**
- ⬜ 1.1 — Supabase Auth setup (email/password + Google OAuth)
- ⬜ 1.2 — Auth middleware in backend (verify Supabase JWT on all routes)
- ⬜ 1.3 — Login page UI (warm, hand-drawn aesthetic from design-ideology.md)
- ⬜ 1.4 — Signup page UI
- ⬜ 1.5 — Auth state management in frontend (hook: useAuth)
- ⬜ 1.6 — Protected route wrapper (redirect to login if not authed)
- ⬜ 1.7 — Session persistence (stay logged in across refreshes)

**Onboarding Flow**
- ⬜ 1.8 — Onboarding flow layout (full screen, one question at a time)
- ⬜ 1.9 — Animated progress indicator (hand-drawn line fills across top)
- ⬜ 1.10 — Step 1: Name and age
- ⬜ 1.11 — Step 2: How do you usually feel energy-wise?
- ⬜ 1.12 — Step 3: Activity level (illustrated options)
- ⬜ 1.13 — Step 4: Dietary pattern (illustrated options)
- ⬜ 1.14 — Step 5: Common symptoms (multi-select illustrated chips)
- ⬜ 1.15 — Step 6: Sleep patterns
- ⬜ 1.16 — Step 7: Stress level
- ⬜ 1.17 — Step 8: Main wellness goal
- ⬜ 1.18 — Step 9 (women): Cycle tracking opt-in (respectful, optional)
- ⬜ 1.19 — Step 10: "We're ready" completion screen

**Backend**
- ⬜ 1.20 — POST /api/onboarding — save user profile
- ⬜ 1.21 — GET /api/profile — retrieve user profile
- ⬜ 1.22 — First insight generation using rule engine on onboarding data

**First Insight Screen**
- ⬜ 1.23 — "Based on what you've shared" insight card design
- ⬜ 1.24 — Transition animation from onboarding → insight → dashboard

### Definition of Done
A new user can sign up, complete all onboarding steps, and land
on their dashboard with at least one real insight card generated
from their onboarding data.

### Key UX Rules For This Phase
- One question per screen. Never two.
- Back button always available.
- Skip button on any optional step.
- Page transitions feel like turning journal pages.
- Read design-ideology.md before touching any UI in this phase.

### Risks
- Google OAuth redirect URI misconfiguration
- Onboarding animation performance on low-end phones
- Users abandoning midway (add onboarding recovery)

### Notes
[Claude fills this in on completion]

---

## ⬜ Phase 2 — Daily Check-in + Dashboard
**Status:** ⬜ Not started  
**Estimated time:** 1 week  
**Completed:** —  
**Depends on:** Phase 1 complete  
**Output folder:** `.claude/outputs/phase-2-checkin-dashboard/`

### Goal
The core daily loop. Users can complete a check-in in under 2 minutes.
The dashboard shows their history, streaks, and early patterns.
This is what users see every day — it must feel effortless and warm.

### Tasks

**Daily Check-in**
- ⬜ 2.1 — Check-in page layout (feels like opening a fresh journal page)
- ⬜ 2.2 — Mood picker: 6 illustrated faces, selection animates ink circle
- ⬜ 2.3 — Energy level slider (illustrated, not default HTML range)
- ⬜ 2.4 — Sleep hours input (illustrated moon + hours)
- ⬜ 2.5 — Water intake input (illustrated glasses)
- ⬜ 2.6 — Sunlight/outdoor time input
- ⬜ 2.7 — Stress level input (1–5 illustrated scale)
- ⬜ 2.8 — Symptom chips (multi-select, hand-written label aesthetic)
- ⬜ 2.9 — Food groups eaten today (illustrated chips)
- ⬜ 2.10 — Optional notes field (short text, soft placeholder copy)
- ⬜ 2.11 — Submit button ("Save today's entry" — stamped aesthetic)
- ⬜ 2.12 — Success animation after saving

**Backend**
- ⬜ 2.13 — POST /api/checkin — validate and save
- ⬜ 2.14 — GET /api/checkin/history — paginated history
- ⬜ 2.15 — GET /api/checkin/streak — calculate current streak
- ⬜ 2.16 — One check-in per day enforcement (edit if same day)

**Dashboard**
- ⬜ 2.17 — Dashboard layout (greeting card, graphs, insight cards)
- ⬜ 2.18 — Time-of-day greeting ("Good morning/evening, [Name]")
- ⬜ 2.19 — Mood history graph (wobbly hand-drawn line, Recharts)
- ⬜ 2.20 — Energy history graph (secondary line, same chart)
- ⬜ 2.21 — Streak counter (illustrated, celebratory on milestones)
- ⬜ 2.22 — "Check in today" CTA card if no entry today
- ⬜ 2.23 — Recent insights section (empty state if none yet)
- ⬜ 2.24 — Quick stats cards (avg sleep this week, avg mood, etc.)
- ⬜ 2.25 — Mobile bottom navigation bar

**States to design (all of them)**
- ⬜ 2.26 — Empty state: first time on dashboard, no data yet
- ⬜ 2.27 — Loading state: skeleton screens, no spinners
- ⬜ 2.28 — Error state: warm copy, retry option

### Definition of Done
User can complete a check-in in under 2 minutes and immediately
see it reflected on their dashboard. All states (empty, loading,
error) are designed and working.

### Risks
- Chart library performance on mobile (test on real device)
- Date/timezone handling for streak calculation

### Notes
[Claude fills this in on completion]

---

## ⬜ Phase 3 — Rule Engine + Gemini AI Insights
**Status:** ⬜ Not started  
**Estimated time:** 1 week  
**Completed:** —  
**Depends on:** Phase 2 complete (need real check-in data)  
**Output folder:** `.claude/outputs/phase-3-rule-engine-gemini/`

### Goal
SOLACE starts being intelligent. After a few check-ins, users
receive warm, specific, science-grounded insights about what
might be causing how they feel — not generic advice.

### Tasks

**Rule Engine (TypeScript)**
- ⬜ 3.1 — Rule engine architecture in backend/src/services/rule-engine/
- ⬜ 3.2 — Deficiency rules: Iron (fatigue + irritability + low iron foods)
- ⬜ 3.3 — Deficiency rules: Vitamin D (low mood + indoors + low sunlight)
- ⬜ 3.4 — Deficiency rules: Magnesium (anxiety + poor sleep + muscle tension)
- ⬜ 3.5 — Deficiency rules: B12 (brain fog + fatigue + low animal products)
- ⬜ 3.6 — Deficiency rules: Vitamin C (low energy + low fruit/veg intake)
- ⬜ 3.7 — Lifestyle rules: sleep debt detection
- ⬜ 3.8 — Lifestyle rules: dehydration pattern
- ⬜ 3.9 — Lifestyle rules: sedentary pattern detection
- ⬜ 3.10 — Stress pattern rules: sustained high stress over 5+ days
- ⬜ 3.11 — Rule engine returns: flags[], confidence scores, evidence[]
- ⬜ 3.12 — Document all rule sources in backend/src/services/rule-engine/sources.md

**Gemini Integration**
- ⬜ 3.13 — Gemini Flash client setup in backend/src/services/gemini/client.ts
- ⬜ 3.14 — Prompt template: weekly insight report
- ⬜ 3.15 — Prompt template: daily nudge
- ⬜ 3.16 — Prompt template: deficiency explanation
- ⬜ 3.17 — Structured JSON output from Gemini (parse into typed response)
- ⬜ 3.18 — Fallback: if Gemini fails, rule engine output alone is shown

**Insight Pipeline**
- ⬜ 3.19 — POST /api/insights/generate — trigger insight generation
- ⬜ 3.20 — GET /api/insights — retrieve user's insight history
- ⬜ 3.21 — Insight stored in DB after generation (not regenerated every load)
- ⬜ 3.22 — Weekly insight auto-generation (cron or on-demand trigger)

**Insight UI**
- ⬜ 3.23 — Insight card component (index card / torn paper aesthetic)
- ⬜ 3.24 — Deficiency flag card (icon + plain language explanation)
- ⬜ 3.25 — Recommendation card (what + why + one step)
- ⬜ 3.26 — Insight detail page (full expanded insight)
- ⬜ 3.27 — Insights history page

### Definition of Done
After 3+ check-ins, a user receives a real, warm, specific insight
card that connects their logged habits to a possible cause. The
insight does not sound like ChatGPT. It sounds like a caring friend
who read the research.

### Critical Rules For This Phase
- All deficiency flags must cite a real source (log in sources.md)
- Gemini prompts must be reviewed for tone — no clinical language
- Always include "this is not medical advice" in small print on insight cards
- If confidence score is low, Gemini should express uncertainty warmly

### Risks
- Gemini free tier rate limits (cache insights, don't regenerate constantly)
- Prompt engineering takes iteration — budget 2 days just for prompts
- False positives in rule engine (tune thresholds carefully)

### Notes
[Claude fills this in on completion]

---

## ⬜ Phase 4 — ML Layer
**Status:** ⬜ Not started  
**Estimated time:** 1.5 weeks  
**Completed:** —  
**Depends on:** Phase 3 complete, users have 14+ check-ins  
**Output folder:** `.claude/outputs/phase-4-ml-layer/`

### Goal
SOLACE stops being rule-based and starts being genuinely personal.
After enough data, it learns YOUR patterns — not a generic user's.
This is the feature that makes SOLACE feel alive.

### Tasks

**Python ML Service (FastAPI)**
- ⬜ 4.1 — FastAPI app structure and health check endpoint
- ⬜ 4.2 — Pydantic models for request/response validation
- ⬜ 4.3 — Authentication: backend-to-ml service API key
- ⬜ 4.4 — Deploy to Railway, test backend can call it

**Emotion Classifier**
- ⬜ 4.5 — Hugging Face emotion model setup (j-hartmann/emotion-english-distilroberta-base)
- ⬜ 4.6 — POST /ml/emotion — classify text, return emotion + confidence
- ⬜ 4.7 — Wire to backend: check-in notes run through classifier on save
- ⬜ 4.8 — Store emotion classification result with check-in in DB

**Personal Pattern Model**
- ⬜ 4.9 — Data preparation: pull user check-ins, clean, feature engineer
- ⬜ 4.10 — Feature set: sleep, water, sunlight, food groups, stress, day of week
- ⬜ 4.11 — Target variables: mood score (next day), energy score (next day)
- ⬜ 4.12 — Model: Gradient Boosting Regressor (sklearn)
- ⬜ 4.13 — Training gate: only train if user has 14+ check-ins
- ⬜ 4.14 — POST /ml/train/:userId — train model for specific user
- ⬜ 4.15 — POST /ml/predict — return prediction + feature importance
- ⬜ 4.16 — Model persistence: save trained model per user (joblib)
- ⬜ 4.17 — Weekly retraining trigger from backend

**Integration**
- ⬜ 4.18 — ML client in backend/src/services/ml-client/
- ⬜ 4.19 — Pass ML predictions into Gemini prompt context
- ⬜ 4.20 — Dashboard: "Based on your patterns" prediction card
- ⬜ 4.21 — Feature importance shown in plain language
          ("Your mood tends to be better on days you sleep 7+ hours")

### Definition of Done
A user with 14+ check-ins sees a "your personal patterns" card on
dashboard that shows a genuine prediction based on their own data,
with a plain-language explanation of what factors matter most for them.

### Risks
- ML service memory limits on Railway free tier (lightweight models only)
- Not enough user data to make meaningful predictions (expected — document it)
- Model performance varies wildly per user

### Notes
[Claude fills this in on completion]

---

## ⬜ Phase 5 — Private Encrypted Journal
**Status:** ⬜ Not started  
**Estimated time:** 1 week  
**Completed:** —  
**Depends on:** Phase 2 complete (auth and user system stable)  
**Output folder:** `.claude/outputs/phase-5-journal/`

### Goal
A private, encrypted digital diary that feels like a real physical
journal. The scribble-on-edit and page-tear-on-delete animations
are what make this section unforgettable. This must feel like the
safest place on the internet.

### Tasks

**Encryption System**
- ⬜ 5.1 — Web Crypto API key derivation (PBKDF2 from user password)
- ⬜ 5.2 — AES-GCM encryption function
- ⬜ 5.3 — AES-GCM decryption function
- ⬜ 5.4 — Key stored in sessionStorage (never sent to server)
- ⬜ 5.5 — Key re-derivation on session restore
- ⬜ 5.6 — Verify: server receives and stores only ciphertext

**Backend**
- ⬜ 5.7 — POST /api/journal — receive ciphertext, store
- ⬜ 5.8 — GET /api/journal — return list (encrypted blobs)
- ⬜ 5.9 — PUT /api/journal/:id — update (new ciphertext)
- ⬜ 5.10 — DELETE /api/journal/:id — soft delete
- ⬜ 5.11 — Verify: no endpoint attempts to read or process content

**Journal UI**
- ⬜ 5.12 — Journal list page (entries shown as diary spine / date)
- ⬜ 5.13 — New entry page (paper texture, ruled lines, margin doodles)
- ⬜ 5.14 — Tiptap rich text editor setup
- ⬜ 5.15 — Handwriting font applied to journal body (Caveat or Kalam)
- ⬜ 5.16 — Mood picker at top (6 illustrated faces, watercolour wash on select)
- ⬜ 5.17 — Date and time shown in handwriting style header
- ⬜ 5.18 — Save button ("Close entry" — wax seal or stamp aesthetic)

**Speech to Text**
- ⬜ 5.19 — Web Speech API integration (browser-native, free)
- ⬜ 5.20 — Microphone button (hand-drawn stamp aesthetic)
- ⬜ 5.21 — Recording indicator (animated ink wave while listening)
- ⬜ 5.22 — Transcript inserted at cursor position in Tiptap

**Edit Animation (scribble)**
- ⬜ 5.23 — On edit: SVG scribble draws over old text (Framer Motion)
- ⬜ 5.24 — New text appears below with slight indent
- ⬜ 5.25 — Margin note: "edited [time]" in small italic
- ⬜ 5.26 — Edit history stored (encrypted) for user to view if wanted

**Delete Animation (page tear)**
- ⬜ 5.27 — On delete: confirmation prompt (warm copy, no alarming language)
- ⬜ 5.28 — Page tear animation from top corner (SVG + Framer Motion)
- ⬜ 5.29 — Paper crumple and fall away
- ⬜ 5.30 — "Page removed" message with small torn paper illustration
- ⬜ 5.31 — Soft delete in DB (recoverable within 7 days — optional feature)

**Privacy UI**
- ⬜ 5.32 — Privacy notice on journal home: "This journal is yours alone"
- ⬜ 5.33 — Small illustrated lock icon alongside notice
- ⬜ 5.34 — Tooltip explaining encryption in plain language

### Definition of Done
User can write, save, edit (with visible scribble animation), and delete
(with page tear animation) journal entries. Server-side verification
confirms encrypted blobs are unreadable without the client key.

### Critical Rules For This Phase
- Journal content NEVER passed to Gemini, ML service, or any external API
- Encryption must be verified by security-auditor agent before phase is marked done
- Every empty state in the journal feels warm and inviting

### Risks
- Web Crypto API inconsistencies across older browsers
- Tiptap + custom fonts performance on mobile
- Page tear animation is complex — budget 2 days for animation alone

### Notes
[Claude fills this in on completion]

---

## ⬜ Phase 6 — Women's Wellness Section
**Status:** ⬜ Not started  
**Estimated time:** 1 week  
**Completed:** —  
**Depends on:** Phase 2 complete  
**Output folder:** `.claude/outputs/phase-6-women-wellness/`

### Goal
A genuinely respectful, science-grounded, cycle-aware wellness section.
Not pink and patronizing. Not clinical and cold. Think: knowledgeable
older sister who actually read the research and wants you to feel better.
This section must be the most thoughtful thing in the app.

### Tasks

**Cycle Tracking**
- ⬜ 6.1 — Cycle data input (last period date, average cycle length)
- ⬜ 6.2 — Phase detection logic (Menstrual, Follicular, Ovulatory, Luteal)
- ⬜ 6.3 — Current phase calculation based on today's date
- ⬜ 6.4 — Phase stored with check-in data for correlation analysis
- ⬜ 6.5 — POST /api/wellness/cycle — save cycle data
- ⬜ 6.6 — GET /api/wellness/phase — return current phase

**UI: Cycle Visualization**
- ⬜ 6.7 — Illustrated circular calendar showing full cycle
- ⬜ 6.8 — Current phase highlighted with watercolour wash (Framer Motion)
- ⬜ 6.9 — Phase labels in gentle plain language (not medical jargon)
- ⬜ 6.10 — Days until next phase shown warmly

**Phase Cards (all four phases)**
- ⬜ 6.11 — Menstrual phase card: what body is doing + mood + energy + tips
- ⬜ 6.12 — Follicular phase card: what body is doing + mood + energy + tips
- ⬜ 6.13 — Ovulatory phase card: what body is doing + mood + energy + tips
- ⬜ 6.14 — Luteal phase card: what body is doing + mood + energy + tips
- ⬜ 6.15 — Each card: recommended foods, exercises, activities, rest cues
- ⬜ 6.16 — Each card: illustrated botanical accents (SVG)
- ⬜ 6.17 — Exercise recommendations vary by phase (strength vs gentle yoga)

**Symptom Logging**
- ⬜ 6.18 — Period symptom chips (human language: "heavy cramping", "mood feels heavy")
- ⬜ 6.19 — Severity scale (gentle 1–3, not clinical)
- ⬜ 6.20 — Symptoms stored with date + cycle phase
- ⬜ 6.21 — Symptom pattern shown over time (simple chart)

**Myths vs Facts**
- ⬜ 6.22 — Research and compile 12–15 myth/fact pairs (all sourced)
- ⬜ 6.23 — Myths vs Facts card layout (myth = soft strikethrough, fact = warm check)
- ⬜ 6.24 — Sources cited at the bottom of each fact in small text

**Mood Overlay**
- ⬜ 6.25 — Dashboard mood graph: overlay cycle phase as background bands
- ⬜ 6.26 — Users can see correlation between cycle phase and mood over time
- ⬜ 6.27 — Plain language annotation: "You tend to feel lower energy during Luteal"

### Definition of Done
A user who opts into cycle tracking sees their current phase with
relevant, warm, sourced recommendations. The mood graph shows cycle
phase correlation. The myths vs facts section has at least 12 entries.

### Design Mandate For This Phase
- Read design-ideology.md before every UI component in this section
- This section must not default to pink unless user chose Blush theme
- Botanical illustration SVGs as accents (not bodies, not clinical diagrams)
- Every piece of copy reviewed for tone: respectful, warm, never preachy
- Test with female users if possible before marking done

### Risks
- Phase detection logic edge cases (irregular cycles, long cycles)
- Myth/fact research takes time — do this alongside coding other tasks
- Tone calibration is hard — iterate on copy with real feedback

### Notes
[Claude fills this in on completion]

---

## ⬜ Phase 7 — Polish, Performance & Deployment
**Status:** ⬜ Not started  
**Estimated time:** 1 week  
**Completed:** —  
**Depends on:** All previous phases complete  
**Output folder:** `.claude/outputs/phase-7-polish/`

### Goal
Turn a working app into a portfolio-ready, production-quality product.
This phase is what separates a student project from something you'd
be proud to show in an interview or ship to real users.

### Tasks

**Theming**
- ⬜ 7.1 — All 4 themes fully implemented (Sage, Blush, Dusk, Honey)
- ⬜ 7.2 — Dark mode for all 4 themes
- ⬜ 7.3 — Theme switcher: floating palette, 4 circular swatches
- ⬜ 7.4 — Theme transition: full-page CSS variable transition, 400ms
- ⬜ 7.5 — Dark/light toggle: illustrated sun/moon, animated
- ⬜ 7.6 — Theme preference persisted to user profile in DB

**Animations Audit**
- ⬜ 7.7 — Every page transition uses Framer Motion (not just cuts)
- ⬜ 7.8 — Every button has hover + active state animation
- ⬜ 7.9 — All loading states are animated skeletons (no spinners)
- ⬜ 7.10 — All empty states are illustrated and warm
- ⬜ 7.11 — prefers-reduced-motion respected everywhere
- ⬜ 7.12 — No janky or laggy animations on mobile (test on real device)

**Mobile Audit**
- ⬜ 7.13 — Every page works perfectly on 375px width (iPhone SE)
- ⬜ 7.14 — Every tap target is minimum 48px
- ⬜ 7.15 — Bottom nav bar works correctly on all phones
- ⬜ 7.16 — Keyboard doesn't break layout on mobile forms
- ⬜ 7.17 — Scroll behaviour is smooth everywhere

**Accessibility**
- ⬜ 7.18 — All interactive elements keyboard navigable
- ⬜ 7.19 — All images have alt text
- ⬜ 7.20 — Color contrast passes WCAG AA in all themes
- ⬜ 7.21 — Screen reader tested on main flows

**Performance**
- ⬜ 7.22 — Lighthouse score > 90 on mobile (Performance, Accessibility, Best Practices)
- ⬜ 7.23 — Images optimized (Next.js Image component used everywhere)
- ⬜ 7.24 — No unnecessary re-renders (React DevTools audit)
- ⬜ 7.25 — API responses cached where appropriate

**Copy Review**
- ⬜ 7.26 — Full app copy audit: no clinical language anywhere
- ⬜ 7.27 — All error messages are warm and helpful
- ⬜ 7.28 — All empty states are illustrated and inviting
- ⬜ 7.29 — "Not medical advice" disclaimer on all health-related content

**Security Audit**
- ⬜ 7.30 — Run security-auditor agent checklist
- ⬜ 7.31 — Journal encryption boundary verified
- ⬜ 7.32 — No secrets in client-side code
- ⬜ 7.33 — Rate limiting verified on all sensitive endpoints

**Documentation**
- ⬜ 7.34 — README.md (professional, with screenshots)
- ⬜ 7.35 — SETUP.md (how to run locally, step by step)
- ⬜ 7.36 — ARCHITECTURE.md (diagrams, decisions, rationale)
- ⬜ 7.37 — Code comments on all complex logic

**Portfolio Assets**
- ⬜ 7.38 — Demo video (2–3 minutes, screen recording with voiceover)
- ⬜ 7.39 — Screenshots of every major page (light + dark mode)
- ⬜ 7.40 — Live demo URL finalized and stable
- ⬜ 7.41 — GitHub repo is clean (no debug code, .env not committed)

### Definition of Done
SOLACE is live, fast, beautiful, accessible, and documented.
You can send the GitHub link and live URL to a senior engineer
and not feel embarrassed about anything in the codebase.

### Notes
[Claude fills this in on completion]

---

## Completion Summary

| Phase | Name                       | Status | Completed |
|-------|----------------------------|--------|-----------|
| 0     | Setup & Infrastructure     | ⬜     | —         |
| 1     | Auth + Onboarding          | ⬜     | —         |
| 2     | Daily Check-in + Dashboard | ⬜     | —         |
| 3     | Rule Engine + Gemini       | ⬜     | —         |
| 4     | ML Layer                   | ⬜     | —         |
| 5     | Private Encrypted Journal  | ⬜     | —         |
| 6     | Women's Wellness           | ⬜     | —         |
| 7     | Polish & Deploy            | ⬜     | —         |

---

## Claude Auto-Update Instructions

When any task above is completed:
→ Change ⬜ to ✅ on that task line
→ If all tasks in a phase are ✅, change the phase Status to ✅ Complete
→ Fill in the Completed date field
→ Add implementation notes in the Notes section
→ Update state.md to reflect current phase and progress
→ Do this automatically. Do not wait to be asked.