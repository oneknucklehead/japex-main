"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";

interface ServiceCardProps {
  image: StaticImageData | string; // transparent cutout PNG of the vehicle
  headline: React.ReactNode;
  subtext?: string;
  href?: string;
}

export default function ServiceCardTwo({
  image,
  headline,
  subtext = "Lorem ipsum dolor sit amet, consectetur sed?",
  href = "#",
}: ServiceCardProps) {
  return (
    <motion.a
      href={href}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative flex w-full flex-col rounded-3xl sm:rounded-4xl bg-black min-h-85 sm:min-h-100 lg:min-h-0 lg:aspect-4/3 mt-10 sm:mt-12 md:mt-16"
      style={{
        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.25)",
      }}
    >
      {/* grey glow rising from bottom */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl sm:rounded-4xl"
        variants={{
          rest: {
            background:
              "radial-gradient(120% 70% at 50% 100%, #6b6b6b 0%, #2a2a2a 35%, transparent 70%)",
          },
          hover: {
            background:
              "radial-gradient(140% 85% at 50% 100%, #9a9a9a 0%, #454545 40%, transparent 75%)",
          },
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* vehicle image — floats above the card's top edge */}
      <motion.div
        variants={{
          rest: { scale: 1, y: 0 },
          hover: { scale: 1.04, y: -8 },
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full flex-1 basis-40 min-h-35 sm:min-h-40 -mt-10 sm:-mt-12 md:-mt-16 mb-4 sm:mb-6 md:mb-8 origin-bottom pointer-events-none"
      >
        <Image
          src={image}
          alt=""
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
        />
      </motion.div>

      {/* text content */}
      <div className="relative z-10 mt-auto shrink-0 px-4 pb-4 sm:px-6 sm:pb-6">
        <h3 className="font-montserrat text-base font-bold leading-snug text-white pr-14 sm:pr-16 md:pr-18 sm:text-lg md:text-xl lg:text-2xl">
          {headline}
        </h3>
        <p className="mt-2 sm:mt-3 max-w-[70%] sm:max-w-[75%] font-bricolage text-xs sm:text-sm font-medium leading-snug text-white/70">
          {subtext}
        </p>
      </div>

      {/* arrow button */}
      <motion.div
        variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 sm:h-4.5 sm:w-4.5"
        >
          <path
            d="M7 7h10v10"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 17 17 7"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.a>
  );
}
