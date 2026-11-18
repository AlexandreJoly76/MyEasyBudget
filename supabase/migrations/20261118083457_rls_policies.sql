-- ============================================================
-- 1. Les « gardiens » : fonctions qui répondent sans passer par la RLS
-- ============================================================

-- Renvoie le foyer de la personne connectée (ou null si elle n'en a pas)
create function public.my_household_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select household_id from public.members where user_id = auth.uid()
$$;

-- Vrai si la personne connectée est gestionnaire de son foyer
create function public.is_manager()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.members
    where user_id = auth.uid() and role = 'manager'
  )
$$;

-- ============================================================
-- 2. Les règles (policies)
-- ============================================================

-- members : je vois les membres de MON foyer
create policy "members: lecture dans son foyer"
  on public.members for select
  to authenticated
  using (household_id = public.my_household_id());

-- households : je vois MON foyer
create policy "households: lecture de son foyer"
  on public.households for select
  to authenticated
  using (id = public.my_household_id());

-- households : seul le gestionnaire modifie le foyer (nom, jour de référence)
create policy "households: modification par le gestionnaire"
  on public.households for update
  to authenticated
  using (id = public.my_household_id() and public.is_manager())
  with check (id = public.my_household_id());

-- profiles : je vois mon profil + ceux des membres de mon foyer
create policy "profiles: lecture soi et son foyer"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or id in (
      select user_id from public.members
      where household_id = public.my_household_id()
    )
  );

-- profiles : je ne modifie que MON profil
create policy "profiles: modification de soi"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- 3. Création automatique du profil à l'inscription
-- ============================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(
      coalesce(
        nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
        split_part(new.email, '@', 1),
        'Membre'
      ),
      40
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();