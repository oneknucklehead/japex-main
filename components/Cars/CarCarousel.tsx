"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Car } from "@/types/car";
import CarCard from "./CarCard";

interface Props {
  cars: Car[];
}

export default function CarCarousel({ cars }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    breakpoints: {
      // These mirror the Tailwind breakpoints below
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);
    updateButtons();
  }, [emblaApi, updateButtons]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full">
      {/* Arrow buttons — top right, exactly like the image */}
      <div className="flex justify-end gap-2 mb-4 px-1">
        <motion.button
          onClick={scrollPrev}
          whileTap={{ scale: 0.92 }}
          disabled={!canScrollPrev}
          aria-label="Previous"
          className={`w-10 h-10 cursor-pointer rounded-xl border border-gray-300 bg-white flex items-center justify-center shadow-sm transition-all duration-200
            ${
              canScrollPrev
                ? "hover:border-gray-400 hover:shadow-md text-gray-700"
                : "opacity-40 cursor-not-allowed text-gray-400"
            }`}
        >
          <svg
            className="rotate-180"
            width="12"
            height="12"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.7071 8.07112C15.0976 7.6806 15.0976 7.04743 14.7071 6.65691L8.34315 0.292946C7.95262 -0.0975785 7.31946 -0.0975785 6.92893 0.292946C6.53841 0.68347 6.53841 1.31664 6.92893 1.70716L12.5858 7.36401L6.92893 13.0209C6.53841 13.4114 6.53841 14.0446 6.92893 14.4351C7.31946 14.8256 7.95262 14.8256 8.34315 14.4351L14.7071 8.07112ZM0 7.36401L0 8.36401L14 8.36401V7.36401V6.36401L0 6.36401L0 7.36401Z"
              fill="black"
            />
          </svg>
        </motion.button>

        <motion.button
          onClick={scrollNext}
          whileTap={{ scale: 0.92 }}
          disabled={!canScrollNext}
          aria-label="Next"
          className={`w-10 h-10 rounded-xl border border-gray-300 cursor-pointer bg-white flex items-center justify-center shadow-sm transition-all duration-200
            ${
              canScrollNext
                ? "hover:border-gray-400 hover:shadow-md text-gray-700"
                : "opacity-40 cursor-not-allowed text-gray-400"
            }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.7071 8.07112C15.0976 7.6806 15.0976 7.04743 14.7071 6.65691L8.34315 0.292946C7.95262 -0.0975785 7.31946 -0.0975785 6.92893 0.292946C6.53841 0.68347 6.53841 1.31664 6.92893 1.70716L12.5858 7.36401L6.92893 13.0209C6.53841 13.4114 6.53841 14.0446 6.92893 14.4351C7.31946 14.8256 7.95262 14.8256 8.34315 14.4351L14.7071 8.07112ZM0 7.36401L0 8.36401L14 8.36401V7.36401V6.36401L0 6.36401L0 7.36401Z"
              fill="black"
            />
          </svg>
        </motion.button>
      </div>

      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {cars.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              // Responsive slide widths:
              // xs  (< 640px)  → 1 card  → 100%
              // sm  (≥ 640px)  → 2 cards → 50%
              // md  (≥ 768px)  → 3 cards → 33.33%
              // lg+ (≥ 1024px) → 4 cards → 25%
              className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 pl-4 first:pl-0"
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
