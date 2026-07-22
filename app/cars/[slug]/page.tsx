import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import CarDetailClient from "./CarDetailClient";
import LightShard from "@/components/LightShard";
import FinanceCalculator from "@/components/tryouts/Financecalculator";

// Force dynamic rendering — needed because supabase server client uses cookies()
export const dynamic = "force-dynamic";

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: car } = await supabase
    .from("cars")
    .select("*, car_images(id, url, alt, position)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!car) notFound();

  car.car_images = (car.car_images ?? []).sort(
    (a: any, b: any) => a.position - b.position,
  );

  // Resolve popular feature IDs → catalog rows (name + image)
  const ids: string[] = car.popular_feature_ids ?? [];
  let popularFeatures: { id: string; name: string; image_url: string }[] = [];
  if (ids.length) {
    const { data: pf } = await supabase
      .from("popular_features")
      .select("id, name, image_url")
      .in("id", ids);
    // .in() returns arbitrary order — restore the admin-defined sequence
    popularFeatures = (pf ?? []).sort(
      (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id),
    );
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
