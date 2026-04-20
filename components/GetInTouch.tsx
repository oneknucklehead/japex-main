"use client";

import { motion } from "framer-motion";
import Container from "./Container";
import { ArrowIcon, ChatIcon, EmailIcon, PhoneIcon } from "./Icons/Icons";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ContactCard {
  id: string;
  label: string;
  value?: string;
  icon: React.ReactNode;
  href: string;
  /** If true, shows the arrow-link style instead of the icon */
  isLink?: boolean;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const CARDS: ContactCard[] = [
  {
    id: "call",
    label: "Call Us",
    value: "+91 98765 43210",
    icon: <PhoneIcon />,
    href: "tel:+919876543210",
  },
  {
    id: "connect",
    label: "Connect with us",
    icon: <ArrowIcon />,
    href: "#",
    isLink: true,
  },
  {
    id: "email",
    label: "Email",
    value: "hello@nippon.com",
    icon: <EmailIcon />,
    href: "mailto:hello@nippon.com",
  },
  {
    id: "text",
    label: "Text Us",
    value: "+91 98765 43210",
    icon: <ChatIcon />,
    href: "sms:+919876543210",
  },
];

// ── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const leftVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ── Sub-component: ContactCard ────────────────────────────────────────────────

function ContactCard({ card }: { card: ContactCard }) {
  return (
    <motion.a
      href={card.href}
      variants={cardVariants}
      // whileHover={{ scale: 1.02, boxShadow: "0 6px 24px rgba(0,0,0,0.08)" }}
      // whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        group flex items-center justify-between gap-4
        bg-white border border-gray-300 hover:border-gray-400 rounded-xl px-5 py-4
        cursor-pointer select-none shadow-sm hover:shadow-md transition-all duration-200
        ${card.isLink ? "min-h-[76px]" : "min-h-[76px]"}
      `}
    >
      {/* Text */}
      <div>
        <p className="text-sm font-semibold text-gray-900 font-montserrat leading-tight">
          {card.label}
        </p>
        {card.value && (
          <p className="text-sm text-gray-500 font-dm-sans mt-0.5">
            {card.value}
          </p>
        )}
      </div>

      {/* Icon badge */}
      <span
        className={`
          flex items-center justify-center rounded-full shrink-0
          w-9 h-9 transition-colors duration-200
          ${
            card.isLink
              ? "bg-brand-dark text-white group-hover:bg-brand-primary"
              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
          }
        `}
      >
        {card.icon}
      </span>
    </motion.a>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GetInTouch() {
  return (
    <section className="w-full bg-[#efeded] py-12 px-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-10">
          {/* ── Left: heading + hours ─────────────────────────────────────── */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="text-left"
          >
            <h2 className="text-2xl md:text-4xl font-extrabold leading-snug text-brand-dark font-montserrat">
              Let&apos;s get in touch,{" "}
              <span className="block">We&apos;re here to help</span>
            </h2>
            <div className="mt-4 text-sm md:text-base text-brand-dark font-dm-sans space-y-1">
              <p>Mon – Fri : 8AM – 9PM</p>
              <p>Sat – Sun : 9AM – 6PM</p>
            </div>
          </motion.div>

          {/* ── Right: 2×2 card grid ──────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 w-full"
          >
            {CARDS.map((card) => (
              <ContactCard key={card.id} card={card} />
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
