import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import DeleteCarButton from "@/components/admin/cars/DeleteCarButton";
import AdminPagination from "@/components/admin/AdminPagination";
import CarSearch from "@/components/admin/cars/CarSearch";

const PAGE_SIZE = 20;

/**
 * `%` and `_` are wildcards in LIKE/ILIKE and `\` escapes them, so an admin
 * typing any of those would otherwise get surprising matches. Commas are
 * stripped separately because PostgREST's `.or()` uses them as its delimiter.
 */
function likePattern(term: string) {
  const safe = term.replace(/[\\%_]/g, (c) => `\\${c}`).replace(/,/g, "");
  return `%${safe}%`;
}

export default async function AdminCarsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const term = q?.trim() ?? "";

  // Clamp to a sane integer — a hand-edited URL shouldn't break the query.
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  const supabase = await createClient();

  // The same filter has to be applied to both the count and the rows, or the
  // pagination would be calculated against the unfiltered total.
  const applySearch = <T,>(query: T): T => {
    if (!term) return query;
    const pattern = likePattern(term);
    return (query as any).or(
      `vin.ilike.${pattern},make.ilike.${pattern},model.ilike.${pattern}`,
    );
  };

  // Count first so the page can be clamped before ranging. Asking for a range
  // beyond the end returns an empty array, which would show a blank table
  // instead of the last page.
  const { count } = await applySearch(
    supabase.from("cars").select("id", { count: "exact", head: true }),
  );

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: cars } = await applySearch(
    supabase
      .from("cars")
      .select(
        "id, slug, make, model, year, price, is_published, is_featured, availability, vin",
      ),
  )
    .order("created_at", { ascending: false })
    .range(from, to);

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
                      ${car.price.toLocaleString("en-US")}
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
