import { createClient } from "@/utils/supabase/server";
import { Car } from "@/types/car";
import CollectionBudgetwiseClient from "./Collectionbudgetwiseclient";

/**
 * Server component — fetches on the server so the cards are in the initial
 * HTML. Previously this ran client-side in a useEffect, which meant nothing
 * rendered until the JS bundle downloaded, hydrated and *then* fetched.
 *
 * No limit here: the price-bucket filters need the full available set, or
 * the higher brackets could come back empty.
 */
export default async function CollectionBudgetwise() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*, car_images(id, url, alt, position)")
    .eq("is_published", true)
    .neq("availability", "Sold out")
    .order("price", { ascending: true });

  if (error) console.error("Error fetching data:", error);

  const cars: Car[] = (data ?? []).map((car) => ({
    ...car,
    car_images: (car.car_images ?? []).sort(
      (a: any, b: any) => a.position - b.position,
    ),
  }));

  return <CollectionBudgetwiseClient cars={cars} />;
}
