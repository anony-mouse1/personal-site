-- Newsletter subscribers for fatimahs.guide
-- Paste this whole file into the Supabase SQL Editor and hit Run.
-- Safe to run more than once.

create table if not exists public.subscribers (
  id         bigint generated always as identity primary key,
  email      text        not null unique,
  source     text        not null default 'home',
  created_at timestamptz not null default now()
);

-- Row Level Security on, with zero policies, means no one can read this table
-- through the public API. The signup route uses the service role key, which
-- bypasses RLS — so writes still work, but a leaked anon key exposes nothing.
alter table public.subscribers enable row level security;

-- Newest signups first when you browse the table.
create index if not exists subscribers_created_at_idx
  on public.subscribers (created_at desc);
