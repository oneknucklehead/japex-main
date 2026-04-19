import CarForm from "@/components/admin/cars/CarForm";

export default function NewCarPage() {
  return (
    <div className="pt-16 lg:pt-0 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat mb-6">
        Add New Car
      </h1>
      <CarForm mode="create" />
    </div>
  );
}
