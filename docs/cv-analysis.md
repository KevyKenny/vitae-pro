# CV Analysis, ATS & Job Matching (Phase 9F)

VitatePro's analysis engine evaluates CV health, ATS compatibility, and job relevance using the Phase 9E OpenAI infrastructure.

## Overview

```
User CV → /api/ai/cv-analysis or /api/ai/job-match → OpenAI (structured JSON)
       → cv_ai_analyses (cache) → cvs.score (health only) → Dashboard / Editor UI
```

## Scoring methodology

Scores are **VitatePro AI assessments** — not hiring guarantees or universal ATS measurements.

### CV Health (overallScore)

Weighted dimensions (documented in prompt):

| Dimension | Weight |
|-----------|--------|
| Content quality | 20% |
| Professional summary | 10% |
| Experience quality | 20% |
| Skills relevance | 10% |
| Education completeness | 10% |
| Structure | 10% |
| ATS compatibility | 15% |
| Readability | 5% |

Each category returns: score, status (`strong` | `good` | `needs-work`), explanation, strengths, improvements.

### ATS Score (atsScore)

Sub-breakdown: section structure, keyword alignment, formatting, readability.

Issues flagged with severity: `critical`, `high`, `medium`, `low`.

### Job Match (matchScore)

Weighted breakdown:

| Dimension | Weight |
|-----------|--------|
| Skills match | 25% |
| Experience match | 25% |
| Keyword match | 20% |
| Education match | 15% |
| Role alignment | 15% |

## API routes

| Route | Purpose |
|-------|---------|
| `POST /api/ai/cv-analysis` | Full CV health + ATS analysis |
| `POST /api/ai/job-match` | CV vs job description match |
| `GET /api/cv/analysis?cvId=&type=` | Fetch cached analysis |

Request body supports `force: true` to bypass cache.

## Caching & stale detection

Table: `public.cv_ai_analyses`

- `cv_health`: one row per CV (upsert)
- `job_match`: one row per CV + job description hash
- `cv_updated_at`: snapshot of CV `updated_at` when analysis ran
- **Stale** when `cvs.updated_at > cv_ai_analyses.cv_updated_at`

Analysis is never auto-regenerated on page load — user clicks **Analyze CV** or **Analyze again**.

## Database

Migration: `supabase/migrations/20260812010000_cv_ai_analyses.sql`

- RLS: users can only read/write their own analyses
- Indexes on `(cv_id, analysis_type)` and `(user_id, updated_at)`
- On successful health analysis, `cvs.score` is updated

## Privacy

- Only serialized CV context sent to OpenAI (via `serializeCvContext`)
- Job descriptions hashed for cache keys — full JD stored only in analysis result JSON for job_match rows
- No full CV bodies in `ai_generations` metadata

## Security

- Authenticated user required
- CV ownership verified via `assertCvOwnership`
- User A cannot analyze User B's CV

## UX integration

| Surface | Feature |
|---------|---------|
| CV Editor toolbar | **Analyze** button → analysis Sheet |
| Analysis Sheet tabs | Health · ATS · Job Match |
| Recommendations | **Improve with AI** → Phase 9E `requestAi` |
| Dashboard | `DashboardCvHealth` widget with score + Review link |

## Incomplete CVs

If minimum content is missing (`checkCvCompleteness`), analysis returns guidance instead of elaborate scores:

- Contact, summary, experience, education, skills checklist
- Message: "Your CV needs a little more information…"

## Zimbabwe & international support

Prompts recognize O/A Level, ZIMSEC, industrial attachment, internships, diplomas, and vocational paths without penalizing non-university backgrounds.

## AI usage tracking

Logged to `ai_generations`:

- CV health: `feature: ats_optimization`, `metadata.operation: cv_health_analysis`
- Job match: `feature: other`, `metadata.operation: job_match`

## Development

Uses `AI_MOCK_MODE=true` mock responses for `cv_analysis` and `job_match` schema names.

See also: [docs/ai-architecture.md](./ai-architecture.md)
