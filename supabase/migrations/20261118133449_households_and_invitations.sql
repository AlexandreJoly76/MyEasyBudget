-- ============================================================
-- 1. Table des invitations
-- ============================================================

create table public.invitations (
  code text primary key check (code ~ '^[A-Z0-9]{3}-[A-Z0-9]{3}$'),
  household_id uuid not null references public.households (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days'
);

alter table public.invitations enable row level security;

-- Seul le gestionnaire voit les codes de son foyer
create policy "invitations: lecture par le gestionnaire"
  on public.invitations for select
  to authenticated
  using (household_id = public.my_household_id() and public.is_manager());

-- ============================================================
-- 2. Créer un foyer (et en devenir gestionnaire)
-- ============================================================

create function public.create_household(p_name text, p_reference_day integer)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_household_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Tu dois être connecté.';
  end if;

  if exists (select 1 from public.members where user_id = auth.uid()) then
    raise exception 'Tu fais déjà partie d''un foyer.';
  end if;

  insert into public.households (name, reference_day)
  values (trim(p_name), p_reference_day)
  returning id into v_household_id;

  insert into public.members (user_id, household_id, role)
  values (auth.uid(), v_household_id, 'manager');

  return v_household_id;
end;
$$;

-- ============================================================
-- 3. Générer un code d'invitation (gestionnaire uniquement)
-- ============================================================

create function public.create_invitation()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  -- ni 0/O ni 1/I : trop faciles à confondre à l'oral
  v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code text;
begin
  if not public.is_manager() then
    raise exception 'Seul le gestionnaire peut inviter.';
  end if;

  loop
    v_code := '';
    for i in 1..6 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
      if i = 3 then
        v_code := v_code || '-';
      end if;
    end loop;
    -- on recommence dans le cas (très rare) où le code existe déjà
    exit when not exists (select 1 from public.invitations where code = v_code);
  end loop;

  insert into public.invitations (code, household_id, created_by)
  values (v_code, public.my_household_id(), auth.uid());

  return v_code;
end;
$$;

-- ============================================================
-- 4. Rejoindre un foyer avec un code
-- ============================================================

create function public.join_household(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_clean text;
  v_household_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Tu dois être connecté.';
  end if;

  if exists (select 1 from public.members where user_id = auth.uid()) then
    raise exception 'Tu fais déjà partie d''un foyer.';
  end if;

  -- "k7m 42q", "K7M42Q" ou "K7M-42Q" deviennent tous "K7M-42Q"
  v_clean := upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g'));
  v_clean := substr(v_clean, 1, 3) || '-' || substr(v_clean, 4, 3);

  select household_id into v_household_id
  from public.invitations
  where code = v_clean and expires_at > now();

  if v_household_id is null then
    raise exception 'Code d''invitation invalide ou expiré.';
  end if;

  insert into public.members (user_id, household_id, role)
  values (auth.uid(), v_household_id, 'member');

  return v_household_id;
end;
$$;

-- ============================================================
-- 5. Qui a le droit d'appeler ces fonctions ?
-- ============================================================

revoke execute on function public.create_household(text, integer) from public, anon;
revoke execute on function public.create_invitation() from public, anon;
revoke execute on function public.join_household(text) from public, anon;

grant execute on function public.create_household(text, integer) to authenticated;
grant execute on function public.create_invitation() to authenticated;
grant execute on function public.join_household(text) to authenticated;