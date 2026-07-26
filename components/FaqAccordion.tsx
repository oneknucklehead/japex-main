"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Tagline from "./Tagline";
import Container from "./Container";

interface Faq {
  id: string;
  question: string;
  answer: string;
  position: number;
}

interface Props {
  faqs: Faq[];
}

// ── Arrow button ──────────────────────────────────────────────────────────────
const ArrowButton = ({ open }: { open: boolean }) => (
  <motion.div
    animate={{
      backgroundColor: open ? "#ffffff" : "rgba(0, 0, 0, 0)",
    }}
    transition={{ duration: 0.15 }}
    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full duration-300 shrink-0 flex items-center justify-center transition-all border ${
      open
        ? "border-brand-white bg-brand-white"
        : "border-gray-300 bg-transparent"
    }`}
  >
    <motion.svg
      animate={{ rotate: open ? 225 : 180 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
        open ? "text-brand-dark" : "text-brand-white"
      } transition-all`}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.292893 6.65666C-0.0976314 7.04719 -0.0976315 7.68035 0.292893 8.07088L6.65685 14.4348C7.04738 14.8254 7.68054 14.8254 8.07107 14.4348C8.46159 14.0443 8.46159 13.4111 8.07107 13.0206L2.41421 7.36377L8.07107 1.70691C8.46159 1.31639 8.46159 0.683226 8.07107 0.292701C7.68054 -0.0978233 7.04738 -0.0978234 6.65686 0.292701L0.292893 6.65666ZM15 7.36377L15 6.36377L1 6.36377L1 7.36377L1 8.36377L15 8.36377L15 7.36377Z"
        fill={`${open ? "#161616" : "#ffffff"}`}
        className="transition-all duration-300"
      />
    </motion.svg>
  </motion.div>
);

// ── Single FAQ item ───────────────────────────────────────────────────────────
const FaqItem = ({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: Faq;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`p-px bg-linear-to-b from-white ${
        isOpen ? "to-[#9C9C9C]" : "to-[#CA281C]"
      } rounded-[13px] sm:rounded-[17px]`}
    >
      <motion.div
        animate={{
          boxShadow: isOpen
            ? "0 4px 24px rgba(0,0,0,0.08)"
            : "0 1px 4px rgba(0,0,0,0.04)",
        }}
        className={`bg-linear-to-b from-black ${
          isOpen ? "to-[#CA281C]" : "to-[#313131]"
        } cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden`}
      >
        {/* Question row — clickable */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full text-white cursor-pointer flex items-center justify-between gap-3 sm:gap-4 px-4 py-4 sm:px-5 sm:py-4.5 md:px-6 md:py-5 text-left"
        >
          <span className="font-extrabold text-sm sm:text-base md:text-lg lg:text-xl leading-snug font-bricolage transition-colors min-w-0">
            {faq.question}
          </span>
          <ArrowButton open={isOpen} />
        </button>

        {/* Answer — animated expand/collapse */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6 text-brand-gray text-xs sm:text-sm md:text-base max-w-4xl leading-relaxed font-dm-sans">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function FaqAccordion({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(faqs?.[0]?.id ?? null);

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="w-full py-12 sm:py-14 md:py-16 px-6 sm:px-5 md:px-6">
      <Container>
        <div className="mx-auto">
          <Tagline text="Have Questions?" />
          {/* Header */}
          <motion.h2
            ref={headerRef}
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bricolage mb-2 px-2 sm:px-0"
          >
            Frequently Asked Questions
          </motion.h2>
          <p className="text-center font-semibold text-sm sm:text-base md:text-lg text-brand-gray mb-8 sm:mb-10 px-2 sm:px-0">
            Lorem ipsum dolor sit amet, consectetur sed?
          </p>

          {/* FAQ list */}
          {!faqs?.length ? (
            <p className="text-center text-brand-gray text-sm sm:text-base py-8">
              No questions yet — check back soon.
            </p>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {faqs.map((faq, i) => (
                <FaqItem
                  key={faq.id}
                  faq={faq}
                  index={i}
                  isOpen={openId === faq.id}
                  onToggle={() => toggle(faq.id)}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
