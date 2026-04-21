"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useCarFilters } from "@/hooks/useCarFilters";
import type { CarFilters, SortOption } from "@/types/car";
import FilterSidebar from "@/components/Cars/FilterSidebar";
import CarCard from "@/components/Cars/CarCard";
import Pagination from "@/components/Cars/Pagination";
import Container from "@/components/Container";
import GetInTouch from "@/components/GetInTouch";
import Testimonials from "@/sections/home/TestimonialsClient";

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

// Skeleton card
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="aspect-video bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-5 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-9 bg-gray-200 rounded-xl w-1/3" />
      </div>
    </div>
  </div>
);

export default function CarsPage() {
  const [filters, setFilters] = useState<CarFilters>({ sortBy: "newest" });
  const [page, setPage] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { cars, loading, total, totalPages } = useCarFilters(filters, page);

  // Reset to page 1 when filters change
  const handleFiltersChange = (f: CarFilters) => {
    setFilters(f);
    setPage(1);
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="min-h-screen bg-[#efeded]">
      <div className="px-6">
        <Container>
          <div className="py-8">
            {/* ── Page header ─────────────────────────────────────────── */}
            <div className="flex flex-wrap items-end justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-extrabold text-gray-900 font-montserrat">
                  Our Cars
                </h1>
                {!loading && (
                  <p className="text-sm text-gray-400 mt-1">{total} results</p>
                )}
              </div>

              {/* Sort dropdown + mobile filter trigger */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end w-full gap-3">
                {/* Sort dropdown */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                  <span className="text-xs text-gray-400 font-medium hidden sm:block">
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
                    className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="xl:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm text-sm font-semibold text-gray-700"
                >
                  <svg
                    className="w-4 h-4"
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

            {/* ── Main layout ──────────────────────────────────────────── */}
            <div className="flex gap-6 items-start">
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
                      className="fixed inset-0 bg-black/40 z-40 xl:hidden"
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
                      className="fixed top-0 left-0 h-full w-80 bg-gray-50 z-50 overflow-y-auto xl:hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                        <span className="font-bold text-gray-900 font-montserrat">
                          Filters
                        </span>
                        <button
                          onClick={() => setMobileSidebarOpen(false)}
                          className="w-fit h-fit p-2 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={4}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4">
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
                {loading ? (
                  // Skeleton grid
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : cars.length === 0 ? (
                  // Empty state checks
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-28 text-center"
                  >
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-800 font-montserrat mb-2">
                      No cars found
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Try adjusting your filters to see more results.
                    </p>
                    <button
                      onClick={() => handleFiltersChange({ sortBy: "newest" })}
                      className="cursor-pointer bg-brand-primary hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
                        <CarCard car={car} />
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

      <Testimonials />
      <Container>
        <GetInTouch />
      </Container>
    </div>
  );
}
