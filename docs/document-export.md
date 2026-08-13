# Document Export (Phase 9G)

Production PDF export, print, and shared document rendering for VitatePro CVs and cover letters.

## Architecture overview

```
CV / Cover Letter data
  + template + customization
        ↓
  CvDocumentView / CoverLetterDocumentView  (single renderer)
        ↓
   ┌────┴────┐
Preview     Print route     PDF API (HTML → Puppeteer)
```

One document model feeds the editor preview, browser print, and server-generated PDF. The editor does not maintain a separate export layout.

## PDF generation

**Approach:** Headless Chromium (`puppeteer-core` + `@sparticuz/chromium`) navigates to the same print routes used by the browser, forwarding session cookies. Unsaved editor payloads are staged via short-lived draft tokens.

**Why this approach:**

- Preserves the same React document components used in preview (no duplicate PDF layout engine such as `@react-pdf/renderer`).
- Produces selectable, ATS-friendly text by printing the same DOM as preview (not canvas/image PDFs).
- Matches template styling, colors, and fonts via embedded CSS and Google Fonts.
- Works in production/serverless environments via `@sparticuz/chromium`.

**Local development:** Set `PUPPETEER_EXECUTABLE_PATH` to your Chrome/Chromium binary if the bundled Chromium is unavailable. When PDF generation is unavailable, the client falls back to the print route (Save as PDF).

**API routes:**

- `POST /api/export/cv` — authenticated, ownership verified, optional inline `document` for unsaved editor state
- `POST /api/export/cover-letter` — same pattern for cover letters

## Rendering layer

| File | Purpose |
|------|---------|
| `src/components/document/cv-document-view.tsx` | CV renderer (all sections) |
| `src/components/document/cover-letter-document-view.tsx` | Cover letter renderer |
| `src/styles/document.css` | Shared print/export styles, page breaks, A4/Letter |
| `src/lib/export/pdf.ts` | Puppeteer print URL → PDF buffer |
| `src/lib/export/draft-store.ts` | Short-lived unsaved document staging |

Experience and education sub-renderers support `variant="document"` for consistent export styling.

## Print

Print routes (document only, no app chrome):

- `/cvs/[id]/print?print=1`
- `/cover-letter/[id]/print?print=1`

Unsaved editor state is passed via `sessionStorage` before opening the print window. The print layout uses `@media print` rules in `document.css`.

## Template rendering

- Template ID controls accents, borders, and layout (modern, executive, creative, etc.).
- Saved template customization (colors, fonts, spacing, sidebar layout) is loaded server-side when available and applied through CSS variables in `resolve-document-style.ts`.

## File naming

Sanitized filenames:

- `John_Doe_CV.pdf`
- `John_Doe_Cover_Letter_Google.pdf`
- Fallback: `VitatePro_CV.pdf`

## Security

- Export requires authentication.
- `assertCvOwnership` / `assertCoverLetterOwnership` verify document access before generation.
- Server routes load persisted documents via Supabase server client + RLS.
- Inline editor payloads must match the authenticated user's document ID.

## A4 / Letter

- Default: **A4**
- Letter size supported via `pageSize: "letter"` on export requests and `.doc-page--letter` CSS.

## Font handling

Google Fonts (Inter, Fraunces) are linked in export HTML. Custom template font stacks from the gallery are resolved through `templateFonts`. Fallbacks are system sans/serif stacks.

## Validation

Export warns (does not block) when contact info is missing. Export is blocked only when the document is technically empty.

Completeness hints use `calculateCvCompletion()` — no extra OpenAI calls for download.

## Testing checklist

- [ ] CV PDF (1, 2, 3+ pages)
- [ ] Cover letter PDF
- [ ] Print from editor and dashboard
- [ ] O Level / A Level subjects
- [ ] Industrial attachment (duration-based)
- [ ] Multiple templates + customization
- [ ] Unsaved editor state export
- [ ] Unauthorized export rejected
- [ ] PDF text selectable / copy-paste

## Analytics hook

Export routes are structured so future analytics can record `{ documentType, action, templateId, timestamp }` without storing document content.
