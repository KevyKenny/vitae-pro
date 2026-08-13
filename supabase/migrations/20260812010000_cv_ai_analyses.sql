-- Phase 9F: CV AI analysis persistence (health, ATS, job match)
-- Stores structured analysis results with stale detection via cv_updated_at snapshot.

create table public.cv_ai_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  cv_id uuid not null references public.cvs (id) on delete cascade,
  analysis_type text not null check (
    analysis_type in ('cv_health', 'job_match')
  ),
  job_description_hash text,
  result jsonb not null default '{}'::jsonb,
  model text,
  cv_updated_at timestamptz not null,
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint cv_ai_analyses_job_hash_check check (
    (analysis_type = 'job_match' and job_description_hash is not null)
    or (analysis_type = 'cv_health' and job_description_hash is null)
  )
);

create index idx_cv_ai_analyses_cv_type
  on public.cv_ai_analyses (cv_id, analysis_type, updated_at desc);

create index idx_cv_ai_analyses_user
  on public.cv_ai_analyses (user_id, updated_at desc);

create unique index idx_cv_ai_analyses_cv_health_unique
  on public.cv_ai_analyses (cv_id)
  where analysis_type = 'cv_health';

create unique index idx_cv_ai_analyses_cv_job_unique
  on public.cv_ai_analyses (cv_id, job_description_hash)
  where analysis_type = 'job_match';

alter table public.cv_ai_analyses enable row level security;

create policy "cv_ai_analyses_select_own"
  on public.cv_ai_analyses for select
  to authenticated
  using (user_id = auth.uid());

create policy "cv_ai_analyses_insert_own"
  on public.cv_ai_analyses for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "cv_ai_analyses_update_own"
  on public.cv_ai_analyses for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "cv_ai_analyses_delete_own"
  on public.cv_ai_analyses for delete
  to authenticated
  using (user_id = auth.uid());

create trigger cv_ai_analyses_set_updated_at
  before update on public.cv_ai_analyses
  for each row
  execute function public.set_updated_at();
