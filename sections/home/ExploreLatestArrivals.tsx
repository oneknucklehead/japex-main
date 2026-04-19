"use client";

import CarCarousel from "@/components/Cars/CarCarousel";
import Container from "@/components/Container";
import { Car } from "@/types/car";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { label: "All Cars", types: [] },
  { label: "People Mover/Wagon", types: ["People Mover", "Wagon"] },
  { label: "Sedan", types: ["Sedan", "Hatchback"] },
  { label: "Campervan/Vans", types: ["Van"] },
  { label: "Prestige", types: ["Coupe"] },
] as const;

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
    if (active === "All Cars") return allCars;
    const activeTypes = CATEGORIES.find((c) => c.label === active)?.types ?? [];
    return allCars.filter((car) => activeTypes.includes(car.body_type as any));
  }, [allCars, active]);

  return (
    <div>
      <Container>
        <div className="px-6">
          <h1 className="font-extrabold font-montserrat text-3xl md:text-5xl text-center px-4 md:px-0">
            Explore our latest arrivals
          </h1>
          <p className="font-bricolage text-lg text-center mt-2 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed?
          </p>

          {/* Category buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map((cat) => {
              const isActive = cat.label === active;
              return (
                <motion.button
                  key={cat.label}
                  onClick={() => setActive(cat.label)}
                  // whileTap={{ scale: 0.95 }}
                  className={`flex font-dm-sans items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base  hover:shadow-md border cursor-pointer  font-semibold  transition-all duration-200 ${
                    isActive
                      ? "hover:border-brand-primary bg-brand-primary text-white border-brand-primary"
                      : "hover:border-gray-400 border-gray-300 bg-white"
                  }`}
                >
                  {/* <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isActive ? "border-white" : "border-brand-primary"}`}
                  >
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-white block" />
                    )}
                  </span> */}
                  {cat.label}
                </motion.button>
              );
            })}
          </div>

          {/* Carousel */}
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-72 bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <p className="text-center text-gray-400 py-12">
              No cars in this category.
            </p>
          ) : (
            <CarCarousel cars={filteredCars} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default ExploreLatestArrivals;
