import type { Metadata } from "next";
import ServiceClient from "./ServiceClient";

export const metadata: Metadata = {
  title: "Service & Parts | Japex Motors",
  description:
    "Japanese-market specialists in Gosford. Logbook servicing, mechanical repairs, genuine parts, and Delica & Hiace builds — all in-house by technicians who know these vehicles inside out. Warranty work honoured properly.",
};

export default function ServicePage() {
  return <ServiceClient />;
}
