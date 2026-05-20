-- MYDAY2 DATABASE SCHEMA
-- Copy and paste this script into the Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE
create table if not exists public.users (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    email text not null,
    avatar text,
    timezone text default 'UTC',
    onboarding_data jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Users
alter table public.users enable row level security;

create policy "Users can view own profile" on public.users 
    for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users 
    for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users 
    for insert with check (auth.uid() = id);

-- 2. GOALS TABLE
create table if not exists public.goals (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    description text,
    timeline text,
    milestones text[] default '{}'::text[],
    progress integer default 0,
    category text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;

create policy "Users can manage own goals" on public.goals
    for all using (auth.uid() = user_id);

-- 3. TASKS TABLE
create table if not exists public.tasks (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    description text,
    priority text default 'Medium'::text,
    status text default 'Pending'::text,
    due_date date,
    start_time text, -- e.g. "09:00"
    end_time text,   -- e.g. "10:00"
    estimated_duration integer, -- in minutes
    recurrence text, -- e.g. "DAILY", "WEEKLY"
    tags text[] default '{}'::text[],
    linked_goal_id uuid references public.goals(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;

create policy "Users can manage own tasks" on public.tasks
    for all using (auth.uid() = user_id);

-- 4. HABITS TABLE
create table if not exists public.habits (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    frequency text default 'Daily'::text,
    streak integer default 0,
    reminder_time text, -- e.g. "08:00"
    consistency_score integer default 0,
    category text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.habits enable row level security;

create policy "Users can manage own habits" on public.habits
    for all using (auth.uid() = user_id);

-- 5. HABIT_COMPLETIONS TABLE
create table if not exists public.habit_completions (
    id uuid default gen_random_uuid() primary key,
    habit_id uuid references public.habits(id) on delete cascade not null,
    completion_date date not null,
    status text default 'Completed'::text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(habit_id, completion_date)
);

alter table public.habit_completions enable row level security;

create policy "Users can manage own habit completions" on public.habit_completions
    for all using (
        exists (
            select 1 from public.habits 
            where public.habits.id = public.habit_completions.habit_id 
            and public.habits.user_id = auth.uid()
        )
    );

-- 6. CALENDAR_EVENTS TABLE
create table if not exists public.calendar_events (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    recurrence text,
    linked_task_id uuid references public.tasks(id) on delete set null,
    linked_goal_id uuid references public.goals(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.calendar_events enable row level security;

create policy "Users can manage own events" on public.calendar_events
    for all using (auth.uid() = user_id);

-- 7. REMINDERS TABLE
create table if not exists public.reminders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    reminder_type text not null, -- e.g. "task", "habit", "general"
    trigger_time timestamp with time zone not null,
    linked_item_id uuid not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reminders enable row level security;

create policy "Users can manage own reminders" on public.reminders
    for all using (auth.uid() = user_id);

-- 8. AI_INSIGHTS TABLE
create table if not exists public.ai_insights (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    type text not null, -- e.g. "weekly_review", "recommendations", "burnout_alert"
    generated_text text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_insights enable row level security;

create policy "Users can view own insights" on public.ai_insights
    for all using (auth.uid() = user_id);

-- ENABLE REALTIME REPLICATION FOR LIVE SYNC
begin;
    -- remove publication if exists
    drop publication if exists supabase_realtime;
    
    -- create publication
    create publication supabase_realtime;
commit;

-- Add tables to realtime replication publication
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habit_completions;
alter publication supabase_realtime add table public.goals;
alter publication supabase_realtime add table public.calendar_events;
alter publication supabase_realtime add table public.reminders;
alter publication supabase_realtime add table public.ai_insights;

-- TRIGGER TO CREATE public.users PROFILE ON auth.users SIGNUP
create or replace function public.handle_new_user() 
returns trigger as $$
begin
    insert into public.users (id, name, email, avatar, timezone, onboarding_data)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', 'Explorer'),
        new.email,
        new.raw_user_meta_data->>'avatar_url',
        'UTC',
        '{}'::jsonb
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
