import type { Metadata } from "next";

import "./globals.css";
import { bricolage, dm_sans, koulen, montserrat, poppins } from "@/styles/font";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.japexmotors.com.au"),
  alternates: { canonical: "./" },
  title: "Japex Motors",
  description: "Buy and sell cars with confidence and ease.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${bricolage.variable} ${koulen.variable} ${poppins.variable} ${dm_sans.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-black">
        {children}
      </body>
    </html>
  );
}
