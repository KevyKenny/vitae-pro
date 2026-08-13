# VitatePro Database Architecture

Phase **9A** foundation: PostgreSQL on Supabase, SQL migrations, RLS, typed clients, and demo seed data.

The frontend continues to use mocks. No Auth/CV persistence is wired yet (Phases 9B–9C).

---

## Architecture overview

```text
auth.users (Supabase Auth)
    │ 1:1
    ▼
profiles ────────────────┬── user_preferences
                         ├── subscriptions
                         ├── notifications
                         ├── ai_usage / ai_generations
                         ├── cvs ─── cover_letters (optional cv_id)
                         │     ├── cv_sections
                         │     ├── cv_personal_info
                         │     ├── cv_summaries
                         │     ├── work_experiences ── experience_bullets
                         │     ├── educations ── education_subjects
                         │     ├── skills / projects / certifications
                         │     ├── languages / achievements / cv_references
                         │     └── cv_versions (JSONB snapshots)
                         │
templates (public catalog; referenced by cvs / cover_letters / preferences)
```

### Design principles

| Principle | Approach |
|-----------|----------|
| Normalized live CV | Relational tables for experience, education, skills, etc. |
| Version history | `cv_versions.snapshot` JSONB — avoid cloning the full graph |
| Zimbabwe-first experience | `industrial_attachment` + `duration_text` (`8 Months`) |
| Flexible education | `o_level` / `a_level` + `education_subjects` (no hard-coded subjects) |
| Security | RLS on every user-owned table; templates publicly readable when active |
| Credentials | Never stored in `profiles`; Auth stays in `auth.users` |

### Important naming choices

- DB uses **snake_case** enum-like strings (`full_time`, `o_level`, `industrial_attachment`).
- Frontend editor types use **kebab-case** (`full-time`, `o-level`).
- Helpers in `src/lib/database/constants.ts` convert between them.

`profiles.id` **is** `auth.users.id` (standard Supabase pattern). Spec-style “user_id” appears on child tables.

---

## Tables (summary)

| Table | Ownership | Notes |
|-------|-----------|-------|
| `profiles` | Auth user | Identity / career / contact |
| `user_preferences` | User | Theme, AI flags, notification toggles |
| `templates` | Public | Active rows readable by anon + authenticated |
| `cvs` | User | Multi-CV; one default via partial unique index |
| `cv_sections` | Via CV | Section visibility / order |
| `cv_personal_info` | Via CV | Per-document personal block |
| `cv_summaries` | Via CV | Professional summary |
| `work_experiences` | Via CV | All experience types |
| `experience_bullets` | Via experience | `responsibility` / `skill_gained` / `achievement` |
| `educations` | Via CV | O/A Level + tertiary + vocational + professional |
| `education_subjects` | Via education | Graded subjects |
| `skills`, `projects`, `certifications`, `languages`, `achievements`, `cv_references` | Via CV | |
| `cv_versions` | Via CV | JSONB snapshots |
| `cover_letters` | User | Optional `cv_id` |
| `ai_generations`, `ai_usage` | User | Foundation for Phase 9E |
| `notifications` | User | |
| `subscriptions` | User | Stripe-ready; no card data |

Cascades: deleting a **CV** removes its nested content. Deleting a **user** cascades from `profiles` → owned data. Template delete uses `ON DELETE SET NULL` on foreign keys.

---

## RLS strategy

- Enabled on **all** application tables listed above.
- Owner checks: `auth.uid() = user_id` or `is_cv_owner(cv_id)` / `is_*_owner(...)` helpers.
- `templates`: `SELECT` where `is_active = true` for `anon` + `authenticated`. Writes require **service role**.
- Profile `INSERT` is performed by `handle_new_user` (security definer) on Auth signup.
- Preferences + free `subscriptions` rows are created by profile triggers.

### Isolation expectation

User A must **not** read/update User B’s CVs, education, cover letters, or AI history. Seed includes an `other.user@vitatepro.test` private CV for RLS testing (`supabase/tests/rls_isolation.sql`).

---

## Environment variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Classic anon JWT (preferred) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Alternate publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Bypasses RLS — never `NEXT_PUBLIC_*` |

See `.env.example`. Do not commit real secrets (`.env*` is gitignored except `.env.example`).

---

## Local development workflow

Prerequisites: Docker Desktop, Node.js, npm.

```bash
# Install deps (includes supabase CLI as a devDependency)
npm install

# Start local stack (Postgres, Auth, Studio, Inbucket)
npx supabase start

# Apply migrations + seed
npx supabase db reset

# Studio
# http://127.0.0.1:54323
```

Copy local keys from `npx supabase status` into `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
```

### Useful npm scripts

| Script | Command |
|--------|---------|
| `npm run supabase:start` | `supabase start` |
| `npm run supabase:stop` | `supabase stop` |
| `npm run db:reset` | Reset DB, re-run migrations + seed |
| `npm run db:push` | Push migrations to linked remote |
| `npm run db:types` | Generate types into `src/lib/database/types.generated.ts` |

---

## Remote / production migration workflow

1. Create a Supabase project (or use existing).
2. `npx supabase login`
3. `npx supabase link --project-ref <project-ref>`
4. Review migrations in `supabase/migrations/` — **never** hand-edit prod tables.
5. `npx supabase db push` (or CI migration job).
6. Optionally run seed **only** on non-production environments.
7. Regenerate types: `npm run db:types`.

### Safety

- Prefer additive migrations.
- Avoid `DROP TABLE` / destructive alters unless explicitly planned.
- Service role stays on servers (Route Handlers, webhooks, admin jobs).

---

## Seed data

`supabase/seed.sql` creates:

- Demo user `demo.candidate@vitatepro.test` / `DemoPass123!` (local Auth)
- Isolation user `other.user@vitatepro.test`
- Templates (modern, executive, minimal, creative, folio)
- One CV with ZIMSEC **O Level** + subjects, **A Level** + subjects, bachelor’s
- **Industrial attachment — 8 Months** (duration mode)
- Internship + full-time roles with bullets
- Skills, projects, certifications, languages, achievements
- Cover letter, notifications, AI usage period row

---

## TypeScript types

| Path | Role |
|------|------|
| `src/lib/database/types.ts` | Hand-maintained Phase 9A `Database` types |
| `src/lib/database/constants.ts` | Check-constraint mirrors + kebab/snake helpers |
| `src/lib/supabase/*` | Browser / server / admin clients |

When CLI is available:

```bash
npm run db:types
```

Prefer generated output as the long-term source of truth; keep helpers/constants in sync with migrations.

---

## Client usage (foundation only)

```ts
// Client Component
import { createBrowserSupabaseClient } from "@/lib/supabase";

// Server Component / Route Handler
import { createServerSupabaseClient } from "@/lib/supabase";

// Trusted server only
import { createAdminClient } from "@/lib/supabase";
```

Do **not** import `admin` from Client Components.

---

## Security considerations

1. RLS is mandatory — assume compromised anon keys.
2. Do not store full AI prompts in `ai_generations` by default; use refs/hashes (`input_ref` / `output_ref`).
3. No payment card fields in `subscriptions`.
4. Template images should use Storage paths (`preview_image_path`), not BYTEA.
5. Auth + CV + cover letter / template persistence: Phases 9B–9D (see `docs/authentication.md`, `docs/cv-persistence.md`, `docs/cover-letters.md`).

### Phase 9D schema additions

| Change | Purpose |
|--------|---------|
| `cover_letters.template_key` | Letter editor style key (parallel to `cvs.template_key`) |
| `user_template_customizations` | Per-user Customize Studio JSONB + RLS |
| Gallery template seed rows (`tpl_*` slugs) | Template gallery backed by DB + `metadata` jsonb |

---

## Deviations from the Phase 9A prompt

| Spec idea | Decision |
|-----------|----------|
| Separate `profiles.user_id` | Use `profiles.id = auth.users.id` (Supabase standard) |
| Frontend still on mocks | 9A was additive; 9B–9D wire auth/CVs/cover letters/templates |
| Types “generated” | Hand-written `types.ts` + `db:types` script for regeneration |
| Publishable key in `.env` | Supported alongside classic anon key |
| SQL enums | Text + `CHECK` for easier future migrations |

---

## Next phases (not in 9A–9D)

- **9E** OpenAI  
- **9F** Storage + PDF  
- **9G** Stripe + launch  
