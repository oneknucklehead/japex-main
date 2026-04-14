"use client";

import Container from "@/components/Container";
import SkeletonImage from "@/components/SkeletonImage";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { getAssetsStorageUrl } from "@/utils/helpers";

const MainBanner = () => {
  const homeBanner = "Homepage/homeBanner1.png";
  const homeBannerUrl = getAssetsStorageUrl(homeBanner);

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      {/* TEXT CONTAINER */}
      <Container>
        <div className="z-20 absolute flex flex-col gap-4 mt-16">
          <motion.h1 className="font-montserrat font-extrabold text-6xl text-brand-white max-w-xl leading-tight">
            Buy and sell cars with confidence and ease.
          </motion.h1>
          <div>
            <p className="font-dm-sans text-brand-white-alternate">
              Fair. Simple. Trusted.
            </p>
            <p className="font-dm-sans text-brand-white-alternate">
              The way car ownership should be.
            </p>
          </div>
          <button className="flex items-center w-fit justify-center gap-4 flex-wrap bg-brand-primary text-brand-white cursor-pointer px-4 py-2 rounded-lg font-montserrat font-extrabold text-xl hover:bg-red-700 transition-colors">
            <p>Get a quote</p>
            <span className="bg-brand-white rounded-sm  p-2">
              <svg
                width="10"
                height="9"
                viewBox="0 0 10 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.06375 1.18294C9.09042 0.797263 8.79938 0.462988 8.41371 0.436317L2.12872 0.0016954C1.74304 -0.0249752 1.40876 0.266058 1.38209 0.651736C1.35542 1.03741 1.64646 1.37169 2.03213 1.39836L7.61879 1.78469L7.23246 7.37135C7.20579 7.75703 7.49682 8.0913 7.8825 8.11797C8.26818 8.14464 8.60245 7.85361 8.62913 7.46793L9.06375 1.18294ZM0.458984 8.01831L0.918633 8.54625L8.82506 1.66259L8.36542 1.13465L7.90577 0.606707L-0.000663946 7.49037L0.458984 8.01831Z"
                  fill="black"
                />
              </svg>
            </span>
          </button>
        </div>
      </Container>
      {/* IMAGE CONTAINER */}
      <div className="absolute inset-0 z-10">
        <SkeletonImage
          src={homeBannerUrl}
          alt="homepage banner"
          containerClassName="relative w-full h-full"
          className="object-center object-cover w-full h-full"
        />
      </div>
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 max-w-2xl z-20">
        <div className="bg-brand-white rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.25)] flex items-center p-4 gap-4">
          {/* Search input */}
          <div className="flex-1 bg-brand-gray h-full rounded-[15px] flex items-center px-4 gap-3">
            <div className="p-3 bg-black rounded-[15px] flex items-center justify-center shrink-0">
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.4583 10.0833H10.7342L10.4775 9.83583C11.3758 8.79083 11.9167 7.43417 11.9167 5.95833C11.9167 2.6675 9.24917 0 5.95833 0C2.6675 0 0 2.6675 0 5.95833C0 9.24917 2.6675 11.9167 5.95833 11.9167C7.43417 11.9167 8.79083 11.3758 9.83583 10.4775L10.0833 10.7342V11.4583L14.6667 16.0325L16.0325 14.6667L11.4583 10.0833ZM5.95833 10.0833C3.67583 10.0833 1.83333 8.24083 1.83333 5.95833C1.83333 3.67583 3.67583 1.83333 5.95833 1.83333C8.24083 1.83333 10.0833 3.67583 10.0833 5.95833C10.0833 8.24083 8.24083 10.0833 5.95833 10.0833Z"
                  fill="white"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles..."
              className="bg-transparent py-4 font-bricolage text-[#afafaf] text-[20px] outline-none flex-1"
            />
          </div>

          {/* OR divider */}
          <span className=" font-bricolage text-[#848484] text-[16px] shrink-0">
            OR
          </span>

          {/* Browse all CTA */}
          <Link
            href="/cars"
            className="bg-brand-primary rounded-[15px] px-6 py-4 flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <span className="font-montserrat font-extrabold text-lg text-white">
              Browse all cars
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
