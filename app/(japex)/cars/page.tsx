"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useCarFilters } from "@/hooks/useCarFilters";
import type { CarFilters, SortOption } from "@/types/car";
import FilterSidebar from "@/components/Cars/FilterSidebar";
import Pagination from "@/components/Cars/Pagination";
import Container from "@/components/Container";
import { useSearchParams } from "next/navigation";
import CarCardFirst from "@/components/tryouts/CarCardFirst";
import LightShard from "@/components/LightShard";
import { getAssetsStorageUrl } from "@/utils/helpers";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "New Arrivals", value: "newest" },
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Year: Newest", value: "year_desc" },
  { label: "Year: Oldest", value: "year_asc" },
  { label: "Lowest KM", value: "km_asc" },
  { label: "Highest KM", value: "km_desc" },
];

const SkeletonCard = () => (
  <div className="bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 animate-pulse">
    <div className="aspect-video bg-white/5" />
    <div className="p-3 sm:p-4 flex flex-col justify-center items-center space-y-2.5 sm:space-y-3">
      <div className="h-3 bg-white/10 rounded w-1/3" />
      <div className="h-5 bg-white/10 rounded w-2/3" />
      <div className="h-3 bg-white/10 rounded w-1/2" />
      <div className="h-6 bg-brand-primary/20 rounded-full w-full" />
    </div>
  </div>
);

function CarsPageInner() {
  const lightshardright = getAssetsStorageUrl("Homepage/lightshardright.png");

  const searchParams = useSearchParams();
  const body = searchParams.get("body");
  const brand = searchParams.get("brand");

  const [filters, setFilters] = useState<CarFilters>({
    sortBy: "newest",
    availability: ["In stock", "Coming soon"],
    ...(body ? { bodyTypes: [body] } : {}),
    ...(brand ? { make: [brand] } : {}),
  });

  const [page, setPage] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { cars, loading, total, totalPages } = useCarFilters(filters, page);

  const handleFiltersChange = (f: CarFilters) => {
    setFilters(f);
    setPage(1);
  };

  // Re-apply the body/brand filters whenever the URL params change
  const [prevBody, setPrevBody] = useState(body);
  const [prevBrand, setPrevBrand] = useState(brand);
  if (body !== prevBody || brand !== prevBrand) {
    setPrevBody(body);
    setPrevBrand(brand);
    setFilters((f) => ({
      ...f,
      bodyTypes: body ? [body] : undefined,
      make: brand ? [brand] : undefined,
    }));
    setPage(1);
  }

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="relative overflow-hidden">
      <div>
        <LightShard className="pointer-events-none absolute left-0 -z-10 hidden w-48 -ml-8 sm:block sm:w-56 md:w-64 lg:w-72 h-auto" />
        <LightShard
          src={lightshardright}
          className="pointer-events-none absolute right-0 -z-10 hidden w-48 -mr-8 sm:block sm:w-56 md:w-64 lg:w-72 h-auto"
        />
        <Container>
          <div className="mt-20 sm:mt-24 py-8 sm:py-10 md:py-14 px-4 sm:px-5 md:px-6">
            {/* ── Main layout ──────────────────────────────────────────── */}
            <div className="flex gap-5 lg:gap-6 items-start">
              {/* Desktop sidebar */}
              <div className="hidden xl:block w-64 xl:w-72 shrink-0 sticky top-24">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFiltersChange}
                  total={total}
                />
              </div>

              {/* Mobile sidebar drawer */}
              <AnimatePresence>
                {mobileSidebarOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setMobileSidebarOpen(false)}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
                    />
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 300,
                      }}
                      className="fixed top-0 left-0 h-[100svh] w-[85%] max-w-80 bg-black border-r border-white/10 z-50 overflow-y-auto xl:hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-black z-10">
                        <span className="font-bold text-white font-montserrat">
                          Filters
                        </span>
                        <button
                          type="button"
                          onClick={() => setMobileSidebarOpen(false)}
                          aria-label="Close filters"
                          className="w-fit h-fit p-2 rounded-full bg-white/10 hover:bg-brand-primary transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="p-3 sm:p-4">
                        <FilterSidebar
                          filters={filters}
                          onChange={(f) => {
                            handleFiltersChange(f);
                            setMobileSidebarOpen(false);
                          }}
                          total={total}
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* ── Cars grid ─────────────────────────────────────────── */}
              <div className="flex-1 min-w-0">
                {/* ── Page header ─────────────────────────────────────────── */}
                <div className="text-white w-full flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins">
                      Our Cars
                    </h1>
                    {!loading && (
                      <p className="text-xs sm:text-sm text-brand-gray mt-1">
                        {total} results
                      </p>
                    )}
                  </div>

                  {/* Sort dropdown + mobile filter trigger */}
                  <div className="flex w-fit gap-2 sm:gap-3">
                    {/* Sort dropdown */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2">
                      <span className="text-xs text-brand-gray font-medium hidden sm:block whitespace-nowrap">
                        Sort By
                      </span>
                      <select
                        value={filters.sortBy ?? "newest"}
                        onChange={(e) =>
                          handleFiltersChange({
                            ...filters,
                            sortBy: e.target.value as SortOption,
                          })
                        }
                        className="text-xs sm:text-sm font-semibold text-white bg-transparent focus:outline-none cursor-pointer max-w-32 sm:max-w-none"
                      >
                        {SORT_OPTIONS.map((o) => (
                          <option
                            key={o.value}
                            value={o.value}
                            className="text-brand-dark"
                          >
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mobile filter button */}
                    <button
                      type="button"
                      onClick={() => setMobileSidebarOpen(true)}
                      className="xl:hidden flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/20 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-white cursor-pointer hover:border-brand-primary transition-colors"
                    >
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 4h18M7 12h10M11 20h2"
                        />
                      </svg>
                      Filters
                    </button>
                  </div>
                </div>

                {loading ? (
                  // Skeleton grid
                  <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : cars.length === 0 ? (
                  // Empty state
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16 sm:py-24 md:py-28 text-center px-4"
                  >
                    <div className="text-4xl sm:text-5xl mb-4">🔍</div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-montserrat mb-2">
                      No cars found
                    </h3>
                    <p className="text-brand-gray text-xs sm:text-sm mb-6">
                      Try adjusting your filters to see more results.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleFiltersChange({ sortBy: "newest" })}
                      className="cursor-pointer bg-brand-primary hover:bg-red-700 text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-colors text-xs sm:text-sm"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                ) : (
                  // Car grid
                  <motion.div
                    key={`${JSON.stringify(filters)}-${page}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
                  >
                    {cars.map((car, i) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(i * 0.05, 0.25),
                        }}
                      >
                        <CarCardFirst car={car} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Pagination */}
                {!loading && cars.length > 0 && (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={null}>
      <CarsPageInner />
    </Suspense>
  );
}
