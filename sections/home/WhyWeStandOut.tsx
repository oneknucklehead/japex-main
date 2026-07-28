"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getAssetsStorageUrl } from "@/utils/helpers";

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideInLeftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const carVariants = {
  hidden: { opacity: 0, x: -80, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.3,
    },
  },
};

const phoneFrameVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.1,
    },
  },
};

const FEATURES = [
  {
    logo: getAssetsStorageUrl("Homepage/checkmark.png"),
    title: "Premium Quality Vehicles",
    description:
      "Hand-selected from trusted Japanese auctions with high grades and low mileage.",
  },
  {
    logo: getAssetsStorageUrl("Homepage/inspection.png"),
    title: "Comprehensive Inspections",
    description:
      "Every vehicle is thoroughly inspected in Japan and again locally for your peace of mind.",
  },
  {
    logo: getAssetsStorageUrl("Homepage/spanner.png"),
    title: "Compliance & Safety Guaranteed",
    description:
      "All vehicles are fully complied to Australian standards – ready to register and drive away.",
  },
  {
    logo: getAssetsStorageUrl("Homepage/shield.png"),
    title: "5 Year Warranty & Roadside Assist",
    description:
      "Drive with confidence knowing you're covered with our 5 year warranty and 12 months roadside assist.",
  },
  {
    logo: getAssetsStorageUrl("Homepage/inspection.png"),
    title: "Finance Made Easy",
    description:
      "In-house finance solutions tailored to your needs. Fast approvals and competitive rates.",
  },
  {
    logo: getAssetsStorageUrl("Homepage/inspection.png"),
    title: "After-Sales Support You Can Trust",
    description:
      "We're here long after the sale – service, parts, and support from a team that cares.",
  },
];

export default function WhyWeStandOut() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const heroCar = getAssetsStorageUrl("Homepage/whyStandOut.png");

  return (
    <section ref={sectionRef} className="bg-black w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-5 md:px-6 py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-0 items-center">
          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="relative flex flex-col items-center lg:items-start">
            {/* Phone frame outline — the red rounded rectangle */}
            <motion.div
              variants={phoneFrameVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="absolute bottom-4 right-1/4 sm:right-[30%] lg:right-1/3
                         w-32 sm:w-40 md:w-44 lg:w-48 h-full rounded-[1.75rem] sm:rounded-4xl lg:rounded-[2.5rem] border-2 sm:border-4 border-b-black border-brand-primary pointer-events-none z-10"
            />

            {/* Heading block */}
            <motion.div
              variants={slideInLeftVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="relative z-20 flex flex-col items-end text-right pr-2 sm:pr-4 mt-4 sm:mt-6 lg:mt-8 self-center lg:self-auto lg:ml-8"
            >
              <p className="text-white bg-black w-fit font-extrabold text-3xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-montserrat">
                Why we
              </p>
              <p className="text-brand-primary bg-black w-fit font-extrabold text-4xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-montserrat">
                Stand Out?
              </p>
              {/* <p className="text-brand-white-alternate bg-black w-fit text-sm mt-2 sm:mt-3 max-w-56 sm:max-w-64 md:max-w-68 leading-relaxed ml-auto font-bricolage">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                sed porta lacus.
              </p> */}
            </motion.div>

            {/* Car image */}
            <motion.div
              variants={carVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mt-4 sm:mt-6 z-20"
            >
              <Image
                src={heroCar}
                alt="White sports car"
                width={1920}
                height={1080}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 512px"
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col gap-5 sm:gap-6 lg:pl-8 xl:pl-12"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUpVariants}
                className="flex items-start gap-3 sm:gap-4 group"
              >
                {/* Red square bullet */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 p-1.5 sm:p-2 bg-brand-primary rounded-sm shrink-0 mt-1">
                  {feature.logo && (
                    <Image
                      src={feature.logo}
                      alt=""
                      width={1920}
                      height={1080}
                      sizes="72px"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <h4 className="text-white font-extrabold text-lg sm:text-xl md:text-2xl font-montserrat mb-1 leading-snug transition-colors duration-200">
                    {feature.title}
                  </h4>
                  <p className="text-brand-white text-xs sm:text-sm leading-relaxed font-bricolage">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
