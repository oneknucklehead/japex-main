"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import {
  calculateLoanPayment,
  formatCurrency,
} from "@/lib/financeCalculations";
import Link from "next/link";
import {
  formatOdometer,
  formatPrice,
  getAssetsStorageUrl,
} from "@/utils/helpers";
import type { Car } from "@/types/car";
import CarImageGallery from "@/components/Cars/CarImageGallery";
import PopularFeaturesCarousel from "@/components/Cars/PopularFeaturesCarousel";
import EnquiryModal from "@/components/Cars/EnquiryModal";
import Container from "@/components/Container";
import { AssuranceIcon } from "@/components/Icons/Icons";
import GlowingTransparentdiv from "@/components/GlowingTransparentdiv";
import Image from "next/image";
import GlowingTransparentDivTestimonial from "@/components/GlowingTransparentDivTestimonial";
interface Props {
  car: Car & { car_images: any[] };
  popularFeatures?: { id: string; name: string; image_url: string }[];
}

// Stagger container for grids/lists
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};
const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// Spec pill
const SpecPill = ({ label, value }: { label: string; value: string }) => (
  <motion.div
    variants={staggerItem}
    className="px-4 py-3 flex flex-col gap-0.5"
  >
    <p className="text-xs text-[#777777] font-medium">{label}</p>
    <p className="text-lg font-bold text-brand-white">{value}</p>
  </motion.div>
);
// Spec pill
const SpecificationsPill = ({ label }: { label: string }) => (
  <motion.div
    variants={staggerItem}
    className="group/specification bg-linear-to-tr from-white to-[#666666] rounded-full p-px"
  >
    <div className="hover:bg-linear-to-b hover:from-[#313131] hover:to-black transition-colors duration-300 bg-linear-to-b from-black to-[#313131] rounded-full px-4 py-2 flex flex-col">
      <p className="text-sm text-brand-gray font-medium">{label}</p>
    </div>
  </motion.div>
);

export default function CarDetailClient({ car, popularFeatures = [] }: Props) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const carName = `${car.year} ${car.make} ${car.model}`;
  // Est. monthly repayment (simple 5yr @ 7.9% p.a.)
  const { periodicPayment: weeklyPayment } = calculateLoanPayment({
    finalPrice: car.price,
    depositAmount: 0,
    termYears: 5, // match whatever default term Finance page use
    interestRate: 10, // match default rate
    frequency: "weekly",
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50); // percent
  const mouseY = useMotionValue(50); // percent

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };
  const googleLogo = getAssetsStorageUrl("Logo/googleLogo2.png");
  return (
    <>
      <div className="min-h-screen font-dm-sans px-6">
        <Container>
          <div className="relative">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-sm mb-6 font-poppins text-brand-gray"
            >
              <Link
                href="/"
                className="transition-colors duration-300 hover:text-white"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/cars"
                className="transition-colors duration-300 hover:text-white"
              >
                Cars
              </Link>
              <span>/</span>
              <span className="font-medium truncate text-white/90">
                {carName}
              </span>
            </motion.nav>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ── LEFT: Image gallery ── */}
              <motion.div
                className="lg:col-span-7 flex flex-col gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <CarImageGallery images={car.car_images} carName={carName} />
                <div className="block lg:hidden lg:col-span-5 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                  <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    className={`relative group flex flex-col justify-between rounded-xl overflow-hidden w-full h-fit`}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    style={{
                      // background: `
                      //   linear-gradient(#1a1414, #1a1414) padding-box,
                      //   linear-gradient(90deg,
                      //     rgba(175,175,175,0.18) 0%,
                      //     rgba(255,255,255,0.18) 50%,
                      //     rgba(126,126,126,0.18) 100%
                      //   ) border-box
                      // `,
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
                      className={`pointer-events-none absolute inset-0 rounded-xl z-20`}
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
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col gap-4 text-brand-white"
                    >
                      {/* Price card */}
                      <div className="rounded-2xl p-4 md:p-6">
                        {!!car?.was_price && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-brand-white bg-brand-primary px-2 py-1 w-fit rounded-full flex items-center text-sm gap-2 mb-3"
                          >
                            <span>
                              <svg
                                width="14"
                                height="9"
                                viewBox="0 0 14 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.0432 4.50028V8.50029C13.0432 8.63289 12.9942 8.76009 12.9068 8.85379C12.8195 8.94759 12.701 9.00029 12.5774 9.00029H8.85087C8.75863 9.00039 8.66854 8.97109 8.59187 8.91619C8.51519 8.86119 8.45538 8.78309 8.42017 8.69169C8.38486 8.60029 8.37564 8.49969 8.39362 8.40259C8.4116 8.30559 8.45603 8.21649 8.52125 8.14649L10.0556 6.50029L6.98757 3.20716L4.98803 5.35403C4.94477 5.40052 4.8934 5.4374 4.83684 5.46256C4.78029 5.48772 4.71968 5.50067 4.65846 5.50067C4.59725 5.50067 4.53663 5.48772 4.48008 5.46256C4.42353 5.4374 4.37216 5.40052 4.3289 5.35403L0.136513 0.85403C0.0491068 0.76021 0 0.63296 0 0.50028C0 0.3676 0.0491068 0.24035 0.136513 0.14653C0.22392 0.0527099 0.342471 0 0.466081 0C0.589691 0 0.708242 0.0527099 0.795649 0.14653L4.65846 4.29341L6.658 2.14653C6.70126 2.10004 6.75263 2.06316 6.80918 2.038C6.86573 2.01284 6.92635 1.99989 6.98757 1.99989C7.04878 1.99989 7.1094 2.01284 7.16595 2.038C7.2225 2.06316 7.27387 2.10004 7.31713 2.14653L10.7141 5.79341L12.2478 4.14653C12.313 4.07653 12.396 4.02884 12.4864 4.00952C12.5769 3.99019 12.6706 4.00009 12.7557 4.03797C12.8409 4.07585 12.9137 4.13999 12.9648 4.22229C13.016 4.30459 13.0433 4.40133 13.0432 4.50028Z"
                                  fill="white"
                                />
                              </svg>
                            </span>
                            <span>
                              This car is on sale, savings Upto $
                              {car.was_price - car.price}
                            </span>
                          </motion.div>
                        )}
                        {/* Title */}
                        <motion.h1
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.05 }}
                          className="text-4xl font-bold font-poppins leading-tight mb-2"
                        >
                          {carName}
                        </motion.h1>
                        {car.vin && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.08 }}
                            className="mb-2 text-xs tracking-wider text-white/70 wrap-break-word"
                          >
                            <span className="font-semibold">VIN: </span>
                            {car.vin}
                          </motion.p>
                        )}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="mb-3"
                        >
                          {car.variant}
                        </motion.p>

                        {/* Specs row */}
                        <motion.div
                          variants={staggerContainer}
                          initial="hidden"
                          animate="show"
                          className="flex items-center gap-2 text-sm text-gray-500 mb-5 flex-wrap font-dm-sans"
                        >
                          <SpecificationsPill
                            label={formatOdometer(car.odometer_km)}
                          />
                          <SpecificationsPill label={car.transmission} />
                          <SpecificationsPill label={car.fuel_type} />
                        </motion.div>
                        {/* MOBILE PRICE CARD */}
                        <div className="flex flex-wrap justify-between gap-x-4">
                          <div className="pt-4 mb-4">
                            {/* Main price */}
                            <div className="text-white font-bricolage flex items-start justify-between mb-1">
                              {car.availability !== "Sold out" ? (
                                <div>
                                  <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.15 }}
                                    className="flex gap-2 items-center"
                                  >
                                    <p className="text-4xl font-black ">
                                      {formatPrice(car.price)}*
                                    </p>
                                    {car.was_price && (
                                      <p className="text-xl text-brand-white/60 line-through mb-0.5">
                                        {formatPrice(car.was_price)}
                                      </p>
                                    )}
                                  </motion.div>
                                  <p className="text-xs text-brand-gray underline decoration-dotted mt-0.5">
                                    *Excl. Govt. charges
                                  </p>
                                  {/* <p className="text-xs text-brand-gray">
                            ^Fees and charges apply
                          </p> */}
                                </div>
                              ) : (
                                <div className="flex gap-2 items-center">
                                  <p className="text-4xl font-black ">
                                    Sold Out
                                  </p>
                                </div>
                              )}
                              {/* {car.availability === "Sold out"  */}
                              {/* && ( */}
                              {/* //   <span className="bg-brand-primary text-white text-sm font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0"> */}
                              {/* //     Sold */}
                              {/* //   </span> */}
                              {/* // )} */}

                              {car.availability !== "Sold out" &&
                                car.condition === "Excellent" && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.35, delay: 0.2 }}
                                    className="bg-brand-primary text-white text-sm font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0"
                                  >
                                    <AssuranceIcon />
                                    Assured
                                  </motion.span>
                                )}
                            </div>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="flex flex-col pt-4 mb-5 text-right"
                          >
                            <p className="text-2xl font-black ">
                              {formatCurrency(weeklyPayment)}{" "}
                              <span className="text-sm font-medium">
                                /per week
                              </span>
                            </p>
                            <p className="text-xs text-brand-gray">
                              Est. weekly repayment
                            </p>
                            <p className="text-xs text-brand-gray">
                              for 5 yr based on 10% p.a.
                            </p>
                            {car.extended_warranty && (
                              <div className="w-fit ml-auto mt-4 group/specification bg-linear-to-tr from-white to-[#666666] rounded-full p-px">
                                <div className="hover:bg-linear-to-b hover:from-[#313131] hover:to-black transition-colors duration-300 bg-linear-to-b from-black to-[#313131] rounded-full px-4 py-2 flex flex-col">
                                  <p className="text-xs text-brand-gray font-semibold">
                                    Inclusive of Extended warranty
                                  </p>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>

                        {/* CTAs — vary by availability */}
                        <div className="flex flex-col gap-3">
                          {car.availability === "Sold out" ? (
                            <>
                              <Link
                                href="/cars"
                                className="w-full text-center bg-brand-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-full transition-colors text-sm"
                              >
                                View similar cars
                              </Link>
                              {/* <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEnquiryOpen(true)}
                          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-3.5 rounded-xl border border-gray-200 transition-colors text-sm"
                        >
                          Send us an enquiry
                        </motion.button> */}
                            </>
                          ) : car.availability === "Coming soon" ? (
                            <>
                              <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setEnquiryOpen(true)}
                                className="cursor-pointer w-full bg-brand-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                              >
                                Get notified
                              </motion.button>
                              {/* <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEnquiryOpen(true)}
                          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-3.5 rounded-xl border border-gray-200 transition-colors text-sm"
                        >
                          Send us an enquiry
                        </motion.button> */}
                            </>
                          ) : (
                            <>
                              <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="cursor-pointer w-full bg-brand-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-full transition-colors duration-300"
                              >
                                Get started
                              </motion.button>
                              {/* <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEnquiryOpen(true)}
                          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-3.5 rounded-xl border border-gray-200 transition-colors text-sm"
                        >
                          Make an enquiry
                        </motion.button> */}
                            </>
                          )}

                          <motion.div
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-px
                      bg-linear-to-tr from-white to-[#666666] rounded-full
                      "
                          >
                            <motion.button
                              onClick={() => setEnquiryOpen(true)}
                              className="w-full hover:bg-linear-to-b hover:from-[#313131] hover:to-black bg-linear-to-b from-black to-[#313131] font-bold text-brand-gray py-3.5 rounded-full transition-colors duration-300 cursor-pointer"
                            >
                              Send us an enquiry
                            </motion.button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                  {/* Trust badges card */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    whileHover={{ y: -2 }}
                    className="bg-white mt-4 space-y-3 rounded-2xl p-5 border border-gray-200 transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="flex gap-4">
                      <div className="flex flex-1 flex-col items-center justify-center">
                        <svg
                          width="40"
                          height="35"
                          viewBox="0 0 33 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.83333 3.66667V0H31.1667V3.66667H1.83333ZM1.83333 29.3333V18.3333H0V14.6667L1.83333 5.5H31.1667L33 14.6667V18.3333H31.1667V29.3333H27.5V18.3333H20.1667V29.3333H1.83333ZM5.5 25.6667H16.5V18.3333H5.5V25.6667Z"
                            fill="black"
                          />
                        </svg>
                        <p className="text-[9px] mt-1 text-brand-dark">
                          Or visit in store
                        </p>
                      </div>
                      <div className="flex flex-col text-brand-dark justify-center ">
                        <h3 className="font-koulen text-3xl">Japex Motors</h3>
                        <p className="font-bricolage">
                          2 Debenham Rd S, West Gosford NSW 2250, Australia
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Image
                        src={googleLogo}
                        width={1920}
                        height={1080}
                        alt="Google logo"
                        className="w-16"
                      />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3.5 h-3.5 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* <div className="border-t border-gray-100 mt-4 pt-4 flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-800">
                          Google
                        </span>

                        <span className="text-sm font-bold text-gray-700">
                          4.7
                        </span>
                        <span className="text-xs text-gray-400">(350)</span>
                      </div> */}
                  </motion.div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="flex flex-wrap gap-x-2 gap-y-2 mt-4"
                  >
                    <motion.div variants={staggerItem}>
                      <GlowingTransparentdiv>
                        <div className="px-4 lg:px-6 py-1 lg:py-2">
                          <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                            5 Years warranty
                          </motion.p>
                        </div>
                      </GlowingTransparentdiv>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <GlowingTransparentdiv>
                        <div className="px-4 lg:px-6 py-1 lg:py-2">
                          <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                            Japanese imports
                          </motion.p>
                        </div>
                      </GlowingTransparentdiv>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <GlowingTransparentdiv>
                        <div className="px-4 lg:px-6 py-1 lg:py-2">
                          <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                            Free delivery to your door*
                          </motion.p>
                        </div>
                      </GlowingTransparentdiv>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <GlowingTransparentdiv>
                        <div className="px-4 lg:px-6 py-1 lg:py-2">
                          <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                            Verified by a team of experts
                          </motion.p>
                        </div>
                      </GlowingTransparentdiv>
                    </motion.div>
                  </motion.div>
                </div>
                {/* Specs grid — below gallery on desktop */}
                <div className="mt-6">
                  <GlowingTransparentDivTestimonial border="xl">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5 }}
                      className="p-5 text-brand-white"
                    >
                      <h3 className="font-bold font-poppins text-lg mb-4">
                        Car features
                      </h3>
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                      >
                        <SpecPill label="Body Type" value={car.body_type} />
                        <SpecPill label="Year" value={String(car.year)} />
                        <SpecPill
                          label="Odometer"
                          value={formatOdometer(car.odometer_km)}
                        />
                        <SpecPill
                          label="Transmission"
                          value={car.transmission}
                        />
                        <SpecPill label="Fuel Type" value={car.fuel_type} />
                        <SpecPill label="Drive Type" value={car.drive_type} />
                        <SpecPill label="Engine" value={car.engine || "—"} />
                        <SpecPill label="Seats" value={String(car.seats)} />
                        <SpecPill label="Doors" value={String(car.doors)} />
                        <SpecPill
                          label="Ext. Colour"
                          value={car.color_exterior || "—"}
                        />
                        <SpecPill
                          label="Int. Colour"
                          value={car.color_interior || "—"}
                        />
                        <SpecPill label="Condition" value={car.condition} />
                        {car.power_steering && (
                          <SpecPill
                            label="Power Steering"
                            value={car.power_steering}
                          />
                        )}
                        {car.custom_specs?.map((spec, i) => (
                          <SpecPill
                            key={`${spec.heading}-${i}`}
                            label={spec.heading}
                            value={spec.value}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  </GlowingTransparentDivTestimonial>
                </div>
                {/* Popular features */}
                <PopularFeaturesCarousel features={popularFeatures} />

                {/* Description */}
                {car.description && (
                  <div className="mt-4">
                    <GlowingTransparentDivTestimonial border="xl">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-xl p-5"
                      >
                        <h3 className="font-bold text-brand-white font-poppins text-lg mb-3">
                          Description
                        </h3>
                        <p className="text-sm text-brand-gray leading-relaxed font-poppins">
                          {car.description}
                        </p>
                      </motion.div>
                    </GlowingTransparentDivTestimonial>
                  </div>
                )}

                {/* Features */}
                {car.features?.length > 0 && (
                  <div className="mt-4">
                    <GlowingTransparentDivTestimonial border="xl">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-xl p-5 text-brand-white"
                      >
                        <h3 className="font-bold font-poppins text-lg mb-4">
                          Features &amp; Options
                        </h3>
                        <motion.div
                          variants={staggerContainer}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true, amount: 0.2 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                        >
                          {car.features.map((f: string) => (
                            <motion.div
                              key={f}
                              variants={staggerItem}
                              className="flex items-center gap-2.5 text-sm text-brand-gray"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                              {f}
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    </GlowingTransparentDivTestimonial>
                  </div>
                )}
              </motion.div>

              {/* ── RIGHT: Price panel ── */}
              <div className="hidden  h-fit lg:block lg:col-span-5 lg:sticky lg:top-24 lg:self-start ">
                <motion.div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  className={`relative group flex flex-col justify-between rounded-xl overflow-hidden w-full h-fit`}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  style={{
                    // background: `
                    //   linear-gradient(#1a1414, #1a1414) padding-box,
                    //   linear-gradient(90deg,
                    //     rgba(175,175,175,0.18) 0%,
                    //     rgba(255,255,255,0.18) 50%,
                    //     rgba(126,126,126,0.18) 100%
                    //   ) border-box
                    // `,
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
                    className={`pointer-events-none absolute inset-0 rounded-xl z-20`}
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
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-4 text-brand-white"
                  >
                    {/* Price card */}
                    <div className="rounded-2xl p-6">
                      {!!car?.was_price && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="text-brand-white bg-brand-primary px-2 py-1 w-fit rounded-full flex items-center text-sm gap-2 mb-3"
                        >
                          <span>
                            <svg
                              width="14"
                              height="9"
                              viewBox="0 0 14 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.0432 4.50028V8.50029C13.0432 8.63289 12.9942 8.76009 12.9068 8.85379C12.8195 8.94759 12.701 9.00029 12.5774 9.00029H8.85087C8.75863 9.00039 8.66854 8.97109 8.59187 8.91619C8.51519 8.86119 8.45538 8.78309 8.42017 8.69169C8.38486 8.60029 8.37564 8.49969 8.39362 8.40259C8.4116 8.30559 8.45603 8.21649 8.52125 8.14649L10.0556 6.50029L6.98757 3.20716L4.98803 5.35403C4.94477 5.40052 4.8934 5.4374 4.83684 5.46256C4.78029 5.48772 4.71968 5.50067 4.65846 5.50067C4.59725 5.50067 4.53663 5.48772 4.48008 5.46256C4.42353 5.4374 4.37216 5.40052 4.3289 5.35403L0.136513 0.85403C0.0491068 0.76021 0 0.63296 0 0.50028C0 0.3676 0.0491068 0.24035 0.136513 0.14653C0.22392 0.0527099 0.342471 0 0.466081 0C0.589691 0 0.708242 0.0527099 0.795649 0.14653L4.65846 4.29341L6.658 2.14653C6.70126 2.10004 6.75263 2.06316 6.80918 2.038C6.86573 2.01284 6.92635 1.99989 6.98757 1.99989C7.04878 1.99989 7.1094 2.01284 7.16595 2.038C7.2225 2.06316 7.27387 2.10004 7.31713 2.14653L10.7141 5.79341L12.2478 4.14653C12.313 4.07653 12.396 4.02884 12.4864 4.00952C12.5769 3.99019 12.6706 4.00009 12.7557 4.03797C12.8409 4.07585 12.9137 4.13999 12.9648 4.22229C13.016 4.30459 13.0433 4.40133 13.0432 4.50028Z"
                                fill="white"
                              />
                            </svg>
                          </span>
                          <span>
                            This car is on sale, savings Upto $
                            {car.was_price - car.price}
                          </span>
                        </motion.div>
                      )}
                      {/* Title */}
                      <motion.h1
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="text-4xl font-bold font-poppins leading-tight mb-2"
                      >
                        {carName}
                      </motion.h1>
                      {car.vin && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.08 }}
                          className="mb-2 text-xs tracking-wider text-white/70 wrap-break-word"
                        >
                          <span className="font-semibold">VIN: </span>
                          {car.vin}
                        </motion.p>
                      )}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="mb-3"
                      >
                        {car.variant}
                      </motion.p>

                      {/* Specs row */}
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="flex items-center gap-2 text-sm text-gray-500 mb-5 flex-wrap font-dm-sans"
                      >
                        <SpecificationsPill
                          label={formatOdometer(car.odometer_km)}
                        />
                        <SpecificationsPill label={car.transmission} />
                        <SpecificationsPill label={car.fuel_type} />
                      </motion.div>
                      {/* PRICE CARD DESKTOP */}
                      <div className="flex justify-between">
                        <div className="pt-4 mb-4">
                          {/* Main price */}
                          <div className="text-white font-bricolage flex items-start justify-between mb-1">
                            {car.availability !== "Sold out" ? (
                              <div>
                                <motion.div
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.15 }}
                                  className="flex gap-2 items-end"
                                >
                                  <p className="text-4xl font-black ">
                                    {formatPrice(car.price)}*
                                  </p>
                                  {car.was_price && (
                                    <p className="text-base text-brand-white/60 line-through mb-0.5">
                                      {formatPrice(car.was_price)}
                                    </p>
                                  )}
                                </motion.div>
                                <p className="text-xs text-brand-gray underline decoration-dotted mt-0.5">
                                  *Excl. Govt. charges
                                </p>
                                {/* <p className="text-xs text-brand-gray">
                            ^Fees and charges apply
                          </p> */}
                              </div>
                            ) : (
                              <div className="flex gap-2 items-center">
                                <p className="text-4xl font-black ">Sold Out</p>
                              </div>
                            )}
                            {/* {car.availability === "Sold out"  */}
                            {/* && ( */}
                            {/* //   <span className="bg-brand-primary text-white text-sm font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0"> */}
                            {/* //     Sold */}
                            {/* //   </span> */}
                            {/* // )} */}

                            {car.availability !== "Sold out" &&
                              car.condition === "Excellent" && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.35, delay: 0.2 }}
                                  className="bg-brand-primary text-white text-sm font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0"
                                >
                                  <AssuranceIcon />
                                  Assured
                                </motion.span>
                              )}
                          </div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="pt-4 mb-5 text-right"
                        >
                          <p className="text-2xl font-black ">
                            {formatCurrency(weeklyPayment)}{" "}
                            <span className="text-sm font-medium">
                              /per week
                            </span>
                          </p>
                          <p className="text-xs text-brand-gray">
                            Est. weekly repayment
                          </p>
                          <p className="text-xs text-brand-gray">
                            for 5 yr based on 10% p.a.
                          </p>
                          {car.extended_warranty && (
                            <div className="w-fit ml-auto mt-4 group/specification bg-linear-to-tr from-white to-[#666666] rounded-full p-px">
                              <div className="hover:bg-linear-to-b hover:from-[#313131] hover:to-black transition-colors duration-300 bg-linear-to-b from-black to-[#313131] rounded-full px-4 py-2 flex flex-col">
                                <p className="text-xs text-brand-gray font-semibold">
                                  Inclusive of Extended warranty
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* CTAs — vary by availability */}
                      <div className="flex flex-col gap-3">
                        {car.availability === "Sold out" ? (
                          <>
                            <Link
                              href="/cars"
                              className="w-full text-center bg-brand-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-full transition-colors text-sm"
                            >
                              View similar cars
                            </Link>
                            {/* <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEnquiryOpen(true)}
                          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-3.5 rounded-xl border border-gray-200 transition-colors text-sm"
                        >
                          Send us an enquiry
                        </motion.button> */}
                          </>
                        ) : car.availability === "Coming soon" ? (
                          <>
                            <motion.button
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setEnquiryOpen(true)}
                              className="cursor-pointer w-full bg-brand-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                            >
                              Get notified
                            </motion.button>
                            {/* <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEnquiryOpen(true)}
                          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-3.5 rounded-xl border border-gray-200 transition-colors text-sm"
                        >
                          Send us an enquiry
                        </motion.button> */}
                          </>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              className="cursor-pointer w-full bg-brand-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-full transition-colors duration-300"
                            >
                              Get started
                            </motion.button>
                            {/* <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEnquiryOpen(true)}
                          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-3.5 rounded-xl border border-gray-200 transition-colors text-sm"
                        >
                          Make an enquiry
                        </motion.button> */}
                          </>
                        )}

                        <motion.div
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-px
                      bg-linear-to-tr from-white to-[#666666] rounded-full
                      "
                        >
                          <motion.button
                            onClick={() => setEnquiryOpen(true)}
                            className="w-full hover:bg-linear-to-b hover:from-[#313131] hover:to-black bg-linear-to-b from-black to-[#313131] font-bold text-brand-gray py-3.5 rounded-full transition-colors duration-300 cursor-pointer"
                          >
                            Send us an enquiry
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
                {/* Trust badges card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  whileHover={{ y: -2 }}
                  className="bg-white mt-4 space-y-3 rounded-2xl p-5 border border-gray-200 transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="flex flex-1 flex-col items-center justify-center">
                      <svg
                        width="40"
                        height="35"
                        viewBox="0 0 33 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.83333 3.66667V0H31.1667V3.66667H1.83333ZM1.83333 29.3333V18.3333H0V14.6667L1.83333 5.5H31.1667L33 14.6667V18.3333H31.1667V29.3333H27.5V18.3333H20.1667V29.3333H1.83333ZM5.5 25.6667H16.5V18.3333H5.5V25.6667Z"
                          fill="black"
                        />
                      </svg>
                      <p className="text-[9px] mt-1 text-brand-dark">
                        Or visit in store
                      </p>
                    </div>
                    <div className="flex flex-col text-brand-dark justify-center ">
                      <h3 className="font-koulen text-3xl">Japex Motors</h3>
                      <p className="font-bricolage">
                        2 Debenham Rd S, West Gosford NSW 2250, Australia
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src={googleLogo}
                      width={1920}
                      height={1080}
                      alt="Google logo"
                      className="w-16"
                    />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3.5 h-3.5 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* <div className="border-t border-gray-100 mt-4 pt-4 flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-800">
                          Google
                        </span>

                        <span className="text-sm font-bold text-gray-700">
                          4.7
                        </span>
                        <span className="text-xs text-gray-400">(350)</span>
                      </div> */}
                </motion.div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="flex flex-wrap items-center justify-between gap-4 mt-4"
                >
                  <motion.div variants={staggerItem}>
                    <GlowingTransparentdiv>
                      <div className="px-6 py-2">
                        <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                          5 Years warranty
                        </motion.p>
                      </div>
                    </GlowingTransparentdiv>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <GlowingTransparentdiv>
                      <div className="px-6 py-2">
                        <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                          Free delivery to your door*
                        </motion.p>
                      </div>
                    </GlowingTransparentdiv>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <GlowingTransparentdiv>
                      <div className="px-6 py-2">
                        <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                          Verified by a team of experts
                        </motion.p>
                      </div>
                    </GlowingTransparentdiv>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <GlowingTransparentdiv>
                      <div className="px-6 py-2">
                        <motion.p className="font-koulen uppercase leading-8 text-sm md:text-xl text-white">
                          Japanese imports
                        </motion.p>
                      </div>
                    </GlowingTransparentdiv>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Enquiry modal */}
      <AnimatePresence>
        {enquiryOpen && (
          <EnquiryModal
            carId={car.id}
            carName={carName}
            onClose={() => setEnquiryOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
