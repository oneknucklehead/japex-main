import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const bucketName = "assets";
  const logoPath = "Logo/logo.png";

  const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${logoPath}`;
  return (
    <header className="bg-brand-dark max-h-24 flex items-center justify-center py-8 px-8 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <div className="relative w-25 h-10">
          <Image
            src={logoUrl}
            alt="JAPEX Motors"
            fill
            className="object-contain"
            sizes="10vw"
            priority
          />
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-8">
          {["Find a Car", "About", "Contact", "Finance", "Service & Parts"].map(
            (item) => (
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
            ),
          )}
        </nav>

        {/* Phone CTA */}
        <a
          href="tel:0297560203"
          className="bg-brand-primary text-white font-dm-sans font-bold text-sm px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
        >
          02 9756 0203
        </a>
      </div>
    </header>
  );
};

export default Navbar;
