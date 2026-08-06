// Shared car write logic.
//
// The top half is PURE — no SDK calls — so it can be imported by both the
// browser (CarForm) and the server route (app/api/admin/cars/route.ts).
// The bottom half is the client-side API used by components; it posts to the
// route rather than writing directly, because collections grant public read
// but no public write ("The current user is not authorized...").
//
// Postgres used to do three things automatically that Appwrite does not.
// Every write path MUST go through toCarDocument() or data silently drifts:
//   1. `fts` tsvector      -> search_blob, concatenated on save
//   2. `availability_rank` -> generated column, now written explicitly
//   3. trimmed text        -> untrimmed values split filter facets, because
//                             Query.equal is exact-match

export const CARS = "cars";
export const CAR_IMAGES = "car_images";

const AVAILABILITY_RANK: Record<string, number> = {
  "In stock": 0,
  "Coming soon": 1,
  "Sold out": 2,
};

export function rankFor(availability: string): number {
  return AVAILABILITY_RANK[availability] ?? 0;
}

export function buildSearchBlob(c: {
  make?: string;
  model?: string;
  variant?: string;
  description?: string;
}): string {
  return [c.make, c.model, c.variant, c.description].filter(Boolean).join(" ");
}

const tidy = (v: unknown) =>
  typeof v === "string" ? v.trim().replace(/\s+/g, " ") : v;

const TEXT_FIELDS = [
  "slug",
  "vin",
  "make",
  "model",
  "variant",
  "body_type",
  "fuel_type",
  "transmission",
  "drive_type",
  "engine",
  "color_exterior",
  "color_interior",
  "condition",
  "power_steering",
] as const;

export interface CarWriteInput {
  slug: string;
  vin: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  body_type: string;
  fuel_type: string;
  transmission: string;
  drive_type?: string;
  engine?: string;
  odometer_km?: number;
  color_exterior?: string;
  color_interior?: string;
  seats?: number;
  doors?: number;
  power_steering?: string;
  price: number;
  was_price?: number | null;
  description?: string;
  features?: string[];
  condition?: string;
  custom_specs?: { heading: string; value: string }[];
  popular_feature_ids?: string[];
  is_featured?: boolean;
  is_published?: boolean;
  extended_warranty?: boolean;
  availability?: string;
}

/** Converts form state into the exact document shape Appwrite expects. */
export function toCarDocument(input: CarWriteInput) {
  const doc: Record<string, any> = { ...input };

  for (const f of TEXT_FIELDS) {
    if (doc[f] != null) doc[f] = tidy(doc[f]);
  }
  if (doc.description != null) doc.description = String(doc.description).trim();

  // jsonb -> serialized string (Appwrite has no JSON attribute type)
  doc.custom_specs_json = JSON.stringify(
    (input.custom_specs ?? []).filter((s) => s.heading?.trim()),
  );
  delete doc.custom_specs;

  doc.features = (input.features ?? [])
    .map((f) => String(f).trim())
    .filter(Boolean);
  doc.popular_feature_ids = input.popular_feature_ids ?? [];
  doc.was_price = input.was_price || null;

  const availability = input.availability ?? "In stock";
  doc.availability = availability;
  doc.availability_rank = rankFor(availability); // was a generated column
  doc.search_blob = buildSearchBlob(doc as any); // was the fts tsvector

  // Never send Appwrite system fields or stale relational keys
  for (const k of [
    "id",
    "$id",
    "$createdAt",
    "$updatedAt",
    "$permissions",
    "$collectionId",
    "$databaseId",
    "car_images",
    "fts",
    "created_at",
    "updated_at",
  ]) {
    delete doc[k];
  }
  return doc;
}

export function fileIdFromUrl(url: string): string | null {
  return url?.match(/\/files\/([^/]+)\/view/)?.[1] ?? null;
}

export class DuplicateVinError extends Error {
  constructor(message = "A car with this VIN already exists.") {
    super(message);
    this.name = "DuplicateVinError";
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Client-side API — posts to /api/admin/cars
// ─────────────────────────────────────────────────────────────────────────

/**
 * Create or update a car, and optionally replace its image rows in the same
 * request. Returns the Appwrite document id.
 *
 * Passing `images` here (rather than a separate call) means the car and its
 * images are written in one round trip, so a network drop can't leave a car
 * saved with the previous set of images.
 */
export async function saveCar(
  input: CarWriteInput,
  opts: {
    mode: "create" | "edit";
    carId?: string;
    images?: { url: string; alt?: string }[];
  },
): Promise<string> {
  const res = await fetch("/api/admin/cars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input,
      mode: opts.mode,
      carId: opts.carId,
      images: opts.images,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (data?.duplicateVin) throw new DuplicateVinError(data.error);
    throw new Error(data?.error ?? "Could not save this car.");
  }
  return data.carId as string;
}

/** Replace a car's image rows without touching the car itself. */
export async function replaceCarImages(
  carId: string,
  images: { url: string; alt?: string }[],
) {
  const res = await fetch("/api/admin/cars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "edit", carId, images, input: undefined }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Could not update images.");
  }
}

/** Delete a car, its image rows, AND its storage files. */
export async function deleteCarCompletely(carId: string) {
  const res = await fetch("/api/admin/cars", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Could not delete this car.");
  return data as { filesDeleted: number; rowsDeleted: number };
}
