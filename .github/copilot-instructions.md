# Copilot Instructions for AI Agents

## Project Overview

- **Type:** Next.js 14+ monorepo (TypeScript)
- **Main features:** Patient consultation system with authentication, video meetings, dashboards, messaging, and medical records.
- **Architecture:**
  - **App directory:** Uses Next.js app router (`app/`).
  - **API routes:**
    - tRPC endpoint at `/app/api/trpc/route.ts` (all backend procedures).
    - Auth endpoint at `/app/api/auth/[...all]/route.ts` (better-auth, catch-all).
  - **Backend logic:**
    - tRPC routers in `server/routers/` (e.g., `auth.ts`, `users.ts`).
    - Root router in `server/index.ts`.
    - Context and procedure helpers in `server/trpc.ts`.
  - **Database:** Drizzle ORM, schema in `drizzle/schema.ts`, config in `drizzle.config.ts`.
  - **Frontend:**
    - Components in `components/` and `features/auth/components/`.
    - Hooks in `hooks/` (e.g., `use-auth-mutation.ts`).
    - Shared UI in `components/ui/`.

## Developer Workflows

- **Start dev server:** `pnpm dev` (or `npm run dev`)
- **Build:** `pnpm build`
- **Database migration:** `pnpm db:push` (uses Drizzle)
- **Lint:** `pnpm lint`

## Patterns & Conventions

- **tRPC:**
  - All backend procedures are exposed via `/api/trpc`.
  - Routers are composed in `server/routers/` and registered in `server/index.ts`.
  - Context is created in `server/trpc.ts`.
- **Auth:**
  - Uses `better-auth` for Next.js API routes (`app/api/auth/[...all]/route.ts`).
  - tRPC also exposes auth procedures (e.g., `auth.signin`).
- **Frontend:**
  - React hooks for API calls (e.g., `useSignIn` in `hooks/use-auth-mutation.ts`).
  - Forms use `react-hook-form` and Zod schemas from `schema/auth.ts`.
- **Database:**
  - Drizzle ORM, schema in `drizzle/schema.ts`.
  - User table: `usersTable`.
- **UI:**
  - Shared UI primitives in `components/ui/`.
  - Feature-specific components in `features/` and `components/`.

## Integration Points

- **External:**
  - Google email sending (`@/lib/google`).
  - Drizzle ORM for DB.
  - better-auth for API auth.
- **Internal:**
  - tRPC for all backend/frontend communication.
  - Context/session via `server/trpc.ts`.

## Troubleshooting

- **404 on tRPC endpoints:**
  - Ensure `/api/trpc` is not shadowed by catch-all routes like `/api/auth/[...all]`.
  - Check router registration in `server/index.ts` and procedure names.
- **Database issues:**
  - Check `drizzle/schema.ts` and migration scripts in `migrations/`.

## Key Files & Directories

- `app/api/trpc/route.ts` — tRPC API handler
- `server/routers/auth.ts` — Auth router (tRPC)
- `server/index.ts` — Root tRPC router
- `drizzle/schema.ts` — DB schema
- `hooks/use-auth-mutation.ts` — Auth API hooks
- `components/ui/` — UI primitives

---

_Iterate and update this file as new patterns emerge or major changes are made._
