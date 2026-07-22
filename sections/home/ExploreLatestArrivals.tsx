"use client";

import CarCarousel from "@/components/Cars/CarCarousel";
import Container from "@/components/Container";
import { Car } from "@/types/car";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import lightshardleft from "../../assets/lightshardleft.png";
import lightshardright from "../../assets/lightshardright.png";
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
    <div>
      <Container>
        <div className="relative text-white">
          {/* <div>
            <Image
              src={lightshardleft}
              alt="glowing background"
              // fill
              priority
              className="absolute w-60 h-60 object-cover object-center -z-10"
            />
          </div> */}
          <div className="z-10">
            <div>
              <Tagline text="New Arrivals" />
            </div>
            <h1 className="font-bold font-poppins text-3xl md:text-5xl text-center px-4 md:px-0">
              Explore our latest arrivals
            </h1>
            <p className="font-bricolage text-brand-white-alternate font-semibold text-lg text-center mt-2 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed?
            </p>

            {/* Category buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {CATEGORIES.map((cat) => {
                const isActive = cat.label === active;
                return (
                  <motion.button
                    key={cat.label}
                    className="flex items-center gap-2 p-px bg-linear-to-tr from-white to-[#666666] rounded-lg"
                  >
                    <motion.div
                      onClick={() => setActive(cat.label)}
                      // whileTap={{ scale: 0.95 }}
                      className={`relative flex font-dm-sans items-center gap-2 px-4 py-2  text-sm md:text-base rounded-md hover:shadow-md  cursor-pointer  font-semibold  transition-all duration-300 ${
                        isActive
                          ? " bg-linear-to-b from-black to-[#780707] text-white"
                          : "hover:from-black hover:to-[#780707] bg-linear-to-b from-black to-[#313131] transition-all duration-300"
                      }`}
                    >
                      <div className="absolute inset-0 bg-linear-to-b from-black to-[#313131] rounded-md" />
                      {/* active gradient, fades in/out on top */}
                      <div
                        className={`absolute inset-0 bg-linear-to-b from-black to-[#780707] rounded-md transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <p className="relative z-10 ">{cat.label}</p>
                    </motion.div>
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
        </div>
      </Container>
    </div>
  );
};

export default ExploreLatestArrivals;
