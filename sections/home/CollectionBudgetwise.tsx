"use client";

import Container from "@/components/Container";
import { Car } from "@/types/car";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Tagline from "@/components/Tagline";
import CarCarousel from "@/components/Cars/CarCarousel";

const PRICE_RANGES: { label: string; min: number; max: number }[] = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $20k", min: 0, max: 20000 },
  { label: "$20k – $40k", min: 20000, max: 40000 },
  { label: "$40k – $60k", min: 40000, max: 60000 },
  { label: "Over $60k", min: 60000, max: Infinity },
] as const;

type PriceLabel = (typeof PRICE_RANGES)[number]["label"];

const CollectionBudgetwise = () => {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePrice, setActivePrice] = useState<PriceLabel>("All Prices");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("cars")
        .select("*, car_images(id, url, alt, position)")
        .eq("is_published", true)
        .order("price", { ascending: true });

      if (error) console.error("Error fetching data:", error);
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
  }, []);

  const filteredCars = useMemo(() => {
    const available = allCars.filter((car) => car.availability !== "Sold out");
    const range = PRICE_RANGES.find((p) => p.label === activePrice);
    if (!range || activePrice === "All Prices") return available;
    return available.filter(
      (car) => car.price >= range.min && car.price < range.max,
    );
  }, [allCars, activePrice]);

  return (
    <div className="px-6 sm:px-5 md:px-6">
      <Container>
        <div className="text-white">
          <div>
            <Tagline text="New Arrivals" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center px-2 sm:px-4 md:px-0">
              Tailored to Your Budget, Without Compromise
            </h1>
            <p className="max-w-2xl font-bricolage text-brand-white-alternate font-semibold text-sm sm:text-base md:text-lg text-center mt-2 mb-5 sm:mb-6 px-2 sm:px-4 md:px-0">
              Whether you&apos;re planning your first road trip or upgrading to
              a premium camper, we&apos;ll help you find the right vehicle to
              match your budget and lifestyle.
            </p>
          </div>

          {/* Price range buttons */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {PRICE_RANGES.map((range) => {
              const isActive = range.label === activePrice;
              return (
                <motion.button
                  key={range.label}
                  type="button"
                  onClick={() => setActivePrice(range.label)}
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
                      {range.label}
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
              No cars in this price range.
            </p>
          ) : (
            <CarCarousel cars={filteredCars} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default CollectionBudgetwise;
