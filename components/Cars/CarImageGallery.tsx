"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CarImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

interface Props {
  images: CarImage[];
  carName: string;
}

export default function CarImageGallery({ images, carName }: Props) {
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    setCanPrev(mainApi.canScrollPrev());
    setCanNext(mainApi.canScrollNext());
  }, [mainApi]);

  // Sync thumb scroll with main
  useEffect(() => {
    if (!mainApi || !thumbApi) return;
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    onSelect();
  }, [mainApi, thumbApi, onSelect]);

  const scrollTo = useCallback(
    (i: number) => {
      mainApi?.scrollTo(i);
      thumbApi?.scrollTo(i);
    },
    [mainApi, thumbApi],
  );

  const scrollPrev = useCallback(() => mainApi?.scrollPrev(), [mainApi]);
  const scrollNext = useCallback(() => mainApi?.scrollNext(), [mainApi]);

  const allImages =
    images.length > 0
      ? images
      : [{ id: "placeholder", url: "", alt: carName, position: 0 }];

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main carousel ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100">
        <div className="overflow-hidden" ref={mainRef}>
          <div className="flex">
            {allImages.map((img, i) => (
              <div
                key={img.id}
                className="flex-none w-full relative aspect-[4/3]"
              >
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={img.alt || carName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 55vw"
                    priority={i === 0}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-6xl">🚗</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next arrows */}
        {allImages.length > 1 && (
          <>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow z-10"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition-shadow z-10"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </>
        )}

        {/* Image counter pill */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {selectedIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      {allImages.length > 1 && (
        <div className="overflow-hidden" ref={thumbRef}>
          <div className="flex gap-2">
            {allImages.map((img, i) => (
              <motion.button
                key={img.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo(i)}
                className={`flex-none relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  i === selectedIndex
                    ? "border-brand-primary opacity-100"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={img.alt || `${carName} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-xl">🚗</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
