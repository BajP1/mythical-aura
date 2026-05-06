
-- Recreate bookings table (with all fields used by the app) and add blocked_slots

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  email text not null,
  players integer not null,
  cabin integer not null,
  games text[] not null default '{}',
  date date not null,
  time text not null,
  duration integer not null,
  phone text,
  total_price integer not null default 0,
  payment_status text default 'pending',
  payment_method text default 'pay_on_desk',
  played_status boolean default false,
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

-- Users can view their own bookings; admin can view all
drop policy if exists "Users view own bookings" on public.bookings;
create policy "Users view own bookings"
  on public.bookings for select
  to authenticated
  using (
    auth.uid() = user_id
    or auth.jwt() ->> 'email' = 'mythicalgamingstation@gmail.com'
  );

-- Authenticated users can create bookings for themselves
drop policy if exists "Users create own bookings" on public.bookings;
create policy "Users create own bookings"
  on public.bookings for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Admin (or owner) can update bookings (e.g., played_status)
drop policy if exists "Admin or owner can update bookings" on public.bookings;
create policy "Admin or owner can update bookings"
  on public.bookings for update
  to authenticated
  using (
    auth.uid() = user_id
    or auth.jwt() ->> 'email' = 'mythicalgamingstation@gmail.com'
  )
  with check (
    auth.uid() = user_id
    or auth.jwt() ->> 'email' = 'mythicalgamingstation@gmail.com'
  );

-- Blocked slots: admin manually blocks specific date+time combinations
create table if not exists public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time text not null,
  created_at timestamptz not null default now(),
  unique (date, time)
);

alter table public.blocked_slots enable row level security;

-- Anyone can read blocked slots (needed by booking page for guests too)
drop policy if exists "Blocked slots are publicly readable" on public.blocked_slots;
create policy "Blocked slots are publicly readable"
  on public.blocked_slots for select
  using (true);

-- Only admin email can insert
drop policy if exists "Admin can insert blocked slots" on public.blocked_slots;
create policy "Admin can insert blocked slots"
  on public.blocked_slots for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'mythicalgamingstation@gmail.com');

-- Only admin email can delete
drop policy if exists "Admin can delete blocked slots" on public.blocked_slots;
create policy "Admin can delete blocked slots"
  on public.blocked_slots for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'mythicalgamingstation@gmail.com');

-- Enable realtime on both tables
alter table public.bookings replica identity full;
alter table public.blocked_slots replica identity full;

do $$
begin
  begin
    execute 'alter publication supabase_realtime add table public.bookings';
  exception when duplicate_object then null;
  end;
  begin
    execute 'alter publication supabase_realtime add table public.blocked_slots';
  exception when duplicate_object then null;
  end;
end $$;
