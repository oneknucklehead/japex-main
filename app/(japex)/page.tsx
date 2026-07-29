import type { Metadata } from "next";

import BannerGrid from "@/sections/home/BannerGrid";
import CollectionBudgetwise from "@/sections/home/CollectionBudgetwise";
import ExploreLatestArrivals from "@/sections/home/ExploreLatestArrivals";
import Faqs from "@/sections/home/Faqs";
import WhyWeStandOut from "@/sections/home/WhyWeStandOut";
import callmecard from "../../assets/callmecard.png";
import CallExpertCard from "@/components/Callexpertcard";
import LightShard from "@/components/LightShard";
import HeroBanner from "@/components/Herobanner";

export const metadata: Metadata = {
  title: "Home | Japex Motors",
  description:
    "Japex Motors brings the best of Japanese automotive culture to the Central Coast — precision-sourced vehicles, custom-finished in-house, expertly complied, and backed end to end.",
};

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative">
        <HeroBanner />
      </section>
      {/* <HomeBadges /> */}

      {/* Decorative light shards — scale with viewport, hidden on the
          smallest screens where they crowd the content */}
      <LightShard className="pointer-events-none absolute left-0 -z-10 hidden w-48 -ml-8 sm:block sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain object-center" />
      <LightShard className="pointer-events-none absolute right-0 -z-10 hidden w-48 -mr-8 -rotate-90 sm:block sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain object-center" />

      {/* ── Latest arrivals ──────────────────────────────────────────────── */}
      <section className="pt-20 pb-8 sm:pt-24 sm:pb-20 md:pt-32 md:pb-24">
        <ExploreLatestArrivals />
      </section>

      {/* ── Budget-wise collection ───────────────────────────────────────── */}
      <section className="relative py-8 sm:py-20 md:py-24">
        <CollectionBudgetwise />
      </section>

      {/* ── Banner grid ──────────────────────────────────────────────────── */}
      <section className="relative py-8 sm:py-20">
        <BannerGrid />
      </section>

      {/* ── Why we stand out ─────────────────────────────────────────────── */}
      <section className="relative py-8 sm:py-20 md:py-24">
        <WhyWeStandOut />
      </section>

      {/* ── Call an expert ───────────────────────────────────────────────── */}
      <section className="relative py-8 sm:py-20 md:py-24">
        <CallExpertCard image={callmecard} />
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────── */}
      <section className="relative py-8 sm:py-20 md:py-24">
        <Faqs />
      </section>
    </main>
  );
}
