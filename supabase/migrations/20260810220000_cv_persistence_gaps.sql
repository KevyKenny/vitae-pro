-- Phase 9C: CV persistence gap fixes
-- 1) Editor template key (EditorTemplateId) independent of gallery template UUID
-- 2) Custom section content
-- 3) Allow multiple custom sections (unique only for built-in types)

alter table public.cvs
  add column if not exists template_key text not null default 'modern';

comment on column public.cvs.template_key is
  'Editor style key: modern | professional | executive | minimal | creative';

alter table public.cv_sections
  add column if not exists content text not null default '';

comment on column public.cv_sections.content is
  'Body for custom sections; unused for built-in section types.';

-- Drop the old one-per-type unique (name may vary)
alter table public.cv_sections
  drop constraint if exists cv_sections_cv_id_section_type_key;

drop index if exists cv_sections_cv_id_section_type_key;

create unique index if not exists cv_sections_one_builtin_type_per_cv
  on public.cv_sections (cv_id, section_type)
  where section_type <> 'custom';

-- Optional achievement year/date for frontend parity (text keeps flexible "2023" / "March 2023")
alter table public.achievements
  add column if not exists achievement_date text;

comment on column public.achievements.achievement_date is
  'Optional free-form date or year for the achievement.';
