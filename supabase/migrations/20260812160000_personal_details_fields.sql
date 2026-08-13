-- Personal Details form: extended fields (backward-compatible with full_name, location, portfolio)

alter table public.cv_personal_info
  add column if not exists given_name text,
  add column if not exists family_name text,
  add column if not exists address text,
  add column if not exists post_code text,
  add column if not exists city text,
  add column if not exists drivers_license text,
  add column if not exists use_as_headline boolean not null default true,
  add column if not exists date_of_birth text,
  add column if not exists place_of_birth text,
  add column if not exists gender text,
  add column if not exists nationality text,
  add column if not exists civil_status text,
  add column if not exists custom_fields jsonb not null default '[]'::jsonb,
  add column if not exists field_visibility jsonb not null default '{}'::jsonb;

comment on column public.cv_personal_info.given_name is 'First / given name (Personal Details form).';
comment on column public.cv_personal_info.family_name is 'Last / family name (Personal Details form).';
comment on column public.cv_personal_info.address is 'Street or area address.';
comment on column public.cv_personal_info.use_as_headline is 'When true, professional_title appears as the CV headline.';
comment on column public.cv_personal_info.custom_fields is 'User-defined optional personal detail fields.';
comment on column public.cv_personal_info.field_visibility is 'Which optional personal detail fields are shown in the editor.';

-- Backfill split names and address from legacy columns where new columns are empty
update public.cv_personal_info
set
  given_name = coalesce(
    nullif(trim(given_name), ''),
    nullif(split_part(trim(full_name), ' ', 1), '')
  ),
  family_name = coalesce(
    nullif(trim(family_name), ''),
    nullif(trim(regexp_replace(trim(full_name), '^\S+\s*', '')), '')
  ),
  address = coalesce(nullif(trim(address), ''), nullif(trim(location), ''))
where full_name is not null or location is not null;
