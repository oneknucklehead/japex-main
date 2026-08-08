"use client";

import CarCarousel from "@/components/Cars/CarCarousel";
import Container from "@/components/Container";
import { Car } from "@/types/car";
import React, { useState, useMemo } from "react";
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

interface Props {
  cars: Car[];
}

const ExploreLatestArrivalsClient = ({ cars }: Props) => {
  const [active, setActive] = useState<CategoryLabel>("All Cars");

  // Filter client-side whenever active changes — data is already here, so
  // switching category is instant with no extra request.
  const filteredCars = useMemo(() => {
    if (active === "All Cars") return cars;
    const activeTypes = CATEGORIES.find((c) => c.label === active)?.types ?? [];
    return cars.filter((car) => activeTypes.includes(car.body_type as any));
  }, [cars, active]);

  return (
    <div className="px-4 sm:px-5 md:px-6">
      <Container>
        <div className="relative text-white">
          <div className="z-10">
            <div>
              <Tagline text="New Arrivals" />
            </div>
            <h1 className="font-bold font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center px-2 sm:px-4 md:px-0">
              Explore our latest arrivals
            </h1>
            <p className="font-bricolage max-w-3xl text-brand-white-alternate font-semibold text-sm sm:text-base md:text-lg text-center mt-2 mb-5 sm:mb-6 px-2 sm:px-4 md:px-0 mx-auto">
              Japanese reliability, built for Australian adventures. Discover
              quality imports chosen for reliability, comfort, and the freedom
              to explore further.
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
            {filteredCars.length === 0 ? (
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

export default ExploreLatestArrivalsClient;
