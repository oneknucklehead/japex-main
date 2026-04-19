"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getAssetsStorageUrl } from "@/utils/helpers";

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  },
});

const fadeIn = (delay: number = 0) => ({
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  },
});

// ── Shared card shell ─────────────────────────────────────────────────────────

const CardShell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative rounded-2xl overflow-hidden w-full h-full ${className}`}
  >
    {children}
  </div>
);

// ── Stat card (cards 1, 2, 3) ─────────────────────────────────────────────────

const StatCard = ({
  image,
  stat,
  label,
  delay,
}: {
  image: string;
  stat: string;
  label: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp(delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="rounded-2xl overflow-hidden relative h-full min-h-0 aspect-4/3 lg:aspect-auto"
    >
      {/* Background image */}
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover object-center blur-xs"
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      {/* Gradient overlay — heavier at bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-brand-dark to-transparent" />

      {/* Text content — bottom left */}
      <div className="absolute bottom-0 left-0 p-4">
        <p className="text-white font-extrabold text-4xl leading-none font-montserrat">
          {stat}
        </p>
        <p className="text-brand-white-alternate text-lg mt-1 font-bricolage">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

// ── CTA card (card 4) ─────────────────────────────────────────────────────────

const CtaCard = ({ delay }: { delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const statCard4 = getAssetsStorageUrl("Homepage/StatCard4.jpg");

  return (
    <motion.div
      ref={ref}
      variants={fadeUp(delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      // className="rounded-2xl overflow-hidden relative h-full min-h-0 aspect-square  md:aspect-auto bg-gray-900"
      className="rounded-2xl overflow-hidden relative h-full min-h-0 bg-gray-900 aspect-4/3 lg:aspect-auto"
    >
      {/* Faint background image for texture */}
      <Image
        src={statCard4}
        alt=""
        fill
        className="object-cover object-center blur-xs"
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      {/* Gradient overlay — heavier at bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-brand-dark to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* Globe icon — top left */}
        <div>
          <div className="w-8 h-8 rounded-full text-white bg-white/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-globe-icon lucide-globe"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="flex-1 flex items-center">
          <h3 className="text-white w-full max-w-full xl:max-w-2/3 font-extrabold text-2xl leading-snug font-montserrat">
            Explore more to get your comfort zone
          </h3>
        </div>

        {/* CTA button */}
        <Link
          href="/used-cars"
          className="flex items-center justify-between gap-4 bg-white hover:bg-gray-100 transition-colors text-gray-900 text-sm font-semibold px-3 py-2 rounded-lg w-full"
        >
          <p>Browse all cars</p>
          <span className="w-fit p-2 bg-brand-primary rounded-lg flex items-center justify-center shrink-0">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M17 7H7M17 7v10"
              />
            </svg>
          </span>
        </Link>
      </div>
    </motion.div>
  );
};

// ── Hero card (right large card) ──────────────────────────────────────────────

const HeroCard = ({ delay }: { delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const statCardLarge = getAssetsStorageUrl("Homepage/StatCardLarge.jpg");

  return (
    <motion.div
      ref={ref}
      variants={fadeIn(delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative w-full aspect-square rounded-2xl overflow-hidden"
    >
      {/* Background image */}
      <Image
        src={statCardLarge}
        alt="Luxury car close-up"
        fill
        className="object-cover object-center blur-xs"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />

      {/* Gradient overlay — heavier at bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-brand-dark to-transparent" />

      {/* Text — bottom left */}
      <div className="absolute bottom-0 left-0 p-6">
        <h2 className="text-white font-extrabold text-2xl lg:text-4xl leading-tight font-montserrat mb-2">
          Not just keys to a car—
        </h2>
        <p className="text-brand-white-alternate  text-lg font-bricolage leading-relaxed">
          but the keys to experiences
          <br />
          you&apos;ll never forget.
        </p>
      </div>
    </motion.div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export default function StatsGrid() {
  const statCard1 = getAssetsStorageUrl("Homepage/StatCard1.jpg");
  const statCard2 = getAssetsStorageUrl("Homepage/StatCard2.jpg");
  const statCard3 = getAssetsStorageUrl("Homepage/StatCard3.jpg");
  const STATS = [
    {
      image: statCard1,
      stat: "500+",
      label: "Cars Available",
    },
    {
      image: statCard2,
      stat: "5000+",
      label: "Customer satisfaction",
    },
    {
      image: statCard3,
      stat: "Over\n10,000+",
      label: "Cars Sold",
    },
  ];
  return (
    <section className="w-full pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-4 items-stretch">
          {/* Left — 2×2 grid (shows BELOW hero on mobile due to flex-col-reverse) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <StatCard
                key={i}
                image={s.image}
                stat={s.stat}
                label={s.label}
                delay={i * 0.1}
              />
            ))}
            <CtaCard delay={0.3} />
          </div>

          {/* Right — hero card (shows ON TOP on mobile due to flex-col-reverse) */}
          <HeroCard delay={0.15} />
        </div>
      </div>
    </section>
  );
}
