"use client";

import Container from "@/components/Container";
import { motion } from "framer-motion";
import { useState } from "react";
import { submitContactForm } from "@/lib/submitContactForm";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const inputClasses =
  "w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 font-dm-sans text-sm text-white placeholder:text-neutral-500 outline-none transition-colors duration-300 focus:border-[#CA281C] disabled:opacity-60";

const EMPTY_FORM = { name: "", number: "", email: "", message: "" };

export default function ContactCTA() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const result = await submitContactForm(form, "cta");

    setSending(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setForm(EMPTY_FORM);
    setSent(true);
  };

  return (
    <section className="w-full px-6 py-8 sm:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto rounded-[28px] bg-linear-to-r from-white to-[#CA281C] p-px"
        >
          <div className="flex flex-col gap-10 rounded-[28px] bg-black px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            {/* left — heading */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={0}
              variants={fadeUp}
              className="flex flex-col gap-4 lg:w-[42%]"
            >
              <h2 className="font-poppins text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
                Ready to find your next
                <br />
                <span className="text-[#CA281C]">Japanese import?</span>
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <p className="font-poppins text-sm font-semibold text-neutral-300">
                  Or you can call us at
                </p>
                <a
                  href="tel:0280414967"
                  className="rounded-full border border-white/20 px-4 py-2 font-poppins text-sm font-bold text-white transition-colors duration-300 hover:border-[#CA281C]"
                >
                  02 8041 4967
                </a>
              </div>
            </motion.div>

            {/* right — form */}
            <motion.form
              onSubmit={handleSubmit}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={1}
              variants={fadeUp}
              className="font-poppins flex flex-1 flex-col gap-4"
            >
              <div className="font-poppins flex flex-col gap-4 sm:flex-row">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  disabled={sending}
                  className={inputClasses}
                />
                <input
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  placeholder="Your number"
                  disabled={sending}
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
                disabled={sending}
                className={inputClasses}
              />

              <div className="relative">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows={4}
                  required
                  disabled={sending}
                  className={`${inputClasses} resize-none pb-14`}
                />
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileTap={{ scale: 0.96 }}
                  className="absolute bottom-3 right-3 rounded-lg bg-brand-primary px-5 py-2 font-poppins text-sm font-bold text-white transition-colors duration-300 hover:bg-[#a8211a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Send"}
                </motion.button>
              </div>

              {error && (
                <p className="font-dm-sans text-sm text-[#CA281C]">{error}</p>
              )}

              {sent && !error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-dm-sans text-sm text-neutral-300"
                >
                  Thanks — we&apos;ve got your message and will be in touch
                  shortly.
                </motion.p>
              )}
            </motion.form>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
