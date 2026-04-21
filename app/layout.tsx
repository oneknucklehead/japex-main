import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { bricolage, dm_sans, montserrat } from "@/styles/font";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Japx Motors",
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
      className={`${montserrat.variable} ${bricolage.variable} ${dm_sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <SpeedInsights />
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
