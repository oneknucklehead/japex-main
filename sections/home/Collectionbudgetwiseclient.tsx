"use client";

import CarCarousel from "@/components/Cars/CarCarousel";
import Container from "@/components/Container";
import { Car } from "@/types/car";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Tagline from "@/components/Tagline";

const PRICE_RANGES: { label: string; min: number; max: number }[] = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $20k", min: 0, max: 20000 },
  { label: "$20k – $40k", min: 20000, max: 40000 },
  { label: "$40k – $60k", min: 40000, max: 60000 },
  { label: "Over $60k", min: 60000, max: Infinity },
] as const;

type PriceLabel = (typeof PRICE_RANGES)[number]["label"];

interface Props {
  cars: Car[];
}

const CollectionBudgetwiseClient = ({ cars }: Props) => {
  const [activePrice, setActivePrice] = useState<PriceLabel>("All Prices");

  const filteredCars = useMemo(() => {
    const range = PRICE_RANGES.find((p) => p.label === activePrice);
    if (!range || activePrice === "All Prices") return cars;
    return cars.filter(
      (car) => car.price >= range.min && car.price < range.max,
    );
  }, [cars, activePrice]);

  return (
    <div className="px-4 sm:px-5 md:px-6">
      <Container>
        <div className="text-white">
          <div>
            <Tagline text="New Arrivals" />
          </div>
          <h1 className="font-bold font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center px-2 sm:px-4 md:px-0">
            Tailored to Your Budget, Without Compromise
          </h1>
          <p className="font-bricolage text-brand-white-alternate font-semibold text-sm sm:text-base md:text-lg text-center mt-2 mb-5 sm:mb-6 px-2 sm:px-4 md:px-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed?
          </p>

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
          {filteredCars.length === 0 ? (
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

export default CollectionBudgetwiseClient;
