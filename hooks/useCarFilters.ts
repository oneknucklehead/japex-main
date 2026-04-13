"use client";

import { useState, useEffect, useCallback } from "react";
import type { Car, CarFilters } from "@/types/car";
import { createClient } from "@/utils/supabase/client";

export function useCarFilters(filters: CarFilters) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const fetchCars = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("cars")
      .select(
        `
        *,
        car_images (id, url, alt, position)
      `,
        { count: "exact" },
      )
      .eq("is_published", true);

    // ── Full-text search (uses the fts column) ──────────────────────────────
    if (filters.search?.trim()) {
      query = query.textSearch("fts", filters.search.trim(), {
        type: "websearch",
        config: "english",
      });
    }

    // ── Make (multi-select) ─────────────────────────────────────────────────
    if (filters.make?.length) {
      query = query.in("make", filters.make);
    }

    // ── Body type (multi-select) ────────────────────────────────────────────
    if (filters.bodyTypes?.length) {
      query = query.in("body_type", filters.bodyTypes);
    }

    // ── Price range ─────────────────────────────────────────────────────────
    if (filters.priceMin != null) query = query.gte("price", filters.priceMin);
    if (filters.priceMax != null) query = query.lte("price", filters.priceMax);

    // ── Year range ──────────────────────────────────────────────────────────
    if (filters.yearMin != null) query = query.gte("year", filters.yearMin);
    if (filters.yearMax != null) query = query.lte("year", filters.yearMax);

    // ── Odometer range (odometer_km) ────────────────────────────────────────
    if (filters.kmMin != null) query = query.gte("odometer_km", filters.kmMin);
    if (filters.kmMax != null) query = query.lte("odometer_km", filters.kmMax);

    // ── Fuel types ──────────────────────────────────────────────────────────
    if (filters.fuelTypes?.length) {
      query = query.in("fuel_type", filters.fuelTypes);
    }

    // ── Transmission ────────────────────────────────────────────────────────
    if (filters.transmissions?.length) {
      query = query.in("transmission", filters.transmissions);
    }

    // ── Drive type (drive_type column) ──────────────────────────────────────
    if (filters.driveTypes?.length) {
      query = query.in("drive_type", filters.driveTypes);
    }

    // ── Seats ───────────────────────────────────────────────────────────────
    if (filters.seats?.length) {
      query = query.in("seats", filters.seats);
    }

    // ── Doors ───────────────────────────────────────────────────────────────
    if (filters.doors?.length) {
      query = query.in("doors", filters.doors);
    }

    // ── Exterior colour (color_exterior column) ─────────────────────────────
    if (filters.colors?.length) {
      query = query.in("color_exterior", filters.colors);
    }

    // ── Features (car must have ALL selected features) ──────────────────────
    if (filters.features?.length) {
      query = query.contains("features", filters.features);
    }

    // ── Condition ───────────────────────────────────────────────────────────
    if (filters.condition?.length) {
      query = query.in("condition", filters.condition);
    }

    // ── Featured only ───────────────────────────────────────────────────────
    if (filters.isFeatured) {
      query = query.eq("is_featured", true);
    }

    // ── Available only (not sold) ───────────────────────────────────────────
    if (filters.availableOnly) {
      query = query.eq("is_sold", false);
    }

    // ── Sorting ─────────────────────────────────────────────────────────────
    switch (filters.sortBy) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "km_asc":
        query = query.order("odometer_km", { ascending: true });
        break;
      case "km_desc":
        query = query.order("odometer_km", { ascending: false });
        break;
      case "year_desc":
        query = query.order("year", { ascending: false });
        break;
      case "year_asc":
        query = query.order("year", { ascending: true });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      default:
        query = query
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false });
        break;
    }

    // Always order images by position
    // (Supabase returns them as a nested array, sorted via the index)

    const { data, count, error } = await query;

    if (!error && data) {
      // Sort nested car_images by position client-side (Supabase doesn't support nested order)
      const sorted = data.map((car: any) => ({
        ...car,
        car_images: (car.car_images ?? []).sort(
          (a: any, b: any) => a.position - b.position,
        ),
      }));
      setCars(sorted);
      setTotal(count ?? 0);
    }

    setLoading(false);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, total };
}
