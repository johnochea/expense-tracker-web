-- ============================================================================
-- The Council's Expense Tracker — Supabase schema
-- Run this in the Supabase Dashboard → SQL Editor (or via the CLI).
-- It is idempotent-ish: safe to re-run on a fresh project.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- profiles: one row per user, holds the editable "starting point" values for
-- Total Balance and Current Savings. Created automatically on signup.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  starting_balance  numeric(14, 2) not null default 0,
  starting_savings  numeric(14, 2) not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- transactions: every earning / expense / savings movement.
--   type      = 'earnings' | 'expenses' | 'savings'
--   category  = one of the allowed categories for that type (enforced below)
-- ---------------------------------------------------------------------------
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  type        text not null check (type in ('earnings', 'expenses', 'savings')),
  category    text not null,
  amount      numeric(14, 2) not null check (amount >= 0),
  description text,
  occurred_on date not null default current_date,
  created_at  timestamptz not null default now(),

  -- Make sure the category is valid for the chosen type.
  constraint valid_category_for_type check (
    (type = 'expenses' and category in
      ('Food','Bills Payment','Grocery','Tuition','Entertainment','Transportation','Travel','Others'))
    or (type = 'earnings' and category in
      ('Salary','Allowance','Scholarship','Business','Others'))
    or (type = 'savings' and category in
      ('Deposit','Interest'))
  )
);

create index if not exists transactions_user_date_idx
  on public.transactions (user_id, occurred_on desc);

-- ---------------------------------------------------------------------------
-- Row Level Security: each user can only see / touch their own rows.
-- ---------------------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "own profile - select" on public.profiles;
create policy "own profile - select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "own profile - update" on public.profiles;
create policy "own profile - update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own profile - insert" on public.profiles;
create policy "own profile - insert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "own transactions - all" on public.transactions;
create policy "own transactions - all" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
