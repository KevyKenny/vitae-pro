# Cover letters & templates (Phase 9D)

Real Supabase persistence for cover letters and the template catalog, without OpenAI/Stripe/PDF.

## Cover letters

### Ownership & RLS

- Table: `cover_letters` (`user_id = auth.uid()`)
- Optional `cv_id` → `cvs` (SET NULL on CV delete)
- Optional `template_id` → `templates`; **`template_key`** stores letter editor style (`professional` | `modern` | …)
- RLS: owner-only select/insert/update/delete (Phase 9A)

### Content storage

JSON fields:

| Column | Payload |
| --- | --- |
| `content` | `{ body, candidate, suggestions, score }` (+ legacy flat section keys supported on read) |
| `job_analysis` | Mock/analysis object when present |

Scalar fields: title, company, job title, hiring manager, website/location, tone, length, application_status, score.

### Data access (`src/lib/cover-letters`)

| Function | Purpose |
| --- | --- |
| `listUserCoverLetters` | List with CV title + template label |
| `getCoverLetter` | Full editor document |
| `createCoverLetter` | New letter; title from profile/role; default template from prefs when set |
| `saveCoverLetterDocument` | Debounced autosave (~850ms) |
| `duplicateCoverLetter` | Deep copy + `" — Copy"` |
| `deleteCoverLetter` / `renameCoverLetter` | |
| `associateCoverLetterWithCv` | Set/clear `cv_id` |

### UI wiring

- `/cover-letter` → creates row → redirects to `/cover-letter/[id]`
- `/cover-letter/[id]` → `CoverLetterProvider` load/save
- `/cover-letters` → real list (open / duplicate / rename / delete)
- Job form: **Associated CV** select (`listUserCvs`)

AI generate/rewrite remains **mock / coming soon** (no OpenAI).

---

## Templates

### Catalog

- Table: `templates` (public SELECT when `is_active`)
- Gallery IDs = **slug** (e.g. `tpl_meridian`) for stable URLs
- Rich gallery fields live in `metadata` jsonb
- Migration `20260811010000_cover_letters_templates.sql` seeds 14 gallery templates (coexists with Phase 9A seed styles)

### Customization

Table: `user_template_customizations` (owner RLS)

- `template_slug`, optional `template_id`
- `customization` jsonb (`TemplateCustomization` shape)
- Used by Customize Studio Save + My Templates list

No favorites join table — the UI has no real favorites toggle (Save persists a customization).

### Data access (`src/lib/templates`)

| Function | Purpose |
| --- | --- |
| `listActiveTemplates` | Gallery cards |
| `getTemplateBySlugOrId` | Detail / customize |
| `saveTemplateCustomization` / `getTemplateCustomization` | Studio |
| `listUserCustomizations` | My Templates |
| `applyGalleryTemplateToCv` | Sets `cvs.template_id` + `template_key` from `editor_style` |
| `setUserDefaultTemplate` / `getUserDefaultTemplateId` | Settings → `user_preferences.default_template_id` |

### UI wiring

- Gallery + detail load from Supabase (mock fallback if empty)
- Customize Save/Apply → DB + optional CV apply
- CV settings default template → real preference UUID
- Premium badges display only — **no payment enforcement**

### Previews

`preview_image_path` may be null; UI keeps MiniPreview / CSS previews. Storage migration later.

---

## CV ↔ template relationship

| Document | Presentation field | Gallery link |
| --- | --- | --- |
| CV | `template_key` (editor) | `template_id` when applied from gallery |
| Cover letter | `template_key` (letter styles) | `template_id` resolved when possible |

Changing a template must not rewrite document content.

---

## Local setup

```bash
npx supabase db push
npm run dev
```

Test: create/edit/save/refresh cover letter; associate CV; duplicate/delete; browse templates; customize save; apply to CV; set default template in settings.

## Out of scope

OpenAI, Stripe, PDF, Storage uploads, email automation.
