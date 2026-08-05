# VitatePro Design System

Frontend tokens and patterns used across authentication, dashboard, editors, templates, and settings.

## Brand

- **Name:** VitatePro  
- **Logos:** `/public/logo/vitaepro-*.svg`  
- **Voice:** Premium AI career coach — calm paper surfaces, emerald trust, gold accents.

## Colors

| Token | Role | Light |
|-------|------|-------|
| `--paper` | App background | `#FAF8F3` |
| `--paper-dim` | Recessed / muted surface | `#F3F0E7` |
| `--surface` | Cards, panels | `#FFFFFF` |
| `--ink` | Primary text | `#1B1D1B` |
| `--ink-soft` | Secondary text | `#55584F` |
| `--ink-faint` | Captions / meta | `#8B8D82` |
| `--emerald` | Primary brand | `#1F4D3D` |
| `--emerald-bright` | Primary hover / focus | `#2F7A5C` |
| `--emerald-wash` | Soft brand fill | `#EAF1EC` |
| `--gold` | Secondary accent | `#B08D3E` |
| `--gold-wash` | Soft accent fill | `#F6EFDD` |
| `--line` / `--line-strong` | Borders | `#E4E0D3` / `#D3CDBB` |
| `--success` | Positive / saved | `#2F7A5C` |
| `--warning` | Caution | `#B08D3E` |
| `--error` / `--destructive` | Danger | `#B42318` |
| `--info` | Informational | `#2C5F8A` |

Dark mode overrides live under `.dark` in `src/app/globals.css`.

## Typography

| Use | Font | Notes |
|-----|------|--------|
| Display / H1–H3 | Fraunces (`font-serif`) | Tracking −0.01em, weight 600 |
| Body / UI | Inter (`font-sans`) | 15px base, line-height 1.55 |
| Meta / scores | IBM Plex Mono (`font-mono`) | Dense numbers, status |

**Scale (approx):** H1 ~1.7–2.1rem · H2 ~1.3–1.5rem · H3 ~1.08–1.2rem · Body 0.88–0.95rem · Caption 0.72–0.78rem · Labels uppercase tracking, faint ink.

## Spacing (8px system)

`--space-1` 8px → `--space-8` 64px. Prefer Tailwind spacing aligned to 8px (p-2, p-4, gap-3, etc.).

## Radii & shadow

- `--radius-s` 8px · `--radius-m` 14px · `--radius-l` 22px  
- `--shadow-s` / `--shadow-m` / `--shadow-l`

## Buttons

Variants: `primary` · `secondary` · `outline` · `ghost` · `destructive` · `link`  
Plus `loading` (spinner + disabled) and native `disabled`.  
Shapes: `pill` (default) · `soft` (8px).

## Motion

Prefer 150–220ms ease-out. Respect `prefers-reduced-motion` (animations disabled via global CSS). Keep motion purposeful: panel open, save status, template switch.

## Accessibility

- Focus-visible: 2px emerald-bright outline  
- WCAG AA targets for ink on paper / emerald on wash  
- Interactive targets ≥ 44px on mobile where possible  
- Provide ARIA labels on icon-only controls  

## Demo mode

Append `?demo=1` to any route to enable marketing demo fixtures (persisted in `localStorage`). Exit with `?demo=0`.
