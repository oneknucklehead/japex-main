"use client";

import Image from "next/image";
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

// ── Social icon component ─────────────────────────────────────────────────────
const SocialIcon = ({
  src,
  alt,
  href,
}: {
  src: string;
  alt: string;
  href: string;
}) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    <motion.div
      className={`w-10 h-10 cursor-pointer rounded-xl border border-gray-300 bg-white flex items-center justify-center shadow-sm transition-all duration-200             hover:border-gray-400 hover:shadow-md text-gray-700"
            `}
      // className="w-10 h-10 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
    >
      <Image src={src} alt={alt} width={20} height={20} />
    </motion.div>
  </Link>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const facebookIcon = getAssetsStorageUrl("Logo/Facebook.png");
  const linkedinIcon = getAssetsStorageUrl("Logo/LinkedIn.png");
  const xIcon = getAssetsStorageUrl("Logo/X.png");
  const logo = getAssetsStorageUrl("Logo/footer.png");
  // Define footer sections and links
  const sections = [
    {
      title: "Popular Brands",
      links: [
        { label: "Toyota", href: "/cars?brand=Toyota" },
        { label: "Hyundai", href: "/cars?brand=Hyundai" },
        { label: "Mitshubishi", href: "/cars?brand=Mitshubishi" },
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
        { label: "Prestige", href: "/cars?type=Prestige" },
        { label: "Hatchbacks", href: "/cars?body=Hatchback" },
        { label: "All", href: "/cars" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "Service & Parts", href: "/service-and-parts" },
        { label: "Why Japex", href: "/why-japex" },
        { label: "Warranty", href: "/warranty" },
        { label: "Car Financing", href: "/finance" },
        { label: "Quality Standards", href: "/quality-standards" },
        { label: "Blogs", href: "/blogs" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Contact us", href: "/contact" },
        { label: "About us", href: "/about" },
        { label: "FAQs", href: "/faqs" },
        { label: "Partnerships", href: "/partnerships" },
        { label: "Careers", href: "/careers" },
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
          </div>
        </div>
      </Container>
      <FooterJapex />
    </footer>
  );
}
