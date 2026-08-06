import { Car } from "@/types/car";
import ExploreLatestArrivalsClient from "./ExploreLatestArrivalsClient";
import { fetchCarsWithImages } from "@/lib/appwrite/queries";

export default async function ExploreLatestArrivals() {
  let cars: Car[] = [];
  try {
    cars = await fetchCarsWithImages({
      featuredOnly: true,
      excludeSoldOut: true,
      orderBy: "newest",
      limit: 24,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
  }

  return <ExploreLatestArrivalsClient cars={cars} />;
}
