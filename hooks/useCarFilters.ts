"use client";

import { useState, useEffect, useCallback } from "react";
import type { Car, CarFilters } from "@/types/car";
import { createClient } from "@/utils/supabase/client";

const PAGE_SIZE = 9;

export function useCarFilters(filters: CarFilters, page: number = 1) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("cars")
      .select(`*, car_images (id, url, alt, position)`, { count: "exact" })
      .eq("is_published", true)
      .range(from, to);

    if (filters.search?.trim())
      query = query.textSearch("fts", filters.search.trim(), {
        type: "websearch",
        config: "english",
      });
    if (filters.make?.length) query = query.in("make", filters.make);
    if (filters.bodyTypes?.length)
      query = query.in("body_type", filters.bodyTypes);
    if (filters.priceMin != null) query = query.gte("price", filters.priceMin);
    if (filters.priceMax != null) query = query.lte("price", filters.priceMax);
    if (filters.yearMin != null) query = query.gte("year", filters.yearMin);
    if (filters.yearMax != null) query = query.lte("year", filters.yearMax);
    if (filters.kmMin != null) query = query.gte("odometer_km", filters.kmMin);
    if (filters.kmMax != null) query = query.lte("odometer_km", filters.kmMax);
    if (filters.fuelTypes?.length)
      query = query.in("fuel_type", filters.fuelTypes);
    if (filters.transmissions?.length)
      query = query.in("transmission", filters.transmissions);
    if (filters.driveTypes?.length)
      query = query.in("drive_type", filters.driveTypes);
    if (filters.seats?.length) query = query.in("seats", filters.seats);
    if (filters.doors?.length) query = query.in("doors", filters.doors);
    if (filters.colors?.length)
      query = query.in("color_exterior", filters.colors);
    if (filters.features?.length)
      query = query.contains("features", filters.features);
    if (filters.condition?.length)
      query = query.in("condition", filters.condition);
    if (filters.isFeatured) query = query.eq("is_featured", true);
    if (filters.availableOnly) query = query.eq("is_sold", false);

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
    }

    const { data, count, error } = await query;
    if (!error && data) {
      setCars(
        data.map((car: any) => ({
          ...car,
          car_images: (car.car_images ?? []).sort(
            (a: any, b: any) => a.position - b.position,
          ),
        })),
      );
      setTotal(count ?? 0);
    }
    setLoading(false);
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
