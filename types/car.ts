export interface Car {
  id: string;
  slug: string;

  // Identification
  make: string;
  model: string;
  variant: string;
  year: number;

  // Specs
  body_type: string;
  fuel_type: string;
  transmission: string;
  drive_type: string; // ← your schema uses drive_type, not drivetrain
  engine: string;
  odometer_km: number; // ← your schema, not km
  color_exterior: string; // ← your schema, not colour
  color_interior: string;
  seats: number;
  doors: number;
  rego: string;
  rego_expiry: string | null;

  // Pricing
  price: number;
  was_price: number | null;

  // Content
  description: string;
  features: string[];
  condition: string;

  // Status
  is_featured: boolean;
  is_sold: boolean;
  is_published: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Joined from car_images
  car_images?: CarImage[];
}

export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  alt: string;
  position: number;
}

export interface CarFilters {
  search?: string;
  make?: string[];
  bodyTypes?: string[];
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  kmMin?: number;
  kmMax?: number;
  fuelTypes?: string[];
  transmissions?: string[];
  driveTypes?: string[]; // ← drive_type
  seats?: number[];
  doors?: number[];
  colors?: string[]; // ← color_exterior
  features?: string[];
  condition?: string[];
  isFeatured?: boolean;
  availableOnly?: boolean; // is_sold = false
  sortBy?: SortOption;
}

export type SortOption =
  | "recommended"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "km_asc"
  | "km_desc"
  | "year_desc"
  | "year_asc";
