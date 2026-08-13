-- =============================================================================
-- 0001 — Extensions, enums (as text + checks later), shared helpers
-- =============================================================================

create extension if not exists "pgcrypto" with schema extensions;

-- Keep uuid generation available on public for convenience.
create or replace function public.gen_uuid()
returns uuid
language sql
volatile
as $$
  select gen_random_uuid();
$$;

-- Shared updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Sets updated_at to UTC now() on row update.';
