"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const NAV_LINKS = ["Find a Car", "About", "Contact", "Finance", "Service & Parts"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const bucketName = "assets";
  const logoPath = "Logo/logo.png";
  const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${logoPath}`;

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="bg-brand-dark flex items-center justify-center py-4 md:py-6 px-4 md:px-8 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link href={"/"} className="relative w-20 h-8 md:w-25 md:h-10 z-50">
          <Image
            src={logoUrl}
            alt="JAPEX Motors"
            fill
            className="object-contain"
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
              className="font-dm-sans font-medium text-sm text-white hover:text-brand-primary transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Desktop Phone CTA */}
        <div className="hidden lg:block">
          <a
            href="tel:0297560203"
            className="bg-brand-primary text-white font-dm-sans font-bold text-sm px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
          >
            02 9756 0203
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden z-50 p-2 -mr-2 text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <div className="w-6 flex flex-col items-end gap-1.5">
            <motion.span
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-full h-0.5 bg-white block origin-left"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-4/5 h-0.5 bg-white block"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-full h-0.5 bg-white block origin-left"
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
            className="fixed inset-0 z-40 bg-brand-dark/98 backdrop-blur-3xl flex flex-col pt-24 px-6 pb-10 overflow-y-auto"
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
