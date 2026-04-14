-- Rename and update the table to match testimonials
create table public.testimonials (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  role        text not null default '',
  avatar_url  text not null default '',
  review      text not null,
  rating      smallint not null default 5 check (rating between 1 and 5),
  position    smallint not null default 0,
  is_published boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Index for ordered fetching
create index idx_testimonials_position on public.testimonials (position);

-- RLS
alter table public.testimonials enable row level security;

create policy "Public can view testimonials"
  on public.testimonials for select
  using (is_published = true);

create policy "Admins have full access to testimonials"
  on public.testimonials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed data
insert into public.testimonials (name, role, avatar_url, review, rating, position) values
(
  'Zoheb Ahmed', 'Car Buyer', '', 
  '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
  5, 0
),
(
  'Zoheb Ahmed', 'Car Buyer', '',
  '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
  5, 1
),
(
  'Zoheb Ahmed', 'Car Buyer', '',
  '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
  5, 2
),
(
  'Sarah Miller', 'First-time Buyer', '',
  '"The team made buying my first car stress-free. From finance to delivery, every step was handled professionally and with care."',
  5, 3
),
(
  'James Wu', 'Returning Customer', '',
  '"Third car I have bought from Japex Motors. The quality and service keeps me coming back. Highly recommend to anyone."',
  5, 4
),
(
  'Priya Sharma', 'SUV Buyer', '',
  '"Found exactly the RAV4 I wanted within my budget. The filter tools on the website made it so easy to narrow down options."',
  5, 5
);