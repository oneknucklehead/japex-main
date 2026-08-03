"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "./Container";
import GlowingTransparentdiv from "./GlowingTransparentdiv";
import { getAssetsStorageUrl } from "@/utils/helpers";

interface CallExpertCardProps {
  title?: React.ReactNode;
  subtext?: string;
  ctaLabel?: string;
  href?: string;
}

export default function CallExpertCard({
  title = (
    <>
      Not sure what you&apos;re
      <br />
      looking for?
    </>
  ),
  subtext = "Let us know what you need, and we'll match you with the right cars.",
  ctaLabel = "Call an Expert",
  href = "tel:0280414967",
}: CallExpertCardProps) {
  const bannerImage = getAssetsStorageUrl("Homepage/CTABanner1.jpeg");

  return (
    <div className="px-6 sm:px-5 md:px-6">
      <Container>
        <div className="p-px rounded-[25px] sm:rounded-[29px] md:rounded-[33px] bg-[#9C9C9C]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full overflow-hidden rounded-3xl sm:rounded-[28px] md:rounded-4xl "
          >
            {/* background photo */}
            <Image
              src={bannerImage}
              alt="CTA Banner"
              fill
              className="object-cover object-left"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              priority={false}
            />

            {/* dark-to-red gradient, left clear / right covered */}
            <div className="absolute inset-0 bg-linear-145 from-black/10 via-[#410E0A] via-60% to-[#CA281C] to-100%" />
            {/* extra darkening on small screens so text stays legible over the photo */}
            <div className="absolute inset-0 bg-black/40 sm:hidden" />

            {/* content */}
            <div className="relative z-10 flex h-full w-full flex-col justify-between gap-6 sm:gap-8 px-5 py-8 sm:max-w-md sm:ml-auto sm:px-6 sm:py-8 md:max-w-lg md:px-8 md:py-10 lg:max-w-xl lg:py-12">
              {/* text block — top */}
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <h3 className="font-montserrat text-xl font-extrabold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                  {title}
                </h3>
                <p className="font-dm-sans max-w-md text-brand-white text-sm md:text-base">
                  {subtext}
                </p>
              </div>

              {/* CTA — bottom */}
              <div className="w-fit">
                <GlowingTransparentdiv>
                  <motion.a
                    href={href}
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    className="pl-4 pr-2 py-1.5 sm:pl-5 sm:pr-3 sm:py-2 flex items-center justify-between w-full gap-3 sm:gap-4"
                  >
                    <span className="font-poppins text-sm sm:text-base font-semibold text-white whitespace-nowrap">
                      {ctaLabel}
                    </span>
                    <motion.span
                      variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-brand-white shrink-0"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-3 w-3 sm:h-3.5 sm:w-3.5"
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
                </GlowingTransparentdiv>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
