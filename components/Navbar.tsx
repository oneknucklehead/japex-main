"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  "Find a Car",
  "About",
  "Contact",
  "Finance",
  "Service & Parts",
];
const SCROLL_THRESHOLD = 20;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const bucketName = "assets";
  const logoPath = "Logo/logo-horizontal.png";
  const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${logoPath}`;

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

  // Track scroll for compact/blur state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // transparent + dark text ONLY on homepage, at the very top
  const transparentAtTop = isHome && !scrolled;
  const textColorClass = transparentAtTop ? "text-black" : "text-white";
  const bgClass = transparentAtTop
    ? "bg-transparent"
    : scrolled
      ? "bg-black/80 backdrop-blur-md"
      : "bg-black";
  const paddingClass = scrolled ? "py-2 lg:py-3" : "py-4 lg:py-7";
  const logoSizeClass = scrolled ? "w-20 md:w-24" : "w-28 md:w-32";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-center px-4 md:px-8 transition-all duration-300 ${bgClass} ${paddingClass}`}
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href={"/"}
          className={`relative z-50 transition-all duration-300 ${logoSizeClass}`}
        >
          <Image
            src={logoUrl}
            alt="JAPEX Motors"
            width={1920}
            height={1080}
            className="object-cover"
            sizes="(max-width: 768px) 5rem, 10vw"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <Link
              key={item}
              href={
                item === "Find a Car"
                  ? "/cars"
                  : `/${item.toLowerCase().replace(/\s+/g, "-").replace("&", "and")}`
              }
              className={`font-dm-sans font-medium transition-colors duration-300 hover:text-brand-primary ${textColorClass}`}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Desktop Phone CTA */}
        <div className="hidden lg:block">
          <a
            href="tel:0297560203"
            className="bg-brand-primary text-white font-dm-sans font-bold text-sm px-4 py-2 rounded-full duration-300 hover:bg-red-700 transition-colors"
          >
            02 9756 0203
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden z-50 p-2 -mr-2 focus:outline-none transition-colors duration-300 ${textColorClass}`}
          aria-label="Toggle Menu"
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

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-brand-dark backdrop-blur-3xl flex flex-col pt-24 px-6 pb-10 overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {NAV_LINKS.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={
                      item === "Find a Car"
                        ? "/cars"
                        : `/${item.toLowerCase().replace(/\s+/g, "-").replace("&", "and")}`
                    }
                    className="font-montserrat font-extrabold text-3xl sm:text-4xl text-white hover:text-brand-primary transition-colors block"
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
              className="mt-auto pt-10"
            >
              <p className="text-gray-400 font-dm-sans text-sm mb-4">
                Call us to get started with your next vehicle.
              </p>
              <a
                href="tel:0297560203"
                className="inline-flex items-center justify-center w-full bg-brand-primary text-white font-dm-sans font-bold text-lg px-6 py-4 rounded-xl hover:bg-red-700 transition-colors"
              >
                02 9756 0203
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
