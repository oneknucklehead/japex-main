"use client";

import Container from "@/components/Container";
import { getAssetsStorageUrl } from "@/utils/helpers";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const ArrowIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.28125 0.750001C9.28125 0.335787 8.94546 4.2594e-07 8.53125 5.73454e-07L1.78125 1.51986e-07C1.36704 1.51986e-07 1.03125 0.335786 1.03125 0.75C1.03125 1.16421 1.36704 1.5 1.78125 1.5H7.78125V7.5C7.78125 7.91421 8.11704 8.25 8.53125 8.25C8.94546 8.25 9.28125 7.91421 9.28125 7.5L9.28125 0.750001ZM0.53125 8.75L1.06158 9.28033L9.06158 1.28033L8.53125 0.75L8.00092 0.21967L0.000919923 8.21967L0.53125 8.75Z"
      fill="black"
    />
  </svg>
);

interface BannerCardProps {
  title: string;
  cardNumber: number;
  description: string;
  imageSrc: string;
  imageAlt: string;
  cardColor: "red" | "black";
}

const BannerCard = ({
  title,
  cardNumber,
  description,
  imageSrc,
  imageAlt,
  cardColor,
}: BannerCardProps) => {
  const bgClass = cardColor === "red" ? "bg-red-600" : "bg-black";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: cardNumber * 0.06 }}
      className="col-span-1 relative aspect-video w-full rounded-2xl h-full"
    >
      {/* Background image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center rounded-xl"
        loading="lazy"
      />

      {/* Floating overlay card — bottom-left */}
      <div
        className={`absolute max-w-2xs bottom-4 left-4 right-16 ${bgClass} rounded-xl p-4 flex flex-col gap-4`}
      >
        {/* Arrow button — top-right of card */}
        <div className="flex justify-end">
          <button className="bg-white rounded-lg p-2 hover:scale-105 transition-transform">
            <ArrowIcon />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-montserrat text-brand-white font-extrabold text-2xl leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="font-bricolage  text-brand-white-alternate font-semibold text-sm">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const BannerGrid = () => {
  const banner1 = getAssetsStorageUrl("Homepage/CarPartsBanner.jpg");
  const banner2 = getAssetsStorageUrl("Homepage/FinanceBanner.jpg");

  return (
    <div>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BannerCard
            title="Your Trusted Source for Quality Car Parts & Global Export Services"
            description="Lorem ipsum dolor sit amet, consectetur sed?"
            imageSrc={banner1}
            cardNumber={1}
            imageAlt="Car parts banner"
            cardColor="red"
          />
          <BannerCard
            title="Car Finance Made Simple with Our Expert Team"
            description="Lorem ipsum dolor sit amet, consectetur sed?"
            imageSrc={banner2}
            cardNumber={2}
            imageAlt="Finance banner"
            cardColor="black"
          />
        </div>
      </Container>
    </div>
  );
};

export default BannerGrid;
