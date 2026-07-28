"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { getAssetsStorageUrl } from "@/utils/helpers";
import Container from "@/components/Container";

// ── Motion presets ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const carVariants = {
  hidden: { opacity: 0, x: -70, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.25,
    },
  },
};

const frameVariants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.1,
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// ── Shared styles ───────────────────────────────────────────────────────────
const inputClasses =
  "w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 font-dm-sans text-sm text-white placeholder:text-neutral-500 outline-none transition-colors duration-300 focus:border-brand-primary";

// ── Contact detail rows ─────────────────────────────────────────────────────
const CONTACT_DETAILS = [
  {
    label: "Call us",
    value: "02 9756 0203",
    href: "tel:0297560203",
  },
  {
    label: "Email us",
    value: "sales@japexmotors.com.au",
    href: "mailto:sales@japexmotors.com.au",
  },
  {
    label: "Visit us",
    value: "2 Debenham Rd S, West Gosford NSW 2250",
    href: "https://maps.google.com/?q=2+Debenham+Rd+S,+West+Gosford+NSW+2250",
  },
];

export default function ContactClient() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const heroCar = getAssetsStorageUrl("Homepage/whyStandOut.png");

  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // wire up submit handler here
    setSent(true);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black font-dm-sans">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-black text-brand-white">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="relative px-6 pt-28 pb-10 lg:pt-36 lg:pb-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
            >
              <p className="mb-3 font-dm-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
                Get In Touch
              </p>
              <h1 className="mb-5 max-w-3xl font-poppins text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-6xl">
                Let&apos;s talk about
                <br />
                <span className="text-brand-primary">your next drive.</span>
              </h1>
              <p className="max-w-2xl font-dm-sans text-base leading-relaxed text-brand-gray lg:text-lg">
                Whether you&apos;re after a specific import, want to talk
                finance, or need our workshop — drop us a line and one of the
                team will get back to you, usually the same business day.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Imagery + Form ───────────────────────────────────────────────── */}
      <section ref={sectionRef} className="relative py-12 lg:py-20">
        <div className="pointer-events-none absolute -bottom-44 -right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-brand-primary/10 blur-3xl" />
        <Container>
          <div className="px-6">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
              {/* ── LEFT: imagery panel ──────────────────────────────── */}
              <div className="relative flex flex-col items-center lg:items-start">
                {/* red frame outline */}
                <motion.div
                  variants={frameVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="pointer-events-none absolute bottom-4 right-1/4 z-10 h-full w-40 rounded-[2.5rem] border-4 border-brand-primary border-b-black sm:w-48 lg:right-1/3"
                />

                {/* heading block */}
                <motion.div
                  variants={slideInLeft}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="relative z-20 mt-6 flex flex-col items-end self-center pr-4 text-right lg:mt-8 lg:ml-8 lg:self-auto"
                >
                  <p className="w-fit bg-black font-montserrat text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                    We&apos;re here
                  </p>
                  <p className="w-fit bg-black font-montserrat text-3xl font-extrabold leading-tight text-brand-primary sm:text-4xl lg:text-6xl">
                    to help.
                  </p>
                  <p className="ml-auto mt-3 w-fit max-w-68 bg-black font-bricolage text-sm leading-relaxed text-brand-gray">
                    Gosford based, Central Coast serving. Real people, straight
                    answers, no runaround.
                  </p>
                </motion.div>

                {/* car image */}
                <motion.div
                  variants={carVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="relative z-20 mt-6 w-full max-w-md lg:max-w-lg"
                >
                  <Image
                    src={heroCar}
                    alt=""
                    width={1920}
                    height={1080}
                    className="h-auto w-full object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>

                {/* contact detail rows */}
                {/* <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="relative z-20 mt-8 flex w-full flex-col gap-3"
                >
                  {CONTACT_DETAILS.map((d) => (
                    <motion.a
                      key={d.label}
                      href={d.href}
                      target={d.label === "Visit us" ? "_blank" : undefined}
                      rel={
                        d.label === "Visit us"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      variants={fadeUp}
                      whileHover={{ y: -2 }}
                      className="flex flex-col gap-0.5 rounded-xl border border-white/10 px-4 py-3 transition-colors duration-300 hover:border-brand-primary sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <span className="font-dm-sans text-xs font-bold uppercase tracking-[0.15em] text-brand-primary">
                        {d.label}
                      </span>
                      <span className="font-poppins text-sm font-semibold text-white sm:text-right">
                        {d.value}
                      </span>
                    </motion.a>
                  ))}
                </motion.div> */}
              </div>

              {/* ── RIGHT: form ──────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[28px] bg-linear-to-r from-white to-[#CA281C] p-px"
              >
                <div className="relative overflow-hidden rounded-[28px] bg-linear-to-b from-[#150606] to-black px-6 py-8 sm:px-8 sm:py-10">
                  <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-primary/20 blur-3xl sm:h-80 sm:w-80" />

                  <div className="relative">
                    <h2 className="mb-2 font-poppins text-2xl font-bold text-white sm:text-3xl">
                      Send us a message
                    </h2>
                    <p className="mb-7 font-dm-sans text-sm text-brand-gray">
                      Fill in your details and we&apos;ll be in touch shortly.
                    </p>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4 font-poppins"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className={inputClasses}
                        />
                        <input
                          name="number"
                          value={form.number}
                          onChange={handleChange}
                          placeholder="Your number"
                          className={inputClasses}
                        />
                      </div>

                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        required
                        className={inputClasses}
                      />

                      <div className="relative">
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Message"
                          rows={5}
                          required
                          className={`${inputClasses} resize-none pb-16`}
                        />
                        <motion.button
                          type="submit"
                          // whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.96 }}
                          className="absolute bottom-3 right-3 cursor-pointer rounded-lg bg-brand-primary px-5 py-2 font-poppins text-sm font-bold text-white transition-colors duration-300 hover:bg-red-700"
                        >
                          Send
                        </motion.button>
                      </div>

                      {sent && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="font-dm-sans text-sm text-brand-gray"
                        >
                          Thanks — we&apos;ve got your message and will be in
                          touch shortly.
                        </motion.p>
                      )}
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
