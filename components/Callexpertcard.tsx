"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import Container from "./Container";
import GlowingTransparentdiv from "./GlowingTransparentdiv";
interface CallExpertCardProps {
  image: StaticImageData | string;
  title?: React.ReactNode;
  subtext?: string;
  ctaLabel?: string;
  href?: string;
}

export default function CallExpertCard({
  image,
  title = (
    <>
      Not sure what you&apos;re
      <br />
      looking for?
    </>
  ),
  subtext = "Let us know what you need, and we'll match you with the right cars.",
  ctaLabel = "Call an Expert",
  href = "tel:0297560203",
}: CallExpertCardProps) {
  return (
    <div>
      <Container>
        <div className="p-px rounded-[33px] bg-[#9C9C9C]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full overflow-hidden rounded-4xl "
            //   style={{ boxShadow: "0 8px 30px -8px rgba(0,0,0,0.6)" }}
          >
            {/* background photo */}
            <Image
              src={image}
              alt=""
              fill
              className="aboslute inset-0 object-cover object-left"
              sizes="(max-width: 768px) 100vw, 900px"
              priority={false}
            />

            {/* dark-to-red gradient, left clear / right covered */}
            {/* via-[#410E0A] */}
            <div className="absolute inset-0 bg-linear-145 from-black/10 via-[#410E0A] via-60% to-[#CA281C] to-100%" />
            {/* <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent sm:hidden" /> */}

            {/* content */}
            <div className="relative z-10 flex h-full w-full flex-col justify-center gap-3 px-6 py-6 sm:max-w-xl sm:ml-auto sm:px-8 lg:w-[48%]">
              <h3 className="font-montserrat text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                {title}
              </h3>
              <p className="font-dm-sans max-w-md text-sm text-brand-white sm:text-base">
                {subtext}
              </p>
              <GlowingTransparentdiv>
                <div className="">
                  <motion.a
                    href={href}
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    className="pl-5 pr-3 py-2 flex items-center justify-between w-full gap-4"
                  >
                    <span className="font-poppins font-semibold text-white">
                      {ctaLabel}
                    </span>
                    <motion.span
                      variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-white"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
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
                    </motion.span>
                  </motion.a>
                </div>
              </GlowingTransparentdiv>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
