# Authentication & user profiles (Phase 9B)

VitatePro uses **Supabase Auth** as the only authentication system, with profiles in PostgreSQL (`profiles.id = auth.users.id`).

The existing UI is preserved; this phase wires real auth/session/profile data while CVs, templates, cover letters, and AI features may still use mocks.

## Architecture

| Layer | Role |
| --- | --- |
| `@supabase/ssr` + middleware | Cookie-based session refresh for App Router |
| `src/lib/supabase/client.ts` | Browser client (`anon` / publishable key) |
| `src/lib/supabase/server.ts` | Server Components / Route Handlers |
| `src/lib/supabase/admin.ts` | Service role — **server only**, never imported in client code |
| `AuthProvider` (`useAuth` / `useUser` / `useProfile`) | Client authenticated user + profile |
| `getCurrentUser` / `getCurrentProfile` | Server helpers |
| DB trigger `handle_new_user` | Creates `profiles` row on signup (Phase 9A) |

Sessions use Supabase’s recommended cookie storage. Do **not** put access tokens in `localStorage`.

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=             # server-only; never NEXT_PUBLIC_*
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # recommended for email redirects
```

Copy from `.env.example`. Missing public URL/key fails gracefully in middleware (auth checks skipped) and surfaces useful errors from client helpers when used.

### Supabase Dashboard

Authentication → URL Configuration:

- Site URL: your local or production origin
- Redirect URLs: `{SITE_URL}/auth/callback`

Email confirmation can be enabled or disabled in the project. With confirmation **off**, signup returns a session and users go to `/auth/transition`. With confirmation **on**, they go to `/auth/verify-email`.

## Auth routes

| Path | Purpose |
| --- | --- |
| `/auth/sign-up` | Email + password registration |
| `/auth/sign-in` | Login (`?redirect=` supported) |
| `/auth/verify-email` | Check inbox / resend |
| `/auth/forgot-password` | Request reset email |
| `/auth/callback` | Exchange auth code; recovery → reset password |
| `/auth/reset-password` | Set new password after recovery link |
| `/auth/transition` | Post-auth splash → onboarding or dashboard |
| `/onboarding` | Persist career preferences to `profiles` + `user_preferences` |

OAuth UI is not exposed until providers are configured.

## Protected routes

Middleware (`src/middleware.ts`) requires a session for:

- `/dashboard`, `/cvs`, `/customize`, `/cover-letter(s)`, `/ai-assistant`, `/help`, `/settings`, `/onboarding`

Unauthenticated users are sent to `/auth/sign-in?redirect=…`.

Public (among others): `/`, `/templates`, `/auth/*` (except transition still needs a user), marketing/legal pages.

Authenticated users hitting sign-in / sign-up / forgot-password are redirected to `/auth/transition`.

## Profiles

- Created by Phase 9A trigger; signup also upserts name/country/career metadata safely.
- Updates via `updateCurrentProfile` / settings UI → `profiles` (RLS: own row only).
- `photo_url` is schema-ready; **Supabase Storage for avatars is deferred**.
- Career goals text lives in `user_preferences.ai_flags.careerGoals` (no extra column).
- Onboarding flags: `profiles.onboarding_completed`.
- Completion: `calculateProfileCompletion()` in `src/lib/auth/profile-completion.ts` (meaningful fields only); stored in `profile_completion` on save.

## Onboarding

1. Auth user required.
2. Prefill from profile.
3. Persist step progress with **Save & continue later**.
4. Finish sets `onboarding_completed` and AI/theme prefs in `user_preferences`.

Database is the source of truth — not `localStorage`.

## Password reset & verification

1. Forgot password → `resetPasswordForEmail` → email link → `/auth/callback?type=recovery` → `/auth/reset-password`.
2. Verification resend uses `auth.resend({ type: "signup" })`.

User-facing errors are mapped in `src/lib/auth/errors.ts` (no raw Supabase/DB strings).

## RLS

Owner-only policies from Phase 9A apply to `profiles` and related private tables. The browser client uses the anon key + user JWT; do not weaken RLS or call the service role from the client.

Isolation checks: `supabase/tests/rls_isolation.sql`.

## Future: delete my account

Not implemented in UI yet. Cascade considerations:

1. Delete `auth.users` (or use Admin API) — should cascade / remove `profiles` by FK design.
2. Ensure all user-owned tables (CVs, cover letters, AI history, preferences) cascade or are cleaned.
3. Later: remove Storage objects under the user prefix when Storage lands.
4. Prefer a server route with service role + explicit confirmation for production deletion.

## Local development & testing

1. Apply Phase 9A migrations (`supabase db push` or linked remote).
2. Set `.env` / `.env.local` from `.env.example`.
3. `npm run dev`.
4. Manual lifecycle:
   - Sign up → transition → onboarding → dashboard
   - Refresh (session persists)
   - Visit protected route logged out → redirect with `redirect=`
   - Profile load/save + completion %
   - Sign out → cannot use back button into protected pages without re-auth
   - Forgot / reset password (requires email configured)
5. RLS: run `supabase/tests/rls_isolation.sql` against a seeded project when Postgres is available.

## Out of scope (later phases)

OpenAI, CV/cover-letter persistence, PDF, Stripe, Storage uploads, OAuth providers.
