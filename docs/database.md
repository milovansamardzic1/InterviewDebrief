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

## Local setup (Windows)

### 1. PostgreSQL status

PostgreSQL **18** is installed and the service `postgresql-x64-18` is running.

`psql` is not in your PATH. Use the full path:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
```

### 2. Create the database

In `psql`:

```sql
CREATE DATABASE interwjuer;
\q
```

### 3. Configure `.env`

Update `.env` with your real postgres password (set during PostgreSQL installation):

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/interwjuer?schema=public"
```

### 4. Apply schema and seed

```powershell
pnpm db:migrate
# When prompted for migration name: init

pnpm db:seed
```

### 5. Browse data (optional)

```powershell
pnpm exec prisma studio
```

Opens a web UI at `http://localhost:5555`.

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
