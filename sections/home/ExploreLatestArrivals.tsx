import { createClient } from "@/utils/supabase/server";
import { Car } from "@/types/car";
import ExploreLatestArrivalsClient from "./ExploreLatestArrivalsClient";

export default async function ExploreLatestArrivals() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*, car_images(id, url, alt, position)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .neq("availability", "Sold out")
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) console.error("Error fetching cars:", error);

  const cars: Car[] = (data ?? []).map((car) => ({
    ...car,
    car_images: (car.car_images ?? []).sort(
      (a: any, b: any) => a.position - b.position,
    ),
  }));

  return <ExploreLatestArrivalsClient cars={cars} />;
}
