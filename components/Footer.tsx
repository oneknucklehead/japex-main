"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAssetsStorageUrl } from "@/utils/helpers";
import Container from "./Container";

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
      className="text-gray-600 text-sm hover:text-red-600 transition-colors"
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
  const logo = getAssetsStorageUrl("Logo/logo.png");
  // Define footer sections and links
  const sections = [
    {
      title: "Quick Links",
      links: [
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
      ],
    },
    {
      title: "Car Types",
      links: [
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
        { label: "Lorem Ipsum", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-white border-t border-gray-200 py-24 px-6">
      <Container>
        <div className="flex flex-col gap-12 lg:gap-16">
          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12">
            {/* Company info */}
            <div className="flex flex-col gap-6 md:max-w-xs lg:col-span-2">
              <Link href="/">
                <Image
                  src={logo}
                  alt="JAPEX Motors"
                  width={99}
                  height={60}
                  className="object-contain w-25 h-auto"
                  priority
                />
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed font-bricolage">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <SocialIcon src={facebookIcon} alt="Facebook" href="#" />
                <SocialIcon src={xIcon} alt="X" href="#" />
                <SocialIcon src={linkedinIcon} alt="LinkedIn" href="#" />
              </div>
            </div>

            {/* Links sections */}
            {sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h4 className="font-bold text-gray-900 text-sm lg:text-base font-montserrat">
                  {section.title}
                </h4>
                <ul className="flex flex-col gap-2">
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

          {/* Bottom copyright/links */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-8 mt-12 text-gray-600 text-sm">
            <p>&copy; {currentYear} JAPX Motors | All Right Reserved</p>
            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="hover:text-red-600 transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:text-red-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
