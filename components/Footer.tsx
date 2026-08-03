"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getAssetsStorageUrl } from "@/utils/helpers";
import Container from "./Container";
import FooterJapex from "./FooterJapex";

// ── Shared motion variants for list items ───────────────────────────────────
const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05, // Staggered animation
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

// ── Footer link component ─────────────────────────────────────────────────────
const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href}>
    <motion.span
      className="text-brand-gray text-sm hover:text-brand-primary transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  </Link>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function Footer() {
  const logo = getAssetsStorageUrl("Logo/footer.png");
  // Define footer sections and links
  const sections = [
    {
      title: "Popular Brands",
      links: [
        { label: "Toyota", href: "/cars?brand=Toyota" },
        { label: "Hyundai", href: "/cars?brand=Hyundai" },
        { label: "Mitsubishi", href: "/cars?brand=Mitsubishi" },
        { label: "Mazda", href: "/cars?brand=Mazda" },
        { label: "Kia", href: "/cars?brand=Kia" },
        { label: "Ford", href: "/cars?brand=Ford" },
        { label: "Volkswagen", href: "/cars?brand=Volkswagen" },
      ],
    },
    {
      title: "Car Types",
      links: [
        { label: "SUVs", href: "/cars?body=SUV" },
        { label: "Sedan", href: "/cars?body=Sedan" },
        { label: "Campervans / Vans", href: "/cars?body=Van" },
        { label: "People Mover / Wagon", href: "/cars?body=Wagon" },
        { label: "Hatchbacks", href: "/cars?body=Hatchback" },
        { label: "All", href: "/cars" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "Service & Parts", href: "/service-and-parts" },
        { label: "Why Japex", href: "/about" },
        { label: "Car Financing", href: "/finance" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Contact us", href: "/contact" },
        { label: "About us", href: "/about" },
      ],
    },
  ];

  return (
    <footer className="w-full py-24">
      <Container>
        <div className="px-6">
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Main content grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
              {/* Links sections */}
              {sections.map((section) => (
                <div key={section.title} className="flex flex-col gap-4">
                  <h4 className="font-bold text-brand-white text-sm lg:text-base font-montserrat">
                    {section.title}
                  </h4>
                  <ul className="flex flex-col gap-2 transition-all">
                    {section.links.map((link, i) => (
                      <motion.li
                        key={i}
                        custom={i}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <FooterLink href={link.href}>{link.label}</FooterLink>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Social */}
            <div className="flex items-center gap-4 border-t border-white/10 pt-8">
              <p className="font-montserrat text-sm font-bold text-brand-white">
                Follow us
              </p>
              <motion.a
                href="https://www.instagram.com/japexmotors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Japex Motors on Instagram"
                // whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-brand-gray transition-colors duration-300 hover:border-brand-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </Container>
      <FooterJapex />
    </footer>
  );
}
