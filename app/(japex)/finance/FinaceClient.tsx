"use client";

import Container from "@/components/Container";
import GetInTouch from "@/components/GetInTouch";
import GlowingTransparentDivTestimonial from "@/components/GlowingTransparentDivTestimonial";
import GlowingTransparentNoBackground from "@/components/GlowingTransparentNoBackground";
import { getAssetsStorageUrl } from "@/utils/helpers";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

// ── Images ──────────────────────────────────────────────────────────────────
const HERO_IMAGE = getAssetsStorageUrl("Finance/financeBanner.jpg");

// ── Data ────────────────────────────────────────────────────────────────────
const FINANCE_STEPS = [
  {
    n: "1",
    title: "Tell us your situation",
    body: "Budget, vehicle, deposit, employment. No commitment — just a conversation.",
  },
  {
    n: "2",
    title: "We search the market",
    body: "We compare rates across multiple lenders simultaneously — on your behalf, not theirs.",
  },
  {
    n: "3",
    title: "You see your options clearly",
    body: "Repayments, total cost, rate, fees — side by side. Every number explained.",
  },
  {
    n: "4",
    title: "Approved and on the road",
    body: "We handle the paperwork. Most approvals same day. Drive away fast",
  },
];

const FINANCE_OPTIONS = [
  {
    tag: "Personal",
    title: "Consumer Car Loan",
    body: "Own it from day one. Fixed repayments around your pay cycle.",
  },
  {
    tag: "Business",
    title: "Chattel Mortgage",
    body: "Own the asset immediately. Potential GST, depreciation and interest claims.",
  },
  {
    tag: "Salaried Employees",
    title: "Novated Lease",
    body: "Pre-tax salary repayments. Reduce your taxable income. We'll walk you through it.",
  },
  {
    tag: "Flexible Cashflow",
    title: "Balloon Payment Loan",
    body: "Lower monthly repayments, lump sum at the end. For buyers who want flexibility.",
  },
];

const WHY_DIFFERENT = [
  {
    title: "Not tied to one lender",
    body: "Real competition across a broad panel of partners.",
  },
  {
    title: "All credit situations",
    body: "First-timers, self-employed, complex history — we find a way.",
  },
  {
    title: "No hidden import costs",
    body: "Compliance is in-house. What we quote is what you pay.",
  },
  {
    title: "Zero obligation",
    body: "A quote is just a quote. No pressure, no countdown.",
  },
  {
    title: "Fast approvals",
    body: "Most conditional approvals same business day.",
  },
  {
    title: "Trade-ins welcome",
    body: "Fair market appraisal on the spot, applied to your deal.",
  },
];

const INSPECTION_CHECKS = [
  "Full mechanical inspection",
  "Accident and repair record review",
  "Undercarriage and chassis check",
  "Interior and electrical check",
  "Engine bay assessment",
  "Cross-referenced against auction grade",
  "Verified service history",
  "Final sign-off before shipping",
];

const FAQS = [
  {
    q: "Do I need a deposit?",
    a: "Not always. We will model both options so you can see the real difference.",
  },
  {
    q: "Any extra costs from importing?",
    a: "None. All shipping, customs, compliance, and registration are in the purchase price upfront.",
  },
  {
    q: "How fast is approval?",
    a: "Conditional approval usually same business day.",
  },
  {
    q: "Can I pay out early?",
    a: "Most lenders allow it. Early payout fees flagged clearly before you commit.",
  },
  {
    q: "Will it affect my credit score?",
    a: "A formal application involves a credit enquiry. We walk you through it before submitting.",
  },
  {
    q: "What does the warranty cover?",
    a: "Major mechanical, engine, and drivetrain as standard, through our trusted warranty partner. Upgrade available for broader coverage.",
  },
  {
    q: "Can I trade in my car?",
    a: "Yes. Fair market appraisal on the spot, credited directly against your purchase price.",
  },
];

const WARRANTY_TIERS = [
  {
    tag: "Standard — Included",
    title: "5-Year Warranty",
    body: "Covers major mechanical components, engine, and drivetrain. Valid at authorised service centres across Australia.",
  },
  {
    tag: "Optional Upgrade",
    title: "Extended Coverage Plan",
    body: "Broader component coverage, electrical systems, and enhanced roadside assistance. Talk to our team about what's right for your vehicle.",
  },
];

// ── Small reusable bits ──────────────────────────────────────────────────────
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary mb-3 font-dm-sans">
    {children}
  </p>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-brand-primary shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/**
 * Image with a shimmer skeleton underneath that fades out once the image has
 * decoded. Pass `priority` for above-the-fold instances (it becomes the LCP
 * candidate, so deferring the request would only delay first paint); leave it
 * off below the fold and it falls through to native lazy loading.
 */
const SkeletonImage = ({
  src,
  alt,
  priority = false,
  className = "aspect-4/3 lg:aspect-4/5",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl ${className}`}>
      {/* skeleton — sits underneath, fades out on load */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-white/5 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="(max-width: 1024px) 100vw, 45vw"
        onLoad={() => setLoaded(true)}
        className={`object-cover object-center transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default function FinanceClient() {
  return (
    <div className="min-h-screen overflow-hidden bg-black font-dm-sans">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-black text-brand-white">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="relative px-4 sm:px-5 md:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16 lg:pt-36 lg:pb-24">
            <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
              {/* copy */}
              <motion.div className="lg:col-span-7" {...fadeUp}>
                <Eyebrow>Experience Life. Drive It Your Way.</Eyebrow>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-poppins leading-[1.1] mb-4 sm:mb-5 max-w-3xl">
                  Finance Without
                  <br />
                  <span className="text-brand-primary">the Headache.</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-brand-gray max-w-2xl leading-relaxed font-dm-sans">
                  Multiple lenders, one team, zero runaround. We find the right
                  structure for your life — and because compliance is handled
                  in-house, the price you see is the price you pay.
                </p>
              </motion.div>

              {/* image */}
              <motion.div
                className="lg:col-span-5"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <SkeletonImage
                  src={HERO_IMAGE}
                  alt="Japex Motors finance — driving away in a Japanese import"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Our Team On The Ground In Japan ───────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div {...fadeUp}>
              <Eyebrow>Our Team On The Ground In Japan</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight mb-3">
                Every car personally inspected before it leaves Japan.
              </h2>
              <p className="text-sm lg:text-base text-brand-gray leading-relaxed">
                We don&apos;t rely on auction listings, online photos, or
                third-party reports. Our dedicated team of inspectors travels
                throughout Japan to physically assess every vehicle we consider
                — before a single bid is placed. They check what photos never
                show: the undercarriage, the engine bay, the full history behind
                the grade.
              </p>
            </motion.div>

            <motion.div className="mt-10" {...fadeUp}>
              <GlowingTransparentNoBackground border="2xl">
                <div className="relative overflow-hidden rounded-2xl">
                  {/* glow — behind, clipped, non-interactive */}
                  <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-full sm:h-96 rounded-full bg-brand-primary/15 blur-3xl z-0" />
                  <div className="relative z-10 p-6 lg:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                      {INSPECTION_CHECKS.map((c) => (
                        <div
                          key={c}
                          className="flex items-center gap-3 text-sm text-brand-gray"
                        >
                          <CheckIcon />
                          {c}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-brand-gray italic mt-6 pt-5 border-t border-white/10">
                      If it doesn&apos;t meet our standard on the ground in
                      Japan, it doesn&apos;t come to Australia. Simple as that.
                    </p>
                  </div>
                </div>
              </GlowingTransparentNoBackground>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Warranty Protection ───────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div {...fadeUp}>
              <Eyebrow>Warranty Protection</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight mb-3">
                5-Year Warranty — Standard on Every Vehicle
              </h2>
              <p className="text-sm lg:text-base text-brand-gray leading-relaxed">
                <b className="text-brand-white">
                  Full peace of mind, provided through our trusted warranty
                  partner, applicable Australia wide.
                </b>{" "}
                Every vehicle that leaves the Japex lot comes with a 5-year
                warranty plan as standard — provided through our trusted
                warranty partner, so you get proper cover backed by a dedicated
                provider. Whether you&apos;re driving daily in Gosford or
                heading up to Port Macquarie for the weekend, you&apos;re
                covered.
              </p>
            </motion.div>

            {/* Warranty tiers */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {WARRANTY_TIERS.map((t) => (
                <motion.div key={t.title} variants={fadeUp}>
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                        {t.tag}
                      </p>
                      <h3 className="text-lg font-bold text-brand-white font-poppins mb-2">
                        {t.title}
                      </h3>
                      <p className="text-sm text-brand-gray leading-relaxed">
                        {t.body}
                      </p>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>

            {/* Warranty highlights */}
            <motion.div
              className="mt-5 bg-linear-to-r from-white to-[#CA281C] p-px rounded-2xl"
              {...fadeUp}
            >
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#150606] to-black border border-white/10 p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-8 text-sm font-semibold text-brand-white">
                <div className="pointer-events-none absolute -bottom-16 -right-16 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-brand-primary/20 blur-3xl" />
                <span className="relative flex items-center gap-2">
                  <span className="text-brand-primary">✦</span> Australia-wide
                  coverage
                </span>
                <span className="relative flex items-center gap-2">
                  <span className="text-brand-primary">✦</span> Transferable if
                  you sell
                </span>
                <span className="relative flex items-center gap-2">
                  <span className="text-brand-primary">✦</span> Upgrade
                  available at any time
                </span>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── How Finance Works ─────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>How Finance Works</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                Four steps from conversation to keys.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {FINANCE_STEPS.map((step) => (
                <motion.div key={step.n} variants={fadeUp}>
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-6 flex gap-4 h-full">
                      <span className="shrink-0 w-fit h-fit py-2 px-4 rounded-xl bg-brand-primary text-white font-black font-poppins flex items-center justify-center">
                        {step.n}
                      </span>
                      <div>
                        <h3 className="font-bold text-brand-white font-poppins mb-1.5">
                          {step.title}
                        </h3>
                        <p className="text-sm text-brand-gray leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Finance Options ───────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>Finance Options</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                A structure for every situation.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {FINANCE_OPTIONS.map((o) => (
                <motion.div key={o.title} variants={fadeUp}>
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                        {o.tag}
                      </p>
                      <h3 className="text-lg font-bold text-brand-white font-poppins mb-2">
                        {o.title}
                      </h3>
                      <p className="text-sm text-brand-gray leading-relaxed">
                        {o.body}
                      </p>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Why Our Finance Is Different ──────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>Why Our Finance Is Different</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                Built around you, not the lender.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {WHY_DIFFERENT.map((w, i) => (
                <motion.div key={w.title} variants={fadeUp}>
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-6 h-full">
                      <span className="inline-flex items-center justify-center w-fit h-fit p-2 rounded-lg bg-brand-primary text-brand-white font-black font-poppins text-sm mb-4">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-bold text-brand-white font-poppins mb-2 leading-snug">
                        {w.title}
                      </h3>
                      <p className="text-sm text-brand-gray leading-relaxed">
                        {w.body}
                      </p>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-xs text-brand-gray/70 italic mt-8 max-w-3xl"
              {...fadeUp}
            >
              Finance is subject to lender approval. All fees, charges, and
              conditions will be outlined before any application is submitted.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* ── Common Questions ──────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>Common Questions</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                Straight answers, before you ask.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {FAQS.map((f) => (
                <motion.div key={f.q} variants={fadeUp}>
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-6">
                      <h3 className="font-bold text-brand-white font-poppins mb-2">
                        {f.q}
                      </h3>
                      <p className="text-sm text-brand-gray leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div
              {...fadeUp}
              className="bg-linear-to-r from-white to-[#CA281C] p-px rounded-2xl"
            >
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#150606] to-black border border-white/10 p-6 sm:p-8 lg:p-12 text-center">
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
                <div className="relative">
                  <p className="text-brand-primary font-dm-sans font-bold text-sm uppercase tracking-[0.25em] mb-4">
                    Experience Life.
                  </p>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins mb-3 text-brand-white">
                    Ready to experience life?
                  </h2>
                  <p className="text-brand-gray text-sm lg:text-base max-w-xl mx-auto mb-7">
                    No jargon. No pressure. Just the best options we can find
                    you.
                  </p>
                  <motion.div
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    whileTap={{ scale: 0.98 }}
                    className="inline-block"
                  >
                    <Link
                      href="/cars"
                      className="flex items-center gap-2 bg-brand-primary hover:bg-red-700 text-white font-bold pl-4 pr-2 py-2 rounded-full transition-colors duration-300 text-sm"
                    >
                      View our cars
                      <motion.span
                        variants={{
                          rest: { rotate: 0 },
                          hover: { rotate: 45 },
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1] as const,
                        }}
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
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
