import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { bricolage, dm_sans, koulen, montserrat, poppins } from "@/styles/font";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

import lightshardLeft from "../assets/lightshardleft.png";
import lightshardRight from "../assets/lightshardright.png";
import ContactCTA from "@/sections/common/ContactCTA";
import Testimonials from "@/sections/home/Testimonials";

export const metadata: Metadata = {
  title: "Japex Motors",
  description: "Buy and sell cars with confidence and ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${bricolage.variable} ${koulen.variable} ${poppins.variable} ${dm_sans.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-black overflow-hidden">
        <Navbar />
        {children}
        <SpeedInsights />
        <Analytics />
        <Testimonials />
        <ContactCTA />
        <Footer />
      </body>
    </html>
  );
}
