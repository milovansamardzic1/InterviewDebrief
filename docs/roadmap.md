# Roadmap

Living backlog for Interwjuer. This is the source of truth Plan Mode reads
before proposing tasks (see `.cursor/rules/project-roadmap.mdc`). Update
statuses as work lands — this document must reflect reality, not intent.

## Status legend

✅ Done · 🟡 Partial · ⛔ Missing

## Current phase (as of 2026-07-28)

**MVP feature surface is complete and merged to `master`** (commit chain through
applications search/filtering). Stacked branches `chore` → P0 → P1 → P2 → P3
were fast-forwarded into `master` and cleaned up.

You do **not** need to finish leftover P2/P3 polish before adding product
features. Open polish items (deploy docs, Sentry, deferred tests) stay on the
backlog but do **not** block P4+ product work unless the user asks to ship or
harden first.

**Default next product slice:** leftover P3 polish (deploy docs) or a new P4+
candidate below — P4 learning plan is done. Other ideas can be added; prefer
one shippable slice at a time.

**Git base for new work:** branch from current `master` (clean). Do not assume
unmerged stacked feature branches still exist.

## Already done (context — do not re-plan)

| Area                  | Status | Notes                                                                                                                                              |
| --------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth                  | ✅     | Register/login/logout/me, JWT (`jose`) + bcrypt, httpOnly cookie, login+register combined UI at `/login`                                           |
| Job Applications      | ✅     | Full CRUD, backend + frontend (list, detail, form sheet, delete, status badge); list search/filters (company/position, status, source, date range) |
| Interview Rounds      | ✅     | Full CRUD, backend + frontend (`round-form-sheet.tsx`, `delete-round-button.tsx`)                                                                  |
| Questions             | ✅     | Full CRUD, backend + frontend (`question-form-sheet.tsx`, `delete-question-button.tsx`)                                                            |
| Skill Evaluations     | ✅     | Full CRUD, backend + frontend (`skill-evaluation-form-sheet.tsx`, `delete-skill-evaluation-button.tsx`)                                            |
| Reference data        | ✅     | Application sources, interview types, skills — read endpoints + client methods                                                                     |
| Dashboard (backend)   | ✅     | `get-dashboard-stats` use case; includes weak skills, topic counts, status breakdown, monthly progress (rounds + avg skill score)                  |
| Dashboard (frontend)  | ✅     | `StatsOverview` renders counts, weakest areas, questions by topic, and progress over time                                                          |
| Question history      | ✅     | `/questions` page — cross-application list, filterable by topic, links back to the source round                                                    |
| Learning plan         | ✅     | `/learning` page + `GET /learning-plan` — ranked weak skills with focus hints and related questions                                                |
| Cursor rules / docs   | ✅     | `.cursor/rules/*.mdc`, `docs/roadmap.md`, Docker Postgres compose + DB docs                                                                        |
| Quality (first slice) | 🟡     | Vitest use-case tests, GitHub Actions CI, frontend env validation, empty/loading/error states — see P2 deferred items                              |

## Priority P0 — Core MVP loop completion ✅ Done

**Why first:** the backend fully supported rounds/questions/skill-evaluations,
but the frontend only _displayed_ them. There was no way for a user to create
an interview round, log a question, or self-evaluate a skill from the UI —
the product's core value proposition (`docs/vision.md`) was not usable end to
end. This blocked everything else, including meaningful analytics and tests.

- [x] ✅ **Interview round CRUD UI** — add/edit/delete a round from the
      application detail page (interview type picker, schedule, status,
      notes). `round-form-sheet.tsx` + `actions/round-mutations.ts`.
- [x] ✅ **Question CRUD UI** — add/edit/delete a question within a round
      (question text, my answer, topic, difficulty, notes).
      `question-form-sheet.tsx` + `actions/question-mutations.ts`.
- [x] ✅ **Skill evaluation CRUD UI** — add/edit/delete a skill evaluation
      within a round (skill picker from reference data, score, notes).
      `skill-evaluation-form-sheet.tsx` + `actions/skill-evaluation-mutations.ts`.

Implementation notes for future reference:

- `src/lib/api/applications.ts` gained nested `rounds`/`questions`/`skillEvaluations`
  sub-clients (matching the backend's own nested REST routes) instead of new
  top-level API client files.
- `src/lib/api/reference-data.ts` gained `interviewTypes()` and `skills()`.
- No contract or backend changes were needed — everything already existed.

## Priority P1 — Core analytics value ✅ Done

**Why second:** per `docs/vision.md`, the success metric is identifying weak
areas and tracking progress over time. This only becomes meaningful once P0
produces real data to analyze.

- [x] ✅ **Weakest areas view** — aggregate `SkillEvaluation.score` by skill
      across all of a user's interviews; surfaced on the dashboard
      ("Najslabije oblasti" in `stats-overview.tsx`).
- [x] ✅ **Progress over time** — `progressOverTime` now tracks both
      completed-round counts and average skill score per month
      (`prisma-dashboard.repository.ts`), rendered as a bar visualization in
      `progress-over-time.tsx`.
- [x] ✅ **Question history/search** — new `/questions` page
      (`src/features/questions/`) lists every question across all
      applications, filterable by topic via a URL-driven server-rendered
      form, each item linking back to its round on the application detail
      page.

## Priority P2 — Quality & hardening 🟡 First slice done

**Why third:** once there's a real, usable feature surface (P0+P1), tests and
CI protect it instead of testing a shell.

- [x] 🟡 **Testing setup** — Vitest in `apps/api`; use-case unit tests with
      in-memory fakes. **Still deferred (non-blocking for product features):**
      Prisma repository integration tests; Playwright E2E smoke
      (register → application → round → question → skill eval → dashboard).
- [x] ✅ **CI pipeline** — `.github/workflows/ci.yml` on push/PR to `main`:
      install, lint, format:check, typecheck, test, build.
- [x] ✅ **Env validation hardening** — `src/lib/config/env.ts` Zod
      `loadEnv()` for `API_URL` / `JWT_EXPIRES_IN_SECONDS`.
- [x] ✅ **Empty/loading/error state audit** — `loading.tsx` for `/`,
      `/applications`, `/questions`; dashboard `error.tsx`; `StatsOverview`
      empty state.

## Priority P3 — Polish / later 🟡 First slice done

- [x] ✅ **Search & filtering on the applications list** — free-text search
      (company/position) plus status, source, and inclusive application-date
      range; URL-driven Server Component filter bar
      (`application-filters.tsx`); filter-aware empty state.
- [ ] ⛔ **Deployment docs + a real target** — Vercel (web) + Railway/Fly.io
      (API). Non-blocking for new product features; do this when ready to
      ship publicly.
- [ ] ⛔ **Error tracking (Sentry)** — once there's real traffic. Non-blocking.

## Priority P4 — Learning loop ✅ Done

**Why:** MVP tracked interviews, questions, and weak skills, but did not yet
turn that into a concrete study plan — the core value in `docs/vision.md`
(“pretvore iskustva sa intervjua u konkretne uvide i **plan učenja**”) and the
success metric “fokusira pripremu na ono što mu zaista nedostaje.”

- [x] ✅ **Learning plan / study focus from weak skills** — `GET /learning-plan` + `/learning` page. Top 5 skills with `averageScore < 3`, ranked weakest
      first, with deterministic Serbian `focusHint`, `lastEvaluatedAt`, and up
      to 3 related questions matched by case-insensitive `topic` contains skill
      name. Shared threshold constants in
      `application/shared/weak-skill-rules.ts` (also used by dashboard). Nav
      item **Učenje**; dashboard “Najslabije oblasti” links to `/learning`.

Implementation notes:

- Dedicated `learning-plan` vertical (contracts → port → use case → Prisma
  repo → route), not stuffed into `GET /dashboard/stats`.
- Topic↔skill matching is heuristic (free-text `Question.topic`, no FK) —
  acceptable for v1.
- Plan is computed on read — no new tables/migrations.

Candidate follow-ups for later P4+ slices (add as checked sections when
starting; do not implement unless scoped in):

- [x] ✅ **Dashboard redesign (density + charts + action widgets)** —
      Compact metric strip (4 counts; catalog skills hidden from hero),
      status pipeline from existing `statusBreakdown`, learning-plan preview
      (parallel `GET /learning-plan`), topics bars + weak skills,
      and `activeApplications` + `upcomingRound` on `GET /dashboard/stats`.
      Out of scope: rejection-reason insights, shell redesign.
- [x] ✅ **Dashboard maturity phases** — home switches by data signal:
      onboarding (0 apps), getting-started checklist (sparse data),
      analytics layout when `apps≥3` OR `questions≥8` OR `evals≥3`.
      Preview query: `?preview=empty|one|analytics`.
- [x] ✅ **Getting-started checklist CTAs** — checklist steps open create
      sheets in place (application / round / question / skill evaluation)
      via controlled `hideTrigger` form sheets; empty-state CTA opens
      `ApplicationFormSheet` directly.
- [x] ✅ **Demo / preview pages** — `/preview` hub + fixture pages for
      dashboard phases, applications list, and learning plan (dev nav
      item **Demo**).
- [x] ✅ **Structured rejection insights** — rejected applications capture a
      structured category plus optional detail; `/insights/rejections` shows
      tenant-scoped category breakdown, categorization coverage, and recent
      rejection context. Includes additive nullable migration and preview
      states for empty/filled data.
- [x] ✅ **Deeper question search** — `/questions` now supports combined
      free-text, company, topic, and difficulty filters through the full
      URL-driven frontend → API → Prisma pipeline.
- [x] ✅ **Applications list cursor pagination UI** — first 12 applications
      render on the server; “Učitaj još” uses a session-backed Server Action,
      preserves active filters, deduplicates appended records, and exposes
      loading/retry/end-of-list states.
- [x] ✅ **Actionable learning tasks** — persisted tasks turn computed weak-skill
      recommendations into trackable actions with priority, optional due date,
      notes, and planned/in-progress/completed lifecycle. `/learning` combines
      tasks with recommended focuses; active tasks conditionally replace the
      dashboard learning preview without increasing dashboard density.
- Deferred P2: Playwright E2E smoke; Prisma repository integration tests

## How to work this backlog

1. Read this file before planning. Do **not** re-propose ✅ done items.
2. **Post-MVP rule:** new product features are allowed without clearing every
   open P2/P3 polish item. P4 learning plan is done — pick the next slice from
   open polish or a new P4+ candidate, or whatever the user names.
3. When adding a brand-new idea, write it into this roadmap (new bullet or
   priority section with a short **Why**) in the same change that plans or
   implements it.
4. Follow `.cursor/rules/architecture-boundaries.mdc` feature order for
   layered work.
5. Check boxes and update status notes when work lands — keep this document
   accurate.
