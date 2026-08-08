import type { Metadata } from "next";
import AboutClient from "./Aboutclient";

export const metadata: Metadata = {
  title: "About Us | Japex Motors",
  description:
    "Japex Motors brings the best of Japanese automotive culture to the Central Coast — precision-sourced vehicles, custom-finished in-house, expertly complied, and backed end to end.",
};
export default function AboutPage() {
  return <AboutClient />;
}
