-- =============================================================================
-- 0002 — Initial schema (profiles, CVs, education, experience, cover letters…)
-- Source of truth aligned with src/features/cv-editor/types.ts and cover-letter
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Profiles (1:1 with auth.users; id == auth.users.id)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  professional_title text,
  email text,
  phone text,
  location text,
  country text,
  linkedin_url text,
  portfolio_url text,
  github_url text,
  website_url text,
  photo_url text,
  career_level text,
  industry text,
  years_of_experience integer check (
    years_of_experience is null
    or years_of_experience >= 0
  ),
  employment_status text,
  preferred_language text default 'en',
  profile_completion integer not null default 0 check (
    profile_completion >= 0
    and profile_completion <= 100
  ),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is
  'Application profile for a Supabase Auth user. Does not store credentials.';

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'first_name',
      split_part(coalesce(new.raw_user_meta_data ->> 'full_name', ''), ' ', 1)
    ),
    coalesce(
      new.raw_user_meta_data ->> 'last_name',
      nullif(
        regexp_replace(coalesce(new.raw_user_meta_data ->> 'full_name', ''), '^\S+\s*', ''),
        ''
      )
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Templates (public catalog)
-- -----------------------------------------------------------------------------
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  category text,
  preview_image_path text,
  ats_compatible boolean not null default true,
  is_free boolean not null default true,
  is_premium boolean not null default false,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  editor_style text,
  metadata jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger templates_set_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- User preferences (separate from identity)
-- -----------------------------------------------------------------------------
create table public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  writing_style text,
  ai_assistance_level text,
  default_template_id uuid references public.templates (id) on delete set null,
  default_language text not null default 'en',
  default_cv_style text,
  default_font text,
  default_color_theme text,
  date_format text not null default 'dmy',
  page_size text not null default 'a4',
  theme text not null default 'system',
  accent text,
  animations_enabled boolean not null default true,
  compact_mode boolean not null default false,
  notify_email boolean not null default true,
  notify_product_updates boolean not null default true,
  notify_ai_suggestions boolean not null default true,
  notify_cv_reminders boolean not null default true,
  notify_template_releases boolean not null default false,
  notify_tips boolean not null default true,
  ai_flags jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

create or replace function public.handle_new_profile_preferences()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_profile_created_preferences
after insert on public.profiles
for each row execute function public.handle_new_profile_preferences();

-- -----------------------------------------------------------------------------
-- CVs
-- -----------------------------------------------------------------------------
create table public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  template_id uuid references public.templates (id) on delete set null,
  status text not null default 'draft'
    check (status in ('draft', 'completed', 'archived')),
  target_role text,
  target_industry text,
  language text not null default 'en',
  is_default boolean not null default false,
  score integer check (score is null or (score >= 0 and score <= 100)),
  completion integer check (
    completion is null
    or (completion >= 0 and completion <= 100)
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger cvs_set_updated_at
before update on public.cvs
for each row execute function public.set_updated_at();

create unique index cvs_one_default_per_user
  on public.cvs (user_id)
  where is_default = true;

-- -----------------------------------------------------------------------------
-- CV sections
-- -----------------------------------------------------------------------------
create table public.cv_sections (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  section_type text not null check (
    section_type in (
      'personal',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'achievements',
      'references',
      'custom'
    )
  ),
  title text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (cv_id, section_type)
);

create trigger cv_sections_set_updated_at
before update on public.cv_sections
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Personal info + summary (per CV)
-- -----------------------------------------------------------------------------
create table public.cv_personal_info (
  cv_id uuid primary key references public.cvs (id) on delete cascade,
  photo_url text,
  full_name text,
  professional_title text,
  email text,
  phone text,
  location text,
  linkedin text,
  portfolio text,
  social_links text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger cv_personal_info_set_updated_at
before update on public.cv_personal_info
for each row execute function public.set_updated_at();

create table public.cv_summaries (
  cv_id uuid primary key references public.cvs (id) on delete cascade,
  content text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger cv_summaries_set_updated_at
before update on public.cv_summaries
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Work experiences (includes industrial_attachment as first-class type)
-- -----------------------------------------------------------------------------
create table public.work_experiences (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  experience_type text not null check (
    experience_type in (
      'full_time',
      'part_time',
      'contract',
      'internship',
      'industrial_attachment',
      'graduate_trainee',
      'apprenticeship',
      'freelance',
      'volunteer',
      'consulting',
      'temporary',
      'self_employed',
      'other'
    )
  ),
  company_name text,
  organization_name text,
  department text,
  job_title text,
  programme_name text,
  project_name text,
  client_name text,
  cause text,
  impact text,
  rotation_details text,
  location text,
  date_mode text not null default 'range'
    check (date_mode in ('range', 'duration')),
  start_month text,
  start_year text,
  end_month text,
  end_year text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  duration_text text,
  description text,
  technologies text[] not null default '{}',
  portfolio_link text,
  supervisor_name text,
  supervisor_position text,
  supervisor_email text,
  supervisor_phone text,
  include_supervisor_on_export boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    end_date is null
    or start_date is null
    or end_date >= start_date
  )
);

comment on column public.work_experiences.duration_text is
  'Human duration such as ''8 Months'' when exact dates are unavailable.';

create trigger work_experiences_set_updated_at
before update on public.work_experiences
for each row execute function public.set_updated_at();

create table public.experience_bullets (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.work_experiences (id) on delete cascade,
  bullet_type text not null default 'responsibility'
    check (bullet_type in ('responsibility', 'skill_gained', 'achievement')),
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger experience_bullets_set_updated_at
before update on public.experience_bullets
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Education + subjects
-- -----------------------------------------------------------------------------
create table public.educations (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  qualification_type text not null check (
    qualification_type in (
      'o_level',
      'a_level',
      'certificate',
      'diploma',
      'hnd',
      'bachelors',
      'honours',
      'masters',
      'doctorate',
      'professional',
      'short_course',
      'apprenticeship',
      'vocational',
      'other'
    )
  ),
  examination_board text,
  examination_board_other text,
  school_name text,
  year_completed text,
  candidate_number text,
  location text,
  institution text,
  qualification text,
  field_of_study text,
  start_date date,
  end_date date,
  completion_year text,
  grade text,
  description text,
  achievements text,
  certificate_name text,
  credential_number text,
  certification_name text,
  issuing_organization text,
  issue_date date,
  expiry_date date,
  credential_id text,
  verification_url text,
  training_provider text,
  programme_name text,
  duration text,
  completion_date date,
  skills_acquired text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.educations is
  'Flexible education model supporting ZIMSEC O/A Level and tertiary qualifications.';

create trigger educations_set_updated_at
before update on public.educations
for each row execute function public.set_updated_at();

create table public.education_subjects (
  id uuid primary key default gen_random_uuid(),
  education_id uuid not null references public.educations (id) on delete cascade,
  subject_name text not null,
  grade text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger education_subjects_set_updated_at
before update on public.education_subjects
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Skills, projects, certifications, languages, achievements, references
-- -----------------------------------------------------------------------------
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  name text not null,
  category text not null default 'other'
    check (
      category in (
        'technical',
        'soft_skill',
        'tool',
        'framework',
        'language',
        'other'
      )
    ),
  proficiency_level integer check (
    proficiency_level is null
    or (proficiency_level >= 1 and proficiency_level <= 5)
  ),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger skills_set_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  project_name text not null,
  description text,
  technologies text[] not null default '{}',
  project_url text,
  repository_url text,
  image_url text,
  start_date date,
  end_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  certification_name text not null,
  issuing_organization text,
  issue_date date,
  expiry_date date,
  credential_id text,
  verification_url text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger certifications_set_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

create table public.languages (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  language text not null,
  proficiency text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger languages_set_updated_at
before update on public.languages
for each row execute function public.set_updated_at();

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger achievements_set_updated_at
before update on public.achievements
for each row execute function public.set_updated_at();

create table public.cv_references (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  name text not null,
  relationship text,
  contact text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger cv_references_set_updated_at
before update on public.cv_references
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- CV versions (JSONB snapshot for history)
-- -----------------------------------------------------------------------------
create table public.cv_versions (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  version_number integer not null,
  label text,
  note text,
  snapshot jsonb not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (cv_id, version_number)
);

-- -----------------------------------------------------------------------------
-- Cover letters
-- -----------------------------------------------------------------------------
create table public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  cv_id uuid references public.cvs (id) on delete set null,
  template_id uuid references public.templates (id) on delete set null,
  title text not null,
  company_name text,
  job_title text,
  job_description text,
  hiring_manager text,
  company_website text,
  company_location text,
  tone text,
  length text,
  content jsonb not null default '{}'::jsonb,
  job_analysis jsonb,
  application_status text not null default 'draft'
    check (
      application_status in (
        'draft',
        'applied',
        'interview',
        'offer',
        'rejected',
        'archived'
      )
    ),
  status text not null default 'draft'
    check (status in ('draft', 'completed', 'archived')),
  score integer check (score is null or (score >= 0 and score <= 100)),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger cover_letters_set_updated_at
before update on public.cover_letters
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- AI foundation tables
-- -----------------------------------------------------------------------------
create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  cv_id uuid references public.cvs (id) on delete set null,
  cover_letter_id uuid references public.cover_letters (id) on delete set null,
  feature text not null check (
    feature in (
      'professional_summary',
      'experience_rewrite',
      'achievement_generation',
      'grammar_improvement',
      'ats_optimization',
      'cover_letter',
      'other'
    )
  ),
  model text,
  input_ref text,
  output_ref text,
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'succeeded', 'failed', 'cancelled')),
  error_code text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  period_start date not null,
  period_end date not null,
  generation_count integer not null default 0 check (generation_count >= 0),
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (period_end >= period_start),
  unique (user_id, period_start, period_end)
);

create trigger ai_usage_set_updated_at
before update on public.ai_usage
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Notifications
-- -----------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null default 'info'
    check (type in ('info', 'success', 'suggestion', 'system', 'tip')),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

-- -----------------------------------------------------------------------------
-- Subscriptions (Stripe-ready; no card data)
-- -----------------------------------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  plan text not null default 'free'
    check (plan in ('free', 'professional', 'premium')),
  status text not null default 'active'
    check (
      status in (
        'active',
        'trialing',
        'past_due',
        'canceled',
        'incomplete',
        'unpaid'
      )
    ),
  provider text not null default 'none',
  provider_customer_id text,
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_profile_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_profile_created_subscription
after insert on public.profiles
for each row execute function public.handle_new_profile_subscription();

-- -----------------------------------------------------------------------------
-- Ownership helpers for RLS
-- -----------------------------------------------------------------------------
create or replace function public.is_cv_owner(p_cv_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cvs c
    where c.id = p_cv_id
      and c.user_id = auth.uid()
  );
$$;

create or replace function public.is_experience_owner(p_experience_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.work_experiences we
    join public.cvs c on c.id = we.cv_id
    where we.id = p_experience_id
      and c.user_id = auth.uid()
  );
$$;

create or replace function public.is_education_owner(p_education_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.educations e
    join public.cvs c on c.id = e.cv_id
    where e.id = p_education_id
      and c.user_id = auth.uid()
  );
$$;

revoke all on function public.is_cv_owner(uuid) from public;
revoke all on function public.is_experience_owner(uuid) from public;
revoke all on function public.is_education_owner(uuid) from public;
grant execute on function public.is_cv_owner(uuid) to authenticated;
grant execute on function public.is_experience_owner(uuid) to authenticated;
grant execute on function public.is_education_owner(uuid) to authenticated;
