"use client";

import Container from "@/components/Container";
import GlowingTransparentDivTestimonial from "@/components/GlowingTransparentDivTestimonial";
import { getAssetsStorageUrl, getPreviewUrl } from "@/utils/helpers";
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
// These source files are 19.4 MB and 10.5 MB. Served through Appwrite at a
// sensible width they land around 100 KB each.
const HERO_IMAGE = getAssetsStorageUrl("ServiceAndParts/serviceBanner.webp", {
  width: 1200,
});
const MATTERS_IMAGE = getAssetsStorageUrl(
  "ServiceAndParts/serviceBanner2.webp",
  {
    width: 1200,
  },
);

// ── Data ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "100%", label: "Japanese-market specialists" },
  { value: "In-House", label: "Workshop & technicians" },
  { value: "Gosford", label: "Central Coast based" },
];

const SPECIALTY = [
  {
    tag: "Mitsubishi",
    title: "Delica",
    body: "The ultimate go-anywhere people mover. We turn Delicas into rugged, capable adventure rigs — lifted, protected, and ready for whatever track you point it down. Equal parts tough and unmistakably cool.",
    features: [
      "Lift kits",
      "Off-road tyres",
      "Roof racks & tents",
      "Snorkels",
      "Underbody protection",
    ],
  },
  {
    tag: "Toyota",
    title: "Hiace",
    body: "From daily driver to full off-grid build. Our Hiace conversions blend reliability with genuine adventure-readiness — interior fitouts, exterior armour, and the rugged stance that turns heads wherever it goes.",
    features: [
      "Camper fitouts",
      "Bullbars",
      "Suspension lifts",
      "Side steps",
      "Custom interiors",
    ],
  },
];

const PARTS = [
  {
    tag: "Mechanical",
    title: "Genuine & OEM-Equivalent Parts",
    body: "Engine, drivetrain, suspension, and electrical components sourced directly through our Japanese supplier network.",
  },
  {
    tag: "Hard to Find",
    title: "Specialist & Rare Components",
    body: "For less common Japanese imports, we tap into our import pipeline to track down parts other suppliers can't.",
  },
];

const ACCESSORY_RANGE = [
  "Bullbars",
  "Roof racks",
  "Snorkels",
  "Lift kits",
  "Side steps",
  "Lighting rigs",
  "Interior fittings",
  "Off-road suspension",
  "Recovery gear",
  "Canopies & trays",
  "Camper conversions",
  "Roof tents",
];

const OFFERINGS = [
  {
    title: "Scheduled Servicing",
    body: "Logbook servicing that keeps your warranty intact and your vehicle running the way it should.",
  },
  {
    title: "Mechanical Repairs",
    body: "From minor fixes to major work — diagnosed and repaired by technicians who know your vehicle's quirks.",
  },
  {
    title: "Genuine Parts Supply",
    body: "Sourced through our Japanese network — for your vehicle or any Japanese import.",
  },
  {
    title: "Delica & Hiace Builds",
    body: "Bring us your platform — we'll turn it into a true Japex build, inside and out.",
  },
  {
    title: "Accessory Fitting",
    body: "Add the Japex look and capability to your existing vehicle — bullbars, racks, lift kits and more.",
  },
  {
    title: "Warranty Work",
    body: "All warranty work carried out in-house, by the people who know your car.",
  },
];

const WHY_TRUST = [
  {
    title: "Specialists, not generalists",
    body: "Our technicians work on Japanese-market vehicles every day. That depth of experience means fewer surprises and faster, more accurate diagnosis.",
  },
  {
    title: "Delica & Hiace experts",
    body: "Few workshops in Australia know these platforms like we do. From routine servicing to full rugged builds, this is where we excel.",
  },
  {
    title: "The same standards, end to end",
    body: "The team that inspects in Japan, the team that finishes in Gosford, and the team that services — all share the same standard. Nothing gets diluted.",
  },
  {
    title: "Your warranty, honoured properly",
    body: "All warranty work carried out in-house by our own team, backed by our third-party warranty provider. No outsourcing, no disputes.",
  },
  {
    title: "Local, and here to stay",
    body: "Based in Gosford, serving the Central Coast and beyond. We're not going anywhere — and neither is the support behind your vehicle.",
  },
];

const FAQS = [
  {
    q: "Do I need to have bought my car from Japex?",
    a: "No. Our workshop and parts service is open to any Japanese-import owner — especially Delica and Hiace owners.",
  },
  {
    q: "Can you give my Delica or Hiace the Japex look?",
    a: "Absolutely — this is where we specialise. Bring it in and we'll talk through a build that suits how you use it.",
  },
  {
    q: "What if my car needs a part you don't stock?",
    a: "We'll source it through our Japanese supplier network. If it exists, we can usually get it.",
  },
  {
    q: "Does every Japex car get the badge?",
    a: "Yes — every vehicle that leaves our workshop carries the Japex badge as our mark of quality and your mark of the family.",
  },
];

// ── Small reusable bits ──────────────────────────────────────────────────────
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary mb-3 font-dm-sans">
    {children}
  </p>
);

const FeaturePill = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-linear-to-r from-white to-[#666666] p-px rounded-[9px]">
    <span className="inline-flex items-center text-xs font-semibold text-brand-gray bg-linear-to-b hover:bg-linear-to-b hover:from-[#313131] hover:to-black transition-colors duration-300 from-black to-[#313131]  rounded-lg px-3 py-1.5">
      {children}
    </span>
  </span>
);

/**
 * Image with a shimmer skeleton underneath that fades out once the image has
 * decoded. Pass `priority` for above-the-fold instances (it becomes the LCP
 * candidate, so deferring the request would only delay first paint); leave it
 * off below the fold and it falls through to native lazy loading.
 *
 * `className` controls sizing — an aspect ratio for standalone use, or
 * `h-full` to fill a flex/grid parent whose height comes from a sibling.
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
        src={getPreviewUrl(src, { width: 640 })}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        unoptimized
        sizes="(max-width: 1024px) 100vw, 45vw"
        onLoad={() => setLoaded(true)}
        className={`object-cover object-center transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

const ArrowButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <motion.div
    whileHover="hover"
    whileTap={{ scale: 0.98 }}
    className="inline-block"
  >
    <Link
      href={href}
      className="w-full flex items-center justify-between gap-2 bg-brand-primary hover:bg-red-700 text-white font-bold pl-4 pr-2 py-2 rounded-full duration-300 transition-colors text-sm"
    >
      {children}
      <motion.span
        variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
);

export default function ServiceClient() {
  const logo = getAssetsStorageUrl("Logo/logo-sandp.png", { width: 1200 });

  return (
    <div className="min-h-screen overflow-hidden bg-black font-dm-sans">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-black text-brand-white">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-6 pt-28 pb-16 lg:pt-36 lg:pb-24 relative">
            <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
              {/* copy */}
              <div className="lg:col-span-7 hero-rise">
                <Eyebrow>Experience Life. Keep Experiencing It.</Eyebrow>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-poppins leading-[1.1] mb-5 max-w-3xl">
                  The Same Care That Built It,
                  <br />
                  <span className="text-brand-primary">Keeps It Running.</span>
                </h1>
                <p className="text-base lg:text-lg text-brand-gray max-w-2xl leading-relaxed font-dm-sans">
                  Your Japex vehicle was hand-selected in Japan, inspected by
                  our own team, and finished in our workshop. That same workshop
                  is here for the life of your car — Central Coast born,
                  Japanese-trained, and run by mechanics who know these vehicles
                  better than anyone.
                </p>
              </div>

              {/* image */}
              {/* <motion.div
                className="lg:col-span-5"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              > */}
              <div
                className="lg:col-span-5 hero-rise"
                style={{ animationDelay: "0.15s" }}
              >
                <SkeletonImage
                  src={HERO_IMAGE}
                  alt="Japex Motors workshop technicians at work"
                  priority={true}
                />
              </div>
              {/* </motion.div> */}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Why It Matters ────────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        {/* <div className="pointer-events-none absolute bottom-0 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/15 blur-3xl" /> */}
        <Container>
          {/* No items-start here — the columns stretch to the row height so the
              image can grow with the prose beside it. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6">
            {/* heading + image (desktop) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 h-full">
              <motion.div {...fadeUp} className="shrink-0">
                <Eyebrow>Why It Matters</Eyebrow>
                <h2 className="text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                  A car is never just a car.
                </h2>
              </motion.div>

              {/* fills whatever height is left after the heading */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="hidden lg:flex flex-1 min-h-0"
              >
                <SkeletonImage
                  src={MATTERS_IMAGE}
                  alt="A Japex-built vehicle on the Central Coast"
                  className="h-full"
                />
              </motion.div>
            </div>

            {/* prose */}
            <motion.div
              className="lg:col-span-7 space-y-4 text-sm lg:text-base text-brand-gray leading-relaxed"
              {...fadeUp}
            >
              <p>
                It&apos;s the school run, the tradie&apos;s livelihood, the
                weekend escape to the coast, the road trip up to Port Macquarie
                with the family. When something feels off, it&apos;s not just an
                inconvenience — it&apos;s a disruption to your life.
              </p>
              <p>
                That&apos;s exactly why we built our workshop the way we did.
                Not as an afterthought, not as a place to send you when
                something goes wrong — but as part of the promise we made the
                day you drove off our lot. We sold you a vehicle we believe in.
                We&apos;ll look after it like we mean that.
              </p>

              <blockquote className="border-l-4 border-brand-primary pl-5 py-1 my-6">
                <p className="text-lg lg:text-xl font-semibold text-brand-white font-poppins italic">
                  &ldquo;We don&apos;t just hand over the keys and wave goodbye.
                  We&apos;re still here — long after the sale, for as long as
                  you own the car.&rdquo;
                </p>
              </blockquote>
            </motion.div>

            {/* image — mobile position, after the prose */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden"
            >
              <SkeletonImage
                src={MATTERS_IMAGE}
                alt="A Japex-built vehicle on the Central Coast"
                className="aspect-4/3"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Mechanics Who Know These Cars ─────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-6">
            <motion.div {...fadeUp}>
              <Eyebrow>Mechanics Who Know These Cars</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight mb-3">
                We know these vehicles inside out.
              </h2>
              <div className="space-y-4 text-sm lg:text-base text-brand-gray leading-relaxed">
                <p>
                  Japanese-imported vehicles aren&apos;t the same as the cars
                  most Australian workshops see every day. Different
                  specifications, different parts numbering, different quirks —
                  and most general mechanics simply haven&apos;t spent enough
                  time with them to really know what they&apos;re looking at.
                </p>
                <p>
                  Ours have. Our technicians specialise in Japanese-market
                  vehicles — the same models we source, inspect, and import
                  ourselves. They&apos;ve worked on hundreds of them. They know
                  the common issues before they become expensive ones, the
                  maintenance schedules that actually matter, and how to keep
                  these vehicles running the way they were built to.
                </p>
                <p>
                  When you bring your car to us, you&apos;re not explaining your
                  vehicle to someone seeing it for the first time. You&apos;re
                  handing it to people who&apos;ve quite possibly worked on that
                  exact model dozens of times before.
                </p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-12"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {STATS.map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  // whileHover={{ y: -2 }}
                >
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="relative p-4 sm:p-6 text-center">
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-gray font-poppins leading-tight wrap-break-word">
                        {s.value}
                      </p>
                      <p className="text-xs lg:text-base font-semibold text-brand-primary mt-1">
                        {s.label}
                      </p>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Our Specialty: Delica & Hiace ─────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-6">
            <motion.div className="mb-10" {...fadeUp}>
              <Eyebrow>Our Specialty: Delica &amp; Hiace</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight mb-3">
                The two platforms that define the Japex build.
              </h2>
              <p className="text-sm lg:text-base text-brand-gray leading-relaxed">
                The Mitsubishi Delica and Toyota Hiace are some of the most
                capable, versatile vehicles to ever come out of Japan — and
                we&apos;ve spent years figuring out exactly how to bring out the
                best in both.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {SPECIALTY.map((s) => (
                <motion.div
                  key={s.title}
                  variants={fadeUp}
                  // whileHover={{ y: -2 }}
                >
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-6 lg:p-7 flex flex-col h-full">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
                        {s.tag}
                      </p>
                      <h3 className="text-2xl font-bold text-brand-white font-poppins mb-3">
                        {s.title}
                      </h3>
                      <p className="text-sm text-brand-gray leading-relaxed mb-5">
                        {s.body}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {s.features.map((f) => (
                          <FeaturePill key={f}>{f}</FeaturePill>
                        ))}
                      </div>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-sm lg:text-base text-brand-gray leading-relaxed mt-8"
              {...fadeUp}
            >
              We don&apos;t just service these vehicles — we build them,
              accessorise them, and know every bolt, panel gap, and quirk.
              Whether yours came from us or you&apos;re bringing in your own
              Delica or Hiace to get the Japex treatment, our team knows exactly
              what to do.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* ── Built Rugged. Built to Stand Out. ─────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="px-6">
            <motion.div
              className="mt-2 bg-linear-to-r from-white to-[#CA281C] p-px rounded-2xl"
              {...fadeUp}
            >
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#150606] to-black border border-white/10 p-8 lg:p-10">
                <div className="pointer-events-none absolute -bottom-20 -right-20 w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-brand-primary/20 blur-3xl" />
                <div className="relative">
                  <Eyebrow>Built Rugged. Built to Stand Out.</Eyebrow>
                  <div className="space-y-4 text-base lg:text-lg text-brand-gray leading-relaxed">
                    <p>
                      There&apos;s a reason people notice a Japex build before
                      they even know what it is. We don&apos;t do generic. Every
                      vehicle that goes through our workshop gets a look
                      that&apos;s deliberate — rugged where it needs to be,
                      refined where it counts, and finished with a level of
                      detail that simply isn&apos;t standard anywhere else.
                    </p>
                    <p>
                      This isn&apos;t about bolting on parts for the sake of it.
                      It&apos;s about taking a platform we know inside out and
                      building something that looks as good as it performs —
                      something that&apos;s unmistakably, uniquely Japex. That
                      uniqueness is the whole point. We take real pride in it,
                      and it shows in every build that rolls out of our
                      workshop.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Genuine Parts + Accessory Range ───────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-6">
            <motion.div className="mb-10" {...fadeUp}>
              <Eyebrow>Genuine Parts, Sourced the Japex Way</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight mb-3">
                The right network gets the right parts.
              </h2>
              <p className="text-sm lg:text-base text-brand-gray leading-relaxed">
                The same network that gets us the right vehicles also gets us
                the right parts. Through our direct relationships in Japan, we
                source genuine and OEM-equivalent components — including models
                that other suppliers in Australia simply don&apos;t carry.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {PARTS.map((p) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  // whileHover={{ y: -2 }}
                >
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                        {p.tag}
                      </p>
                      <h3 className="text-lg font-bold text-brand-white font-poppins mb-2">
                        {p.title}
                      </h3>
                      <p className="text-sm text-brand-gray leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>

            {/* Accessory range */}
            <motion.div className="mt-5" {...fadeUp}>
              <GlowingTransparentDivTestimonial border="2xl">
                <div className="p-6 lg:p-8">
                  <Eyebrow>The Japex Accessory Range</Eyebrow>
                  <div className="flex flex-wrap gap-2">
                    {ACCESSORY_RANGE.map((a) => (
                      <FeaturePill key={a}>{a}</FeaturePill>
                    ))}
                  </div>
                </div>
              </GlowingTransparentDivTestimonial>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── The Japex Badge ───────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="px-6">
            <motion.div
              className="bg-linear-to-r from-white to-[#CA281C] p-px rounded-2xl"
              {...fadeUp}
            >
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#150606] to-black border border-white/10 p-8 lg:p-12 text-center md:text-left">
                <div className="pointer-events-none absolute -top-10 left-1/9 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
                <div className="relative mx-auto grid grid-cols-1 gap-10 md:gap-12 md:grid-cols-2 items-center">
                  <div className="flex items-center justify-center">
                    <Image
                      src={getPreviewUrl(logo, { width: 640 })}
                      alt="JAPEX Motors"
                      width={1920}
                      height={1080}
                      className="object-cover max-w-40 sm:max-w-52 h-fit w-fit"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-brand-primary font-dm-sans font-bold text-sm uppercase tracking-[0.25em] mb-4">
                      The Japex Badge
                    </p>
                    <h2 className="text-2xl lg:text-3xl font-bold font-poppins mb-4 text-brand-white">
                      More than a badge — a mark of the family.
                    </h2>
                    <p className="text-brand-gray text-sm lg:text-base leading-relaxed">
                      Every vehicle that leaves our workshop carries the Japex
                      badge. It&apos;s not just branding — it&apos;s our
                      signature on the work, and proof that the vehicle has been
                      through our process: sourced with care, inspected on the
                      ground in Japan, finished by hand in Gosford. When you see
                      that badge, you&apos;re looking at a vehicle that meets
                      the Japex standard. And when it&apos;s on your car,
                      you&apos;re part of the Japex family — for as long as you
                      own it.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── What We Offer ─────────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-6">
            <motion.div className="mb-10" {...fadeUp}>
              <Eyebrow>What We Offer</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                Everything your vehicle needs, under one roof.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {OFFERINGS.map((o) => (
                <motion.div
                  key={o.title}
                  variants={fadeUp}
                  // whileHover={{ y: -2 }}
                >
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-6">
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

      {/* ── Why Trust Our Workshop ────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>Why Trust Our Workshop</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                Five reasons to bring it to us.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {WHY_TRUST.map((w, i) => (
                <motion.div
                  key={w.title}
                  variants={fadeUp}
                  // whileHover={{ y: -2 }}
                >
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
          </div>
        </Container>
      </section>

      {/* ── Common Questions ──────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>Common Questions</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
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
          <div className="px-6">
            <motion.div
              className="bg-linear-to-r from-white to-[#CA281C] p-px rounded-2xl"
              {...fadeUp}
            >
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#150606] to-black border border-white/10 p-8 lg:p-12 text-center">
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
                <div className="relative">
                  <p className="text-brand-primary font-dm-sans font-bold text-sm uppercase tracking-[0.25em] mb-4">
                    Experience Life.
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold font-poppins mb-3 text-brand-white">
                    Your car deserves people who get it.
                  </h2>
                  <p className="text-brand-gray text-sm lg:text-base max-w-xl mx-auto mb-7">
                    Whether it&apos;s a logbook service, a tricky repair, or
                    building out your Delica or Hiace into something truly
                    unique — bring it to the people who understand it from the
                    inside out. Same care, same standards, same family.
                  </p>
                  <div className="flex justify-center">
                    <ArrowButton href="/cars">
                      <p>View our cars</p>
                    </ArrowButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
