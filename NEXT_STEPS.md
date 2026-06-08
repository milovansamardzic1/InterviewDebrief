# Next Steps

A practical roadmap for building Interwjuer on this scaffold, organized around the [12-Factor App](https://12factor.net/) principles.

Each phase builds on the previous one. Complete them in order unless you have a strong reason not to.

---

## How this maps to 12-Factor

| Factor | What it means for you |
|--------|----------------------|
| **I. Codebase** | One Git repo, many deploys (dev, staging, prod) |
| **II. Dependencies** | All deps declared in `package.json`; lockfile committed |
| **III. Config** | Secrets and env-specific values in environment variables, never in code |
| **IV. Backing services** | PostgreSQL is a swappable resource via `DATABASE_URL` |
| **V. Build, release, run** | `pnpm build` → deploy artifact → `pnpm start` |
| **VI. Processes** | App is stateless; session/state lives in PostgreSQL or cookies |
| **VII. Port binding** | Next.js binds to `PORT` (default 3000) |
| **VIII. Concurrency** | Scale by running more app processes, not bigger ones |
| **IX. Disposability** | Fast startup, graceful shutdown; no in-memory global state |
| **X. Dev/prod parity** | Same PostgreSQL + same env var names across environments |
| **XI. Logs** | Write to stdout/stderr; let the platform aggregate logs |
| **XII. Admin processes** | Migrations and seeds run as one-off commands, not at runtime |

---

## Phase 1 — Local environment (Factor III, IV, X)

**Goal:** Run the app locally against a real PostgreSQL instance.

1. Install PostgreSQL locally, or use a managed dev database (Neon, Supabase, Railway, etc.).

2. Copy and configure environment variables:

   ```powershell
   cp .env.example .env
   ```

   Update `.env` with your real `DATABASE_URL`. Never commit `.env`.

3. When you add new config, always:
   - Add the variable to `.env` locally
   - Add a placeholder to `.env.example` (no secrets)
   - Read it via `process.env.VAR_NAME` in server code only

   **Rules:**
   - `NEXT_PUBLIC_*` — safe for browser exposure (URLs, public keys)
   - Everything else — server-only (database URLs, API secrets, signing keys)

4. Verify the dev server starts:

   ```powershell
   pnpm dev
   ```

---

## Phase 2 — Database schema (Factor IV, XII, X)

**Goal:** Define your data model and apply it via migrations.

1. Add models to [`prisma/schema.prisma`](prisma/schema.prisma).

2. Create and apply your first migration:

   ```powershell
   pnpm db:migrate
   ```

   Name migrations descriptively (e.g. `init_users_and_workspaces`).

3. Regenerate the client after schema changes:

   ```powershell
   pnpm db:generate
   ```

   This also runs automatically on `pnpm install` via `postinstall`.

**12-Factor notes:**
- Schema changes are **admin processes** — run migrations as one-off commands in each environment, not inside request handlers.
- Use the same migration files in dev, staging, and prod (Factor X).
- Swap databases by changing `DATABASE_URL` only — no code changes (Factor IV).

---

## Phase 3 — First feature module (Factor VI, server-first)

**Goal:** Add one vertical slice using the feature-based layout.

Create your first feature under `src/features/<feature-name>/`:

```
src/features/<feature-name>/
├── components/    # UI for this feature only
├── actions/       # Server Actions ("use server")
├── queries/       # Server-side data fetching
├── schemas/       # Input validation (add Zod when you need it)
└── types/         # Feature-specific TypeScript types
```

**Conventions:**
- Default to **Server Components** — no `"use client"` unless you need interactivity, hooks, or browser APIs.
- Put data access in `queries/` or Server Actions, using the Prisma singleton at [`src/lib/db/prisma.ts`](src/lib/db/prisma.ts).
- Keep shared UI in `src/components/`; feature-specific UI stays in the feature folder.
- Add shadcn components as needed:

  ```powershell
  pnpm dlx shadcn@latest add button
  ```

**12-Factor notes:**
- Do not store session or user state in global variables or local files (Factor VI, IX).
- Persist durable state in PostgreSQL; use HTTP cookies for auth tokens when you add auth.

---

## Phase 4 — Configuration hardening (Factor III)

**Goal:** Make misconfiguration fail fast in production.

When you are ready (not required on day one):

1. Add a small server-side env validation module, e.g. `src/lib/config/env.ts`, using Zod or similar.
2. Validate required vars at startup or first server import — not on every request.
3. Keep validated config as a typed object; never scatter `process.env` reads across the codebase.

**Minimum env vars to plan for as the app grows:**

| Variable | Scope | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | Server | PostgreSQL connection |
| `NODE_ENV` | Server | `development` / `production` / `test` |
| `NEXT_PUBLIC_APP_URL` | Public | Canonical app URL for links and redirects |
| Auth secrets | Server | Add when you implement auth (e.g. session signing key) |
| Third-party API keys | Server | Add per integration, never `NEXT_PUBLIC_*` |

Update [`.env.example`](.env.example) every time you add a new variable.

---

## Phase 5 — Code quality gate (Factor II)

**Goal:** Keep the codebase consistent before every commit or PR.

Run locally:

```powershell
pnpm lint
pnpm format:check
pnpm exec tsc --noEmit
pnpm build
```

Fix issues before pushing. The lockfile (`pnpm-lock.yaml`) must stay committed so all environments install identical dependencies (Factor II).

---

## Phase 6 — Version control and environments (Factor I, V, X)

**Goal:** One codebase, multiple deploys.

1. **Branching:** Use feature branches; merge to `main` for production-bound work.

2. **Environments:** Aim for at least:
   - **Development** — your machine + local or cloud dev DB
   - **Production** — deployed app + production DB

   Add **staging** when you need pre-prod validation.

3. **Build / release / run separation (Factor V):**
   - **Build:** `pnpm install && pnpm build` (CI or platform)
   - **Release:** Build artifact + env config + migration step
   - **Run:** `pnpm start` (or platform equivalent)

4. Each environment gets its own `DATABASE_URL` and secrets via the hosting platform's env config — not via separate code branches.

---

## Phase 7 — Deployment (Factors V, VII, VIII, IX, XI)

**Goal:** Ship to a hosting platform (Vercel, Railway, Fly.io, etc.).

**Before first deploy:**

1. Set all env vars on the platform (mirror `.env.example`).
2. Run migrations against the production database:

   ```powershell
   pnpm exec prisma migrate deploy
   ```

   Run this as a release step, not from app startup code (Factor XII).

3. Ensure Node.js meets Prisma requirements (20.19+ for Prisma 7; currently pinned to Prisma 6 for Node 20.17).

**At runtime:**
- The platform sets `PORT`; Next.js respects it automatically (Factor VII).
- Scale by adding instances, not by storing state in memory (Factor VIII).
- Log with `console.log` / `console.error` — avoid writing log files inside the container (Factor XI).
- Processes should start quickly and shut down cleanly on SIGTERM (Factor IX).

---

## Phase 8 — Ongoing development checklist

Use this checklist whenever you add something new:

- [ ] New env var? → `.env`, `.env.example`, and platform config updated
- [ ] New DB table? → Prisma model + migration committed
- [ ] New feature? → New folder under `src/features/<name>/`
- [ ] New npm package? → `pnpm add`, lockfile committed
- [ ] Client component needed? → Justify why server-side won't work
- [ ] Secret or API key? → Server-only env var, never in client bundle
- [ ] One-off task (seed, backfill)? → Script or `prisma` command, not a web route

---

## Suggested build order

A reasonable sequence for a SaaS product:

1. Core data models (users, organizations, etc.)
2. Authentication and authorization
3. First product feature (your core value)
4. Billing / subscriptions (if applicable)
5. Admin or internal tooling
6. Observability (error tracking, uptime) — add when you have real traffic

Keep each step as a self-contained feature module. Avoid shared abstractions until you see real duplication.

---

## Useful commands reference

| Command | When to use |
|---------|-------------|
| `pnpm dev` | Local development |
| `pnpm build` | Verify production build |
| `pnpm start` | Run production build locally |
| `pnpm lint` | Check ESLint rules |
| `pnpm format` | Auto-format with Prettier |
| `pnpm db:migrate` | Create + apply migration (dev) |
| `pnpm exec prisma migrate deploy` | Apply migrations (staging/prod) |
| `pnpm db:push` | Prototype schema without migration (dev only) |
| `pnpm dlx shadcn@latest add <name>` | Add a UI component |

---

## What to avoid early on

- Storing config in code or committed JSON files
- Running migrations inside API routes or middleware
- Global in-memory caches for user-specific data
- Client-side data fetching libraries (React Query, SWR) before you need them
- Premature shared abstractions (generic repositories, service layers)
- Committing `.env` or any file containing secrets

---

## When you're ready for more infrastructure

These are intentionally **not** in the scaffold. Add them when you have a concrete need:

| Need | Options to evaluate |
|------|---------------------|
| Error tracking | Sentry, Bugsnag |
| Email | Resend, Postmark, AWS SES |
| File storage | S3, Cloudflare R2 |
| Background jobs | Inngest, Trigger.dev, BullMQ + Redis |
| CI/CD | GitHub Actions, platform-native pipelines |
| Testing | Vitest + Playwright |

Keep each addition behind an env var and treat it as a backing service (Factor IV).
