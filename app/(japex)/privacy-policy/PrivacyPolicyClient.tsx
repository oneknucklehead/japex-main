"use client";

import Container from "@/components/Container";
import GlowingTransparentDivTestimonial from "@/components/GlowingTransparentDivTestimonial";
import { motion } from "framer-motion";

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

const INFO_COLLECTED = [
  "Name",
  "Phone number",
  "Email address",
  "Residential address",
  "Driver's licence details",
];

const INFO_USES = [
  {
    title: "Respond to your enquiries",
    body: "So we can get back to you about a vehicle, a service booking, or a finance question.",
  },
  {
    title: "Provide our services",
    body: "Sourcing, importing, complying, servicing, and delivering your vehicle.",
  },
  {
    title: "Improve our website and customer experience",
    body: "Understanding what people need from us so we can do it better.",
  },
];

const CONTACT = {
  phone: "02 8041 4967",
  phoneHref: "tel:0280414967",
  email: "info@japex.motors.com.au",
  emailHref: "mailto:info@japex.motors.com.au",
};

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

export default function PrivacyPolicyClient() {
  return (
    <div className="min-h-screen font-dm-sans overflow-hidden">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative text-brand-white">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16 lg:pt-36 lg:pb-24 relative">
            <div className="hero-rise">
              <Eyebrow>Legal</Eyebrow>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-poppins leading-[1.1] mb-4 sm:mb-5 max-w-3xl">
                Privacy
                <span className="text-brand-primary"> Policy.</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-brand-gray max-w-2xl leading-relaxed font-dm-sans">
                At Japex Motors, we respect your privacy and are committed to
                protecting your personal information.
              </p>
              <p className="text-xs sm:text-sm text-brand-gray/70 mt-4">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── What we collect ───────────────────────────────────────────────── */}
      <section className="relative py-12 sm:py-16 lg:py-24">
        <div className="pointer-events-none absolute bottom-0 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/15 blur-3xl" />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 px-4 sm:px-5 md:px-6">
            <motion.div className="lg:col-span-5" {...fadeUp}>
              <Eyebrow>Information We Collect</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                What we ask for, and why.
              </h2>
            </motion.div>

            <motion.div className="lg:col-span-7" {...fadeUp}>
              <p className="text-sm lg:text-base text-brand-gray leading-relaxed mb-6">
                We may collect information such as your name, phone number,
                email address, residential address, driver&apos;s licence
                details, and any other information you provide when contacting
                us or enquiring about our vehicles.
              </p>

              <GlowingTransparentDivTestimonial border="2xl">
                <div className="p-5 sm:p-6 lg:p-8">
                  <Eyebrow>Details We May Hold</Eyebrow>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-2.5 sm:gap-y-3">
                    {INFO_COLLECTED.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-gray"
                      >
                        <CheckIcon />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </GlowingTransparentDivTestimonial>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── How we use it ─────────────────────────────────────────────────── */}
      <section className="relative py-12 sm:py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div className="mb-8 sm:mb-10" {...fadeUp}>
              <Eyebrow>How We Use It</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                We use this information to:
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              {INFO_USES.map((use, i) => (
                <motion.div key={use.title} variants={fadeUp}>
                  <GlowingTransparentDivTestimonial border="2xl">
                    <div className="p-5 sm:p-6 h-full">
                      <span className="inline-flex items-center justify-center w-fit h-fit p-2 rounded-lg bg-brand-primary text-brand-white font-black font-poppins text-xs sm:text-sm mb-3 sm:mb-4">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-brand-white font-poppins mb-2 leading-snug">
                        {use.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                        {use.body}
                      </p>
                    </div>
                  </GlowingTransparentDivTestimonial>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Sharing & security ────────────────────────────────────────────── */}
      <section className="relative py-12 sm:py-16 lg:py-24">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div className="mb-8 sm:mb-10" {...fadeUp}>
              <Eyebrow>Sharing &amp; Security</Eyebrow>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-white font-poppins leading-tight">
                Your information stays with us.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.div variants={fadeUp}>
                <GlowingTransparentDivTestimonial border="2xl">
                  <div className="p-5 sm:p-6 h-full">
                    <h3 className="text-base sm:text-lg font-bold text-brand-white font-poppins mb-2">
                      We don&apos;t sell your data
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                      We do not sell or share your personal information with
                      third parties unless required by law or necessary to
                      provide our services.
                    </p>
                  </div>
                </GlowingTransparentDivTestimonial>
              </motion.div>

              <motion.div variants={fadeUp}>
                <GlowingTransparentDivTestimonial border="2xl">
                  <div className="p-5 sm:p-6 h-full">
                    <h3 className="text-base sm:text-lg font-bold text-brand-white font-poppins mb-2">
                      We keep it secure
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                      We take reasonable steps to keep your personal information
                      secure.
                    </p>
                  </div>
                </GlowingTransparentDivTestimonial>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="px-4 sm:px-5 md:px-6">
            <motion.div
              {...fadeUp}
              className="bg-linear-to-r from-white to-[#CA281C] p-px rounded-2xl"
            >
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#150606] to-black border border-white/10 p-6 sm:p-8 lg:p-12">
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
                <div className="relative">
                  <Eyebrow>Questions?</Eyebrow>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins mb-3 text-brand-white leading-tight">
                    Get in touch about your information.
                  </h2>
                  <p className="text-brand-gray text-xs sm:text-sm lg:text-base max-w-2xl mb-6 sm:mb-7 leading-relaxed">
                    If you have any questions about this Privacy Policy or would
                    like to access or update your personal information, please
                    contact us.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <motion.a
                      href={CONTACT.phoneHref}
                      //   whileHover={{ y: -2 }}
                      className="flex flex-col gap-0.5 rounded-xl border border-white/15 px-4 py-3 transition-colors duration-300 hover:border-brand-primary min-w-0"
                    >
                      <span className="font-dm-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-brand-primary">
                        Phone
                      </span>
                      <span className="font-poppins text-sm sm:text-base font-semibold text-white whitespace-nowrap">
                        {CONTACT.phone}
                      </span>
                    </motion.a>

                    <motion.a
                      href={CONTACT.emailHref}
                      //   whileHover={{ y: -2 }}
                      className="flex flex-col gap-0.5 rounded-xl border border-white/15 px-4 py-3 transition-colors duration-300 hover:border-brand-primary min-w-0"
                    >
                      <span className="font-dm-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-brand-primary">
                        Email
                      </span>
                      <span className="font-poppins text-sm sm:text-base font-semibold text-white wrap-break-word">
                        {CONTACT.email}
                      </span>
                    </motion.a>
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
