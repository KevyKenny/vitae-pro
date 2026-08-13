-- =============================================================================
-- VitatePro demo / development seed
-- Fictional Zimbabwean-aware CV data (O Level, A Level, industrial attachment).
-- Safe to re-run after `supabase db reset`.
-- =============================================================================

-- Fixed demo identity (local / staging only)
-- Password for local Auth: DemoPass123!
create extension if not exists "pgcrypto" with schema extensions;

do $$
declare
  demo_user_id uuid := 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  other_user_id uuid := 'ffffffff-1111-2222-3333-444444444444';
  tpl_modern uuid := '11111111-1111-1111-1111-111111111101';
  tpl_exec uuid := '11111111-1111-1111-1111-111111111102';
  tpl_minimal uuid := '11111111-1111-1111-1111-111111111103';
  tpl_creative uuid := '11111111-1111-1111-1111-111111111104';
  tpl_folio uuid := '11111111-1111-1111-1111-111111111105';
  cv_id uuid := '22222222-2222-2222-2222-222222222221';
  edu_o uuid := '33333333-3333-3333-3333-333333333301';
  edu_a uuid := '33333333-3333-3333-3333-333333333302';
  edu_bsc uuid := '33333333-3333-3333-3333-333333333303';
  exp_attach uuid := '44444444-4444-4444-4444-444444444401';
  exp_intern uuid := '44444444-4444-4444-4444-444444444402';
  exp_ft uuid := '44444444-4444-4444-4444-444444444403';
  letter_id uuid := '55555555-5555-5555-5555-555555555501';
begin
  -- Demo auth users (local Supabase Auth schema)
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
  values
    (
      '00000000-0000-0000-0000-000000000000',
      demo_user_id,
      'authenticated',
      'authenticated',
      'demo.candidate@vitatepro.test',
      crypt('DemoPass123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Tanaka Moyo","first_name":"Tanaka","last_name":"Moyo"}'::jsonb,
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      other_user_id,
      'authenticated',
      'authenticated',
      'other.user@vitatepro.test',
      crypt('DemoPass123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Other User","first_name":"Other","last_name":"User"}'::jsonb,
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      ''
    )
  on conflict (id) do nothing;

  -- Profiles (trigger may already create rows — upsert details)
  insert into public.profiles (
    id, first_name, last_name, professional_title, email, phone, location, country,
    linkedin_url, portfolio_url, github_url, career_level, industry,
    years_of_experience, employment_status, preferred_language,
    profile_completion, onboarding_completed
  )
  values
    (
      demo_user_id, 'Tanaka', 'Moyo', 'Junior Software Developer',
      'demo.candidate@vitatepro.test', '+263 77 000 0000', 'Harare, Zimbabwe', 'ZW',
      'https://linkedin.com/in/tanaka-moyo-demo', 'https://tanaka.demo.dev',
      'https://github.com/tanaka-demo', 'junior', 'Technology', 2, 'seeking', 'en',
      82, true
    ),
    (
      other_user_id, 'Other', 'User', 'Designer',
      'other.user@vitatepro.test', null, 'Bulawayo, Zimbabwe', 'ZW',
      null, null, null, 'mid-level', 'Design', 4, 'employed', 'en', 40, true
    )
  on conflict (id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    professional_title = excluded.professional_title,
    country = excluded.country,
    profile_completion = excluded.profile_completion,
    onboarding_completed = excluded.onboarding_completed;

  -- Templates
  insert into public.templates (
    id, slug, name, description, category, ats_compatible, is_free, is_premium,
    is_active, is_featured, editor_style, sort_order, metadata
  )
  values
    (tpl_modern, 'modern', 'Modern', 'Clean layout with measured whitespace for product and tech roles.', 'Modern', true, true, false, true, true, 'modern', 1, '{"accent":"emerald"}'::jsonb),
    (tpl_exec, 'executive', 'Executive', 'Structured columns suited to leadership and consulting.', 'Corporate', true, false, true, true, false, 'executive', 2, '{}'::jsonb),
    (tpl_minimal, 'minimal', 'Minimal', 'Single-column layout with crisp mono score treatment.', 'Minimal', true, true, false, true, false, 'minimal', 3, '{}'::jsonb),
    (tpl_creative, 'creative', 'Creative', 'Editorial layout with accent rules for design roles.', 'Creative', false, false, true, true, true, 'creative', 4, '{}'::jsonb),
    (tpl_folio, 'folio', 'Folio', 'Compact density for engineering and PM CVs.', 'Tech', true, true, false, true, false, 'professional', 5, '{}'::jsonb)
  on conflict (id) do nothing;

  update public.user_preferences
  set default_template_id = tpl_modern,
      writing_style = 'professional',
      ai_assistance_level = 'balanced',
      theme = 'system',
      default_language = 'en'
  where user_id = demo_user_id;

  -- Demo CV
  insert into public.cvs (
    id, user_id, title, template_id, status, target_role, target_industry,
    language, is_default, score, completion
  )
  values (
    cv_id, demo_user_id, 'Junior Software Developer — Harare',
    tpl_modern, 'draft', 'Junior Software Developer', 'Technology',
    'en', true, 86, 78
  )
  on conflict (id) do nothing;

  insert into public.cv_personal_info (
    cv_id, full_name, professional_title, email, phone, location, linkedin, portfolio
  )
  values (
    cv_id, 'Tanaka Moyo', 'Junior Software Developer',
    'demo.candidate@vitatepro.test', '+263 77 000 0000', 'Harare, Zimbabwe',
    'https://linkedin.com/in/tanaka-moyo-demo', 'https://tanaka.demo.dev'
  )
  on conflict (cv_id) do nothing;

  insert into public.cv_summaries (cv_id, content)
  values (
    cv_id,
    'Junior software developer with industrial attachment and internship experience building reliable web tools for Zimbabwean teams. Comfortable with TypeScript, PostgreSQL, and clear communication with supervisors and stakeholders.'
  )
  on conflict (cv_id) do nothing;

  insert into public.cv_sections (cv_id, section_type, title, sort_order, is_visible)
  values
    (cv_id, 'personal', 'Personal Information', 0, true),
    (cv_id, 'summary', 'Professional Summary', 1, true),
    (cv_id, 'experience', 'Work Experience', 2, true),
    (cv_id, 'education', 'Education', 3, true),
    (cv_id, 'skills', 'Skills', 4, true),
    (cv_id, 'projects', 'Projects', 5, true),
    (cv_id, 'certifications', 'Certifications', 6, true),
    (cv_id, 'languages', 'Languages', 7, true),
    (cv_id, 'achievements', 'Achievements', 8, true),
    (cv_id, 'references', 'References', 9, false)
  on conflict (cv_id, section_type) do nothing;

  -- O Level (ZIMSEC)
  insert into public.educations (
    id, cv_id, qualification_type, examination_board, school_name,
    year_completed, candidate_number, location, sort_order
  )
  values (
    edu_o, cv_id, 'o_level', 'zimsec', 'Mufakose High 1',
    '2018', 'OL-DEMO-001', 'Harare, Zimbabwe', 0
  )
  on conflict (id) do nothing;

  insert into public.education_subjects (education_id, subject_name, grade, sort_order)
  values
    (edu_o, 'English Language', 'A', 0),
    (edu_o, 'Mathematics', 'A', 1),
    (edu_o, 'Combined Science', 'B', 2),
    (edu_o, 'History', 'B', 3),
    (edu_o, 'Geography', 'C', 4),
    (edu_o, 'Shona', 'A', 5),
    (edu_o, 'Commerce', 'B', 6),
    (edu_o, 'Computer Science', 'A', 7);

  -- A Level (ZIMSEC)
  insert into public.educations (
    id, cv_id, qualification_type, examination_board, school_name,
    year_completed, candidate_number, location, sort_order
  )
  values (
    edu_a, cv_id, 'a_level', 'zimsec', 'St. George''s College',
    '2020', 'AL-DEMO-002', 'Harare, Zimbabwe', 1
  )
  on conflict (id) do nothing;

  insert into public.education_subjects (education_id, subject_name, grade, sort_order)
  values
    (edu_a, 'Mathematics', 'A', 0),
    (edu_a, 'Physics', 'B', 1),
    (edu_a, 'Computer Science', 'A', 2);

  -- Tertiary
  insert into public.educations (
    id, cv_id, qualification_type, institution, qualification, field_of_study,
    start_date, end_date, completion_year, grade, description, sort_order
  )
  values (
    edu_bsc, cv_id, 'bachelors', 'University of Zimbabwe',
    'BSc Honours', 'Computer Science',
    '2021-02-01', '2024-11-30', '2024', '2.1',
    'Capstone focused on accessible career tools for Southern African graduates.',
    2
  )
  on conflict (id) do nothing;

  -- Industrial Attachment — 8 Months (duration mode, no fake end-date required)
  insert into public.work_experiences (
    id, cv_id, experience_type, company_name, department, job_title, location,
    date_mode, duration_text, is_current,
    supervisor_name, supervisor_position, supervisor_email, supervisor_phone,
    include_supervisor_on_export, sort_order
  )
  values (
    exp_attach, cv_id, 'industrial_attachment', 'Econet Wireless Zimbabwe',
    'Digital Products', 'Software Development Attaché', 'Harare, Zimbabwe',
    'duration', '8 Months', false,
    'Chiedza Ndlovu', 'Engineering Lead', 'chiedza.ndlovu@econet.demo',
    '+263 71 000 1111', true, 0
  )
  on conflict (id) do nothing;

  insert into public.experience_bullets (experience_id, bullet_type, content, sort_order)
  values
    (exp_attach, 'responsibility', 'Supported maintenance of customer-facing web dashboards used by field teams.', 0),
    (exp_attach, 'responsibility', 'Wrote integration tests for payment notification webhooks.', 1),
    (exp_attach, 'skill_gained', 'Learned Git branching workflows and code review etiquette.', 2),
    (exp_attach, 'achievement', 'Reduced recurring triage tickets by documenting a troubleshooting runbook.', 3);

  -- Internship
  insert into public.work_experiences (
    id, cv_id, experience_type, company_name, department, job_title, location,
    date_mode, start_month, start_year, end_month, end_year, is_current, sort_order
  )
  values (
    exp_intern, cv_id, 'internship', 'Uncommon.org', 'Engineering',
    'Software Engineering Intern', 'Harare, Zimbabwe',
    'range', '01', '2024', '04', '2024', false, 1
  )
  on conflict (id) do nothing;

  insert into public.experience_bullets (experience_id, bullet_type, content, sort_order)
  values
    (exp_intern, 'responsibility', 'Built React components for learner progress tracking.', 0),
    (exp_intern, 'achievement', 'Shipped an accessibility pass that improved keyboard navigation on core pages.', 1);

  -- Full-time
  insert into public.work_experiences (
    id, cv_id, experience_type, company_name, job_title, location,
    date_mode, start_month, start_year, is_current, sort_order
  )
  values (
    exp_ft, cv_id, 'full_time', 'Nexlify Labs', 'Junior Software Developer',
    'Harare, Zimbabwe', 'range', '06', '2024', true, 2
  )
  on conflict (id) do nothing;

  insert into public.experience_bullets (experience_id, bullet_type, content, sort_order)
  values
    (exp_ft, 'responsibility', 'Develop features for an ATS-friendly CV editor using TypeScript and Next.js.', 0),
    (exp_ft, 'achievement', 'Improved PDF export reliability for multi-page CVs.', 1);

  -- Skills
  insert into public.skills (cv_id, name, category, proficiency_level, sort_order)
  values
    (cv_id, 'TypeScript', 'technical', 4, 0),
    (cv_id, 'PostgreSQL', 'technical', 3, 1),
    (cv_id, 'React', 'framework', 4, 2),
    (cv_id, 'Next.js', 'framework', 3, 3),
    (cv_id, 'Git', 'tool', 4, 4),
    (cv_id, 'Communication', 'soft_skill', 4, 5),
    (cv_id, 'English', 'language', 5, 6),
    (cv_id, 'Shona', 'language', 5, 7);

  -- Projects
  insert into public.projects (
    cv_id, project_name, description, technologies, project_url, repository_url, sort_order
  )
  values
    (
      cv_id, 'Campus Events Board',
      'Lightweight event board for student societies with moderation tools.',
      array['TypeScript', 'Next.js', 'Supabase'],
      'https://events.demo.vitatepro.test',
      'https://github.com/tanaka-demo/campus-events',
      0
    ),
    (
      cv_id, 'Attachment Logbook',
      'Digital logbook for industrial attachment hours and supervisor comments.',
      array['React', 'PostgreSQL'],
      null,
      'https://github.com/tanaka-demo/attachment-logbook',
      1
    );

  insert into public.certifications (
    cv_id, certification_name, issuing_organization, issue_date, credential_id, sort_order
  )
  values (
    cv_id, 'Meta Front-End Developer Certificate', 'Coursera / Meta',
    '2023-08-01', 'META-FE-DEMO', 0
  );

  insert into public.languages (cv_id, language, proficiency, sort_order)
  values
    (cv_id, 'English', 'Fluent', 0),
    (cv_id, 'Shona', 'Native', 1);

  insert into public.achievements (cv_id, title, description, sort_order)
  values (
    cv_id,
    'Dean''s List — Faculty of Science',
    'Recognized for academic performance during the 2023 academic year.',
    0
  );

  insert into public.cv_versions (cv_id, version_number, label, note, snapshot, created_by)
  values (
    cv_id, 1, 'Initial draft', 'Seed snapshot',
    jsonb_build_object('title', 'Junior Software Developer — Harare', 'version', 1),
    demo_user_id
  )
  on conflict (cv_id, version_number) do nothing;

  -- Cover letter
  insert into public.cover_letters (
    id, user_id, cv_id, template_id, title, company_name, job_title,
    hiring_manager, tone, length, application_status, status, score, content
  )
  values (
    letter_id, demo_user_id, cv_id, tpl_modern,
    'Nexlify — Junior Software Developer',
    'Nexlify Labs', 'Junior Software Developer', 'Hiring Manager',
    'professional', 'medium', 'applied', 'completed', 88,
    jsonb_build_object(
      'headerName', 'Tanaka Moyo',
      'headerMeta', 'Harare · demo.candidate@vitatepro.test',
      'greeting', 'Dear Hiring Manager,',
      'opening', 'I am writing to express my interest in the Junior Software Developer role at Nexlify Labs.',
      'experience', 'During my industrial attachment at Econet Wireless Zimbabwe, I contributed to reliable web tooling used by field teams.',
      'skills', 'I bring TypeScript, React, and PostgreSQL experience with a focus on clear documentation.',
      'closing', 'Thank you for your time and consideration.',
      'signature', 'Tanaka Moyo'
    )
  )
  on conflict (id) do nothing;

  insert into public.notifications (user_id, type, title, message, is_read)
  values
    (demo_user_id, 'tip', 'Lead with outcomes', 'Start bullets with verbs and end with measurable results.', false),
    (demo_user_id, 'success', 'Demo CV ready', 'Your seeded Junior Software Developer CV is ready to edit.', true);

  insert into public.ai_usage (
    user_id, period_start, period_end, generation_count, input_tokens, output_tokens
  )
  values (
    demo_user_id,
    date_trunc('month', current_date)::date,
    (date_trunc('month', current_date) + interval '1 month - 1 day')::date,
    3, 1200, 900
  )
  on conflict (user_id, period_start, period_end) do nothing;

  -- Isolation fixture: other user has a private CV User A must not see
  insert into public.cvs (id, user_id, title, status, is_default)
  values (
    '22222222-2222-2222-2222-222222222299',
    other_user_id,
    'OTHER USER PRIVATE CV',
    'draft',
    true
  )
  on conflict (id) do nothing;

end $$;
