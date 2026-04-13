-- ============================================================
-- JAPEX MOTORS — Supabase Database Schema
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── CARS TABLE ──────────────────────────────────────────────────────────────

create table public.cars (
  id               uuid primary key default uuid_generate_v4(),
  slug             text unique not null,

  -- Identification
  make             text not null,
  model            text not null,
  variant          text not null default '',
  year             smallint not null,

  -- Specs
  body_type        text not null,
  fuel_type        text not null,
  transmission     text not null,
  drive_type       text not null default 'FWD',
  engine           text not null default '',
  odometer_km      integer not null default 0,
  color_exterior   text not null default '',
  color_interior   text not null default '',
  seats            smallint not null default 5,
  doors            smallint not null default 4,
  rego             text not null default '',
  rego_expiry      date,

  -- Pricing
  price            integer not null,           -- stored in whole dollars
  was_price        integer,

  -- Content
  description      text not null default '',
  features         text[] not null default '{}',
  condition        text not null default 'Good',

  -- Status flags
  is_featured      boolean not null default false,
  is_sold          boolean not null default false,
  is_published     boolean not null default true,

  -- Timestamps
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cars_updated_at
  before update on public.cars
  for each row execute procedure public.handle_updated_at();

-- Indexes for fast filtering
create index idx_cars_make         on public.cars (make);
create index idx_cars_body_type    on public.cars (body_type);
create index idx_cars_price        on public.cars (price);
create index idx_cars_year         on public.cars (year);
create index idx_cars_is_published on public.cars (is_published);
create index idx_cars_is_featured  on public.cars (is_featured);

-- Full-text search index (make + model + variant + description)
alter table public.cars
  add column fts tsvector
    generated always as (
      to_tsvector('english',
        coalesce(make, '') || ' ' ||
        coalesce(model, '') || ' ' ||
        coalesce(variant, '') || ' ' ||
        coalesce(description, '')
      )
    ) stored;

create index idx_cars_fts on public.cars using gin(fts);


-- ─── CAR IMAGES TABLE ────────────────────────────────────────────────────────

create table public.car_images (
  id         uuid primary key default uuid_generate_v4(),
  car_id     uuid not null references public.cars(id) on delete cascade,
  url        text not null,
  alt        text not null default '',
  position   smallint not null default 0,
  created_at timestamptz not null default now()
);

create index idx_car_images_car_id on public.car_images (car_id, position);


-- ─── ENQUIRIES TABLE ─────────────────────────────────────────────────────────

create table public.enquiries (
  id         uuid primary key default uuid_generate_v4(),
  car_id     uuid references public.cars(id) on delete set null,
  name       text not null,
  email      text not null,
  phone      text not null default '',
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_enquiries_car_id  on public.enquiries (car_id);
create index idx_enquiries_is_read on public.enquiries (is_read);


-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────

-- Enable RLS on all tables
alter table public.cars        enable row level security;
alter table public.car_images  enable row level security;
alter table public.enquiries   enable row level security;

-- Public can READ published cars
create policy "Public can view published cars"
  on public.cars for select
  using (is_published = true);

-- Public can READ car images
create policy "Public can view car images"
  on public.car_images for select
  using (true);

-- Public can INSERT enquiries
create policy "Public can submit enquiries"
  on public.enquiries for insert
  with check (true);

-- Admins (authenticated users) can do everything
create policy "Admins have full access to cars"
  on public.cars for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admins have full access to images"
  on public.car_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admins have full access to enquiries"
  on public.enquiries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ─── STORAGE BUCKET ──────────────────────────────────────────────────────────

-- Run this in Supabase → Storage → Create bucket (or via SQL):
insert into storage.buckets (id, name, public)
  values ('car-images', 'car-images', true)
  on conflict do nothing;

-- Public can view car images
create policy "Public can view car images storage"
  on storage.objects for select
  using (bucket_id = 'car-images');

-- Only authenticated users can upload/delete
create policy "Admins can upload car images"
  on storage.objects for insert
  with check (bucket_id = 'car-images' and auth.role() = 'authenticated');

create policy "Admins can delete car images"
  on storage.objects for delete
  using (bucket_id = 'car-images' and auth.role() = 'authenticated');


-- ─── SEED DATA (optional demo listing) ──────────────────────────────────────

insert into public.cars (
  slug, make, model, variant, year,
  body_type, fuel_type, transmission, drive_type, engine,
  odometer_km, color_exterior, color_interior,
  seats, doors, rego, rego_expiry,
  price, was_price, description, features,
  is_featured, condition
) values

-- ── SEDANS ──────────────────────────────────────────────────────────────────
(
  '2022-toyota-camry-ascent-sport-hybrid',
  'Toyota', 'Camry', 'Ascent Sport Hybrid', 2022,
  'Sedan', 'Hybrid Petrol', 'Automatic', 'FWD', '2.5L 4-Cyl Hybrid',
  28000, 'White', 'Black',
  5, 4, 'CAM221', '2026-03-31',
  32990, 35990,
  'One-owner 2022 Toyota Camry Ascent Sport Hybrid in pristine condition. Full dealer service history, excellent fuel economy, and packed with safety tech.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Keyless Entry','Push Start','Leather Seats','Adaptive Cruise Control','Lane Departure Warning','Dual Zone Climate'],
  true, 'Excellent'
),
(
  '2020-honda-accord-sport',
  'Honda', 'Accord', 'Sport', 2020,
  'Sedan', 'Petrol', 'Automatic', 'FWD', '1.5L 4-Cyl Turbo',
  45000, 'Black', 'Black',
  5, 4, 'HON201', '2025-11-30',
  27990, null,
  'Sporty and refined 2020 Honda Accord Sport. Well maintained with log books. Honda Sensing safety suite included.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Heated Front Seats','Keyless Entry','Push Start','Lane Keep Assist'],
  false, 'Good'
),
(
  '2021-bmw-330i-m-sport',
  'BMW', '3 Series', '330i M Sport', 2021,
  'Sedan', 'Petrol', 'Automatic', 'RWD', '2.0L 4-Cyl Turbo',
  22000, 'Grey', 'Black Leather',
  5, 4, 'BMW211', '2026-01-31',
  62990, 68000,
  'Stunning 2021 BMW 330i M Sport in Mineral Grey. Loaded with options including M Sport package, sunroof, and full leather. Low kms for the year.',
  ARRAY['Apple CarPlay','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Heated Seats','Sunroof','GPS Navigation','Adaptive Cruise Control','Blind Spot Monitoring','Push Start','Keyless Entry','Heads Up Display'],
  true, 'Excellent'
),
(
  '2021-mercedes-benz-c300-mhev',
  'Mercedes-Benz', 'C300', 'MHEV', 2021,
  'Sedan', 'Petrol', 'Automatic', 'RWD', '2.0L 4-Cyl Turbo Mild Hybrid',
  43000, 'Silver', 'Black Leather',
  5, 4, 'MER211', '2025-09-30',
  55990, null,
  'Elegant 2021 Mercedes-Benz C300 MHEV. Full Mercedes service history, Burmester sound system, and AMG Line exterior package.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Leather Seats','Sunroof','GPS Navigation','Adaptive Cruise Control','Blind Spot Monitoring','Heads Up Display','Keyless Entry','Push Start','360 Degree Camera'],
  false, 'Excellent'
),
(
  '2022-mazda-3-g25-astina-hatch',
  'Mazda', '3', 'G25 Astina', 2022,
  'Hatchback', 'Petrol', 'Automatic', 'FWD', '2.5L 4-Cyl',
  33000, 'Red', 'Black',
  5, 5, 'MAZ221', '2026-05-31',
  32990, null,
  'Sharp and sophisticated 2022 Mazda 3 G25 Astina hatchback. The premium compact hatch with Bose sound, HUD, and i-Activsense safety tech.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Blind Spot Monitoring','Heads Up Display','Keyless Entry','Push Start','Bose Sound System','LED Headlights'],
  false, 'Excellent'
),
(
  '2023-hyundai-i30-n-premium',
  'Hyundai', 'i30', 'N Premium', 2023,
  'Hatchback', 'Petrol', 'Manual', 'FWD', '2.0L 4-Cyl Turbo',
  18000, 'Blue', 'Black Alcantara',
  5, 5, 'HYU231', '2026-07-31',
  42990, null,
  'Hot hatch thrills with the 2023 Hyundai i30 N Premium. Performance blue paint, Sunroof pack, and the full N-line interior treatment.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Sunroof','Keyless Entry','Push Start','Bucket Seats','Launch Control','N-Grin Shift'],
  true, 'Excellent'
),
(
  '2022-tesla-model-3-long-range-awd',
  'Tesla', 'Model 3', 'Long Range AWD', 2022,
  'Sedan', 'Electric', 'Automatic', 'AWD', 'Dual Motor Electric',
  35000, 'White', 'White Vegan Leather',
  5, 4, 'TES221', '2026-02-28',
  58990, 64990,
  'The 2022 Tesla Model 3 Long Range AWD. 600km range, over-the-air updates, and Autopilot included. Home charging cable included.',
  ARRAY['Autopilot','Rear Parking Camera','Rear Parking Sensors','GPS Navigation','Keyless Entry','Push Start','Premium Sound','Glass Roof','Heated Seats'],
  true, 'Excellent'
),
(
  '2023-hyundai-ioniq5-dynamiq-awd',
  'Hyundai', 'IONIQ 5', 'Dynamiq AWD', 2023,
  'SUV', 'Electric', 'Automatic', 'AWD', 'Dual Motor Electric',
  12000, 'Matte Green', 'Black',
  5, 5, 'ION231', '2026-08-31',
  72990, null,
  'Next-generation electric SUV. Ultra-fast 800V charging, futuristic interior, Vehicle-to-Load (V2L) capability. The future is here.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Blind Spot Monitoring','360 Degree Camera','Keyless Entry','Push Start','Heated Seats','Ventilated Seats','Bose Sound'],
  true, 'Excellent'
),

-- ── SUVs ─────────────────────────────────────────────────────────────────────
(
  '2020-toyota-rav4-cruiser-awd-hybrid',
  'Toyota', 'RAV4', 'Cruiser AWD Hybrid', 2020,
  'SUV', 'Hybrid Petrol', 'Automatic', 'AWD', '2.5L 4-Cyl Hybrid',
  52000, 'White', 'Black Leather',
  5, 5, 'RAV201', '2025-12-31',
  43990, 47500,
  'Top-spec 2020 Toyota RAV4 Cruiser AWD Hybrid. Loaded with every option and returning exceptional fuel economy for a mid-size SUV.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Sunroof','Adaptive Cruise Control','Blind Spot Monitoring','360 Degree Camera','Keyless Entry','Push Start','Roof Rails','Power Tailgate'],
  true, 'Excellent'
),
(
  '2019-mazda-cx5-akera-4x4',
  'Mazda', 'CX-5', 'Akera 4x4', 2019,
  'SUV', 'Petrol', 'Automatic', '4WD', '2.5L 4-Cyl Turbo',
  60000, 'Grey', 'Brown Leather',
  5, 5, 'CX5191', '2025-08-31',
  26990, null,
  'Top-of-the-range 2019 Mazda CX-5 Akera with the turbo petrol engine. Stunning brown leather interior and full safety tech.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Sunroof','Adaptive Cruise Control','Blind Spot Monitoring','Keyless Entry','Push Start','Roof Rails','Head-Up Display'],
  false, 'Good'
),
(
  '2023-kia-seltos-sport-plus-fwd',
  'Kia', 'Seltos', 'Sport+ FWD', 2023,
  'SUV', 'Petrol', 'Automatic', 'FWD', '1.6L 4-Cyl Turbo',
  39000, 'Orange', 'Black',
  5, 5, 'SEL231', '2026-06-30',
  33990, null,
  'Funky and feature-packed 2023 Kia Seltos Sport+ in bold Surfy Blue. Loaded with tech and backed by Kia''s 7-year warranty.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Blind Spot Monitoring','Keyless Entry','Push Start','LED Headlights','Wireless Charging'],
  false, 'Excellent'
),
(
  '2021-hyundai-tucson-highlander-awd',
  'Hyundai', 'Tucson', 'Highlander AWD', 2021,
  'SUV', 'Petrol', 'Automatic', 'AWD', '1.6L 4-Cyl Turbo',
  76000, 'Black', 'Black Leather',
  5, 5, 'TUC211', '2025-10-31',
  31990, null,
  'Top-spec 2021 Hyundai Tucson Highlander AWD. Panoramic sunroof, 360 camera, and full leather. Excellent value at this price.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Sunroof','360 Degree Camera','Adaptive Cruise Control','Blind Spot Monitoring','Keyless Entry','Push Start','Tow Pack'],
  false, 'Good'
),
(
  '2021-volkswagen-tiguan-147tdi-rline',
  'Volkswagen', 'Tiguan', '147TDI R-Line', 2021,
  'SUV', 'Diesel', 'Automatic', 'AWD', '2.0L 4-Cyl Turbo Diesel',
  31000, 'White', 'Black',
  5, 5, 'TIG211', '2026-04-30',
  39990, 43000,
  'Sharp 2021 Volkswagen Tiguan 147TDI R-Line. Sporty R-Line body kit, black roof, and the torquey diesel engine. Great towing capacity.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Sunroof','Adaptive Cruise Control','Blind Spot Monitoring','Keyless Entry','Push Start','Tow Pack','Ambient Lighting'],
  false, 'Excellent'
),
(
  '2021-audi-q3-35tfsi',
  'Audi', 'Q3', '35 TFSI', 2021,
  'SUV', 'Petrol', 'Automatic', 'FWD', '1.4L 4-Cyl Turbo',
  29000, 'Grey', 'Black',
  5, 5, 'AUD211', '2025-11-30',
  33490, null,
  'Sophisticated 2021 Audi Q3 35 TFSI. Audi''s Virtual Cockpit, MMI infotainment, and refined German build quality at an accessible price.',
  ARRAY['Apple CarPlay','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Sunroof','GPS Navigation','Adaptive Cruise Control','Keyless Entry','Push Start','Ambient Lighting'],
  false, 'Good'
),
(
  '2024-land-rover-evoque-p250-dynamic-hse',
  'Land Rover', 'Range Rover Evoque', 'P250 Dynamic HSE', 2024,
  'SUV', 'Petrol', 'Automatic', 'AWD', '2.0L 4-Cyl Turbo',
  15000, 'Silver', 'Ebony Leather',
  5, 5, 'EVQ241', '2026-09-30',
  76990, null,
  'Near-new 2024 Land Rover Range Rover Evoque P250 Dynamic HSE. Panoramic roof, Pivi Pro infotainment, and ClearSight rear-view camera.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Leather Seats','Sunroof','GPS Navigation','Adaptive Cruise Control','Blind Spot Monitoring','360 Degree Camera','Heads Up Display','Ventilated Seats','Keyless Entry','Push Start'],
  true, 'Excellent'
),
(
  '2022-gwm-haval-jolion-ultra-hybrid',
  'GWM', 'Haval Jolion', 'Ultra Hybrid', 2022,
  'SUV', 'Hybrid Petrol', 'Automatic', 'FWD', '1.5L 4-Cyl Hybrid',
  17000, 'White', 'Black',
  5, 5, 'JOL221', '2026-01-31',
  22990, 24990,
  'Great value 2022 GWM Haval Jolion Ultra Hybrid. Surprising interior quality and tech features at an entry-level price point.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Blind Spot Monitoring','Keyless Entry','Push Start','360 Degree Camera','LED Headlights'],
  false, 'Good'
),
(
  '2022-mitsubishi-outlander-aspire-7seat-awd-phev',
  'Mitsubishi', 'Outlander', 'Aspire 7 Seat AWD PHEV', 2022,
  'SUV', 'Plug-in Hybrid', 'Automatic', 'AWD', '2.4L 4-Cyl Plug-in Hybrid',
  48000, 'Black', 'Black Leather',
  7, 5, 'OUT221', '2025-12-31',
  35990, 39990,
  'Top-spec 2022 Mitsubishi Outlander Aspire PHEV. 7 seats, plug-in hybrid efficiency, panoramic sunroof, and full safety suite.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Sunroof','360 Degree Camera','Adaptive Cruise Control','Blind Spot Monitoring','Keyless Entry','Push Start','Tow Pack','Heated Seats'],
  false, 'Good'
),
(
  '2021-audi-q7-50tdi-sline',
  'Audi', 'Q7', '50 TDI S Line Quattro', 2021,
  'SUV', 'Diesel', 'Automatic', 'AWD', '3.0L V6 Turbo Diesel',
  79000, 'Grey', 'Black Leather',
  7, 5, 'AQ7211', '2025-07-31',
  65990, 72000,
  'Imposing 2021 Audi Q7 50 TDI S Line in Quattro AWD. Third row seating, air suspension, and the smooth V6 diesel engine.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Sunroof','GPS Navigation','Adaptive Cruise Control','Blind Spot Monitoring','360 Degree Camera','Heads Up Display','Ventilated Seats','Heated Seats','Keyless Entry','Push Start','Tow Pack','Air Suspension'],
  false, 'Good'
),
(
  '2024-suzuki-jimny-xl',
  'Suzuki', 'Jimny', 'XL', 2024,
  'SUV', 'Petrol', 'Automatic', '4WD', '1.5L 4-Cyl',
  12000, 'Yellow', 'Black',
  4, 3, 'JIM241', '2026-10-31',
  36990, null,
  'The iconic 2024 Suzuki Jimny XL in striking Kinetic Yellow. True off-road capability in a compact package. Huge demand, act fast!',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Alloy Wheels','LED Headlights','Rear Diff Lock'],
  true, 'Excellent'
),

-- ── VANS / CAMPERVANS ────────────────────────────────────────────────────────
(
  '2021-toyota-hiace-lwb-van-diesel',
  'Toyota', 'HiAce', 'LWB Van', 2021,
  'Van', 'Diesel', 'Automatic', 'RWD', '2.8L 4-Cyl Turbo Diesel',
  34000, 'White', 'Grey',
  2, 5, 'HIA211', '2025-09-30',
  48990, null,
  'Reliable 2021 Toyota HiAce LWB Diesel Auto. The workhorse van trusted by businesses Australia-wide. Immaculate condition with full service history.',
  ARRAY['Rear Parking Camera','Rear Parking Sensors','Apple CarPlay','Android Auto','Bluetooth','Cruise Control'],
  false, 'Good'
),
(
  '2020-mercedes-benz-sprinter-316cdi',
  'Mercedes-Benz', 'Sprinter', '316 CDI LWB', 2020,
  'Van', 'Diesel', 'Automatic', 'RWD', '2.1L 4-Cyl Turbo Diesel',
  50000, 'White', 'Grey',
  2, 5, 'SPR201', '2025-06-30',
  64990, null,
  'Premium 2020 Mercedes-Benz Sprinter 316 CDI LWB. Ideal for conversion to campervan or luxury shuttle. MBUX infotainment system.',
  ARRAY['Rear Parking Camera','GPS Navigation','Apple CarPlay','Cruise Control','LED Headlights'],
  false, 'Good'
),
(
  '2022-volkswagen-transporter-tdi340-swb',
  'Volkswagen', 'Transporter', 'TDI340 SWB', 2022,
  'Van', 'Diesel', 'Manual', 'FWD', '2.0L 4-Cyl Turbo Diesel',
  28000, 'Blue', 'Grey',
  2, 5, 'VWT221', '2026-03-31',
  52990, 56000,
  'Brilliant 2022 Volkswagen Transporter TDI340 SWB in Candy White. The benchmark van for comfort and driving dynamics.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Alloy Wheels','Cruise Control'],
  false, 'Excellent'
),
(
  '2021-ford-transit-custom-320l',
  'Ford', 'Transit Custom', '320L', 2021,
  'Van', 'Diesel', 'Automatic', 'FWD', '2.0L 4-Cyl Turbo Diesel',
  62000, 'White', 'Grey',
  2, 5, 'TRA211', '2025-08-31',
  45990, null,
  'Hardworking 2021 Ford Transit Custom 320L. SYNC 3 infotainment, FordPass connected vehicle, and excellent payload capacity.',
  ARRAY['Rear Parking Camera','Apple CarPlay','Android Auto','Cruise Control','Bluetooth'],
  false, 'Good'
),

-- ── PEOPLE MOVERS ────────────────────────────────────────────────────────────
(
  '2022-kia-carnival-platinum',
  'Kia', 'Carnival', 'Platinum', 2022,
  'People Mover', 'Petrol', 'Automatic', 'FWD', '3.5L V6',
  22000, 'Black', 'Nappa Leather',
  8, 5, 'CAR221', '2026-04-30',
  61990, 67000,
  'Flagship 2022 Kia Carnival Platinum. The ultimate family hauler with captain''s chairs, VIP rear seats, and Harman Kardon sound.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Leather Seats','360 Degree Camera','Adaptive Cruise Control','Blind Spot Monitoring','Sunroof','Keyless Entry','Push Start','Heated Seats','Ventilated Seats','Power Sliding Doors'],
  true, 'Excellent'
),
(
  '2021-toyota-alphard-executive-lounge',
  'Toyota', 'Alphard', 'Executive Lounge', 2021,
  'People Mover', 'Hybrid Petrol', 'Automatic', 'FWD', '2.5L 4-Cyl Hybrid',
  18000, 'White', 'White Leather',
  7, 5, 'ALP211', '2026-01-31',
  89990, 98000,
  'The pinnacle of luxury people movers. 2021 Toyota Alphard Executive Lounge with massaging rear seats, 360 camera, and hybrid efficiency.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Sunroof','360 Degree Camera','GPS Navigation','Adaptive Cruise Control','Keyless Entry','Push Start','Ventilated Seats','Heated Seats','Massaging Seats','Power Tailgate','Power Sliding Doors'],
  true, 'Excellent'
),
(
  '2019-honda-odyssey-vtil',
  'Honda', 'Odyssey', 'VTi-L', 2019,
  'People Mover', 'Petrol', 'Automatic', 'FWD', '2.4L 4-Cyl',
  58000, 'Silver', 'Black Leather',
  7, 5, 'ODY191', '2025-07-31',
  29990, null,
  'Practical and comfortable 2019 Honda Odyssey VTi-L. Magic Slide seats, Honda Sensing safety, and great fuel economy for a 7-seater.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Keyless Entry','Push Start','Power Sliding Doors','Honda Sensing'],
  false, 'Good'
),

-- ── PRESTIGE ─────────────────────────────────────────────────────────────────
(
  '2020-porsche-911-carrera-s',
  'Porsche', '911', 'Carrera S', 2020,
  'Coupe', 'Petrol', 'Automatic', 'RWD', '3.0L H6 Twin-Turbo',
  14000, 'Red', 'Black Leather',
  4, 2, 'POR201', '2025-09-30',
  178990, 189000,
  'Stunning 2020 Porsche 911 Carrera S in Guards Red. One owner, full Porsche service history, Sport Chrono package, and PASM suspension.',
  ARRAY['Apple CarPlay','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Sunroof','GPS Navigation','Adaptive Cruise Control','Blind Spot Monitoring','Heads Up Display','Keyless Entry','Push Start','Ventilated Seats','Bose Sound','Sport Chrono'],
  true, 'Excellent'
),
(
  '2021-bentley-continental-gt-v8',
  'Bentley', 'Continental GT', 'V8', 2021,
  'Coupe', 'Petrol', 'Automatic', 'AWD', '4.0L V8 Twin-Turbo',
  8000, 'Blue', 'Linen Leather',
  4, 2, 'BEN211', '2025-11-30',
  299990, null,
  'Breathtaking 2021 Bentley Continental GT V8 in Moroccan Blue. Rotating dashboard, Naim audio, and Mulliner driving spec. A true grand tourer.',
  ARRAY['Apple CarPlay','Rear Parking Camera','Leather Seats','Sunroof','GPS Navigation','Adaptive Cruise Control','Blind Spot Monitoring','Heads Up Display','Ventilated Seats','Heated Seats','Keyless Entry','Push Start','Naim Audio','Night Vision'],
  true, 'Excellent'
),
(
  '2018-ford-mustang-gt-5l-fastback',
  'Ford', 'Mustang', 'GT 5.0 Fastback', 2018,
  'Coupe', 'Petrol', 'Manual', 'RWD', '5.0L V8',
  41000, 'Red', 'Black',
  4, 2, 'MUS181', '2025-08-31',
  52990, 56000,
  'Raw and thrilling 2018 Ford Mustang GT 5.0L V8 Fastback. The iconic pony car with a thunderous V8, Brembo brakes, and MagneRide suspension.',
  ARRAY['Apple CarPlay','Rear Parking Camera','Rear Parking Sensors','Leather Seats','Keyless Entry','Push Start','Brembo Brakes','MagneRide Suspension','Line Lock','Launch Control'],
  false, 'Good'
),
(
  '2023-honda-civic-type-r',
  'Honda', 'Civic', 'Type R', 2023,
  'Hatchback', 'Petrol', 'Manual', 'FWD', '2.0L 4-Cyl Turbo',
  11000, 'White', 'Red Alcantara',
  5, 5, 'CTR231', '2026-11-30',
  70990, null,
  'The benchmark hot hatch — 2023 Honda Civic Type R. Championship White, limited slip differential, and the best front-wheel drive handling on the planet.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Adaptive Cruise Control','Blind Spot Monitoring','Keyless Entry','Push Start','Bucket Seats','Limited Slip Differential','Brembo Brakes'],
  true, 'Excellent'
),

-- ── UTES ─────────────────────────────────────────────────────────────────────
(
  '2024-ford-ranger-wildtrak-4x4',
  'Ford', 'Ranger', 'Wildtrak 3.0 V6 4x4', 2024,
  'Ute', 'Diesel', 'Automatic', '4WD', '3.0L V6 Turbo Diesel',
  18000, 'White', 'Black',
  5, 4, 'RAN241', '2026-08-31',
  59990, 63000,
  'Top-spec 2024 Ford Ranger Wildtrak with the V6 diesel. B&O sound, 360 camera, and class-leading towing of 3,500kg.',
  ARRAY['Apple CarPlay','Android Auto','Rear Parking Camera','Rear Parking Sensors','Adaptive Cruise Control','Blind Spot Monitoring','Keyless Entry','Push Start','Tow Pack','Roof Rails','Alloy Wheels','360 Degree Camera','B&O Sound'],
  true, 'Excellent'
),
(
  '2020-toyota-hilux-workmate-4x4',
  'Toyota', 'HiLux', 'SR5 4x4 Extra Cab', 2020,
  'Ute', 'Diesel', 'Manual', '4WD', '2.8L 4-Cyl Turbo Diesel',
  54000, 'White', 'Black',
  5, 4, 'HIL201', '2025-10-31',
  26990, null,
  'Rugged and reliable 2020 Toyota HiLux SR5 4x4. Australia''s best-selling ute with proven off-road capability and excellent towing.',
  ARRAY['Rear Parking Camera','Tow Pack','Alloy Wheels','Cruise Control','Bluetooth','LED Headlights'],
  false, 'Good'
),
(
  '2023-toyota-landcruiser-gxl-4wd',
  'Toyota', 'LandCruiser', 'GXL 300 Series', 2023,
  'SUV', 'Diesel', 'Automatic', '4WD', '3.3L V6 Twin-Turbo Diesel',
  28500, 'White', 'Black Leather',
  7, 4, 'LCA231', '2025-06-30',
  115990, 125000,
  'The ultimate 2023 Toyota LandCruiser 300 GXL. Twin-turbo V6 diesel, multi-terrain select, and E-KDSS crawl control. The definitive Australian 4WD.',
  ARRAY['Apple CarPlay & Android Auto','Reversing Camera','Blind Spot Monitor','Heated Front Seats','Power Tailgate','Roof Rails','LED Headlights','Dual Zone Climate Control','Multi-Terrain Select','Crawl Control','E-KDSS'],
  true, 'Excellent'
);