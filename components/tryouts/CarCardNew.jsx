"use client";
import { motion } from "framer-motion";
import { formatOdometer, formatPrice, getCoverImage } from "@/utils/helpers";
import BlurRevealText from "./BlurRevealText";
import Image from "next/image";
import Link from "next/link";

export default function CarCardNew({ car }) {
  const href = `/cars/${car?.slug}`;
  const coverImage = getCoverImage(car);
  const priority = car?.is_featured; // now actually wired into <Image> below

  return (
    <Link
      href={href}
      className={`transition-all duration-200 ${
        car?.availability === "Sold out" ? "saturate-0" : ""
      }`}
    >
      <motion.div
        className="relative cursor-pointer flex flex-col justify-between rounded-[28px] overflow-hidden w-full h-full"
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
          border: "1px solid transparent",
          boxShadow: `
            inset 0 0 12.7px rgba(255,255,255,0.25),
            0 2px 10.1px -2px rgba(255,0,0,0.2),
            0 4px 6px -1px rgba(0,0,0,0.1)
          `,
          backdropFilter: "blur(61.8px)",
          WebkitBackdropFilter: "blur(61.8px)",
        }}
      >
        <div>
          {/* Image zone */}
          <div className="relative w-full aspect-4/3 flex items-center justify-center z-10">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={`${car?.year} ${car?.make} ${car?.model}`}
                fill
                className="absolute inset-0 object-cover transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-5xl">🚗</span>
              </div>
            )}
          </div>
        </div>

        {/* flex-1 wrapper so the content block actually claims leftover card height */}
        <div className="flex-1 flex flex-col relative">
          {/* Gradient glow, behind content */}
          <div
            className="absolute left-1/2 bottom-1/4 z-0"
            style={{
              width: "2px",
              height: "2px",
              borderRadius: "50%",
              background: "linear-gradient(90deg, #CA281C 0%, #64140E 100%)",
              boxShadow: "0 0 101.8px 100px rgba(202,40,28,0.55)",
            }}
          />
          <div className="absolute top-[40%] w-full h-16 bg-[#A7A8AC] z-0" />
          <div className="absolute blur-3xl bg-linear-to-b from-[#CA281C] to-[#64140E] top-10 left-0 w-full h-full opacity-45 z-0" />

          {/* INNER CARD CONTENT */}
          <motion.div
            className="relative w-full h-full flex flex-col rounded-[28px] z-20"
            style={{
              border: "1px solid transparent",
              boxShadow: `
                inset 0 0 12.7px rgba(255,255,255,0.25),
                0 2px 10.1px -2px rgba(255,0,0,0.2),
                0 4px 6px -1px rgba(0,0,0,0.1)
              `,
              backdropFilter: "blur(61.8px)",
              WebkitBackdropFilter: "blur(61.8px)",
            }}
          >
            {/* Badges — availability takes priority over Sale/Featured */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 font-dm-sans">
              {car?.availability === "Sold out" ? (
                <span className="bg-gray-800 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Sold
                </span>
              ) : car?.availability === "Coming soon" ? (
                <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Coming Soon
                </span>
              ) : car?.was_price ? (
                <div>
                  <span className="bg-brand-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Save ${car.was_price - car.price}
                  </span>
                </div>
              ) : car?.is_featured ? (
                <span className="bg-brand-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Featured
                </span>
              ) : null}
            </div>
            <motion.div
              className="pointer-events-none absolute -bottom-10 left-0 right-0 h-40"
              variants={{
                rest: { opacity: 0.5, y: 28 },
                hover: { opacity: 1, y: 24 },
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background:
                  "radial-gradient(ellipse 70% 100% at 50% 100%, #FFFFFF 0%, #FF0000 20%, rgba(210,52,52,0.05) 62%, transparent 80%)",
              }}
            />

            <div className="w-full font-bricolage h-full flex flex-col gap-1 items-center justify-start text-white p-6">
              <BlurRevealText delay={0.3}>
                <h3 className="text-lg uppercase">{car?.make}</h3>
              </BlurRevealText>
              <BlurRevealText delay={0.4}>
                <h1 className="font-bold text-2xl text-center">
                  {car?.year} {car?.model}
                </h1>
              </BlurRevealText>
              <div className="flex items-center gap-2 min-h-7">
                <BlurRevealText delay={0.5}>
                  <h3 className="text-center">{car?.variant}</h3>
                </BlurRevealText>
              </div>

              <div className="flex items-center gap-2">
                <BlurRevealText delay={0.6}>
                  <p className="text-sm">{formatOdometer(car?.odometer_km)}</p>
                </BlurRevealText>
                <BlurRevealText delay={0.65}>
                  <div className="w-1 h-1 bg-white rounded-full" />
                </BlurRevealText>
                <BlurRevealText delay={0.7}>
                  <p>{car?.transmission}</p>
                </BlurRevealText>
                <BlurRevealText delay={0.75}>
                  <div className="w-1 h-1 bg-white rounded-full" />
                </BlurRevealText>
                <BlurRevealText delay={0.8}>
                  <p>{car?.fuel_type}</p>
                </BlurRevealText>
              </div>

              <div className="mt-auto flex items-center justify-between w-full">
                <BlurRevealText delay={1}>
                  {/* {car?.was_price && (
                    <p className="text-xs text-gray-400 line-through">
                      {formatPrice(car?.was_price)}
                    </p>
                  )} */}
                  {car?.availability === "Sold out" ? (
                    <p className="text-2xl font-bold ml-2">Sold Out</p>
                  ) : (
                    <p className="text-2xl font-bold ml-2">
                      {formatPrice(car?.price)}
                    </p>
                  )}
                </BlurRevealText>
                <BlurRevealText delay={1.1}>
                  <motion.div className="z-10 text-sm cursor-pointer group/button flex items-center gap-2 rounded-full bg-white p-1 font-semibold text-black">
                    <p className="ml-2">View More</p>
                    <span>
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
                        className="group-hover/button:rotate-45 transition-all duration-300"
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </span>
                  </motion.div>
                </BlurRevealText>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
