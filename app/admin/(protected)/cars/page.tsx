import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminCarsPage() {
  const supabase = await createClient();
  const { data: cars } = await supabase
    .from("cars")
    .select(
      "id, slug, make, model, year, price, is_published, is_featured, is_sold",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="pt-16 lg:pt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat">
          Cars
        </h1>
        <Link
          href="/admin/cars/new"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          + Add Car
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Year", "Make / Model", "Price", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(cars ?? []).map((car) => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{car.year}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {car.make} {car.model}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    ${car.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {car.is_published && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          Published
                        </span>
                      )}
                      {car.is_featured && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                          Featured
                        </span>
                      )}
                      {car.is_sold && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                          Sold
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/cars/${car.id}`}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/cars/${car.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-gray-400 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
