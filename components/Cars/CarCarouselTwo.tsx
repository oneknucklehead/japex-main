"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Car } from "@/types/car";
import CarCard from "./CarCard";
import CarCardFirst from "../tryouts/CarCardFirst";
import CarCardNew from "../tryouts/CarCardNew";

interface Props {
  cars: Car[];
}

export default function CarCarouselTwo({ cars }: Props) {
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
    <div className="relative w-full z-10">
      {/* Arrow buttons — top right, exactly like the image */}
      <div className="flex justify-end gap-2 mb-4 px-1">
        <motion.button
          onClick={scrollPrev}
          whileTap={{ scale: 0.92 }}
          disabled={!canScrollPrev}
          aria-label="Previous"
          className={`w-10 h-10 text-white rounded-full border border-white/20 bg-black flex items-center justify-center shadow-sm transition-colors duration-300
            ${
              canScrollPrev
                ? "cursor-pointer hover:border-brand-primary  hover:bg-brand-primary text-gray-700"
                : "opacity-40 cursor-not-allowed text-gray-400"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left-icon lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </motion.button>

        <motion.button
          onClick={scrollNext}
          whileTap={{ scale: 0.92 }}
          disabled={!canScrollNext}
          aria-label="Next"
          className={`w-10 h-10 rounded-full border text-white border-white/20   bg-black flex items-center justify-center shadow-sm transition-colors duration-300
            ${
              canScrollNext
                ? "cursor-pointer hover:border-brand-primary hover:bg-brand-primary text-gray-700"
                : "opacity-40 cursor-not-allowed text-gray-400"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right-icon lucide-chevron-right"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </motion.button>
      </div>

      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-stretch -ml-4">
          {cars.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              // Responsive slide widths:
              // xs  (< 640px)  → 1 card  → 100%
              // sm  (≥ 640px)  → 2 cards → 50%
              // md  (≥ 768px)  → 3 cards → 33.33%
              // lg+ (≥ 1024px) → 4 cards → 25%
              className="flex-none pl-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <div className="h-full w-full">
                {/* <CarCard car={car} /> */}
                <CarCardNew car={car} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
