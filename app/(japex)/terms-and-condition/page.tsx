import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions | Japex Motors",
  description:
    "The terms that apply when you access or use the Japex Motors website.",
};

export default function TermsPage() {
  return <TermsClient />;
}
