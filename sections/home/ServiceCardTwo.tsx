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
      className="relative flex w-full h-full flex-col rounded-[28px] bg-black aspect-4/3"
      style={{
        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.25)",
      }}
    >
      {/* grey glow rising from bottom */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[28px]"
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

      {/* vehicle image — contained, sits in top ~60% */}
      <motion.div
        variants={{
          rest: { scale: 1.12, y: 0 },
          hover: { scale: 1.14, y: -6 },
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[28px]  z-10 h-[75%] mb-10 w-full pointer-events-none"
      >
        <Image
          src={image}
          alt=""
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 640px) 100vw, 400px"
        />
      </motion.div>

      {/* text content */}
      <div className="relative rounded-[28px]  z-10 mt-auto px-6 pb-6">
        <h3 className="font-montserrat text-xl font-bold leading-snug text-white sm:text-2xl">
          {headline}
        </h3>
        <p className="mt-3 max-w-[75%] font-bricolage text-sm font-medium leading-snug text-white/70">
          {subtext}
        </p>
      </div>

      {/* arrow button */}
      <motion.div
        variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
