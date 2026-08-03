"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import Image from "next/image";
import GlowingTransparentDivTestimonial from "../GlowingTransparentDivTestimonial";

interface PopularFeature {
  id: string;
  name: string;
  image_url: string;
}

export default function PopularFeaturesCarousel({
  features,
}: {
  features: PopularFeature[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!features?.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-white font-poppins text-lg">
          Popular features
        </h3>
        <div className="flex gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous"
            className={`w-10 h-10  text-white rounded-full border border-white/20 bg-black flex  items-center justify-center shadow-sm transition-colors duration-300
            ${
              canPrev
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
              className="lucide lucide-chevron-left-icon lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Next"
            className={`w-10 h-10 rounded-full border text-white border-white/20  cursor-pointer bg-black flex items-center justify-center shadow-sm transition-colors duration-300
            ${
              canNext
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
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {features.map((f) => (
            <div
              key={f.id}
              className="min-w-0 pl-4 flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%]"
            >
              {/* <GlowingTransparentDivTestimonial border="xl"> */}
              <div className="relative rounded-xl overflow-hidden aspect-3/4 ">
                {f.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Image
                    src={f.image_url}
                    alt={f.name}
                    width={1920}
                    height={1080}
                    priority={false}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/0 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 ">
                  <div className="w-6 h-0.5 mb-2 bg-brand-primary"></div>
                  <p className="text-white font-bold text-sm leading-tight font-poppins drop-shadow">
                    {f.name}
                  </p>
                </div>
              </div>
              {/* </GlowingTransparentDivTestimonial> */}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
