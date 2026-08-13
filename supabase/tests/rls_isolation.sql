-- RLS isolation checklist (run after seed against local Supabase)
-- Expectation: demo user never sees other user's private CV.
--
-- Usage (local):
--   npx supabase db reset
--   psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/tests/rls_isolation.sql
--
-- Or open SQL Editor in Studio and paste sections while impersonating JWTs.

-- 1) As service role (bypasses RLS): both CVs visible
-- select id, user_id, title from public.cvs order by title;

-- 2) Simulate User A (demo) via set_config of request.jwt.claim.sub
-- NOTE: In Supabase SQL editor use "impersonate" or auth.uid() via request:
--
-- select set_config(
--   'request.jwt.claim.sub',
--   'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
--   true
-- );
-- select set_config('request.jwt.claim.role', 'authenticated', true);
--
-- Then:
-- select id, title from public.cvs;  -- must ONLY return demo CV
-- select title from public.cover_letters; -- must ONLY return demo letters
-- select * from public.educations; -- only demo education
--
-- Attempt cross-user read must return 0 rows:
-- select * from public.cvs
-- where id = '22222222-2222-2222-2222-222222222299';

do $$
declare
  demo_id uuid := 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  other_cv uuid := '22222222-2222-2222-2222-222222222299';
  demo_cv_count integer;
  other_visible integer;
begin
  -- Structural assertions that do not require JWT impersonation
  select count(*) into demo_cv_count
  from public.cvs
  where user_id = demo_id;

  if demo_cv_count < 1 then
    raise exception 'SEED CHECK FAILED: demo user has no CV';
  end if;

  if not exists (
    select 1 from public.work_experiences
    where experience_type = 'industrial_attachment'
      and duration_text = '8 Months'
  ) then
    raise exception 'SEED CHECK FAILED: industrial attachment (8 Months) missing';
  end if;

  if not exists (
    select 1 from public.educations where qualification_type = 'o_level'
  ) then
    raise exception 'SEED CHECK FAILED: O Level education missing';
  end if;

  if not exists (
    select 1 from public.educations where qualification_type = 'a_level'
  ) then
    raise exception 'SEED CHECK FAILED: A Level education missing';
  end if;

  if not exists (
    select 1 from public.education_subjects es
    join public.educations e on e.id = es.education_id
    where e.qualification_type = 'o_level'
  ) then
    raise exception 'SEED CHECK FAILED: O Level subjects missing';
  end if;

  if not exists (select 1 from public.cvs where id = other_cv) then
    raise exception 'SEED CHECK FAILED: isolation fixture CV missing';
  end if;

  -- Confirm RLS is enabled on private tables
  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in ('cvs', 'educations', 'cover_letters', 'work_experiences')
      and c.relrowsecurity = false
  ) then
    raise exception 'RLS CHECK FAILED: expected RLS enabled on private tables';
  end if;

  raise notice 'Seed + RLS structural checks passed. Impersonate JWT to verify isolation.';
end $$;
