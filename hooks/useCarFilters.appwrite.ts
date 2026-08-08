"use client";

import { useState, useEffect, useCallback } from "react";
import { Query } from "appwrite";
import type { Car, CarFilters, CarImage } from "@/types/car";
import { createClient, DB_ID } from "@/lib/appwrite/client";

const PAGE_SIZE = 9;
const CARS = "cars";
const CAR_IMAGES = "car_images";

// ── Search strategy ────────────────────────────────────────────────────────
// Postgres `websearch` ANDs terms: "Hiace Welcab" => 1 result.
// Appwrite's Query.search ORs them:  "Hiace Welcab" => 13 results.
// One Query.search per word ANDs correctly for most inputs, BUT returns 0 for
// "Delica D5" — a listing's model is "Delica D:5" and the colon breaks
// tokenisation of the standalone "D5" term.
//
// Measured against the real inventory (migrate/test-search-and.mjs):
//   postgres | A: one search | B: search per word | C: fetch + client AND
//   ---------|---------------|--------------------|----------------------
//      1     |      13       |        1           |    1   "Hiace Welcab"
//      4     |       9       |        0  <-- bad  |    4   "Delica D5"
//     13     |      14       |       13           |   13   "Toyota Hiace"
//      2     |      14       |        2           |    2   "Toyota Dark Prime"
//      9     |       9       |        9           |    9   "Mitsubishi Delica"
//
// So: search the first token server-side, AND the rest client-side. Matched
// Postgres on every tested query.
//
// NOTE: with ~25 listings the wide fetch is trivial. If inventory grows beyond
// SEARCH_FETCH_LIMIT, searched results would be truncated — revisit then.
const SEARCH_FETCH_LIMIT = 500;

const AVAILABILITY_RANK: Record<string, number> = {
  "In stock": 0,
  "Coming soon": 1,
  "Sold out": 2,
};

function safeParse(json: string | null | undefined) {
  try {
    const v = JSON.parse(json || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function mapCar(doc: any, images: CarImage[]): Car {
  return {
    id: doc.$id,
    slug: doc.slug,
    make: doc.make,
    model: doc.model,
    variant: doc.variant,
    year: doc.year,
    vin: doc.vin,
    body_type: doc.body_type,
    fuel_type: doc.fuel_type,
    transmission: doc.transmission,
    drive_type: doc.drive_type,
    engine: doc.engine,
    odometer_km: doc.odometer_km,
    color_exterior: doc.color_exterior,
    color_interior: doc.color_interior,
    seats: doc.seats,
    doors: doc.doors,
    power_steering: doc.power_steering,
    price: doc.price,
    was_price: doc.was_price,
    description: doc.description,
    features: doc.features ?? [],
    condition: doc.condition,
    is_featured: doc.is_featured,
    availability: doc.availability,
    is_published: doc.is_published,
    extended_warranty: doc.extended_warranty,
    created_at: doc.$createdAt,
    updated_at: doc.$updatedAt,
    custom_specs: safeParse(doc.custom_specs_json),
    car_images: images,
  };
}

/** Filters that translate directly to server-side Appwrite queries. */
function buildBaseQueries(filters: CarFilters): string[] {
  const q: string[] = [Query.equal("is_published", true)];

  if (filters.make?.length) q.push(Query.equal("make", filters.make));
  if (filters.bodyTypes?.length)
    q.push(Query.equal("body_type", filters.bodyTypes));
  if (filters.fuelTypes?.length)
    q.push(Query.equal("fuel_type", filters.fuelTypes));
  if (filters.transmissions?.length)
    q.push(Query.equal("transmission", filters.transmissions));
  if (filters.driveTypes?.length)
    q.push(Query.equal("drive_type", filters.driveTypes));
  if (filters.seats?.length) q.push(Query.equal("seats", filters.seats));
  if (filters.doors?.length) q.push(Query.equal("doors", filters.doors));
  if (filters.colors?.length)
    q.push(Query.equal("color_exterior", filters.colors));
  if (filters.condition?.length)
    q.push(Query.equal("condition", filters.condition));
  if (filters.availability?.length)
    q.push(Query.equal("availability", filters.availability));
  if (filters.isFeatured) q.push(Query.equal("is_featured", true));

  if (filters.priceMin != null)
    q.push(Query.greaterThanEqual("price", filters.priceMin));
  if (filters.priceMax != null)
    q.push(Query.lessThanEqual("price", filters.priceMax));
  if (filters.yearMin != null)
    q.push(Query.greaterThanEqual("year", filters.yearMin));
  if (filters.yearMax != null)
    q.push(Query.lessThanEqual("year", filters.yearMax));
  if (filters.kmMin != null)
    q.push(Query.greaterThanEqual("odometer_km", filters.kmMin));
  if (filters.kmMax != null)
    q.push(Query.lessThanEqual("odometer_km", filters.kmMax));

  return q;
}

/** availability_rank is always the primary sort, mirroring the old SQL. */
function buildSortQueries(sortBy: CarFilters["sortBy"]): string[] {
  const q = [Query.orderAsc("availability_rank")];
  switch (sortBy) {
    case "price_asc":
      q.push(Query.orderAsc("price"));
      break;
    case "price_desc":
      q.push(Query.orderDesc("price"));
      break;
    case "km_asc":
      q.push(Query.orderAsc("odometer_km"));
      break;
    case "km_desc":
      q.push(Query.orderDesc("odometer_km"));
      break;
    case "year_desc":
      q.push(Query.orderDesc("year"));
      break;
    case "year_asc":
      q.push(Query.orderAsc("year"));
      break;
    case "newest":
      q.push(Query.orderDesc("$createdAt"));
      break;
    default:
      q.push(Query.orderDesc("is_featured"));
      q.push(Query.orderDesc("$createdAt"));
  }
  return q;
}

/**
 * Postgres `.contains("features", [...])` means "contains ALL of these".
 * Appwrite's Query.contains is ANY-overlap, so strict containment happens here.
 */
function matchesAllFeatures(doc: any, wanted: string[]) {
  const have: string[] = doc.features ?? [];
  return wanted.every((f) => have.includes(f));
}

/**
 * A term matches if it appears ANYWHERE (mid-word included) in the car's
 * identifying fields: make, model, variant, year, VIN.
 *
 * Description is deliberately EXCLUDED.
 *
 * `search_blob` includes the description, and descriptions are long prose full
 * of numbers, dates and measurements. Searching them meant a short term like
 * "1" or "06" matched a dozen cars through text nobody was searching on —
 * results that look broken even though the match was technically real.
 *
 * The identifying fields are short and structured, so substring matching over
 * them behaves predictably: "iac" finds Hiace, "206" finds GDH206 variants and
 * VINs containing 206, "0602" finds VIN 06020. A broad term like "1" still
 * returns several cars, but every one of them genuinely contains a 1 in its
 * name, variant, year or VIN — which is the honest answer to a one-character
 * search.
 */
function matchesAllTerms(doc: any, terms: string[]) {
  // Year included so "2020" works as a search. Description omitted on purpose.
  const haystack = [doc.make, doc.model, doc.variant, doc.year, doc.vin]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Separator-free copy of the VIN ONLY, so "KDH206-1234567" is also findable
  // as "KDH2061234567".
  //
  // Stripping separators across the whole haystack was wrong: joining the
  // fields together created matches that span a boundary — "( 38120 ) 38120"
  // collapsing to "3812038120" invented a "2038" that exists in neither the
  // variant nor the VIN. Compacting only the VIN keeps the convenience without
  // the phantom matches.
  const vinCompact = `${doc.vin || ""}`.toLowerCase().replace(/[^a-z0-9]/g, "");

  return terms.every((term) => {
    const t = term.toLowerCase();
    if (haystack.includes(t)) return true;
    const tc = t.replace(/[^a-z0-9]/g, "");
    return Boolean(tc) && vinCompact.includes(tc);
  });
}

export function useCarFilters(filters: CarFilters, page: number = 1) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const { databases } = createClient();

      const searchTerms = (filters.search ?? "")
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      const featureFilter = filters.features ?? [];

      // Anything not expressible server-side forces the wide-fetch path.
      const needsClientFiltering =
        searchTerms.length > 0 || featureFilter.length > 0;

      const base = buildBaseQueries(filters);
      const sort = buildSortQueries(filters.sortBy);

      let pageDocs: any[];
      let totalCount: number;

      if (!needsClientFiltering) {
        // ── Fast path: fully server-side with real pagination ──
        const res = await databases.listDocuments(DB_ID, CARS, [
          ...base,
          ...sort,
          Query.limit(PAGE_SIZE),
          Query.offset((page - 1) * PAGE_SIZE),
        ]);
        pageDocs = res.documents;
        totalCount = res.total;
      } else {
        // ── Wide-fetch path: narrow server-side, AND in memory, paginate ──
        // No Query.search here, deliberately.
        //
        // Appwrite's fulltext index only covers search_blob, and it tokenises
        // rather than substring-matches — so narrowing server-side on the first
        // term would exclude every VIN match before the client filter ever ran.
        // A VIN typed in full wouldn't tokenise reliably, and a partial VIN
        // never would.
        //
        // Instead the server applies the structured filters (make, price, year,
        // availability...) and the text match happens in memory across
        // search_blob + vin. That also makes matching substring-based, which is
        // strictly more permissive than before — every previously-matching
        // query still matches.
        //
        // Cost: up to SEARCH_FETCH_LIMIT documents fetched while a search is
        // active. Fine at current inventory; revisit past ~500 published cars.
        const wide = [...base, ...sort, Query.limit(SEARCH_FETCH_LIMIT)];

        const res = await databases.listDocuments(DB_ID, CARS, wide);

        let matched = res.documents as any[];
        if (searchTerms.length)
          matched = matched.filter((d) => matchesAllTerms(d, searchTerms));
        if (featureFilter.length)
          matched = matched.filter((d) => matchesAllFeatures(d, featureFilter));

        totalCount = matched.length;
        const from = (page - 1) * PAGE_SIZE;
        pageDocs = matched.slice(from, from + PAGE_SIZE);
      }

      // ── Attach images (Appwrite has no server-side joins) ──
      const carIds = pageDocs.map((d) => d.$id);
      const imagesByCar: Record<string, CarImage[]> = {};

      if (carIds.length) {
        const imgRes = await databases.listDocuments(DB_ID, CAR_IMAGES, [
          Query.equal("car_id", carIds),
          Query.orderAsc("position"),
          Query.limit(1000), // 9 cars * ~30 images stays well inside one request
        ]);
        for (const img of imgRes.documents as any[]) {
          (imagesByCar[img.car_id] ??= []).push({
            id: img.$id,
            car_id: img.car_id,
            url: img.url,
            alt: img.alt,
            position: img.position,
          });
        }
      }

      setCars(pageDocs.map((d) => mapCar(d, imagesByCar[d.$id] ?? [])));
      setTotal(totalCount);
    } catch (err) {
      // The Supabase version swallowed errors silently; surface them instead.
      console.error("useCarFilters:", err);
      setCars([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters), page]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return {
    cars,
    loading,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    pageSize: PAGE_SIZE,
  };
}

// Exported for CarForm.tsx — availability_rank was a Postgres generated column
// and must now be written explicitly on every save.
export function rankFor(availability: string): number {
  return AVAILABILITY_RANK[availability] ?? 0;
}
