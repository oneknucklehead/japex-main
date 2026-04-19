import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import CarDetailClient from "./CarDetailClient";

// Force dynamic rendering — needed because supabase server client uses cookies()
export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

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

  return <CarDetailClient car={car} />;
}
