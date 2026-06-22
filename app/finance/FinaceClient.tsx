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

// ── Small reusable bits ──────────────────────────────────────────────────────
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary mb-3 font-montserrat">
    {children}
  </p>
);

export default function FinanceClient() {
  return (
    <div className="min-h-screen bg-[#efeded] font-dm-sans">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-6 py-20 lg:py-28 relative">
            <motion.div {...fadeUp}>
              <Eyebrow>Experience Life. Drive It Your Way.</Eyebrow>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold font-montserrat leading-[1.05] mb-5 max-w-3xl">
                Finance Without
                <br />
                <span className="text-brand-primary">the Headache.</span>
              </h1>
              <p className="text-base lg:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Multiple lenders, one team, zero runaround. We find the right
                structure for your life — and because compliance is handled
                in-house, the price you see is the price you pay.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>
      {/* INSEPCTION CHECKLIST */}
      {/* <section className="">
        <Container>
          <div className="px-6">
            <motion.div
              className="mt-10 bg-brand-white rounded-2xl p-6 lg:p-8 border  border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
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
          </div>
        </Container>
      </section> */}

      {/* ── Our Team On The Ground In Japan ───────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="px-6">
            <motion.div className="" {...fadeUp}>
              <Eyebrow>Our Team On The Ground In Japan</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight mb-3">
                Every car personally inspected before it leaves Japan.
              </h2>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                We don&apos;t rely on auction listings, online photos, or
                third-party reports. Our dedicated team of inspectors travels
                throughout Japan to physically assess every vehicle we consider
                — before a single bid is placed. They check what photos never
                show: the undercarriage, the engine bay, the full history behind
                the grade.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 bg-[#efeded] rounded-2xl p-6 lg:p-8 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              {...fadeUp}
            >
              {/* <p className="text-sm font-bold text-gray-900 font-montserrat mb-5">
                Every car personally inspected before it leaves Japan
              </p> */}
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
                If it doesn&apos;t meet our standard on the ground in Japan, it
                doesn&apos;t come to Australia. Simple as that.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Warranty Protection ───────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="px-6">
            <motion.div className="" {...fadeUp}>
              <Eyebrow>Warranty Protection</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight mb-3">
                5-Year Warranty — Standard on Every Vehicle
              </h2>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                <b>
                  Full peace of mind, provided through our trusted warranty
                  partner, applicable Australia wide.
                </b>{" "}
                Every vehicle that leaves the Japex lot comes with a 5-year
                warranty plan as standard — provided through our trusted
                warranty partner, so you get proper cover backed by a dedicated
                provider. Whether you're driving daily in Gosford or heading up
                to Port Macquarie for the weekend, you're covered.
              </p>
            </motion.div>

            {/* Warranty tiers */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {WARRANTY_TIERS.map((t) => (
                <motion.div
                  key={t.title}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-6 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                    {t.tag}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 font-montserrat mb-2">
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Warranty highlights */}
            <motion.div
              className="mt-5 bg-brand-dark text-white rounded-2xl p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-8 text-sm font-semibold relative overflow-hidden"
              {...fadeUp}
            >
              <div className="pointer-events-none absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-brand-primary/20 blur-3xl" />
              <span className="relative flex items-center gap-2">
                <span className="text-brand-primary">✦</span> Australia-wide
                coverage
              </span>
              <span className="relative flex items-center gap-2">
                <span className="text-brand-primary">✦</span> Transferable if
                you sell
              </span>
              <span className="relative flex items-center gap-2">
                <span className="text-brand-primary">✦</span> Upgrade available
                at any time
              </span>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── How Finance Works ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>How Finance Works</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight">
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
          </div>
        </Container>
      </section>

      {/* ── Finance Options ───────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>Finance Options</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight">
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
                <motion.div
                  key={o.title}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-6 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                    {o.tag}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 font-montserrat mb-2">
                    {o.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {o.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Why Our Finance Is Different ──────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>Why Our Finance Is Different</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight">
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
                <motion.div
                  key={w.title}
                  variants={fadeUp}
                  className="bg-brand-white rounded-2xl p-6 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center w-fit h-fit p-2 rounded-lg bg-brand-primary text-white font-black font-montserrat text-sm mb-4">
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

            <motion.p
              className="text-xs text-gray-400 italic mt-8 max-w-3xl"
              {...fadeUp}
            >
              Finance is subject to lender approval. All fees, charges, and
              conditions will be outlined before any application is submitted.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* ── Common Questions ──────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="px-6">
            <motion.div className="max-w-3xl mb-10" {...fadeUp}>
              <Eyebrow>Common Questions</Eyebrow>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 font-montserrat leading-tight">
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
                <motion.div
                  key={f.q}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-6 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <h3 className="font-bold text-gray-900 font-montserrat mb-2">
                    {f.q}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
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
                  Ready to experience life?
                </h2>
                <p className="text-gray-300 text-sm lg:text-base max-w-xl mx-auto mb-7">
                  No jargon. No pressure. Just the best options we can find you.
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
