import { Query } from "node-appwrite";
import { createAdminClient, DB_ID } from "@/lib/appwrite/server";
import Link from "next/link";
import { Suspense } from "react";
import DeleteCarButton from "@/components/admin/cars/DeleteCarButton";
import AdminPagination from "@/components/admin/AdminPagination";
import CarSearch from "@/components/admin/cars/CarSearch";

const PAGE_SIZE = 20;

export default async function AdminCarsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const term = q?.trim() ?? "";

  // Clamp to a sane integer — a hand-edited URL shouldn't break the query.
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  const { databases } = createAdminClient();

  // Admin search covers VIN, make and model. Postgres did this with a single
  // ILIKE `.or()`; Appwrite has no OR across attributes in one query and its
  // fulltext index is per-attribute. With a small inventory the simplest
  // correct approach is to pull the (admin-only) list and filter in memory —
  // which also gives real substring matching on VIN, something Query.search
  // would not do since it tokenises rather than substring-matches.
  const all = await databases.listDocuments(DB_ID, "cars", [
    Query.orderDesc("$createdAt"),
    Query.limit(5000),
  ]);

  const needle = term.toLowerCase();
  const filtered = term
    ? (all.documents as any[]).filter((c) =>
        [c.vin, c.make, c.model]
          .filter(Boolean)
          .some((v: string) => String(v).toLowerCase().includes(needle)),
      )
    : (all.documents as any[]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const from = (page - 1) * PAGE_SIZE;
  const cars = filtered.slice(from, from + PAGE_SIZE).map((c) => ({
    id: c.$id,
    slug: c.slug,
    make: c.make,
    model: c.model,
    year: c.year,
    price: c.price,
    is_published: c.is_published,
    is_featured: c.is_featured,
    availability: c.availability,
    vin: c.vin,
  }));

  return (
    <div className="pt-16 lg:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat">
          Cars
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Suspense fallback={null}>
            <CarSearch />
          </Suspense>
          <Link
            href="/admin/cars/new"
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors text-center"
          >
            + Add Car
          </Link>
        </div>
      </div>

      {term && (
        <p className="mb-4 text-sm text-gray-500">
          {total} result{total === 1 ? "" : "s"} for &ldquo;{term}&rdquo;
        </p>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "VIN",
                  "Year",
                  "Brand / Model",
                  "Price",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(cars ?? []).length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-gray-400"
                  >
                    {term
                      ? "No cars match that search."
                      : "No cars yet — add your first one."}
                  </td>
                </tr>
              ) : (
                (cars ?? []).map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {car.vin}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{car.year}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {car.make} {car.model}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ${(car.price ?? 0).toLocaleString("en-US")}
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
                        {car.availability === "In stock" && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                            In Stock
                          </span>
                        )}
                        {car.availability === "Coming soon" && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                            Coming soon
                          </span>
                        )}
                        {car.availability === "Sold out" && (
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
                        <DeleteCarButton carId={car.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        basePath="/admin/cars"
        params={{ q: term || undefined }}
        label="cars"
      />
    </div>
  );
}
