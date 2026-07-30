"use client";

import Container from "@/components/Container";
import ServiceCard from "./ServiceCard";
import ServiceCardTwo from "./ServiceCardTwo";
import { getAssetsStorageUrl } from "@/utils/helpers";

const BannerGrid = () => {
  const image1 = getAssetsStorageUrl("Homepage/carparts.png");
  const image2 = getAssetsStorageUrl("Homepage/finance2.png");
  return (
    <div className="px-6 sm:px-5 md:px-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-6 lg:gap-8 w-full items-stretch">
          <ServiceCard
            image={image1}
            headline={
              "Your Trusted Source for Quality Car Parts & Global Export Services"
            }
            subtext="Genuine Japanese parts and reliable export solutions. We supply quality components and provide worldwide vehicle export services backed by industry experience and trusted logistics partners."
            href="/service-and-parts"
          />
          <ServiceCardTwo
            image={image2}
            headline={
              "Car Finance Made Simple with Our Expert Team & Financing Options"
            }
            subtext="Get on the road sooner with flexible, low-rate finance packages tailored specifically to your lifestyle or business needs. Fast approvals, zero stress."
            href="/finance"
          />
        </div>
      </Container>
    </div>
  );
};

export default BannerGrid;
