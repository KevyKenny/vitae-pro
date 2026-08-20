-- User-facing CV template display names only (slugs / IDs unchanged).

update public.templates set name = 'Default' where slug = 'tpl_default';
update public.templates set name = 'Contrast' where slug = 'tpl_0';
update public.templates set name = 'Compact' where slug = 'tpl_1';
update public.templates set name = 'Classic' where slug = 'tpl_2';
update public.templates set name = 'Formal' where slug = 'tpl_3';
update public.templates set name = 'Split' where slug = 'tpl_4';
update public.templates set name = 'Timeline' where slug = 'tpl_5';
