import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TestimonialsSkeleton from "@/components/TestimonialsSkeleton";
import ContactCTA from "@/sections/common/ContactCTA";
import Testimonials from "@/sections/home/Testimonials";
import { Suspense } from "react";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials />
      </Suspense>
      <ContactCTA />
      <Footer />
    </>
  );
}
