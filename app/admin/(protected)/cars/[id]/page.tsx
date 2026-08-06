import { notFound } from "next/navigation";
import { Query } from "node-appwrite";
import CarForm from "@/components/admin/cars/CarForm";
import { createAdminClient, DB_ID } from "@/lib/appwrite/server";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { databases } = createAdminClient();

  // Migrated documents kept their Supabase UUID with the hyphens stripped
  // (see migrate-data.mjs toDocId). While parts of the admin still link using
  // the old UUID form, accept either and normalise. Harmless once every page
  // is on Appwrite — a plain Appwrite id has no hyphens to strip.
  const candidates = [id, id.replace(/-/g, "")].filter(
    (v, i, a) => a.indexOf(v) === i,
  );

  let car: any = null;
  let carId = id;
  const attempts: string[] = [];
  for (const candidate of candidates) {
    try {
      car = await databases.getDocument(DB_ID, "cars", candidate);
      carId = candidate;
      break;
    } catch (e: any) {
      // Log the real reason. A blind notFound() hides auth/config errors
      // (wrong DB_ID, missing API key, bad scopes) as a plain 404.
      attempts.push(`${candidate}: [${e?.code}] ${e?.type} - ${e?.message}`);
    }
  }
  if (!car) {
    console.error(
      `EditCarPage: could not load car.\n` +
        `  DB_ID=${DB_ID}\n` +
        `  endpoint=${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}\n` +
        `  apiKeyPresent=${Boolean(process.env.APPWRITE_API_KEY)}\n` +
        attempts.map((a) => `  tried ${a}`).join("\n"),
    );
    notFound();
  }

  // Appwrite has no joins — fetch the image rows separately, ordered.
  const imgRes = await databases.listDocuments(DB_ID, "car_images", [
    Query.equal("car_id", carId),
    Query.orderAsc("position"),
    Query.limit(1000),
  ]);

  const car_images = (imgRes.documents as any[]).map((d) => ({
    id: d.$id,
    url: d.url,
    alt: d.alt,
    position: d.position,
  }));

  const initialData = {
    ...car,
    id: car.$id,
    // custom_specs is stored as a JSON string (Appwrite has no JSON type)
    custom_specs: (() => {
      try {
        const v = JSON.parse(car.custom_specs_json || "[]");
        return Array.isArray(v) ? v : [];
      } catch {
        return [];
      }
    })(),
    // the form edits features as a comma-separated string
    features: (car.features ?? []).join(", "),
    popular_feature_ids: car.popular_feature_ids ?? [],
    car_images,
  };

  return (
    <div className="pt-16 lg:pt-0 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat mb-6">
        Edit — {car.year} {car.make} {car.model}
      </h1>
      <CarForm mode="edit" initialData={initialData} />
    </div>
  );
}
