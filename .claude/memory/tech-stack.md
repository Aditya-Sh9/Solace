# SOLACE — Tech Stack (LOCKED)

Do not change anything in this file without explicit user approval.
When a new library is added, log it here with rationale.

## Frontend

| Tech              | Version | Purpose                          |
|-------------------|---------|----------------------------------|
| Next.js           | 14.x    | Full-stack framework, App Router |
| TypeScript        | 5.x     | Type safety                      |
| Tailwind CSS      | 3.x     | Styling                          |
| Framer Motion     | 11.x    | Animations / micro-interactions  |
| shadcn/ui         | latest  | Component base (customized)      |
| Recharts          | 2.x     | Data visualization               |
| Tiptap            | 2.x     | Journal rich text editor         |
| Lucide React      | latest  | Icon system                      |

## Backend

| Tech              | Purpose                            |
|-------------------|------------------------------------|
| Next.js API Routes| Application API                    |
| Prisma            | ORM, type-safe DB access           |
| Zod               | Runtime validation                 |

## Database & Auth

| Tech              | Purpose                            |
|-------------------|------------------------------------|
| Supabase Postgres | Primary database                   |
| Supabase Auth     | Authentication (email + Google)    |

## AI / ML

| Tech                       | Purpose                              |
|----------------------------|--------------------------------------|
| Google Gemini Flash        | LLM for insights, recommendations    |
| Hugging Face Inference API | Emotion classification               |
| Python FastAPI             | ML microservice                      |
| scikit-learn               | Personal pattern model               |
| pandas, numpy              | Data processing                      |

## Security

| Tech              | Purpose                            |
|-------------------|------------------------------------|
| Web Crypto API    | Client-side journal encryption     |
| bcrypt (Supabase) | Password hashing (managed)         |

## Deployment

| Service          | Purpose                            |
|------------------|------------------------------------|
| Vercel           | Next.js hosting                    |
| Railway / Render | Python ML service hosting          |
| Supabase Cloud   | DB + Auth hosting                  |

## Service Breakdown

### Frontend (`/frontend`)
- Next.js 14, TypeScript, Tailwind, Framer Motion, shadcn/ui
- Supabase client (auth only)
- Web Crypto API for journal encryption
- Deployed: Vercel

### Backend (`/backend`)
- Node.js 20+, Express, TypeScript
- Prisma ORM → Supabase Postgres
- Zod validation
- Google Gemini SDK
- Deployed: Railway

### ML Service (`/ml-service`)
- Python 3.11, FastAPI
- scikit-learn, pandas, numpy
- Hugging Face Transformers
- Deployed: Railway (separate service)

### Shared (`/shared`)
- TypeScript-only package
- Type definitions used by both frontend and backend
- No runtime code

## Justification Log

[When a new library is added, log it here.]

- **[DATE]** Added [library] because [reason]. Considered alternatives: [list].