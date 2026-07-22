"use client";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { useRef } from "react";

import BlurRevealText from "./BlurRevealText";
import { formatOdometer, formatPrice, getCoverImage } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";

export default function CarCardFirst({ car }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const href = `/cars/${car?.slug}`;
  const coverImage = getCoverImage(car);
  const priority = car?.is_featured;
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <Link
      href={href}
      className={`card transition-all duration-200 ${
        car?.availability === "Sold out" ? "saturate-0" : ""
      }`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="relative group cursor-pointer flex flex-col rounded-[28px] overflow-hidden w-full h-full"
        initial="rest"
        whileHover="hover"
        animate="rest"
        style={{
          background: `
            linear-gradient(#1a1414, #1a1414) padding-box,
            linear-gradient(90deg,
              rgba(175,175,175,0.18) 0%,
              rgba(255,255,255,0.18) 50%,
              rgba(126,126,126,0.18) 100%
            ) border-box
          `,
          // border: "1px solid transparent",
          boxShadow: `
          inset 0 0 12.7px rgba(255,255,255,0.25),
          0 2px 10.1px -2px rgba(255,0,0,0.2),
          0 4px 6px -1px rgba(0,0,0,0.1)
        `,
          backdropFilter: "blur(61.8px)",
          WebkitBackdropFilter: "blur(61.8px)",
        }}
      >
        {/* Cursor-tracking glow, hugs border only, all sides */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[28px] z-20"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            padding: "2px",
            background: useMotionTemplate`radial-gradient(140px circle at ${mouseX}% ${mouseY}%, rgba(255,20,20,1) 0%, rgba(180,10,10,0.6) 40%, transparent 70%)`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <div className="relative flex items-center justify-center">
          <div className="relative w-full aspect-video overflow-hidden">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={`${car?.year} ${car?.make} ${car?.model}`}
                fill
                className=" p-2 rounded-[28px] object-cover transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-5xl">🚗</span>
              </div>
            )}

            {/* Badges — availability takes priority over Sale/Featured */}
            <div className="absolute font-dm-sans top-4 left-4 flex gap-2">
              {car?.availability === "Sold out" ? (
                <span className="bg-gray-800 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Sold
                </span>
              ) : car?.availability === "Coming soon" ? (
                <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Coming Soon
                </span>
              ) : car?.was_price ? (
                // <div className="flex justify-between bg-amber-200">
                <span className="bg-brand-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Save ${car.was_price - car.price}
                </span>
              ) : // </div>
              car?.is_featured ? (
                <span className="bg-brand-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Featured
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {/* INNER CARD CONTENT */}
          <motion.div className="relative w-full h-full ">
            <div className="w-full font-bricolage h-full flex flex-col gap-1 items-center justify-start text-white p-4">
              <div className="flex items-center justify-center flex-col">
                {car?.was_price && (
                  <BlurRevealText delay={0.2}>
                    <div className="font-dm-sans">
                      <span className="bg-brand-primary text-white text-sm font-semibold px-2.5 py-1 rounded-full">
                        On sale!
                      </span>
                    </div>
                  </BlurRevealText>
                )}
                <BlurRevealText delay={0.3}>
                  <h3 className="text-center font-semibold text-[#CA281C] text-xl uppercase">
                    {car?.make}
                  </h3>
                </BlurRevealText>
                <BlurRevealText delay={0.4}>
                  <h1 className="text-center font-extrabold text-3xl">
                    {car?.year} {car?.model}
                  </h1>
                </BlurRevealText>
                <div className="flex items-center gap-2 min-h-7">
                  <BlurRevealText delay={0.5}>
                    <h3 className="text-center">{car?.variant}</h3>
                  </BlurRevealText>
                  {/* <BlurRevealText delay={0.6}>
                <h3> Highroof</h3>
              </BlurRevealText> */}
                </div>
                {/* Specs row */}
                <div className="flex items-center gap-2 my-2">
                  <BlurRevealText delay={0.6}>
                    <p className="text-[#A2A2A2]">
                      {formatOdometer(car?.odometer_km)}
                    </p>
                  </BlurRevealText>
                  <BlurRevealText delay={0.65}>
                    <div className="w-1 h-1  bg-[#CA281C] rounded-full"></div>
                  </BlurRevealText>
                  <BlurRevealText delay={0.7}>
                    <p className="text-[#A2A2A2]">{car?.transmission}</p>
                  </BlurRevealText>
                  <BlurRevealText delay={0.75}>
                    <div className="w-1 h-1  bg-[#CA281C] rounded-full"></div>
                  </BlurRevealText>
                  <BlurRevealText delay={0.8}>
                    <p className="text-[#A2A2A2] flex">{car?.fuel_type}</p>
                  </BlurRevealText>
                </div>
              </div>
              <div className="w-full mt-auto flex justify-start items-start flex-col">
                <motion.button className="mt-auto cursor-pointer flex items-center bg-brand-primary hover:bg-[#CA281C]/80 transition-all duration-300 p-2 rounded-full justify-between w-full">
                  <BlurRevealText delay={1}>
                    {/* <p className="text-2xl font-bold ml-2">$42,100</p> */}
                    <div className="flex flex-col items-start">
                      {car?.availability === "Sold out" ? (
                        <p className="text-2xl font-bold ml-2">Sold Out</p>
                      ) : (
                        <div className="flex flex-col items-start">
                          <span className="text-2xl font-bold  ml-2">
                            {formatPrice(car?.price)}
                          </span>
                        </div>
                      )}
                    </div>
                  </BlurRevealText>
                  <BlurRevealText delay={1.1}>
                    <motion.div className="flex text-sm group/button items-center  gap-1 rounded-full bg-white p-1 font-semibold text-black">
                      <p className="ml-2">View More</p>
                      <span className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="group-hover/button:rotate-45 transition-all duration-300 lucide lucide-arrow-up-right-icon lucide-arrow-up-right"
                        >
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </span>
                    </motion.div>
                  </BlurRevealText>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
