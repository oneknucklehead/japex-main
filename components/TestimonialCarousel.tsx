"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
  review: string;
  rating: number;
}

interface Props {
  testimonials: Testimonial[];
}

// ── Avatar placeholder ────────────────────────────────────────────────────────
const AvatarIcon = () => (
  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
    <svg
      className="w-6 h-6 text-gray-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  </div>
);

// ── Single testimonial card ───────────────────────────────────────────────────
const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="bg-white rounded-2xl p-6 flex flex-col gap-6 h-full"
  >
    {/* Avatar */}
    <AvatarIcon />

    {/* Review text */}
    <p className="text-gray-800 text-sm leading-relaxed flex-1 font-bricolage">
      {testimonial.review}
    </p>

    {/* Author */}
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm">—</span>
      <span className="text-gray-900 font-semibold text-sm font-montserrat">
        {testimonial.name}
      </span>
    </div>
  </motion.div>
);

// ── Dot indicator ─────────────────────────────────────────────────────────────
const DotButton = ({
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-full cursor-pointer transition-all duration-300 ${
      selected
        ? "w-2.5 h-2.5 bg-white hover:bg-white"
        : "w-2 h-2 bg-white/40 hover:bg-white/50"
    }`}
    aria-label="Go to slide"
  />
);

// ── Main component ────────────────────────────────────────────────────────────
export default function TestimonialsCarousel({ testimonials }: Props) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  return (
    <section ref={sectionRef} className="bg-black w-full py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-white font-extrabold text-3xl lg:text-5xl leading-tight font-montserrat mb-4">
            See What Our
            <br />
            Customers Have to Say
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-brand-white-alternate" />
            <p className="text-brand-white-alternate text-lg font-bricolage">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed?
            </p>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex -ml-4">
            {" "}
            {/* negative margin to offset the left padding */}
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="flex-none w-full sm:w-1/2 lg:w-1/3 pl-4"
              >
                <TestimonialCard testimonial={t} index={i} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Controls — dots + arrows centered below */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          {/* Prev button */}
          <motion.button
            onClick={scrollPrev}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-xl cursor-pointer bg-white/10 hover:bg-brand-primary border border-white/20 flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            <svg
              className="w-4 h-4 text-white"
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

          {/* Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <DotButton
                key={i}
                selected={i === selectedIndex}
                onClick={() => scrollTo(i)}
              />
            ))}
          </div>

          {/* Next button — red */}
          <motion.button
            onClick={scrollNext}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-xl cursor-pointer bg-white/10 hover:bg-brand-primary border border-white/20 flex items-center justify-center transition-colors"
            aria-label="Next"
          >
            <svg
              className="w-4 h-4 text-white"
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
        </motion.div>
      </div>
    </section>
  );
}
