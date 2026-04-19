import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import CarForm from "@/components/admin/cars/CarForm";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: car } = await supabase
    .from("cars")
    .select("*, car_images(id, url, alt, position)")
    .eq("id", id)
    .single();

  if (!car) notFound();

  car.car_images = (car.car_images ?? []).sort(
    (a: any, b: any) => a.position - b.position,
  );
  // Convert features array back to comma string for the form
  const initialData = { ...car, features: (car.features ?? []).join(", ") };

  return (
    <div className="pt-16 lg:pt-0 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat mb-6">
        Edit — {car.year} {car.make} {car.model}
      </h1>
      <CarForm mode="edit" initialData={initialData} />
    </div>
  );
}
