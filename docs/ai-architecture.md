# VitatePro AI Architecture (Phase 9E)

This document describes the OpenAI integration layer introduced in Phase 9E.

## Overview

```
User UI → /api/ai/* (Next.js Route Handlers) → lib/ai → OpenAI Responses API → Structured JSON → UI
                                                                                    ↓
                                                                         ai_generations (Supabase)
```

All OpenAI requests are **server-side only**. The API key is never exposed to the browser.

## Environment variables

Add to `.env` (see `.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes (unless mock mode) | Server-only OpenAI API key |
| `OPENAI_MODEL` | No | Default model (default: `gpt-4o-mini`) |
| `OPENAI_MODEL_FAST` | No | Lightweight operations (defaults to `OPENAI_MODEL`) |
| `OPENAI_MODEL_QUALITY` | No | Complex writing (default: `gpt-4o`) |
| `AI_MOCK_MODE` | No | Set to `true` for explicit dev fallback (default: off) |

**Never** use `NEXT_PUBLIC_*` for OpenAI credentials.

## Service layer (`src/lib/ai/`)

| Module | Purpose |
|--------|---------|
| `client.ts` | Singleton OpenAI client (`server-only`) |
| `env.ts` | API key, mock mode checks |
| `models.ts` | Centralized model tiers (`default`, `fast`, `quality`) |
| `generate.ts` | Responses API wrapper (text, structured JSON, streaming) |
| `system.ts` | Base VitatePro AI system instruction |
| `prompts/*` | Versioned prompt definitions per use case |
| `types.ts` | Strong TypeScript result types |
| `errors.ts` | User-safe error mapping |
| `auth.ts` | User auth + CV/cover letter ownership checks |
| `rate-limit.ts` | In-memory per-user rate limiting (40 req/min) |
| `usage.ts` | Logging to `ai_generations` + privacy-safe server logs |
| `cv-context.ts` | Minimal CV context builders (privacy-conscious) |
| `schemas.ts` | Zod request validation |
| `route-handler.ts` | Shared API route wrapper |
| `mock.ts` | Explicit mock responses when `AI_MOCK_MODE=true` |

## API routes

| Route | Feature | Auth / ownership |
|-------|---------|------------------|
| `POST /api/ai/summary` | Professional summary | User + `cvId` ownership |
| `POST /api/ai/experience` | Experience improve / bullets | User + `cvId` ownership |
| `POST /api/ai/cover-letter` | Generate or improve section | User + `coverLetterId` (+ optional `cvId`) |
| `POST /api/ai/job-analysis` | Job description analysis | User (optional `coverLetterId`) |
| `POST /api/ai/cv-tailor` | CV tailoring recommendations | User + `cvId` ownership |
| `POST /api/ai/skills` | Skills suggestions | User + `cvId` ownership |
| `POST /api/ai/cv-analysis` | CV health + ATS assessment (Phase 9F) | User + `cvId` ownership |
| `POST /api/ai/job-match` | CV vs job description match (Phase 9F) | User + `cvId` ownership |
| `GET /api/cv/analysis` | Fetch cached analysis (Phase 9F) | User + `cvId` ownership |

Client helper: `src/features/ai/api.ts`

## AI capabilities

1. **Professional summary** — generate, improve, professional, concise, confident, ATS
2. **Experience enhancement** — improve, rewrite, professional, concise, impact, ATS
3. **Experience bullets** — grounded bullet generation from user description
4. **Cover letter generation** — full letter from CV + job + tone + length
5. **Cover letter improvement** — per-section suggestions
6. **Job description analysis** — structured skills, keywords, requirements
7. **CV tailoring** — recommendations only (never silent rewrite)
8. **Skills suggestions** — demonstrated vs. consider-adding skills

## Structured outputs

Structured responses use OpenAI Responses API `json_schema` format with strict schemas defined alongside prompts in `src/lib/ai/prompts/`.

## Security

- **Authentication**: Supabase session via `getCurrentUser()` / `requireAiUser()`
- **Authorization**: Explicit ownership checks on `cvs` and `cover_letters` — never trust client IDs alone
- **RLS**: `ai_generations` table has row-level security (insert/select own rows)
- **Prompt injection**: Job descriptions and CV content treated as untrusted DATA in system instructions
- **Privacy**: Minimal context per operation; no full CV logging on server

## Usage tracking

Each successful/failed generation can be logged to `public.ai_generations`:

- `user_id`, `cv_id`, `cover_letter_id`, `feature`, `model`
- `input_tokens`, `output_tokens`, `status`, `metadata`
- No full prompts or CV bodies stored in metadata by default

## Rate limiting

Basic in-memory limit: **40 requests per user per minute**. Designed for easy replacement with Redis or database-backed limits in a future billing phase.

## UX patterns

- **Accept / Reject / Regenerate** — AI never silently overwrites user content in the CV editor
- **Loading states** — `aiLoading`, `generating`, `analyzing`, `cvTailoring`
- **Cancel** — `AbortController` cancels in-flight requests
- **Errors** — Friendly messages; no API keys or stack traces exposed

## Zimbabwe CV support

System instructions include O/A Level, ZIMSEC, industrial attachment durations, and vocational paths. AI must not invent dates for attachment durations (e.g. preserve "8 months").

## Development mock mode

Set `AI_MOCK_MODE=true` for offline development without OpenAI. **Off by default** — production never silently falls back to fake AI.

## Future phases

The layer is structured for:

- Subscription tiers and AI credits
- Database-backed rate limits
- AI history / undo / compare
- Streaming UX for long-form generation
- Operation-specific model routing for cost control

## Wired UI surfaces

- CV Editor: summary, experience bullets, skills (`editor-context.tsx`)
- Cover Letter: job analysis, generate, section improve, CV tailor (`cover-letter-context.tsx`)

See also: [docs/cv-analysis.md](./cv-analysis.md) for Phase 9F scoring, caching, and job matching.
