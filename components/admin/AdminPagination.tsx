import Link from "next/link";

/**
 * Link-based pagination for admin list pages. Server-component friendly —
 * page state lives in the URL rather than React state, so it survives a
 * refresh and works without a client bundle.
 *
 * `params` carries any other query values (a search term, a filter) through
 * to every page link, so paging never drops the current view.
 */
export default function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
  basePath,
  params = {},
  label = "items",
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  basePath: string;
  params?: Record<string, string | undefined>;
  label?: string;
}) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const href = (p: number) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  // Windowed page numbers: always show first and last, plus a couple either
  // side of the current page, with gaps collapsed to an ellipsis.
  const pages: (number | "gap")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "gap") {
      pages.push("gap");
    }
  }

  const arrowCls =
    "flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition-colors";

  const PrevIcon = (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );

  const NextIcon = (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-700">{from}</span>–
        <span className="font-semibold text-gray-700">{to}</span> of{" "}
        <span className="font-semibold text-gray-700">{total}</span> {label}
      </p>

      <div className="flex items-center gap-1.5">
        {/* Previous */}
        {page > 1 ? (
          <Link
            href={href(page - 1)}
            aria-label="Previous page"
            className={`${arrowCls} border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50`}
          >
            {PrevIcon}
          </Link>
        ) : (
          <span
            aria-hidden="true"
            className={`${arrowCls} border-gray-100 bg-gray-50 text-gray-300`}
          >
            {PrevIcon}
          </span>
        )}

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "gap" ? (
            <span
              key={`gap-${i}`}
              className="px-1 text-sm text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <Link
              key={p}
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className={`flex h-9 min-w-9 items-center justify-center rounded-xl border px-2.5 text-sm font-semibold transition-colors ${
                p === page
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </Link>
          ),
        )}

        {/* Next */}
        {page < totalPages ? (
          <Link
            href={href(page + 1)}
            aria-label="Next page"
            className={`${arrowCls} border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50`}
          >
            {NextIcon}
          </Link>
        ) : (
          <span
            aria-hidden="true"
            className={`${arrowCls} border-gray-100 bg-gray-50 text-gray-300`}
          >
            {NextIcon}
          </span>
        )}
      </div>
    </div>
  );
}
