-- Drop table if it exists
drop table if exists public.paper_analyses;

-- Create paper_analyses table
create table public.paper_analyses (
    id uuid default gen_random_uuid() primary key,
    paper_id text not null,
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    analysis jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups
create index paper_analyses_paper_id_user_id_idx on public.paper_analyses(paper_id, user_id);

-- Enable RLS
alter table public.paper_analyses enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Enable read access for users" on public.paper_analyses;
drop policy if exists "Enable insert access for users" on public.paper_analyses;
drop policy if exists "Enable update access for users" on public.paper_analyses;
drop policy if exists "Enable delete access for users" on public.paper_analyses;

-- Create a single policy that allows all operations for authenticated users
create policy "Enable all access for authenticated users"
    on public.paper_analyses
    for all
    using (auth.role() = 'authenticated' and auth.uid() = user_id)
    with check (auth.role() = 'authenticated' and auth.uid() = user_id);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.paper_analyses to anon, authenticated;
grant usage on all sequences in schema public to anon, authenticated;

-- Create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists set_updated_at on public.paper_analyses;
create trigger set_updated_at
    before update on public.paper_analyses
    for each row
    execute function public.handle_updated_at(); 