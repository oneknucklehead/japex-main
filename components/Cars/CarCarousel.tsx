"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Car } from "@/types/car";
import CarCardFirst from "../tryouts/CarCardFirst";

interface Props {
  cars: Car[];
}

export default function CarCarousel({ cars }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
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
    emblaApi.on("init", updateButtons);
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      emblaApi.off("init", updateButtons);
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, updateButtons]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full z-10">
      {/* Arrow buttons — top right */}
      <div className="flex justify-end gap-2 mb-3 sm:mb-4 px-1">
        <motion.button
          onClick={scrollPrev}
          whileTap={{ scale: 0.92 }}
          disabled={!canScrollPrev}
          aria-label="Previous"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black flex items-center justify-center shadow-sm transition-colors duration-300
            ${
              canScrollPrev
                ? "cursor-pointer text-white hover:border-brand-primary hover:bg-brand-primary"
                : "opacity-40 cursor-not-allowed text-gray-400"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </motion.button>

        <motion.button
          onClick={scrollNext}
          whileTap={{ scale: 0.92 }}
          disabled={!canScrollNext}
          aria-label="Next"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black flex items-center justify-center shadow-sm transition-colors duration-300
            ${
              canScrollNext
                ? "cursor-pointer text-white hover:border-brand-primary hover:bg-brand-primary"
                : "opacity-40 cursor-not-allowed text-gray-400"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </motion.button>
      </div>

      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-stretch -ml-3 sm:-ml-4">
          {cars.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.06, 0.3) }}
              // Responsive slide widths:
              // xs  (< 480px)  → 1 card    → 100%
              // xs+ (≥ 480px)  → 1.5 cards → peek of the next
              // sm  (≥ 640px)  → 2 cards   → 50%
              // md  (≥ 768px)  → 3 cards   → 33.33%
              // lg  (≥ 1024px) → 3 cards   → 33.33%
              // xl  (≥ 1280px) → 4 cards   → 25%
              className="flex-none min-w-0 pl-3 sm:pl-4 w-full min-[480px]:w-2/3 sm:w-1/2 md:w-1/3 xl:w-1/4"
            >
              <div className="h-full w-full">
                <CarCardFirst car={car} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
