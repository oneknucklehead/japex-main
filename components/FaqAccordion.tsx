"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

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
      backgroundColor: open ? "#de0c0d" : "transparent",
    }}
    transition={{ duration: 0.3 }}
    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border transition-all ${
      open ? "border-brand-primary" : "border-gray-300"
    }`}
  >
    <motion.svg
      animate={{ rotate: open ? 225 : 180 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`w-3 h-3 ${open ? "text-white" : "text-brand-dark"}`}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        d="M0.292893 6.65666C-0.0976314 7.04719 -0.0976315 7.68035 0.292893 8.07088L6.65685 14.4348C7.04738 14.8254 7.68054 14.8254 8.07107 14.4348C8.46159 14.0443 8.46159 13.4111 8.07107 13.0206L2.41421 7.36377L8.07107 1.70691C8.46159 1.31639 8.46159 0.683226 8.07107 0.292701C7.68054 -0.0978233 7.04738 -0.0978234 6.65686 0.292701L0.292893 6.65666ZM15 7.36377L15 6.36377L1 6.36377L1 7.36377L1 8.36377L15 8.36377L15 7.36377Z"
        fill="currentColor"
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
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        animate={{
          boxShadow: isOpen
            ? "0 4px 24px rgba(0,0,0,0.08)"
            : "0 1px 4px rgba(0,0,0,0.04)",
        }}
        className="bg-white  cursor-pointer rounded-2xl overflow-hidden"
      >
        {/* Question row — clickable */}
        <button
          onClick={onToggle}
          className="w-full  cursor-pointer flex items-center justify-between gap-4 px-6 py-5 text-left"
        >
          <span
            className={`font-bold text-base leading-snug font-montserrat transition-colors ${
              isOpen ? "text-gray-900" : "text-gray-900"
            }`}
          >
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
              <p className="px-6 pb-6 text-gray-500 text-sm leading-relaxed font-dm-sans">
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
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="w-full bg-[#f0eeee] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.h2
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-extrabold text-3xl lg:text-5xl text-gray-900 font-montserrat mb-10"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* FAQ list */}
        <div className="flex flex-col gap-4">
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
      </div>
    </section>
  );
}
