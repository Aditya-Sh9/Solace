# SOLACE — Coding Rules

## File Organization

- One component per file
- Components in PascalCase (`MoodPicker.tsx`)
- Hooks in camelCase with `use` prefix (`useCheckin.ts`)
- Utilities in kebab-case (`format-date.ts`)
- Max 300 lines per file. If longer, split.

## TypeScript

- No `any`. Ever. Use `unknown` and narrow.
- Prefer `type` for unions, `interface` for objects
- All API responses must have a typed contract
- Use Zod for runtime validation at every boundary

## React / Next.js

- Server Components by default. Use Client Components only when needed.
- Custom hooks for any logic used in 2+ places
- No prop drilling beyond 2 levels — use context or composition
- Always handle loading, error, and empty states explicitly

## Styling

- Tailwind utility classes — no inline styles
- Use CSS variables for theme colors (set in `globals.css`)
- Never hardcode colors. Always reference theme.
- Custom animations live in `src/components/animations/`

## API Routes

- Validate input with Zod
- Return consistent shape: `{ data, error }`
- Status codes used properly (200, 400, 401, 404, 500)
- Never expose Prisma errors directly to client

## Database

- All schema changes via Prisma migrations
- Never write raw SQL except for performance-critical reads
- Soft delete (with `deleted_at`) for journal and check-ins
- Index columns used in WHERE clauses

## Naming

- Boolean variables: `is`, `has`, `should` prefix
- Functions: verb-first (`getInsight`, not `insight`)
- Components: noun-based (`MoodPicker`, not `PickMood`)

## Error Handling

- Never `catch` without doing something
- User-facing errors must be warm, never technical
- Log errors to console + future error service

## Comments

- Comment WHY, not WHAT
- TODO comments must include date and context
- No commented-out code in commits

## Service Boundaries

- Frontend NEVER imports from `/backend` source
- Backend NEVER imports from `/frontend` source
- Both can import types from `/shared`
- Frontend talks to backend ONLY via the API client in `/frontend/src/lib/api-client`
- Backend talks to ML service ONLY via the ML client in `/backend/src/services/ml-client`
- Never bypass these boundaries, even for convenience