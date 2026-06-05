create table public.faqs(
  id         uuid primary key default uuid_generate_v4(),
  question   text not null,
  answer     text not null,
  position   smallint not null default 0,
  created_at timestamptz not null default now()
)

alter table public.faqs enable row level security;

create policy "Public can view faqs"
  on public.faqs for select
  using (true);

create policy "Admins have full access to faqs"
  on public.faqs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed
insert into public.faqs (question, answer, position) values
(
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  0
),
(
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  1
),
(
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  2
),
(
  'How do I finance a car through Japex Motors?',
  'We offer flexible finance options through our trusted lending partners. Simply browse our inventory, select a car, and use our finance calculator to get an instant estimate. Our team will guide you through the rest.',
  3
),
(
  'Can I trade in my current vehicle?',
  'Yes! We accept trade-ins on most vehicles. Bring your car in for a free appraisal and we will give you a competitive offer that can be applied toward your next purchase.',
  4
),
(
  'Do the cars come with a warranty?',
  'All vehicles come with a minimum 3-month warranty covering major mechanical components. Extended warranty options are also available at the time of purchase.',
  5
);