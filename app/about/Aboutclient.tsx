"use client";

import Container from "@/components/Container";
import GetInTouch from "@/components/GetInTouch";
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
const STATS = [
  { value: "500+", label: "Vehicles in stock" },
  { value: "5,000+", label: "Satisfied customers" },
  { value: "10,000+", label: "Cars sold" },
  { value: "Gosford", label: "Central Coast, NSW" },
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

const SOURCING_STEPS = [
  {
    n: "1",
    title: "Direct relationships in Japan",
    body: "Our founder built a curated network of Japanese partners — auction agents, specialist dealers, and private suppliers — over years of operating in the market. We know who grades honestly, who maintains properly, and who shares our standards.",
  },
  {
    n: "2",
    title: "On-the-ground inspection and selection",
    body: "Our team physically assesses every vehicle in Japan before a bid is placed — checking what photos and listings never show.",
  },
  {
    n: "3",
    title: "Full importation and compliance",
    body: "We manage shipping, customs, and full ADR certification in-house. No shortcuts, no grey-area imports. Every vehicle road-legal and registered.",
  },
  {
    n: "4",
    title: "The Japex finish",
    body: "Vehicles arrive in Gosford and go through our in-house build — Japex accessories fitted, details refined, signature style applied. Unlike anything else on the market.",
  },
];

const STOCK = [
  {
    tag: "Everyday and Prestige",
    title: "Sedans, SUVs and People Movers",
    body: "The full range — from 15k daily drivers to high-spec prestige. Every segment, the same sourcing excellence.",
  },
  {
    tag: "Adventure and Off-Road",
    title: "Kitted Japanese 4WDs",
    body: "LandCruisers, Patrols, HiLuxes, Jimny builds — Japex-fitted with lift kits, snorkels, roof racks, bull bars. Built for Central Coast tracks and beyond.",
  },
  {
    tag: "Lifestyle",
    title: "Campervans and Adventure Vehicles",
    body: "Japanese campervans and expedition builds, finished in-house with the Japex touch.",
  },
  {
    tag: "Trades and Commercial",
    title: "Utes and Work Vehicles",
    body: "Reliable, properly maintained Japanese commercial vehicles ready to earn their keep from day one.",
  },
];

const VALUES = [
  {
    title: "Straight talk",
    body: "The price is the price. The condition is exactly what we say. We'd rather earn your trust than your signature.",
  },
  {
    title: "Excellence at every price point",
    body: "$12k or $120k — the sourcing rigour and Japex finish don't change. Every car earns its spot on our lot.",
  },
  {
    title: "One roof. No referrals.",
    body: "Finance, compliance, servicing, parts — all in-house. End to end, no runaround, ever.",
  },
  {
    title: "Built for this region",
    body: "For Central Coast and Mid North Coast Australians — beach runs, bush tracks, long drives up to Port Macquarie. Every vehicle built with that life in mind.",
  },
];

const WHY = [
  {
    title: "Direct from Japan — not second-hand wholesale",
    body: "Our founder's network means a cleaner history, a more honest grade, and provenance we can stand behind.",
  },
  {
    title: "Our own inspectors on the ground",
    body: "Our team physically travels Japan to inspect every vehicle before a bid is placed. If it doesn't pass on the ground, it doesn't come to Australia.",
  },
  {
    title: "Expert in-house compliance",
    body: "ADR, SEVS, customs, registration — all handled internally. No outsourced agents, no passing the buck.",
  },
  {
    title: "The Japex build — our own accessories, our own style",
    body: "We design and source our own accessories and finish every vehicle in-house. Unmistakably Japex — unavailable anywhere else.",
  },
  {
    title: "5-year warranty as standard",
    body: "Every vehicle comes with a 5-year warranty plan through our trusted provider, upgradeable for broader coverage. Valid Australia wide.",
  },
  {
    title: "Finance built around real people",
    body: "In-house finance, broad lender panel, no bias, no pressure. The right car at the right terms.",
  },
  {
    title: "Servicing and genuine parts, long after the sale",
    body: "Regular servicing, repairs, genuine Japanese components. Here for the full experience.",
  },
];

// ── Small reusable bits ──────────────────────────────────────────────────────
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary mb-3 font-montserrat">
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

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-[#efeded] font-dm-sans">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        {/* subtle red glow */}
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-6 py-20 lg:py-28 relative">
            <motion.div {...fadeUp}>
              <Eyebrow>Experience Life.</Eyebrow>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold font-montserrat leading-[1.05] mb-5 max-w-3xl">
                Japanese Excellence.
                <br />
                <span className="text-brand-primary">
                  Delivered to Your Driveway.
                </span>
              </h1>
              <p className="text-base lg:text-lg text-brand-white-alternate max-w-2xl leading-relaxed">
                Japex Motors brings the best of Japan's automotive culture to
                the Central Coast — precision-sourced vehicles, custom-finished
                to our own standard, expertly complied, and backed by a team
                that lives and breathes Japanese cars.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Our Story ─────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6">
            <motion.div className="lg:col-span-5" {...fadeUp}>
              <Eyebrow>Our Story</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-black font-montserrat leading-tight">
                Australians deserve the best Japan has to offer.
              </h2>
            </motion.div>

            <motion.div
              className="lg:col-span-7 space-y-4 text-sm lg:text-base text-gray-500 leading-relaxed"
              {...fadeUp}
            >
              <p>
                Japex Motors was born out of one conviction — that Australians
                deserve access to the best Japan has to offer, not just what
                filters through the wholesale market.
              </p>
              <p>
                Our founder spent his career inside the Japanese automotive
                industry, building direct relationships with auction houses,
                specialist dealers, and suppliers across Japan. Those years gave
                Japex something most dealerships don't have: on-the-ground
                expertise, trusted partnerships, and the knowledge to manage the
                full import and compliance process without handing it off to
                anyone else.
              </p>
              <p>
                Based in Gosford and serving the entire Central Coast — from the
                Northern Beaches all the way up through Newcastle, Port
                Macquarie, and beyond — Japex exists for the Australians out
                here. The ones who love the ocean, the bush tracks, the long
                weekends and the open highway. We simply believe all of that is
                better experienced in a vehicle with Japanese soul.
              </p>
              <p>
                But sourcing the right car is only half of it. What makes a
                Japex vehicle unmistakable is what happens next. We design and
                source our own accessories — bullbars, roof racks, side steps,
                lighting rigs, interior fittings — and apply them in-house to
                create vehicles with a look and feel that is entirely our own.
                Every build is deliberate. Every detail considered. Whether it's
                a kitted-out 4WD ready for the trails or a refined daily driver
                with subtle Japanese character, you won't find it anywhere else.
                That's the Japex style.
              </p>

              <blockquote className="border-l-4 border-brand-primary pl-5 py-1 my-6">
                <p className="text-lg lg:text-xl font-semibold text-gray-900 font-montserrat italic">
                  &ldquo;We don't just sell Japanese cars. We finish them — so
                  when you pull up, people notice.&rdquo;
                </p>
              </blockquote>

              <p>
                We've since grown into a full-service dealership — finance,
                servicing, genuine parts — because the experience shouldn't stop
                at the sale. Over 10,000 vehicles sold. Over 5,000 customers who
                keep coming back. That's the Japex standard.
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-14 px-6"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-300
                hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-center"
              >
                <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-primary font-montserrat leading-tight wrap-break-word">
                  {s.value}
                </p>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ── How We Source ─────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <motion.div className="px-6" {...fadeUp}>
            <Eyebrow>How We Source Our Vehicles</Eyebrow>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight mb-3">
              We go further back in the chain — all the way to Japan.
            </h2>
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
              Most dealerships buy from Australian wholesale auctions. We go
              further back in the chain — all the way to Japan.
            </p>
          </motion.div>
          <div className="px-6">
            {/* Inspection checklist */}
            <motion.div
              className="mt-10 bg-[#efeded] rounded-2xl p-6 lg:p-8 border  border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              {...fadeUp}
            >
              <Eyebrow>OUR TEAM ON THE GROUND IN JAPAN</Eyebrow>
              <p className="text-normal font-bold text-gray-900 font-montserrat mb-2">
                Every car personally inspected before it leaves Japan
              </p>
              <p className="text-sm text-gray-700 font-montserrat mb-5">
                We don't rely on auction listings, online photos, or third-party
                reports. Our dedicated team of inspectors travels throughout
                Japan to physically assess every vehicle we consider — before a
                single bid is placed. They check what photos never show: the
                undercarriage, the engine bay, the full history behind the
                grade.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {INSPECTION_CHECKS.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <CheckIcon />
                    {c}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 italic mt-6 pt-5 border-t border-gray-200">
                If it doesn't meet our standard on the ground in Japan, it
                doesn't come to Australia. Simple as that.
              </p>
            </motion.div>

            {/* 4-step process */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {SOURCING_STEPS.map((step) => (
                <motion.div
                  key={step.n}
                  variants={fadeUp}
                  className="bg-brand-white rounded-2xl p-6 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex gap-4"
                >
                  <span className="shrink-0 w-fit h-fit py-2 px-4 rounded-xl bg-brand-primary text-white font-black font-montserrat flex items-center justify-center">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 font-montserrat mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Why Japan */}
            <motion.div
              className="mt-12 bg-brand-dark text-white rounded-2xl p-8 lg:p-10 relative overflow-hidden"
              {...fadeUp}
            >
              <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-brand-primary/20 blur-3xl" />
              <div className="relative">
                <Eyebrow>Why Japan?</Eyebrow>
                <p className="text-base lg:text-lg text-gray-200 leading-relaxed ">
                  Japan's domestic car market is uniquely well-suited to
                  Australia. Vehicles are maintained to an exceptional standard,
                  mileage is low relative to age, service records are detailed
                  and reliable, and the auction grading system is among the most
                  transparent in the world. For buyers who care about what's
                  under the bonnet — not just what's on the sticker — the
                  Japanese experience is in a different class.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── What We Stock ─────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="px-6">
            <motion.div className="mb-10" {...fadeUp}>
              <Eyebrow>What We Stock</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight">
                From everyday commuters to weekend warriors.
              </h2>
              <p className="text-sm lg:text-base text-gray-600 mt-3">
                All sourced from Japan and finished to the Japex standard.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {STOCK.map((s) => (
                <motion.div
                  key={s.title}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-6 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                    {s.tag}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 font-montserrat mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {s.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── What We Stand For ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="px-6">
            <motion.div className="mb-10" {...fadeUp}>
              <Eyebrow>What We Stand For</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight">
                The Japex standard isn&apos;t a slogan.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {VALUES.map((v) => (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  className="bg-brand-white rounded-2xl p-6 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-gray-900 font-montserrat mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {v.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Why Japex ─────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="px-6">
            <motion.div className="mb-10" {...fadeUp}>
              <Eyebrow>Why Japex Motors</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight">
                Seven reasons buyers keep coming back.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {WHY.map((w, i) => (
                <motion.div
                  key={w.title}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-6 border shadow-sm cursor-pointer border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200"
                >
                  <span className="inline-flex items-center justify-center w-fit h-fit p-2 rounded-lg bg-brand-primary text-brand-white font-black font-montserrat text-sm mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-bold text-gray-900 font-montserrat mb-2 leading-snug">
                    {w.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {w.body}
                  </p>
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
              className="bg-brand-dark text-white rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden"
              {...fadeUp}
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-brand-primary/20 blur-3xl" />
              <div className="relative">
                <p className="text-brand-primary font-montserrat font-bold text-sm uppercase tracking-[0.25em] mb-4">
                  Experience Life.
                </p>
                <h2 className="text-2xl lg:text-3xl font-extrabold font-montserrat mb-3">
                  Japex Motors — Gosford's Japanese automotive experts.
                </h2>
                <p className="text-gray-300 text-sm lg:text-base max-w-xl mx-auto mb-7">
                  Browse the current range — every vehicle sourced from Japan,
                  finished in-house, and backed end to end.
                </p>
                <Link
                  href="/cars"
                  className="inline-block bg-brand-primary hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm"
                >
                  View our cars
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <GetInTouch />
    </div>
  );
}
