import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactCTA from "@/sections/common/ContactCTA";
import Testimonials from "@/sections/home/Testimonials";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Testimonials />
      <ContactCTA />
      <Footer />
    </>
  );
}
