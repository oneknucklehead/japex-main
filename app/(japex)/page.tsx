import type { Metadata } from "next";

import CollectionBudgetwise from "@/sections/home/CollectionBudgetwise";
import ExploreLatestArrivals from "@/sections/home/ExploreLatestArrivals";
import LightShard from "@/components/LightShard";
import HeroBanner from "@/components/Herobanner";
import dynamic from "next/dynamic";

// Revalidate every 60s.
//
// Without this, Next.js renders this page once at build time and serves that
// HTML indefinitely — deleted cars keep appearing because the page was never
// re-rendered, not because the data is stale in Appwrite.
//
// 60s is a floor, not a ceiling: the admin API routes call revalidatePath()
// after every car mutation, so edits appear immediately rather than waiting
// out this window. This exists to catch changes made outside the app (directly
// in the Appwrite console, say).
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Home | Japex Motors",
  description:
    "Japex Motors brings the best of Japanese automotive culture to the Central Coast — precision-sourced vehicles, custom-finished in-house, expertly complied, and backed end to end.",
};

const WhyWeStandOut = dynamic(() => import("@/sections/home/WhyWeStandOut"));
const BannerGrid = dynamic(() => import("@/sections/home/BannerGrid"));
const CallExpertCard = dynamic(() => import("@/components/Callexpertcard"));
const Faqs = dynamic(() => import("@/sections/home/Faqs"));

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative">
        <HeroBanner />
      </section>

      <LightShard className="pointer-events-none absolute left-0 -z-10 hidden w-48 -ml-8 sm:block sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain object-center" />
      <LightShard className="pointer-events-none absolute right-0 -z-10 hidden w-48 -mr-8 -rotate-90 sm:block sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain object-center" />

      <section className="pt-20 pb-8 sm:pt-24 sm:pb-20 md:pt-32 md:pb-24">
        <ExploreLatestArrivals />
      </section>

      <section className="relative py-8 sm:py-20 md:py-24">
        <CollectionBudgetwise />
      </section>

      <section className="relative py-8 sm:py-20">
        <BannerGrid />
      </section>

      <section className="relative py-8 sm:py-20 md:py-24">
        <WhyWeStandOut />
      </section>

      <section className="relative py-8 sm:py-20 md:py-24">
        <CallExpertCard />
      </section>

      <section className="relative py-8 sm:py-20 md:py-24">
        <Faqs />
      </section>
    </main>
  );
}
