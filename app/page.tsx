import CTAFooterBanner from "@/components/CTAFooterBanner";
import BannerGrid from "@/sections/home/BannerGrid";
import CollectionBudgetwise from "@/sections/home/CollectionBudgetwise";
import ExploreLatestArrivals from "@/sections/home/ExploreLatestArrivals";
import Faqs from "@/sections/home/Faqs";
import MainBanner from "@/sections/home/MainBanner";
import StatsGrid from "@/sections/home/StatsGrid";
import Testimonials from "@/sections/home/Testimonials";
import WhyWeStandOut from "@/sections/home/WhyWeStandOut";
import GetInTouch from "@/components/GetInTouch";
import { motion } from "framer-motion";

import CarCardNew from "@/components/tryouts/CarCardNew";
import CarCardFirst from "@/components/tryouts/CarCardFirst";
import HeroBanner from "@/components/Herobanner";
import ExploreCollection from "@/sections/home/ExploreCollection";
import Image from "next/image";
import callmecard from "../assets/callmecard.png";
import CallExpertCard from "@/components/Callexpertcard";
import ContactCTA from "@/sections/common/ContactCTA";
import LightShard from "@/components/LightShard";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative">
        <HeroBanner />
        {/* <ExploreCollection /> */}
      </section>
      {/* <section className="relative h-156.25">
        <MainBanner />
      </section> */}
      {/* <section className="relative py-20 md:py-24 bg-black">
        <CarCardFirst />
      </section>
      <section className="relative py-20 md:py-24 bg-black">
        <CarCardNew />
      </section> */}

      <LightShard className="absolute left-0 w-72 h-72 object-cover object-center -ml-10  -z-10" />
      <LightShard className="-rotate-90 absolute right-0 w-72 h-72 object-cover object-center -mr-10  -z-10" />

      <section className="pt-40 md:pt-32 pb-24">
        <ExploreLatestArrivals />
      </section>
      <section className="relative py-24">
        <CollectionBudgetwise />
      </section>
      <section className="relative py-20 md:py-24">
        <BannerGrid />
      </section>
      <section>
        <WhyWeStandOut />
      </section>
      <section>
        <CallExpertCard image={callmecard} />
      </section>
      {/* <section>
        <StatsGrid />
      </section> */}
      {/* <section className="relative">
        <Testimonials />
      </section> */}
      <section>
        <Faqs />
      </section>
    </main>
  );
}
