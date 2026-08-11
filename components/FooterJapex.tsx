"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "./Container";
import { getAssetsStorageUrl } from "@/utils/helpers";
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function FooterJapex() {
  const footerCar = getAssetsStorageUrl("Footer/footerCar.png");
  const footerLogo = getAssetsStorageUrl("Footer/japexWhiteStrip.png");
  const lightshardLeft = getAssetsStorageUrl("Homepage/lightshardleft.png");
  const lightshardRight = getAssetsStorageUrl("Homepage/lightshardright.png");
  return (
    <footer className="relative w-full overflow-hidden">
      {/* visual band */}
      <div className="relative flex w-full flex-col items-center justify-end overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        {/* light shards, bottom corners */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="pointer-events-none -rotate-45 -ml-10 absolute bottom-0 left-0 w-1/2 max-w-xs sm:max-w-sm lg:max-w-md"
        >
          <Image
            src={lightshardLeft}
            alt=""
            width={1920}
            height={1080}
            priority={false}
            loading="lazy"
            unoptimized
            className="h-auto w-full object-contain"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="pointer-events-none rotate-45 -mr-16 absolute bottom-0 right-0 w-1/2 max-w-xs sm:max-w-sm lg:max-w-md"
        >
          <Image
            src={lightshardRight}
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            priority={false}
            unoptimized
            className="h-auto w-full object-contain"
          />
        </motion.div>

        {/* wordmark */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
          className="relative z-10 px-4 max-w-4xl"
        >
          <Image
            src={footerLogo}
            alt="Japex Motors"
            width={1920}
            height={1080}
            priority={false}
            loading="lazy"
            unoptimized
            className="h-auto w-full object-contain"
          />
        </motion.div>

        {/* car, overlaps logo bottom */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          custom={1}
          variants={fadeUp}
          animate={{ y: [0, -6, 0] }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative z-10 -mt-2 w-[75%] max-w-4xl sm:w-[70%] sm:-mt-8 lg:w-[60%] "
        >
          <Image
            src={footerCar}
            alt="Japex Motors vehicle"
            width={1920}
            height={1080}
            loading="lazy"
            priority={false}
            unoptimized
            className="h-auto w-full object-contain"
          />
        </motion.div>
      </div>
      <Container>
        {/* <div className="h-px w-full bg-gray-800 mt-4"></div> */}
        {/* standard footer content */}
        <div className="transition-all relative mt-8 z-10 text-white font-koulen mx-auto px-4 flex flex-wrap  gap-x-4 gap-y-2 items-center justify-center md:justify-between">
          <p className="text-neutral-500 flex items-center gap-1 justify-center">
            ©
            <span className="text-white flex items-center justify-center">
              {" "}
              {new Date().getFullYear()} JAPEX. All rights reserved.
            </span>
          </p>
          <div className="flex gap-4">
            <Link
              href={"/terms-and-condition"}
              className="hover:text-brand-primary transition-colors duration-300"
            >
              Terms and conditions
            </Link>
            <Link
              href={"/privacy-policy"}
              className="hover:text-brand-primary transition-colors duration-300"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
