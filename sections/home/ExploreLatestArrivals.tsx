"use client";

import CarCarousel from "@/components/Cars/CarCarousel";
import Container from "@/components/Container";
import { Car } from "@/types/car";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Tagline from "@/components/Tagline";

const CATEGORIES: { label: string; types: string[] }[] = [
  { label: "All Cars", types: [] },
  { label: "People Mover/Wagon", types: ["People Mover", "Wagon"] },
  { label: "Sedan", types: ["Sedan", "Hatchback"] },
  { label: "Campervan/Vans", types: ["Van"] },
  { label: "Prestige", types: ["Coupe"] },
];

type CategoryLabel = (typeof CATEGORIES)[number]["label"];

const ExploreLatestArrivals = () => {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<CategoryLabel>("All Cars");

  // Fetch ALL cars once on mount
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("cars")
        .select("*, car_images(id, url, alt, position)")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching cars:", error);
      else {
        setAllCars(
          (data ?? []).map((car) => ({
            ...car,
            car_images: (car.car_images ?? []).sort(
              (a: any, b: any) => a.position - b.position,
            ),
          })),
        );
      }
      setLoading(false);
    };

    fetchData();
  }, []); // ← empty array, runs once only

  // Filter client-side whenever active changes — no extra fetch
  const filteredCars = useMemo(() => {
    const available = allCars.filter((car) => car.availability !== "Sold out");
    if (active === "All Cars") return available;
    const activeTypes = CATEGORIES.find((c) => c.label === active)?.types ?? [];
    return available.filter((car) =>
      activeTypes.includes(car.body_type as any),
    );
  }, [allCars, active]);

  return (
    <div className="px-6 sm:px-5 md:px-6">
      <Container>
        <div className="relative text-white">
          <div className="z-10">
            <div>
              <Tagline text="New Arrivals" />
            </div>
            <h1 className="font-bold font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center px-2 sm:px-4 md:px-0">
              Explore our latest arrivals
            </h1>
            <p className="font-bricolage text-brand-white-alternate font-semibold text-sm sm:text-base md:text-lg text-center mt-2 mb-5 sm:mb-6 px-2 sm:px-4 md:px-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed?
            </p>

            {/* Category buttons */}
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {CATEGORIES.map((cat) => {
                const isActive = cat.label === active;
                return (
                  <motion.button
                    key={cat.label}
                    type="button"
                    onClick={() => setActive(cat.label)}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 p-px bg-linear-to-tr from-white to-[#666666] rounded-lg cursor-pointer"
                  >
                    <div
                      className={`relative flex font-dm-sans items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base rounded-md font-semibold transition-all duration-300 ${
                        isActive ? "" : "hover:shadow-md"
                      }`}
                    >
                      <div className="absolute inset-0 bg-linear-to-b from-black to-[#313131] rounded-md" />
                      {/* active gradient, fades in/out on top */}
                      <div
                        className={`absolute inset-0 bg-linear-to-b from-black to-[#780707] rounded-md transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <p className="relative z-10 whitespace-nowrap">
                        {cat.label}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Carousel */}
            {loading ? (
              <div className="flex gap-3 sm:gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-56 sm:h-64 md:h-72 bg-white/5 border border-white/10 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : filteredCars.length === 0 ? (
              <p className="text-center text-gray-400 py-10 sm:py-12 text-sm sm:text-base">
                No cars in this category.
              </p>
            ) : (
              <CarCarousel cars={filteredCars} />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ExploreLatestArrivals;
