"use client";

import Container from "@/components/Container";
import GlowingTransparentDivTestimonial from "@/components/GlowingTransparentDivTestimonial";
import { motion } from "framer-motion";
import Link from "next/link";

// ── Shared motion presets ──────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const stagger = {
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, margin: "-80px" },
};

// ── Data ────────────────────────────────────────────────────────────────────
const LAST_UPDATED = "July 2026";

const TERMS = [
  {
    title: "Website Information",
    body: "We make every effort to ensure the information on this website is accurate and up to date. However, vehicle descriptions, specifications, prices, and availability may change without notice. Errors or omissions may occur, and we reserve the right to correct them.",
  },
  {
    title: "Vehicle Availability",
    body: "All vehicles advertised are subject to prior sale and availability. Listing a vehicle on our website does not guarantee it is still available for purchase.",
  },
  {
    title: "Vehicle Inspections",
    body: "Every vehicle is thoroughly inspected before being offered for sale. Our team in Japan, including experienced mechanics and vehicle inspectors, carefully inspects each vehicle before purchase. Once the vehicle arrives in Australia, it is inspected again, including a final inspection during the Blue Slip process before registration. Customers are also welcome to arrange an independent mechanic or vehicle inspector to inspect the vehicle before purchase.",
  },
  {
    title: "Deposits",
    body: "Deposits are generally refundable if you decide not to proceed with your purchase. However, if you ask us to register the vehicle or carry out any work on it and then change your mind, you will be responsible for the cost of the work already completed. Our team will explain these conditions before any work begins.",
  },
  {
    title: "Pricing",
    body: "Unless otherwise stated, all prices are in Australian Dollars (AUD). Prices may change without notice and do not include government charges or registration costs unless specified.",
  },
  {
    title: "Warranties and Consumer Rights",
    body: "Some vehicles may be sold with a warranty. Details of any applicable warranty will be provided before purchase. Nothing in these Terms & Conditions excludes, restricts, or modifies any rights or remedies you may have under the Australian Consumer Law or any other applicable law.",
  },
  {
    title: "Intellectual Property",
    body: "All content on this website, including text, images, logos, and graphics, is owned by or licensed to Japex Motors and may not be copied, reproduced, or used without our written permission.",
  },
];

// ── Small reusable bits ──────────────────────────────────────────────────────
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary mb-3 font-dm-sans">
    {children}
  </p>
);

export default function TermsClient() {
  return (
    <div className="min-h-screen font-dm-sans overflow-hidden">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative text-brand-white">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16 lg:pt-36 lg:pb-24 relative">
            <motion.div {...fadeUp}>
              <Eyebrow>Legal</Eyebrow>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-poppins leading-[1.1] mb-4 sm:mb-5 max-w-3xl">
                Terms &amp;
                <span className="text-brand-primary"> Conditions.</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-brand-gray max-w-2xl leading-relaxed font-dm-sans">
                Welcome to the Japex Motors website. By accessing or using this
                website, you agree to these Terms &amp; Conditions.
              </p>
              <p className="text-xs sm:text-sm text-brand-gray/70 mt-4">
                Last updated: {LAST_UPDATED}
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── The terms ─────────────────────────────────────────────────────── */}
      <section className="relative py-12 sm:py-16 lg:py-24">
        <div className="pointer-events-none absolute bottom-0 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/15 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div className="mb-8 sm:mb-10" {...fadeUp}>
              <Eyebrow>The Detail</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                What you agree to when you use this site.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {TERMS.map((term, i) => (
                <motion.div key={term.title} variants={fadeUp}>
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-5 sm:p-6 h-full">
                      <span className="inline-flex items-center justify-center w-fit h-fit p-2 rounded-lg bg-brand-primary text-brand-white font-black font-poppins text-xs sm:text-sm mb-3 sm:mb-4">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-brand-white font-poppins mb-2 leading-snug">
                        {term.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                        {term.body}
                      </p>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Governing law ─────────────────────────────────────────────────── */}
      <section className="relative py-12 sm:py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div
              className="bg-linear-to-r from-white to-[#CA281C] p-px rounded-2xl"
              {...fadeUp}
            >
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#150606] to-black border border-white/10 p-6 sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute -bottom-20 -right-20 w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-brand-primary/20 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-fit h-fit p-2 rounded-lg bg-brand-primary text-brand-white font-black font-poppins text-xs sm:text-sm shrink-0">
                      08
                    </span>
                    <Eyebrow>Governing Law</Eyebrow>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins mb-3 text-brand-white leading-tight">
                    New South Wales, Australia.
                  </h2>
                  <p className="text-sm lg:text-base text-brand-gray leading-relaxed max-w-3xl">
                    These Terms &amp; Conditions are governed by the laws of New
                    South Wales, Australia. Any disputes relating to these Terms
                    &amp; Conditions or the use of this website will be subject
                    to the jurisdiction of the courts of New South Wales.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div {...fadeUp}>
              <GlowingTransparentDivTestimonial border="2xl">
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-poppins mb-2 text-brand-white leading-tight">
                      Questions about these terms?
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                      Our team is happy to walk you through anything here before
                      you buy.
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="shrink-0"
                  >
                    <Link
                      href="/contact"
                      className="inline-block bg-brand-primary hover:bg-red-700 text-white font-bold px-5 py-3 sm:px-7 sm:py-3.5 rounded-full transition-colors text-xs sm:text-sm whitespace-nowrap"
                    >
                      Contact us
                    </Link>
                  </motion.div>
                </div>
              </GlowingTransparentDivTestimonial>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
