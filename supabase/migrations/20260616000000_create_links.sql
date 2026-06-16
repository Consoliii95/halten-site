-- Linktree próprio da Halten: links gerenciáveis pelo admin, exibidos em /links

create table if not exists links (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text,
  url text,
  icon text default 'link',
  icon_url text,
  position integer default 0,
  clicks integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create index if not exists links_position_idx on links (position asc);

alter table links enable row level security;

create policy "public read active links"
  on links for select
  using (active = true);

create policy "authenticated manage links"
  on links for all
  using (auth.role() = 'authenticated');

-- Incremento atômico de cliques (chamado pela rota pública /links/go/[id])
create or replace function increment_link_clicks(link_id uuid)
returns void
language sql
as $$
  update links set clicks = clicks + 1 where id = link_id;
$$;
