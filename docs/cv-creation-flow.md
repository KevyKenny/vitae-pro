# CV Creation Flow (Phase 9H)

Intelligent onboarding and first-time CV creation for VitatePro.

## New user journey

```
Landing → Sign up → Profile onboarding → /cvs/new (creation chooser)
  → Guided CV (/cvs/{id}/edit?guided=1) OR full editor
  → Autosave at each step → Template & review → Analyze → Export
```

After profile onboarding, users are routed to **Create your CV** instead of an empty dashboard.

## CV creation methods

| Method | Route / behavior |
|--------|------------------|
| **Create with VitatePro** (recommended) | `/cvs/new` → guided wizard in editor |
| **Start from scratch** | `/cvs/new` → full editor |
| **Import existing CV** | Dialog stub — parsing coming soon |

Optional fields at creation: **target job title**, **target industry** (stored on `cvs.target_role` / `cvs.target_industry`).

## Guided flow stages

1. Personal information (required path)
2. Professional summary (optional)
3. Experience — includes internship, industrial attachment, graduate trainee (optional)
4. Education — O Level, A Level, diploma, degree, etc. (optional)
5. Skills (optional)
6. Additional — projects, achievements (optional)
7. Design — template selection in preview (optional)
8. Review — completion checklist + analysis entry (optional)

Progress uses the shared `ProgressStepper`. Users can **Skip** optional steps or **Exit guided mode** at any time.

## Completion logic

**Percentage (`calculateCvCompletion`)** — weighted 0–100:

| Area | Weight | Criteria |
|------|--------|----------|
| Personal | 20% | Name, title, contact |
| Summary | 15% | Length thresholds |
| Experience | 25% | Entry with role/org + bullets |
| Education | 15% | At least one qualification |
| Skills | 10% | Three+ named skills |
| Optional | 15% | Projects, certs, languages, achievements, references |

**Checklist (`getCvCompletionChecklist`)** — user-facing ticks; does **not** require university, work experience, summary, or references.

**Smart recommendations (`getCvSmartRecommendations`)** — up to 3 contextual next actions.

## Autosave

The editor persists via existing `EditorProvider` debounced save (900ms). Guided mode uses the same pipeline — no separate draft store.

## Profile reuse

At CV creation, `buildEmptyPersonalFromProfile()` seeds personal info from `profiles`. Later profile edits do not overwrite CV content (see `docs/cv-persistence.md`).

## Suggested CV titles

`suggestCvTitle()` produces names like:

- `John Doe — Software Engineer`
- `Mary Moyo — Graduate CV`
- `My Professional CV` (fallback)

## Master CV and tailored CVs

- **Duplicate** — generic copy (`{title} — Copy`), master unchanged.
- **Tailored CV** (`duplicateCvAsTailored`) — new document with job/company in title and `target_role` set. Original CV is never modified.

Available from the CV list actions menu: **Create tailored CV**.

## Zimbabwe-specific support

Guided copy and existing editor sections support:

- O Level / A Level with subjects and grades (ZIMSEC)
- Industrial attachment, internship, graduate trainee (duration-based dates)
- Diploma, certificate, vocational, professional qualifications

School leavers can complete a legitimate CV with education + skills only.

## AI assistance

AI remains optional in section editors (summary, experience, skills). Guided descriptions prompt users to use AI when stuck. AI failures do not overwrite user content (existing editor behavior).

## Analytics foundation

`trackProductEvent()` in `src/lib/analytics/events.ts` logs non-PII events in development:

`cv_created`, `cv_guided_started`, `cv_guided_completed`, `cv_tailored`, `cv_import_requested`, etc.

## User types tested conceptually

| Persona | Valid path |
|---------|------------|
| School leaver | O/A Level + skills + projects |
| Graduate | Degree + internship + summary |
| Professional | Experience + education + skills |
| Career changer | Experience + new target role + tailored copy |
| No tertiary | O/A Level + work + skills |

## Key files

| File | Purpose |
|------|---------|
| `src/app/(app)/cvs/new/page.tsx` | Creation chooser |
| `src/features/cv-creation/` | Guided panel, completion, tailor dialog |
| `src/lib/cvs/completion-checklist.ts` | Checklist + recommendations |
| `src/lib/cvs/suggest-title.ts` | Title suggestions |
| `src/lib/cvs/repository.ts` | `createCv`, `duplicateCvAsTailored` |
| `src/features/dashboard/components/welcome-hero.tsx` | State-aware dashboard hero |
