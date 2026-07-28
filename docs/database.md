# Database setup (Interwjuer)

This project uses **PostgreSQL** as the database and **Prisma** as the ORM (Object-Relational Mapper).

## How they work together

```
Next.js web app  →  Node API (apps/api)  →  Prisma Client  →  PostgreSQL
   (UI only)           (business logic)        (TypeScript)       (actual data)
```

- **PostgreSQL** stores tables and rows on disk.
- **Prisma schema** (`prisma/schema.prisma`) describes tables, columns, and relations in code.
- **Prisma Client** is used only in `apps/api` — the Next.js web app never imports it.
- **Shared contracts** (`packages/contracts`) define DTO shapes used by both API and web.
- **Migrations** are versioned SQL files that change the database schema safely over time.
- **Seed** fills the database with initial/reference data for local development.

## Entity overview

| Model               | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `User`              | Account owner                                           |
| `JobApplication`    | A job the user applied to                               |
| `ApplicationSource` | Where the application came from (LinkedIn, Referral, …) |
| `InterviewRound`    | One round in the interview process                      |
| `InterviewType`     | Type of round (Technical, Behavioral, …)                |
| `Question`          | Questions asked in a round                              |
| `Skill`             | Skill catalog for self-evaluation                       |
| `SkillEvaluation`   | Score for a skill in a specific round                   |

## Local setup (Docker, Windows)

PostgreSQL runs as a container via `docker-compose.yml` at the repo root — no
native PostgreSQL install needed. Requires Docker Desktop (with the WSL2
backend) to be installed and running.

### 1. Start PostgreSQL

```powershell
docker compose up -d
```

This starts a `postgres:16-alpine` container named `interwjuer-postgres`,
exposed on `localhost:5432`, with data persisted in the `interwjuer_postgres_data`
Docker volume (survives container restarts/recreation; removed only via
`docker compose down -v`).

### 2. Configure `.env`

A root-level `.env` (gitignored, see `.env.example`) already points at the
compose service:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/interwjuer?schema=public"
```

`apps/api` loads this same root `.env` at startup via `process.loadEnvFile()`
(see `apps/api/src/index.ts`) — there is only one `.env` file for the whole
monorepo, shared by the Next.js app and the API.

### 3. Apply schema and seed

```powershell
pnpm db:migrate
# When prompted for migration name: init

pnpm db:seed
```

### 4. Browse data (optional)

```powershell
pnpm exec prisma studio
```

Opens a web UI at `http://localhost:5555`.

### Alternative: native PostgreSQL install

If you'd rather not use Docker, install PostgreSQL directly (e.g. via
`choco install postgresql` or the installer from postgresql.org), create a
`interwjuer` database, and point `DATABASE_URL` in `.env` at it instead.

## Useful commands

| Command                           | What it does                                  |
| --------------------------------- | --------------------------------------------- |
| `pnpm db:migrate`                 | Create + apply migration (dev)                |
| `pnpm db:seed`                    | Run seed script                               |
| `pnpm db:generate`                | Regenerate Prisma Client after schema changes |
| `pnpm exec prisma studio`         | Visual database browser                       |
| `pnpm exec prisma migrate deploy` | Apply migrations in staging/prod              |

## After changing the schema

1. Edit `prisma/schema.prisma`
2. Run `pnpm db:migrate`
3. Prisma Client regenerates automatically

Never edit applied migration files manually unless you know what you are doing.
