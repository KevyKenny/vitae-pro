-- Phase 9D: Cover letter template_key + user template customizations + gallery seeds

alter table public.cover_letters
  add column if not exists template_key text not null default 'professional';

comment on column public.cover_letters.template_key is
  'Letter editor style key: professional | modern | executive | minimal | creative';

-- -----------------------------------------------------------------------------
-- User template customizations
-- -----------------------------------------------------------------------------
create table if not exists public.user_template_customizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  template_id uuid references public.templates (id) on delete set null,
  template_slug text,
  name text not null default 'Saved customization',
  customization jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists user_template_customizations_user_slug_key
  on public.user_template_customizations (user_id, template_slug)
  where template_slug is not null;

create index if not exists idx_user_template_customizations_user_id
  on public.user_template_customizations (user_id, updated_at desc);

create trigger user_template_customizations_set_updated_at
before update on public.user_template_customizations
for each row execute function public.set_updated_at();

alter table public.user_template_customizations enable row level security;

create policy "user_template_customizations_select_own"
  on public.user_template_customizations for select
  to authenticated
  using (user_id = auth.uid());

create policy "user_template_customizations_insert_own"
  on public.user_template_customizations for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "user_template_customizations_update_own"
  on public.user_template_customizations for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "user_template_customizations_delete_own"
  on public.user_template_customizations for delete
  to authenticated
  using (user_id = auth.uid());

grant select, insert, update, delete
  on public.user_template_customizations
  to authenticated;

-- -----------------------------------------------------------------------------
-- Gallery template seeds (stable UUIDs; coexist with legacy modern/executive seeds)
-- -----------------------------------------------------------------------------
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
    '22222222-2222-4222-8222-000000000001',
    'tpl_meridian',
    'Meridian',
    'Clean serif headings with measured whitespace — ideal for product and senior IC roles.',
    'modern',
    true,
    true,
    false,
    true,
    true,
    'modern',
    10,
    '{"style":"modern","careerLevels":["mid-level","senior"],"industries":["technology","design","marketing"],"rating":4.9,"reviews":428,"popularity":98,"badges":["recommended","recruiter-favorite"],"accent":"#1F4D3D","previewAccent":"#1F4D3D","typography":"Fraunces headings · Inter body","layoutStyle":"Single column · airy rhythm","bestFor":["Product designers","PMs","Senior ICs"],"features":["Clear section headings","Skill chips","Metric-forward bullets"],"readability":94}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-000000000002',
    'tpl_ledger',
    'Ledger',
    'Structured columns suited to fintech, consulting, and formal corporate applications.',
    'professional',
    true,
    true,
    false,
    true,
    false,
    'professional',
    11,
    '{"style":"professional","careerLevels":["junior","mid-level","senior"],"industries":["finance","technology"],"rating":4.8,"reviews":312,"popularity":92,"badges":["popular"],"accent":"#B08D3E","previewAccent":"#B08D3E","typography":"Inter throughout · mono dates","layoutStyle":"Two column · dense clarity","bestFor":["Analysts","Consultants","Finance"],"features":["Strict section order","Date alignment","Low ornament"],"readability":91}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-000000000003',
    'tpl_bureau',
    'Bureau',
    'Bold hierarchy and confident whitespace for director and leadership resumes.',
    'executive',
    true,
    false,
    true,
    true,
    false,
    'executive',
    12,
    '{"style":"executive","careerLevels":["senior","executive"],"industries":["finance","healthcare","technology"],"rating":4.7,"reviews":198,"popularity":84,"badges":["premium","recommended"],"accent":"#1B1D1B","previewAccent":"#1B1D1B","typography":"Fraunces display · Inter body","layoutStyle":"Sidebar accent · executive rail","bestFor":["Directors","VPs","Founders"],"features":["Leadership summary","Board-ready density","Accent rail"],"readability":88}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-000000000004',
    'tpl_atelier',
    'Atelier',
    'Editorial layout with accent rules for design, brand, and creative portfolios.',
    'creative',
    false,
    false,
    true,
    true,
    false,
    'creative',
    13,
    '{"style":"creative","careerLevels":["junior","mid-level","senior"],"industries":["design","marketing"],"rating":4.6,"reviews":256,"popularity":88,"badges":["premium","popular"],"accent":"#2F7A5C","previewAccent":"#2F7A5C","typography":"Fraunces + generous leading","layoutStyle":"Single column · editorial rules","bestFor":["Designers","Brand leads","Creatives"],"features":["Project gallery feel","Gold accent bar","Portfolio links"],"readability":86}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-000000000005',
    'tpl_cordial',
    'Cordial',
    'Friendly modern layout that feels warm, approachable, and polished.',
    'modern',
    true,
    true,
    false,
    true,
    false,
    'modern',
    14,
    '{"style":"modern","careerLevels":["graduate","junior","mid-level"],"industries":["healthcare","marketing","technology"],"rating":4.8,"reviews":189,"popularity":79,"badges":["free"],"accent":"#3E6B5C","previewAccent":"#3E6B5C","typography":"Inter headings · soft hierarchy","layoutStyle":"Single column · balanced","bestFor":["Client-facing roles","Ops","CS"],"features":["Soft section labels","Compact skills","Clear hierarchy"],"readability":93}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-000000000006',
    'tpl_foundry',
    'Foundry',
    'Serious executive presence with restrained ornament and strong typographic scale.',
    'executive',
    true,
    false,
    true,
    true,
    false,
    'executive',
    15,
    '{"style":"executive","careerLevels":["senior","executive"],"industries":["engineering","finance","technology"],"rating":4.5,"reviews":141,"popularity":71,"badges":["premium"],"accent":"#4A4238","previewAccent":"#4A4238","typography":"Merriweather-inspired scale","layoutStyle":"Two column · leadership","bestFor":["Engineering leaders","Ops executives"],"features":["Impact first","Sparse color","Print-ready"],"readability":87}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-000000000007',
    'tpl_halcyon',
    'Halcyon',
    'Minimal single-column resume with a clear, recruiter-friendly hierarchy.',
    'minimal',
    true,
    true,
    false,
    true,
    true,
    'minimal',
    16,
    '{"style":"minimal","careerLevels":["student","graduate","junior","mid-level"],"industries":["technology","engineering","healthcare"],"rating":4.9,"reviews":502,"popularity":95,"badges":["recruiter-favorite","free"],"accent":"#6B7A63","previewAccent":"#6B7A63","typography":"Inter · maximal clarity","layoutStyle":"Single column · focused","bestFor":["Early-career professionals"],"features":["Focused layout","Clear headings","Easy scanning"],"readability":97}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-000000000008',
    'tpl_marquee',
    'Marquee',
    'Creative spotlight layout for marketers and storytellers who still need structure.',
    'creative',
    false,
    false,
    true,
    true,
    false,
    'creative',
    17,
    '{"style":"creative","careerLevels":["mid-level","senior"],"industries":["marketing","design"],"rating":4.4,"reviews":167,"popularity":76,"badges":["popular","premium"],"accent":"#B5562B","previewAccent":"#B5562B","typography":"Display headers · Inter body","layoutStyle":"Sidebar layout · accent wash","bestFor":["Marketers","Content leads"],"features":["Campaign highlights","Bold intro","Link row"],"readability":84}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-000000000009',
    'tpl_vantage',
    'Vantage',
    'Modern tech-forward CV with clean skills taxonomy and project emphasis.',
    'modern',
    true,
    true,
    false,
    true,
    false,
    'modern',
    18,
    '{"style":"modern","careerLevels":["junior","mid-level","senior"],"industries":["technology","engineering"],"rating":4.7,"reviews":274,"popularity":90,"badges":["recommended"],"accent":"#2F7A5C","previewAccent":"#2F7A5C","typography":"Sans stack · mono accents","layoutStyle":"Two column · skills rail","bestFor":["Engineers","Product","Data"],"features":["Skills taxonomy","Project block","GitHub-ready"],"readability":92}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-00000000000a',
    'tpl_printrow',
    'Print Row',
    'Classic executive print layout with hairline rules and boardroom calm.',
    'executive',
    true,
    false,
    true,
    true,
    false,
    'executive',
    19,
    '{"style":"executive","careerLevels":["executive","senior"],"industries":["finance","healthcare"],"rating":4.6,"reviews":120,"popularity":68,"badges":["premium","recommended"],"accent":"#3D3A2E","previewAccent":"#3D3A2E","typography":"Serif display · restrained body","layoutStyle":"Single column · print rules","bestFor":["C-suite","Board nominations"],"features":["Print margins","Hat tips to classic CVs"],"readability":89}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-00000000000b',
    'tpl_kiln',
    'Kiln',
    'Warm creative system for design leads who want craft without chaos.',
    'creative',
    false,
    false,
    true,
    true,
    false,
    'creative',
    20,
    '{"style":"creative","careerLevels":["mid-level","senior"],"industries":["design"],"rating":4.5,"reviews":98,"popularity":64,"badges":["premium"],"accent":"#A8622E","previewAccent":"#A8622E","typography":"Warm serif headings","layoutStyle":"Sidebar · craft accent","bestFor":["Design managers","Brand"],"features":["Case study stubs","Palette cue"],"readability":85}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-00000000000c',
    'tpl_overleaf',
    'Overleaf',
    'Academic-leaning minimal template for research, graduate, and teaching applications.',
    'academic',
    true,
    true,
    false,
    true,
    false,
    'minimal',
    21,
    '{"style":"academic","careerLevels":["student","graduate","junior"],"industries":["healthcare","engineering","technology"],"rating":4.8,"reviews":210,"popularity":73,"badges":["free"],"accent":"#4E6E5D","previewAccent":"#4E6E5D","typography":"Classic academic stack","layoutStyle":"Single column · publications-ready","bestFor":["Graduates","Researchers","Clinicians"],"features":["Publications block cue","Clean degrees","Clear structure"],"readability":95}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-00000000000d',
    'tpl_folio',
    'Folio',
    'Single-column professional layout with crisp mono metadata treatment.',
    'minimal',
    true,
    true,
    false,
    true,
    false,
    'minimal',
    22,
    '{"style":"minimal","careerLevels":["graduate","junior","mid-level"],"industries":["technology","engineering","marketing"],"rating":4.7,"reviews":330,"popularity":86,"badges":["free","popular"],"accent":"#1F4D3D","previewAccent":"#1F4D3D","typography":"Inter · IBM Plex Mono meta","layoutStyle":"Single column · crisp","bestFor":["General tech applications"],"features":["Mono dates","Minimal visual treatment"],"readability":96}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-00000000000e',
    'tpl_signal',
    'Signal',
    'Compact density for engineering and product management CVs.',
    'professional',
    true,
    false,
    true,
    true,
    false,
    'professional',
    23,
    '{"style":"professional","careerLevels":["mid-level","senior"],"industries":["technology","engineering"],"rating":4.6,"reviews":188,"popularity":81,"badges":["premium","recommended"],"accent":"#2F7A5C","previewAccent":"#2F7A5C","typography":"Dense Inter · sharp labels","layoutStyle":"Two column · compact","bestFor":["PMs","Engineers","Tech leads"],"features":["High density","Bullet-focused achievements","Role-specific keywords"],"readability":90}'::jsonb
  )
on conflict (slug) do nothing;
