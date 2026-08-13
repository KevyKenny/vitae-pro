-- =============================================================================
-- 0004 — Indexes for common query paths
-- =============================================================================

create index if not exists idx_profiles_country on public.profiles (country);
create index if not exists idx_profiles_updated_at on public.profiles (updated_at desc);

create index if not exists idx_templates_slug on public.templates (slug);
create index if not exists idx_templates_active_sort
  on public.templates (is_active, sort_order)
  where is_active = true;

create index if not exists idx_cvs_user_id on public.cvs (user_id);
create index if not exists idx_cvs_user_updated on public.cvs (user_id, updated_at desc);
create index if not exists idx_cvs_template_id on public.cvs (template_id);
create index if not exists idx_cvs_status on public.cvs (user_id, status);

create index if not exists idx_cv_sections_cv_id on public.cv_sections (cv_id, sort_order);

create index if not exists idx_work_experiences_cv_id
  on public.work_experiences (cv_id, sort_order);
create index if not exists idx_experience_bullets_experience_id
  on public.experience_bullets (experience_id, sort_order);

create index if not exists idx_educations_cv_id on public.educations (cv_id, sort_order);
create index if not exists idx_education_subjects_education_id
  on public.education_subjects (education_id, sort_order);

create index if not exists idx_skills_cv_id on public.skills (cv_id, sort_order);
create index if not exists idx_projects_cv_id on public.projects (cv_id, sort_order);
create index if not exists idx_certifications_cv_id on public.certifications (cv_id, sort_order);
create index if not exists idx_languages_cv_id on public.languages (cv_id, sort_order);
create index if not exists idx_achievements_cv_id on public.achievements (cv_id, sort_order);
create index if not exists idx_cv_references_cv_id on public.cv_references (cv_id, sort_order);

create index if not exists idx_cv_versions_cv_id
  on public.cv_versions (cv_id, version_number desc);

create index if not exists idx_cover_letters_user_id
  on public.cover_letters (user_id, updated_at desc);
create index if not exists idx_cover_letters_cv_id on public.cover_letters (cv_id);

create index if not exists idx_ai_generations_user_created
  on public.ai_generations (user_id, created_at desc);
create index if not exists idx_ai_usage_user_period
  on public.ai_usage (user_id, period_start, period_end);

create index if not exists idx_notifications_user_unread
  on public.notifications (user_id, is_read, created_at desc);

create index if not exists idx_subscriptions_provider_customer
  on public.subscriptions (provider_customer_id)
  where provider_customer_id is not null;
