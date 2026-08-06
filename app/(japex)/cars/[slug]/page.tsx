import { notFound } from "next/navigation";
import { Query } from "node-appwrite";
import CarDetailClient from "./CarDetailClient";
import LightShard from "@/components/LightShard";
import FinanceCalculator from "@/components/tryouts/Financecalculator";
import { createAdminClient, DB_ID } from "@/lib/appwrite/server";

export const dynamic = "force-dynamic";

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { databases } = createAdminClient();

  // Appwrite has no .single() — query by slug and take the first match.
  // is_published is filtered here rather than by permission: Appwrite
  // permissions are role-based, not conditional on document state.
  const found = await databases.listDocuments(DB_ID, "cars", [
    Query.equal("slug", slug),
    Query.equal("is_published", true),
    Query.limit(1),
  ]);

  const doc: any = found.documents[0];
  if (!doc) notFound();

  // No joins — fetch image rows separately, already ordered by position.
  const imgRes = await databases.listDocuments(DB_ID, "car_images", [
    Query.equal("car_id", doc.$id),
    Query.orderAsc("position"),
    Query.limit(1000),
  ]);

  const car = {
    ...doc,
    id: doc.$id,
    created_at: doc.$createdAt,
    updated_at: doc.$updatedAt,
    // custom_specs is stored as a JSON string (Appwrite has no JSON type)
    custom_specs: (() => {
      try {
        const v = JSON.parse(doc.custom_specs_json || "[]");
        return Array.isArray(v) ? v : [];
      } catch {
        return [];
      }
    })(),
    features: doc.features ?? [],
    car_images: (imgRes.documents as any[]).map((d) => ({
      id: d.$id,
      url: d.url,
      alt: d.alt,
      position: d.position,
    })),
  };

  // Resolve popular feature ids → catalog rows (name + image)
  const ids: string[] = doc.popular_feature_ids ?? [];
  let popularFeatures: { id: string; name: string; image_url: string }[] = [];

  if (ids.length) {
    const pfRes = await databases.listDocuments(DB_ID, "popular_features", [
      Query.equal("$id", ids),
      Query.limit(100),
    ]);
    popularFeatures = (pfRes.documents as any[])
      .map((d) => ({ id: d.$id, name: d.name, image_url: d.image_url }))
      // Query results come back in arbitrary order — restore the sequence the
      // admin chose. Ids that no longer resolve are simply absent, same as the
      // old .in() behaviour.
      .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  }

  return (
    <div className="relative">
      <div className="mt-24 py-8">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <LightShard className="absolute left-0 top-24 w-72 h-72 -ml-10" />
          <LightShard className="-rotate-90 absolute right-0 top-24 w-72 h-72 -mr-10" />
        </div>

        <CarDetailClient car={car} popularFeatures={popularFeatures} />
        <FinanceCalculator car={car} />
      </div>
    </div>
  );
}
