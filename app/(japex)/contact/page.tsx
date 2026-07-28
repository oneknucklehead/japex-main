import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Japex Motors",
  description:
    "Japex Motors brings the best of Japanese automotive culture to the Central Coast — precision-sourced vehicles, custom-finished in-house, expertly complied, and backed end to end.",
};

export default function AboutPage() {
  return <ContactClient />;
}
