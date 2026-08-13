-- =============================================================================
-- 0003 — Row Level Security policies
-- Private user data: owner-only. Templates: public read for active rows.
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.templates enable row level security;
alter table public.cvs enable row level security;
alter table public.cv_sections enable row level security;
alter table public.cv_personal_info enable row level security;
alter table public.cv_summaries enable row level security;
alter table public.work_experiences enable row level security;
alter table public.experience_bullets enable row level security;
alter table public.educations enable row level security;
alter table public.education_subjects enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.languages enable row level security;
alter table public.achievements enable row level security;
alter table public.cv_references enable row level security;
alter table public.cv_versions enable row level security;
alter table public.cover_letters enable row level security;
alter table public.ai_generations enable row level security;
alter table public.ai_usage enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles ---------------------------------------------------------------
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Inserts come from the security-definer signup trigger, not clients.

-- Preferences ------------------------------------------------------------
create policy "user_preferences_select_own"
  on public.user_preferences for select
  to authenticated
  using (user_id = auth.uid());

create policy "user_preferences_update_own"
  on public.user_preferences for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "user_preferences_insert_own"
  on public.user_preferences for insert
  to authenticated
  with check (user_id = auth.uid());

-- Templates (public catalog) --------------------------------------------
create policy "templates_select_active_public"
  on public.templates for select
  to anon, authenticated
  using (is_active = true);

-- Mutating templates is service-role only (no authenticated write policies).

-- CVs --------------------------------------------------------------------
create policy "cvs_select_own"
  on public.cvs for select
  to authenticated
  using (user_id = auth.uid());

create policy "cvs_insert_own"
  on public.cvs for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "cvs_update_own"
  on public.cvs for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "cvs_delete_own"
  on public.cvs for delete
  to authenticated
  using (user_id = auth.uid());

-- Helper macro pattern for CV child tables -------------------------------
-- cv_sections
create policy "cv_sections_all_own"
  on public.cv_sections for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "cv_personal_info_all_own"
  on public.cv_personal_info for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "cv_summaries_all_own"
  on public.cv_summaries for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "work_experiences_all_own"
  on public.work_experiences for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "experience_bullets_all_own"
  on public.experience_bullets for all
  to authenticated
  using (public.is_experience_owner(experience_id))
  with check (public.is_experience_owner(experience_id));

create policy "educations_all_own"
  on public.educations for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "education_subjects_all_own"
  on public.education_subjects for all
  to authenticated
  using (public.is_education_owner(education_id))
  with check (public.is_education_owner(education_id));

create policy "skills_all_own"
  on public.skills for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "projects_all_own"
  on public.projects for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "certifications_all_own"
  on public.certifications for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "languages_all_own"
  on public.languages for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "achievements_all_own"
  on public.achievements for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "cv_references_all_own"
  on public.cv_references for all
  to authenticated
  using (public.is_cv_owner(cv_id))
  with check (public.is_cv_owner(cv_id));

create policy "cv_versions_select_own"
  on public.cv_versions for select
  to authenticated
  using (public.is_cv_owner(cv_id));

create policy "cv_versions_insert_own"
  on public.cv_versions for insert
  to authenticated
  with check (public.is_cv_owner(cv_id));

create policy "cv_versions_delete_own"
  on public.cv_versions for delete
  to authenticated
  using (public.is_cv_owner(cv_id));

-- Cover letters ----------------------------------------------------------
create policy "cover_letters_select_own"
  on public.cover_letters for select
  to authenticated
  using (user_id = auth.uid());

create policy "cover_letters_insert_own"
  on public.cover_letters for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "cover_letters_update_own"
  on public.cover_letters for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "cover_letters_delete_own"
  on public.cover_letters for delete
  to authenticated
  using (user_id = auth.uid());

-- AI ---------------------------------------------------------------------
create policy "ai_generations_select_own"
  on public.ai_generations for select
  to authenticated
  using (user_id = auth.uid());

create policy "ai_generations_insert_own"
  on public.ai_generations for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "ai_usage_select_own"
  on public.ai_usage for select
  to authenticated
  using (user_id = auth.uid());

create policy "ai_usage_upsert_own"
  on public.ai_usage for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "ai_usage_update_own"
  on public.ai_usage for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Notifications ----------------------------------------------------------
create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_delete_own"
  on public.notifications for delete
  to authenticated
  using (user_id = auth.uid());

-- Inserts typically via service role / server actions.

-- Subscriptions ----------------------------------------------------------
create policy "subscriptions_select_own"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid());

-- Updates from Stripe webhooks use service role (no authenticated write).
