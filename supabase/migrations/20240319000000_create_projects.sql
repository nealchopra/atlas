-- Create projects table
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    title text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add project_id to paper_analyses
alter table public.paper_analyses 
    add column if not exists project_id uuid references public.projects;

-- Create updated_at function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create updated_at trigger for projects
create trigger handle_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

-- Enable RLS
alter table public.projects enable row level security;

-- Create policies
create policy "Users can view their own projects"
    on public.projects for select
    using (auth.uid() = user_id);

create policy "Users can create their own projects"
    on public.projects for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own projects"
    on public.projects for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own projects"
    on public.projects for delete
    using (auth.uid() = user_id);

-- Update paper_analyses policies to check project ownership
create policy "Users can view analyses in their projects"
    on public.paper_analyses for select
    using (
        project_id is null -- temporary until migration
        or 
        exists (
            select 1 from public.projects 
            where projects.id = paper_analyses.project_id 
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can create analyses in their projects"
    on public.paper_analyses for insert
    with check (
        project_id is null -- temporary until migration
        or 
        exists (
            select 1 from public.projects 
            where projects.id = paper_analyses.project_id 
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can update analyses in their projects"
    on public.paper_analyses for update
    using (
        project_id is null -- temporary until migration
        or 
        exists (
            select 1 from public.projects 
            where projects.id = paper_analyses.project_id 
            and projects.user_id = auth.uid()
        )
    )
    with check (
        project_id is null -- temporary until migration
        or 
        exists (
            select 1 from public.projects 
            where projects.id = paper_analyses.project_id 
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can delete analyses in their projects"
    on public.paper_analyses for delete
    using (
        project_id is null -- temporary until migration
        or 
        exists (
            select 1 from public.projects 
            where projects.id = paper_analyses.project_id 
            and projects.user_id = auth.uid()
        )
    );

-- Create indexes
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists paper_analyses_project_id_idx on public.paper_analyses(project_id); 