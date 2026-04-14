"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getAssetsStorageUrl } from "@/utils/helpers";

const FEATURES = [
  {
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed porta lacus.",
  },
  {
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed porta lacus.",
  },
  {
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed porta lacus.",
  },
  {
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed porta lacus.",
  },
];

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

export default function WhyWeStandOut() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const whiteTesla = getAssetsStorageUrl("Homepage/tesla.png");

  return (
    <section ref={sectionRef} className="bg-black w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center">
          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="relative flex flex-col items-center lg:items-start">
            {/* Phone frame outline — the red rounded rectangle */}
            <motion.div
              variants={phoneFrameVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="absolute bottom-4 right-1/3 
                         w-48 h-full rounded-[2.5rem] border-4 border-b-black  border-brand-primary pointer-events-none z-10"
            />

            {/* Heading block */}
            <motion.div
              variants={slideInLeftVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="relative z-20 flex flex-col items-end text-right pr-4 mt-6 lg:mt-8 self-center lg:self-auto lg:ml-8"
            >
              <p className="text-white bg-black w-fit font-extrabold text-4xl lg:text-5xl leading-tight font-montserrat">
                Why we
              </p>
              <p className="text-brand-primary bg-black w-fit font-extrabold text-4xl lg:text-6xl leading-tight font-montserrat">
                Stand Out?
              </p>
              <p className="text-brand-white-alternate bg-black w-fit text-sm mt-3 max-w-68 leading-relaxed ml-auto font-bricolage">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                sed porta lacus.
              </p>
            </motion.div>

            {/* Car image — overflows below */}
            <motion.div
              variants={carVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="relative w-full max-w-md lg:max-w-lg mt-6 z-20"
            >
              <Image
                src={whiteTesla}
                alt="White sports car"
                width={1920}
                height={1080}
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
            className="flex flex-col gap-6 lg:pl-12"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUpVariants}
                className="flex items-start gap-4 group"
              >
                {/* Red square bullet */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="w-6 h-6 bg-brand-primary rounded-sm shrink-0 mt-1"
                />

                {/* Text */}
                <div>
                  <h4 className="text-white font-extrabold text-2xl font-montserrat mb-1 transition-colors duration-200">
                    {feature.title}
                  </h4>
                  <p className="text-brand-white text-sm leading-relaxed font-bricolage">
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
