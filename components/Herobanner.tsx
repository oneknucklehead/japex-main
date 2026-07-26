"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import herobanner from "../assets/herobanner.png";
import herotext from "../assets/herotext.png";
import GlowingTransparentdiv from "./GlowingTransparentdiv";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-full min-h-screen overflow-hidden bg-black">
      {/* background photo + dust */}
      <div className="absolute inset-0">
        <Image
          src={herobanner}
          alt="Hero image"
          width={1920}
          height={1080}
          sizes="(max-width: 768px) 90vw, 50vw"
          priority
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="flex flex-wrap items-end justify-center gap-4  absolute h-60 bottom-0 w-full bg-linear-to-b from-transparent  to-black">
          {/* <div className="hidden sm:flex flex-wrap items-end justify-center gap-4 ">
            <GlowingTransparentdiv>
              <div className="px-6 py-2">
                <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                  5 Years warranty
                </motion.p>
              </div>
            </GlowingTransparentdiv>
            <GlowingTransparentdiv>
              <div className="px-6 py-2">
                <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                  Verified by a team of experts
                </motion.p>
              </div>
            </GlowingTransparentdiv>
            <GlowingTransparentdiv>
              <div className="px-6 py-2">
                <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                  Japanese imports
                </motion.p>
              </div>
            </GlowingTransparentdiv>
          </div> */}
        </div>
      </div>
      <div className="absolute px-6 md:px-8 inset-0 flex flex-col items-center justify-center h-fit w-full max-w-2xl md:max-w-3xl text-center mx-auto z-10 pt-32 md:pt-40">
        <div className="w-full  max-w-2xl md:max-w-3xl mb-2   md:mb-4">
          <Image
            src={herotext}
            alt=""
            width={1920}
            height={1080}
            sizes="(max-width: 768px) 90vw, 50vw"
            priority
            className="w-full h-full object-cover object-center"
          />
          <motion.p className="font-montserrat font-medium text-sm md:text-xl">
            Buy and sell cars with confidence and ease.
          </motion.p>
        </div>
        <motion.button className="group flex gap-4 w-fit cursor-pointer items-center justify-center bg-brand-primary text-white font-montserrat font-bold text-sm pl-4 pr-2 py-2 rounded-full hover:bg-red-700 transition-all duration-300">
          <motion.p className="text-sm md:text-lg">Get a quote</motion.p>
          <motion.span className="bg-white text-black rounded-full p-1 flex items-center justify-center group-hover:rotate-45 transition-all duration-300">
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
              className="hidden md:block lucide lucide-arrow-up-right-icon lucide-arrow-up-right"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
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
              className="block md:hidden w-4 h-4 lucide lucide-arrow-up-right-icon lucide-arrow-up-right"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
}
