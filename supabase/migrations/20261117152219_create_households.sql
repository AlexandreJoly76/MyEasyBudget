-- ─── Profils : un par compte utilisateur ───────────────────────────
-- auth.users est la table des comptes, gérée par Supabase Auth.
-- On y rattache nos propres infos (le nom affiché).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  created_at timestamptz not null default now()
);

-- ─── Foyers ────────────────────────────────────────────────────────
create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  reference_day smallint not null check (reference_day between 1 and 31),
  created_at timestamptz not null default now()
);

-- ─── Rôles possibles dans un foyer ─────────────────────────────────
create type public.member_role as enum ('manager', 'member');

-- ─── Membres : qui appartient à quel foyer, avec quel rôle ────────
create table public.members (
  -- user_id est la CLÉ PRIMAIRE : une personne n'apparaît qu'une fois,
  -- donc elle ne peut appartenir qu'à UN SEUL foyer (règle du cahier des charges).
  user_id uuid primary key references public.profiles (id) on delete cascade,
  household_id uuid not null references public.households (id) on delete cascade,
  role public.member_role not null default 'member',
  joined_at timestamptz not null default now()
);

-- Accélère la recherche « tous les membres du foyer X »
create index members_household_id_idx on public.members (household_id);

-- ─── Sécurité : on active RLS partout ──────────────────────────────
-- Sans aucune règle (policy), RLS INTERDIT TOUT par défaut.
-- On écrira les règles à l'étape suivante.
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.members enable row level security;