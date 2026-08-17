# CV Document Rendering

Unified document rendering for VitatePro CV preview, browser print, and PDF export.

## Architecture

```
CvDocument (data)
  + TemplateCustomization
        ↓
  resolveCvDocumentStyle()
        ↓
  buildCvContentBlocks() → measure heights → packBlocks()
        ↓
  PageModel[] → CvPage (fixed A4/Letter shells)
        ↓
  ┌──────────────┬──────────────┐
  Preview        Print route    Puppeteer PDF
  (scale only)   (scale 1)      (scale 1)
```

Cover letters follow the same measure → pack → `CvPage` pattern in `cover-letter-document-view.tsx`.

## Page geometry

Canonical sizes live in `src/components/document/page-geometry.ts`:

- **A4:** `210mm × 297mm`
- **Letter:** `8.5in × 11in`

Pages use **fixed height** (`height`, not `min-height`). Content is assigned to pages before render, so `overflow: hidden` is only a safety guard.

Usable content height = page height − top/bottom padding from resolved template margins.

## Pagination

1. **Blocks** — CV content is flattened into measurable blocks (header, section titles, experience headers/bullets, education entries, etc.).
2. **Measure** — `BlockMeasureLayer` renders blocks off-screen at canonical width after `document.fonts.ready`.
3. **Pack** — Pure `packBlocks()` assigns blocks to pages using orphan/keep-with-next rules.
4. **Render** — Each page renders only its block subset inside `CvPage`.

Split rules (v1):

- Section titles should not sit alone at the bottom of a page.
- Experience/education entries prefer splitting at bullet boundaries.
- Blocks taller than one page occupy a single page (natural wrap inside).

## Preview scaling

`CVPreview` always lays out at true A4 dimensions, then applies:

```
effectiveScale = fitScale × userZoom
```

- `fitScale` = available panel width ÷ canonical page width (capped at 1).
- User zoom (100 / 70 / 50) multiplies fit scale only — it never changes document layout inputs.

## Print / PDF readiness

Export waits for `[data-document-ready="true"]`, emitted by `DocumentReadyMarker` after:

- Pagination measurement completes
- `document.fonts.ready`
- Two animation frames (layout stabilization)

Puppeteer (`src/lib/export/pdf.ts`) waits for this marker before `page.pdf()`.

## Customization lookup

Saved customizations are keyed by gallery template slug. `resolveCvTemplateCustomization()` loads by `cvs.template_id` → `templates.slug` first, then falls back to the editor style key (`template_key`).

## Export drafts

Unsaved browser print and PDF export stage documents via `export_drafts` (Supabase, TTL 5 minutes) with in-memory fallback for local dev.

Browser print uses `POST /api/export/cv/draft` → print URL with `draftToken` (avoids `sessionStorage` + `noopener` data loss).

## Manual regression checklist

- [ ] Desktop zoom 100 / 70 / 50 — same page count, no reflow
- [ ] Mobile — document scales to width, internal layout unchanged
- [ ] 1 / 2 / 3+ page CVs (long summary, many jobs/bullets)
- [ ] Preview page count = PDF page count
- [ ] PDF text selectable
- [ ] A4 and Letter export
- [ ] Template customization visible in preview and PDF
- [ ] Unsaved editor PDF + print via draft token
- [ ] Sidebar layout repeats rail on each page
- [ ] Cover letter multi-page paragraphs

## Related files

| File | Role |
|------|------|
| `src/components/document/cv-document-view.tsx` | Paginated CV orchestrator |
| `src/components/document/cv-page.tsx` | Fixed page shell |
| `src/components/document/pagination/` | Blocks, measure, pack |
| `src/features/cv-editor/components/cv-preview.tsx` | Scale-only preview host |
| `src/features/export/components/print-cv-document.tsx` | Print route |
| `src/lib/export/pdf.ts` | Puppeteer PDF |
| `src/styles/document.css` | Shared document styles |

See also [document-export.md](./document-export.md) and [templates.md](./templates.md).
