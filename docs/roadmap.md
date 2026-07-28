# Roadmap

Living backlog for finishing Interwjuer. This is the source of truth Plan
Mode reads before proposing tasks (see `.cursor/rules/project-roadmap.mdc`).
Update statuses as work lands — this document must reflect reality, not
intent.

## Status legend

✅ Done · 🟡 Partial · ⛔ Missing

## Already done (context — do not re-plan)

| Area                 | Status | Notes                                                                                                                 |
| -------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| Auth                 | ✅     | Register/login/logout/me, JWT (`jose`) + bcrypt, httpOnly cookie, login+register combined UI at `/login`              |
| Job Applications     | ✅     | Full CRUD, backend + frontend (list, detail, form sheet, delete, status badge)                                        |
| Interview Rounds     | ✅     | Full CRUD, backend + frontend (`round-form-sheet.tsx`, `delete-round-button.tsx`)                                     |
| Questions            | ✅     | Full CRUD, backend + frontend (`question-form-sheet.tsx`, `delete-question-button.tsx`)                               |
| Skill Evaluations    | ✅     | Full CRUD, backend + frontend (`skill-evaluation-form-sheet.tsx`, `delete-skill-evaluation-button.tsx`)               |
| Reference data       | ✅     | Application sources, interview types, skills — read endpoints + client methods                                        |
| Dashboard (backend)  | ✅     | `get-dashboard-stats` use case; includes weak skills, topic counts, status breakdown, monthly progress (rounds + avg skill score) |
| Dashboard (frontend) | ✅     | `StatsOverview` renders counts, weakest areas, questions by topic, and progress over time                                         |
| Question history     | ✅     | `/questions` page — cross-application list, filterable by topic, links back to the source round                                   |

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
- Manual browser QA of the full create/edit/delete flow is still pending
  (see Priority P2 for the automated-testing gap this currently relies on).

## Priority P1 — Core analytics value ✅ Done

**Why second:** per `docs/vision.md`, the success metric is identifying weak
areas and tracking progress over time. This only becomes meaningful once P0
produces real data to analyze.

- [x] ✅ **Weakest areas view** — aggregate `SkillEvaluation.score` by skill
      across all of a user's interviews; surfaced on the dashboard
      ("Najslabije oblasti" in `stats-overview.tsx`). This was already
      implemented before this pass — the original audit marking it missing
      was inaccurate.
- [x] ✅ **Progress over time** — `progressOverTime` now tracks both
      completed-round counts and average skill score per month
      (`prisma-dashboard.repository.ts`), rendered as a bar visualization in
      `progress-over-time.tsx`.
- [x] ✅ **Question history/search** — new `/questions` page
      (`src/features/questions/`) lists every question across all
      applications, filterable by topic via a URL-driven server-rendered
      form, each item linking back to its round on the application detail
      page.

Implementation notes for future reference:

- `questionsByTopic` (aggregate counts) already existed and is distinct from
  the new question history list (individual browsable/filterable questions)
  added in this pass.
- Backend: extended `QuestionsRepository` port with `listHistoryForUser`
  (cursor-paginated, same pattern as `PrismaJobApplicationsRepository`), a new
  `ListQuestionHistoryUseCase`, and a new top-level `GET /questions` route —
  kept separate from the application-scoped nested routes since this is a
  cross-cutting read model, not a mutation scoped to one application.
- No new frontend dependency was added for the progress-over-time chart — a
  lightweight CSS bar visualization was used instead of a charting library.

## Priority P2 — Quality & hardening

**Why third:** once there's a real, usable feature surface (P0+P1), tests and
CI protect it instead of testing a shell.

- [ ] ⛔ **Testing setup** — add a test runner to `apps/api` and cover the
      highest-value branching logic (state transitions, auth, not-found
      guards in use cases).
- [ ] ⛔ **CI pipeline** — lint, typecheck, test, build on push/PR.
- [ ] ⛔ **Env validation hardening** — validate `process.env` with a shared,
      cached schema on both frontend and backend instead of ad-hoc reads.
- [ ] ⛔ **Empty/loading/error state audit** — make sure every P0/P1 view
      handles the empty, loading, and error cases explicitly.

## Priority P3 — Polish / later

- [ ] ⛔ Search & filtering on the applications list (status, source, date range)
- [ ] ⛔ Deployment docs + a real target (Vercel for web, Railway/Fly.io for API)
- [ ] ⛔ Error tracking (Sentry) once there's real traffic

## How to work this backlog

1. Pick the first unchecked item in the lowest-numbered priority (P0 before P1).
2. Follow `.cursor/rules/architecture-boundaries.mdc` feature order — but P0
   items skip contracts/backend steps since they already exist; start at
   Frontend.
3. Check the box and update the status table above when done, in the same
   change.
