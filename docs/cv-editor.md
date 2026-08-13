# CV Editor — Reliable Section Saving (Phase 4A)

## Mental model

1. Enter information in a section.
2. Click **Save**.
3. Content is persisted.
4. Continue editing — nothing you typed disappears.

**Explicit Save is authoritative.** Soft autosave (2.5s debounce) is a safety net only.

## Architecture

| Piece | Role |
|-------|------|
| `editor-context.tsx` | Document state, mutation sequence, dirty sections, persist |
| `SectionSaveBar` | Per-section Save / Saving… / Saved / Retry UI |
| `useSectionSave` | Dirty + status for a section key |
| `updateDocument(updater, { sectionKey })` | Local edits; marks dirty; optional soft autosave |
| `saveSection(key)` | Flush persist of **current** editor state |

## Concurrency protection

- `mutationSeqRef` increments on every local edit.
- Persist captures `seqAtStart` + snapshot from `documentRef`.
- After save succeeds:
  - If seq unchanged → sync remapped IDs into state.
  - If seq advanced → **keep local editor state** (never overwrite newer text) and queue another save.
- Overlapping saves set `pendingAutosaveRef` instead of dropping work.
- New entity IDs always use `crypto.randomUUID()` so remaps do not remount inputs mid-typing.

## What not to do

- Do not reload the full CV from the database after every section save.
- Do not `setDocument(saved)` when the user has typed since the snapshot.
- Do not use closed-over arrays when updating lists — always `prev => …`.

## Autosave

- Debounced **2500ms** after edits.
- Never primary; never clobbers newer input.
- Manual **Save** / section **Save** clears the timer and persists immediately.

## AI interaction

- AI reads `documentRef` (current editor state), not a stale DB fetch for the text being improved.
- Results appear as suggestions; **Use Suggestion** applies only after user acceptance.

## Custom sections + Quill

- Heading: text input (`sections[].label`).
- Description: `react-quill-new` (React 19–compatible Quill).
- HTML sanitized via `sanitizeCvHtml` (`isomorphic-dompurify`) before preview/PDF.
- Stored in `cv_sections.content`.

## Sections with Save

Personal, Summary, Experience, Education, Skills, Projects, Certifications, Languages, Achievements, References, Custom.

Languages / Achievements / References include Add / Edit / Delete with confirmation.

## Persistence note

`saveCvDocument` still performs a full child rewrite for consistency with Phase 9C. Safety comes from **always writing the latest editor snapshot** and **never replacing newer UI state** with an older response.
