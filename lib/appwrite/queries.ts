import { Query } from "node-appwrite";
import { createAdminClient, DB_ID } from "./server";
import type { Car } from "@/types/car";

// Server-side read helpers.
//
// Appwrite has no joins, so anything that used Supabase's
// `select("*, car_images(...)")` needs a second query and a manual attach.
// This lives in one place so the mapping (custom_specs_json -> custom_specs,
// $id -> id, $createdAt -> created_at) stays consistent everywhere.

const CARS = "cars";
const CAR_IMAGES = "car_images";

function parseSpecs(json: string | null | undefined) {
  try {
    const v = JSON.parse(json || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function mapCarDoc(doc: any, images: any[] = []): Car {
  return {
    ...doc,
    id: doc.$id,
    created_at: doc.$createdAt,
    updated_at: doc.$updatedAt,
    features: doc.features ?? [],
    custom_specs: parseSpecs(doc.custom_specs_json),
    car_images: images,
  } as Car;
}

/** Fetch image rows for a set of car ids, grouped by car id and ordered. */
export async function fetchImagesFor(carIds: string[]) {
  const byCar: Record<string, any[]> = {};
  if (!carIds.length) return byCar;

  const { databases } = createAdminClient();

  // Appwrite caps a single listDocuments at 5000 and Query.equal at a
  // reasonable id-list length, so chunk for safety as inventory grows.
  const CHUNK = 25;
  for (let i = 0; i < carIds.length; i += CHUNK) {
    const chunk = carIds.slice(i, i + CHUNK);
    const res = await databases.listDocuments(DB_ID, CAR_IMAGES, [
      Query.equal("car_id", chunk),
      Query.orderAsc("position"),
      Query.limit(5000),
    ]);
    for (const d of res.documents as any[]) {
      (byCar[d.car_id] ??= []).push({
        id: d.$id,
        car_id: d.car_id,
        url: d.url,
        alt: d.alt,
        position: d.position,
      });
    }
  }
  return byCar;
}

/**
 * Cars with their images attached — the Appwrite equivalent of
 * `.select("*, car_images(...)")`.
 *
 * Note on "not sold out": Supabase used `.neq("availability", "Sold out")`.
 * Appwrite has Query.notEqual, but it excludes documents where the attribute
 * is null, so a car with no availability set would silently vanish. Filtering
 * in memory keeps the old inclusive behaviour.
 */
export async function fetchCarsWithImages(opts: {
  featuredOnly?: boolean;
  excludeSoldOut?: boolean;
  orderBy?: "newest" | "price_asc";
  limit?: number;
}): Promise<Car[]> {
  const { databases } = createAdminClient();

  const queries: string[] = [
    Query.equal("is_published", true),
    Query.limit(opts.limit && !opts.excludeSoldOut ? opts.limit : 5000),
  ];
  if (opts.featuredOnly) queries.push(Query.equal("is_featured", true));

  if (opts.orderBy === "price_asc") queries.push(Query.orderAsc("price"));
  else queries.push(Query.orderDesc("$createdAt"));

  const res = await databases.listDocuments(DB_ID, CARS, queries);

  let docs = res.documents as any[];
  if (opts.excludeSoldOut) {
    docs = docs.filter((d) => d.availability !== "Sold out");
    if (opts.limit) docs = docs.slice(0, opts.limit);
  }

  const imagesByCar = await fetchImagesFor(docs.map((d) => d.$id));
  return docs.map((d) => mapCarDoc(d, imagesByCar[d.$id] ?? []));
}

/** Published testimonials, ordered. */
export async function fetchTestimonials() {
  const { databases } = createAdminClient();
  const res = await databases.listDocuments(DB_ID, "testimonials", [
    Query.equal("is_published", true),
    Query.orderAsc("position"),
    Query.limit(200),
  ]);
  return (res.documents as any[]).map((d) => ({ ...d, id: d.$id }));
}

/** FAQs, ordered. */
export async function fetchFaqs() {
  const { databases } = createAdminClient();
  const res = await databases.listDocuments(DB_ID, "faqs", [
    Query.orderAsc("position"),
    Query.limit(200),
  ]);
  return (res.documents as any[]).map((d) => ({ ...d, id: d.$id }));
}
