# CV Template System

Reference-matched CV templates for VitatePro preview, print, and PDF export.

## Architecture

```
CvDocument (data)
  + TemplateDefinition (registry)
  + TemplateCustomization (optional overrides)
        ↓
  resolveCvDocumentStyle()
        ↓
  TemplateDefinition.buildBlocks() → measure → packBlocksByRegion()
        ↓
  TemplateDefinition.renderPage() → CvPage stack
        ↓
  Preview / Print / Puppeteer PDF
```

See also [cv-rendering.md](./cv-rendering.md) for pagination and export details.

## Template registry

Definitions live in [`src/lib/templates/definitions/`](../src/lib/templates/definitions/):

| Key | Reference PDF | Layout |
|-----|---------------|--------|
| `tpl_default` | template-default.pdf | Sidebar + main (blue) |
| `tpl_0` | template-0.pdf | Sidebar + main (plain) |
| `tpl_1` | template-1.pdf | Single column, uppercase sections |
| `tpl_2` | template-2.pdf | Single column, date-left |
| `tpl_3` | template-3.pdf | Form two-column |
| `tpl_4` | template-4.pdf | Sidebar + main (red) |
| `tpl_5` | template-5.pdf | Form two-column (compact) |

Each `TemplateDefinition` owns:

- Default customization (margins, colors, fonts, layout)
- Block construction and region assignment
- Page rendering (sidebar, headers, form panels)
- CSS class prefix (`tpl-default`, `tpl-1`, etc.)

## Identity flow

- **Gallery slug / renderer key:** `tpl_default`, `tpl_0`, …
- **CV persistence:** stored in `cvs.template_key`
- **Runtime:** `CvDocument.rendererKey` + `templateSlug`
- **Legacy:** `templateId` (`modern`, etc.) remains for backward compatibility

## Fonts

| Reference | VitatePro font |
|-----------|----------------|
| Liberation Sans | Inter (substitute) |
| Roboto | Roboto (Google Fonts) |
| Montserrat | Montserrat (Google Fonts) |
| Poppins | Poppins (Google Fonts) |

Fonts load in [`src/app/layout.tsx`](../src/app/layout.tsx). Template styles in [`src/styles/templates.css`](../src/styles/templates.css).

## Reference matching process

Run `next dev` and open `/dev/templates/<rendererKey>` (for example
`/dev/templates/tpl_default`). This dev-only route renders the template at true
A4 size with the [`kennedy-sithole.fixture.ts`](../src/lib/templates/reference/kennedy-sithole.fixture.ts)
data through the production renderer, so it can be diffed directly against the
matching `templates-layout/template-*.pdf`. The route returns 404 in production
builds.

1. Open the proof route for the target template
2. Compare against `templates-layout/template-*.pdf` page by page
3. Iterate spacing, typography, and page breaks
4. Re-check the exported PDF, which shares the same renderer

Section labels ("Professional Summary", "Employment", "Certificates") come from
document data, not the template, so the fixture carries the reference wording.

## Rails and pagination

Sidebar templates emit their rail as `region: "sidebar"` blocks, so a long rail
flows onto later pages instead of being clipped. Each region packs
independently; a region that runs out of content leaves later pages empty rather
than repeating its last page.

Rails bleed to the page edges by escaping the page padding box with negative
margins. Block heights are therefore measured from flow position rather than
element boxes, so collapsed and negative margins are counted correctly — see
[`block-measure-layer.tsx`](../src/components/document/pagination/block-measure-layer.tsx).

## Adding template #8

1. Add reference PDF to `templates-layout/`
2. Create `src/lib/templates/definitions/tpl-N.ts`
3. Register in `definitions/index.ts`
4. Add CSS under `src/styles/templates.css`
5. Seed gallery row in Supabase migration
6. Add fixture test case in `pack.test.ts`

## Customization constraints

Templates apply defaults even without saved customization. User overrides (accent, font, margins) are clamped by `createTemplateDefaultCustomization()` — layout family and section order remain template-controlled.
