import type { Metadata } from "next";
import FinanceClient from "./FinaceClient";
export const metadata: Metadata = {
  title: "Finance | Japex Motors",
  description:
    "Finance without the headache. Multiple lenders, one team, zero runaround — plus a 5-year warranty standard on every Japex vehicle. Compliance handled in-house, so the price you see is the price you pay.",
};

export default function FinancePage() {
  return <FinanceClient />;
}
