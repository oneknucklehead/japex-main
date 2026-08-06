"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { getAssetsStorageUrl } from "@/utils/helpers";

const NAV_LINKS = [
  "Find a Car",
  "About",
  "Contact",
  "Finance",
  "Service & Parts",
];
const SCROLL_THRESHOLD = 20;
const PHONE_NUMBER = "02 8041 4967";
const PHONE_HREF = "tel:0280414967";

const hrefFor = (item: string) =>
  item === "Find a Car"
    ? "/cars"
    : `/${item.toLowerCase().replace(/\s+/g, "-").replace("&", "and")}`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Built via the helper rather than inline, so it resolves through ASSET_MAP
  // like every other asset. The inline version was the reason this logo kept
  // pointing at Supabase after the migration.
  const logoUrl = getAssetsStorageUrl("Logo/logo-vertical.png");

  // Prevent scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu if resized up into the desktop nav breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Track scroll for compact/blur state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // transparent + dark text ONLY on homepage, at the very top, menu closed
  const transparentAtTop = isHome && !scrolled && !isOpen;
  const textColorClass = transparentAtTop ? "text-black" : "text-white";
  const bgClass = isOpen
    ? "bg-transparent"
    : transparentAtTop
      ? "bg-transparent"
      : scrolled
        ? "bg-black/80 backdrop-blur-md"
        : "bg-black";
  const paddingClass = scrolled ? "py-1 " : "py-1 ";
  const logoSizeClass = scrolled
    ? "w-16 sm:w-18 md:w-20 lg:w-16 xl:w-20"
    : "w-20 sm:w-24 md:w-28 lg:w-20 xl:w-24";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-all duration-300 ${bgClass} ${paddingClass}`}
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-4">
        {/* Logo */}
        <Link
          href={"/"}
          className={`relative z-50 shrink-0 transition-all duration-300 ${logoSizeClass}`}
        >
          <Image
            src={logoUrl}
            alt="JAPEX Motors"
            width={1920}
            height={1080}
            className="object-contain w-full h-auto"
            sizes="(max-width: 640px) 5rem, (max-width: 1024px) 7rem, 6rem"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8 min-w-0">
          {NAV_LINKS.map((item) => (
            <Link
              key={item}
              href={hrefFor(item)}
              className={`font-dm-sans font-medium text-sm xl:text-base whitespace-nowrap transition-colors duration-300 hover:text-brand-primary ${textColorClass}`}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right cluster — phone CTA + hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Compact phone icon — tablet only (md → lg) */}
          <a
            href={PHONE_HREF}
            aria-label={`Call ${PHONE_NUMBER}`}
            className="hidden md:flex lg:hidden items-center justify-center w-10 h-10 rounded-full bg-brand-primary text-white transition-colors duration-300 hover:bg-red-700"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.24 1L7.7 9.7a14 14 0 006.6 6.6l1.72-1.4a1 1 0 011-.23l3.3 1.1a1 1 0 01.68.94V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
              />
            </svg>
          </a>

          {/* Full phone CTA — desktop */}
          <a
            href={PHONE_HREF}
            className="hidden lg:inline-block bg-brand-primary text-white font-dm-sans font-bold text-xs xl:text-sm px-3 xl:px-4 py-2 rounded-full whitespace-nowrap duration-300 hover:bg-red-700 transition-colors"
          >
            {PHONE_NUMBER}
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden z-50 p-2 -mr-2 focus:outline-none transition-colors duration-300 ${
              isOpen ? "text-white" : textColorClass
            }`}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <div className="w-6 flex flex-col items-end gap-1.5">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 2 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-current block origin-left"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-4/5 h-0.5 bg-current block"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: 2 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-current block origin-left"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-brand-dark backdrop-blur-3xl flex flex-col pt-20 sm:pt-24 px-6 sm:px-8 pb-8 sm:pb-10 overflow-y-auto lg:hidden"
          >
            <nav className="flex flex-col gap-4 sm:gap-6 mt-6 sm:mt-8">
              {NAV_LINKS.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={hrefFor(item)}
                    className="font-montserrat font-extrabold text-2xl sm:text-3xl md:text-4xl text-white hover:text-brand-primary transition-colors block"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-auto pt-8 sm:pt-10"
            >
              <p className="text-gray-400 font-dm-sans text-sm mb-4">
                Call us to get started with your next vehicle.
              </p>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center w-full bg-brand-primary text-white font-dm-sans font-bold text-base sm:text-lg px-6 py-3.5 sm:py-4 rounded-xl hover:bg-red-700 transition-colors"
              >
                {PHONE_NUMBER}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
