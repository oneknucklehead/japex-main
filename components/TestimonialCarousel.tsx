"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import quotes from "../assets/quotes.png";
import GlowingTransparentDivTestimonial from "./GlowingTransparentDivTestimonial";

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

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

// ── Ratings row, reused in card + modal ────────────────────────────────────
const Rating = ({ rating }: { rating: number }) => (
  <div className="flex" style={{ color: "red" }}>
    {Array.from({ length: rating }).map((_, i) => (
      <StarIcon key={i} />
    ))}
  </div>
);

// ── Single testimonial card ─────────────────────────────────────────────────
const TestimonialCard = ({
  testimonial,
  index,
  onReadMore,
}: {
  testimonial: Testimonial;
  index: number;
  onReadMore: (t: Testimonial) => void;
}) => (
  <div className="h-full">
    <GlowingTransparentDivTestimonial border="2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="p-6 text-white flex flex-col h-full space-y-5"
      >
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Rating rating={testimonial.rating} />
            <h3 className="text-2xl font-extrabold font-poppins">
              {testimonial.name}
            </h3>
            <p className="font-poppins text-sm text-brand-primary border-brand-primary border rounded-lg px-3 py-1 w-fit">
              {testimonial.role}
            </p>
          </div>
          <div className="w-10 h-10 opacity-50 shrink-0">
            <Image src={quotes} alt="quotation mark" />
          </div>
        </div>
        <div className="w-20 h-px bg-brand-primary" />
        <div className="mt-auto">
          <p className="text-brand-gray font-dm-sans line-clamp-3">
            &quot;{testimonial.review}&quot;
          </p>
          <button
            onClick={() => onReadMore(testimonial)}
            className="text-brand-primary font-dm-sans text-sm font-semibold mt-1 cursor-pointer hover:underline"
          >
            ...more
          </button>
        </div>
      </motion.div>
    </GlowingTransparentDivTestimonial>
  </div>
);

// ── Read-more modal ──────────────────────────────────────────────────────────
const TestimonialModal = ({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial | null;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {testimonial && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <GlowingTransparentDivTestimonial border="2xl">
            <div className="p-6 sm:p-8 text-white flex flex-col space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <Rating rating={testimonial.rating} />
                  <h3 className="text-2xl font-extrabold font-poppins">
                    {testimonial.name}
                  </h3>
                  <p className="font-poppins text-sm text-brand-primary border-brand-primary border rounded-lg px-3 py-1 w-fit">
                    {testimonial.role}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-brand-primary transition-colors flex items-center justify-center cursor-pointer"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="w-20 h-px bg-brand-primary" />
              <p className="text-brand-gray font-dm-sans leading-relaxed">
                &quot;{testimonial.review}&quot;
              </p>
            </div>
          </GlowingTransparentDivTestimonial>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
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
  const [activeTestimonial, setActiveTestimonial] =
    useState<Testimonial | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
    <section ref={sectionRef} className="bg-black w-full">
      <div className="max-w-7xl mx-auto">
        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex -ml-4 items-stretch">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-none w-full sm:w-1/2 lg:w-1/3 pl-4 h-auto"
              >
                <TestimonialCard
                  testimonial={t}
                  index={i}
                  onReadMore={setActiveTestimonial}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <motion.button
            onClick={scrollPrev}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-full cursor-pointer  hover:bg-brand-primary border border-white/20 flex items-center justify-center transition-colors"
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

          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <DotButton
                key={i}
                selected={i === selectedIndex}
                onClick={() => scrollTo(i)}
              />
            ))}
          </div>

          <motion.button
            onClick={scrollNext}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-full cursor-pointer  hover:bg-brand-primary border border-white/20 flex items-center justify-center transition-colors"
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

      <TestimonialModal
        testimonial={activeTestimonial}
        onClose={() => setActiveTestimonial(null)}
      />
    </section>
  );
}
