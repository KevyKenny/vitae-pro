# CV persistence (Phase 9C)

VitatePro CVs are stored in **normalized Supabase PostgreSQL tables** owned by the authenticated user (`cvs.user_id = auth.uid()`). The editor UI keeps the existing `CvDocument` model; mappers bridge document ↔ database.

## Architecture

```
UI (CvDocument)
  ↓
src/lib/cvs/repository.ts   (CRUD / duplicate / default / archive)
  ↓
src/lib/cvs/mappers.ts      (field mapping, bullets, subjects)
  ↓
Supabase client (anon + JWT) + RLS
  ↓
cvs + child tables
```

CV personal information lives in **`cv_personal_info`** (copied from profile at create time, then independent).

Editor style uses **`cvs.template_key`** (`modern` | `professional` | `executive` | `minimal` | `creative`). Gallery `template_id` UUID remains optional for later linking.

## Tables used

| Table | Role |
| --- | --- |
| `cvs` | Document meta, status, default flag, template_key, completion |
| `cv_sections` | Order, visibility, custom `content` |
| `cv_personal_info` | Per-CV contact identity |
| `cv_summaries` | Professional summary |
| `work_experiences` + `experience_bullets` | Experience incl. industrial attachment / duration_text |
| `educations` + `education_subjects` | O/A Level + tertiary + subjects |
| `skills`, `projects`, `certifications`, `languages`, `achievements`, `cv_references` | Section content |

Cascade deletes: deleting a CV removes all children. Deleting experience/education removes bullets/subjects.

## Migration (9C)

`supabase/migrations/20260810220000_cv_persistence_gaps.sql`

- `cvs.template_key`
- `cv_sections.content`
- unique index: one row per built-in `section_type` per CV (multiple `custom` allowed)
- `achievements.achievement_date` (optional)

Apply with `npx supabase db push` (or your linked remote workflow).

## Data-access API (`src/lib/cvs`)

| Function | Purpose |
| --- | --- |
| `listUserCvs` | Dashboard / My CVs list |
| `getCvWithContent` | Load editor document |
| `createCv` | New CV from profile seed |
| `saveCvDocument` | Debounced / manual persist |
| `duplicateCv` | Deep copy with new UUIDs |
| `deleteCv` | Delete with cascade |
| `setDefaultCv` | One default per user (partial unique index) |
| `archiveCv` / `unarchiveCv` | Status `archived` / `draft` |
| `renameCv` | Title only |

Identity always comes from `supabase.auth.getUser()`. RLS enforces ownership — never pass `user_id` from the browser as authorization.

## Save strategy

1. Debounce ~900ms after edits (`EditorProvider`).
2. Remap non-UUID client ids → UUIDs; restore default `cv_sections` if the rail is empty.
3. Upsert `cvs` meta + personal + summary **before** touching child tables (so a personal upsert failure cannot wipe sections).
4. **Delete + insert** child rows for the CV (sections, experience, education, …).

`getCvWithContent` also heals CVs that already lost their `cv_sections` rows (inserts defaults) so the editor rail and preview sections come back.

Manual **Save** flushes immediately via `retrySave` → `persistNow`.

## Create flow

1. `createCv()` inserts CV + default sections + personal snapshot from `profiles` + empty summary.
2. Navigate to `/cvs/{id}/edit`.
3. Later profile edits do **not** overwrite CV personal info.

## Duplicate / delete / default

- **Duplicate**: load full document → new id + `" — Copy"` title → full insert (independent rows).
- **Delete**: confirm dialog → `delete from cvs` (cascade).
- **Default**: clear other `is_default` for user, then set selected (enforced by `cvs_one_default_per_user`).

## Frontend wiring

| Area | Behavior |
| --- | --- |
| `/dashboard` | `RecentCvs` + WelcomeHero create/continue from real list |
| `/cvs` | Full list: open, duplicate, default, archive, delete |
| `/cvs/[id]/edit` | Load from Supabase; autosave; no mock document |
| Custom sections | Persisted `content` on `cv_sections` |
| AI buttons | Mock / “coming soon” only |

Mocks remain for landing, marketing, template gallery demo, cover-letter preview fixtures.

## RLS

Owner policies from Phase 9A (`is_cv_owner`, etc.). Isolation test: `supabase/tests/rls_isolation.sql`.

Do not use the service role from client code.

## Local testing

1. Push 9C migration.
2. Sign in → Create CV → edit O Level subjects, industrial attachment, bullets, skills, reorder sections, change template.
3. Wait for Saved → refresh → reopen from dashboard.
4. Create a second CV → edit independently.
5. Duplicate → edit copy → delete copy.
6. Set default → verify badge.
7. Logged-out access to `/cvs/{id}/edit` → redirect to sign-in.

## Out of scope

OpenAI, cover-letter persistence, PDF, Stripe, Storage uploads.
