"use client";

import CarCarousel from "@/components/Cars/CarCarousel";
import Container from "@/components/Container";
import { Car } from "@/types/car";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

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
    const range = PRICE_RANGES.find((p) => p.label === activePrice);
    if (!range || activePrice === "All Prices") return allCars;
    return allCars.filter(
      (car) => car.price >= range.min && car.price < range.max,
    );
  }, [allCars, activePrice]);

  return (
    <div className="px-6">
      <Container>
        <h1 className="font-extrabold font-montserrat text-3xl md:text-5xl text-center px-4 md:px-0">
          Tailored to Your Budget, Without Compromise
        </h1>
        <p className="font-bricolage text-lg text-center mt-2 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed?
        </p>

        {/* Price range buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {PRICE_RANGES.map((range) => {
            const isActive = range.label === activePrice;
            return (
              <motion.button
                key={range.label}
                onClick={() => setActivePrice(range.label)}
                // whileTap={{ scale: 0.95 }}
                className={`flex font-dm-sans items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base  hover:shadow-md border cursor-pointer  font-semibold  transition-all duration-200 ${
                  isActive
                    ? "hover:border-brand-primary bg-brand-primary text-white border-brand-primary"
                    : "hover:border-gray-400 border-gray-300 bg-white"
                }`}
              >
                {range.label}
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
            No cars in this price range.
          </p>
        ) : (
          <CarCarousel cars={filteredCars} />
        )}
      </Container>
    </div>
  );
};

export default CollectionBudgetwise;
