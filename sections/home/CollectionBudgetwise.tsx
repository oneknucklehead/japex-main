import { Car } from "@/types/car";
import CollectionBudgetwiseClient from "./Collectionbudgetwiseclient";
import { fetchCarsWithImages } from "@/lib/appwrite/queries";

/**
 * Server component — fetches on the server so the cards are in the initial
 * HTML. Previously this ran client-side in a useEffect, which meant nothing
 * rendered until the JS bundle downloaded, hydrated and *then* fetched.
 *
 * No limit here: the price-bucket filters need the full available set, or
 * the higher brackets could come back empty.
 */
export default async function CollectionBudgetwise() {
  let cars: Car[] = [];
  try {
    cars = await fetchCarsWithImages({
      excludeSoldOut: true,
      orderBy: "price_asc",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return <CollectionBudgetwiseClient cars={cars} />;
}
