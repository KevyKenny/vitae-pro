-- Replace placeholder gallery templates with seven reference CV templates

update public.templates
set is_active = false
where slug like 'tpl_%'
  and slug not in (
    'tpl_default',
    'tpl_0',
    'tpl_1',
    'tpl_2',
    'tpl_3',
    'tpl_4',
    'tpl_5'
  );

insert into public.templates (
  id,
  slug,
  name,
  description,
  category,
  ats_compatible,
  is_free,
  is_premium,
  is_active,
  is_featured,
  editor_style,
  sort_order,
  metadata
)
values
  (
    '33333333-3333-4333-8333-000000000000',
    'tpl_default',
    'Classic Sidebar',
    'Blue sidebar with grouped skills — reference template-default.',
    'modern',
    true,
    true,
    false,
    true,
    true,
    'modern',
    1,
    '{"renderer_key":"tpl_default","reference_pdf":"template-default.pdf","layoutFamily":"sidebar"}'::jsonb
  ),
  (
    '33333333-3333-4333-8333-000000000001',
    'tpl_0',
    'Classic Sidebar (Plain)',
    'Sidebar layout without icons — reference template-0.',
    'modern',
    true,
    true,
    false,
    true,
    false,
    'modern',
    2,
    '{"renderer_key":"tpl_0","reference_pdf":"template-0.pdf","layoutFamily":"sidebar"}'::jsonb
  ),
  (
    '33333333-3333-4333-8333-000000000002',
    'tpl_1',
    'Professional',
    'Single column with icon contact header — reference template-1.',
    'professional',
    true,
    true,
    false,
    true,
    false,
    'modern',
    3,
    '{"renderer_key":"tpl_1","reference_pdf":"template-1.pdf","layoutFamily":"single-column"}'::jsonb
  ),
  (
    '33333333-3333-4333-8333-000000000003',
    'tpl_2',
    'Modern Single',
    'Single column Poppins layout — reference template-2.',
    'modern',
    true,
    true,
    false,
    true,
    false,
    'modern',
    4,
    '{"renderer_key":"tpl_2","reference_pdf":"template-2.pdf","layoutFamily":"single-column"}'::jsonb
  ),
  (
    '33333333-3333-4333-8333-000000000004',
    'tpl_3',
    'Resume Form',
    'Formal two-column resume — reference template-3.',
    'professional',
    true,
    true,
    false,
    true,
    false,
    'modern',
    5,
    '{"renderer_key":"tpl_3","reference_pdf":"template-3.pdf","layoutFamily":"form-two-column"}'::jsonb
  ),
  (
    '33333333-3333-4333-8333-000000000005',
    'tpl_4',
    'Red Sidebar',
    'Red-accent sidebar — reference template-4.',
    'executive',
    true,
    true,
    false,
    true,
    false,
    'modern',
    6,
    '{"renderer_key":"tpl_4","reference_pdf":"template-4.pdf","layoutFamily":"sidebar"}'::jsonb
  ),
  (
    '33333333-3333-4333-8333-000000000006',
    'tpl_5',
    'Resume Form (Compact)',
    'Compact formal resume — reference template-5.',
    'professional',
    true,
    true,
    false,
    true,
    false,
    'modern',
    7,
    '{"renderer_key":"tpl_5","reference_pdf":"template-5.pdf","layoutFamily":"form-two-column"}'::jsonb
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  is_active = true,
  is_featured = excluded.is_featured,
  editor_style = excluded.editor_style,
  sort_order = excluded.sort_order,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now());

-- Map existing CVs on legacy template keys to default reference template
update public.cvs
set template_key = 'tpl_default'
where template_key is null
   or template_key in ('modern', 'professional', 'executive', 'minimal', 'creative');
