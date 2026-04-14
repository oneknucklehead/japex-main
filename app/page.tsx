import CTAFooterBanner from "@/components/CTAFooterBanner";
import BannerGrid from "@/sections/home/BannerGrid";
import CollectionBudgetwise from "@/sections/home/CollectionBudgetwise";
import ExploreLatestArrivals from "@/sections/home/ExploreLatestArrivals";
import Faqs from "@/sections/home/Faqs";
import MainBanner from "@/sections/home/MainBanner";
import StatsGrid from "@/sections/home/StatsGrid";
import Testimonials from "@/sections/home/Testimonials";
import WhyWeStandOut from "@/sections/home/WhyWeStandOut";

export default function Home() {
  return (
    <main className="">
      <section className="relative h-156.25">
        <MainBanner />
      </section>
      <section className="pt-24 pb-32 bg-[#efeded]">
        <ExploreLatestArrivals />
      </section>
      <section className="relative py-24">
        <BannerGrid />
      </section>
      <section>
        <WhyWeStandOut />
      </section>
      <section className="relative py-24">
        <CollectionBudgetwise />
      </section>
      <section>
        <StatsGrid />
      </section>
      <section>
        <Testimonials />
      </section>
      <section>
        <Faqs />
      </section>
      <section>
        <CTAFooterBanner />
      </section>
    </main>
  );
}
