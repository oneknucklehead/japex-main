"use client";

import Container from "@/components/Container";
import ServiceCard from "./ServiceCard";
import ServiceCardTwo from "./ServiceCardTwo";
import image1 from "../../assets/carparts.png";
import image2 from "../../assets/finance.png";

const BannerGrid = () => {
  return (
    <div className="px-6 sm:px-5 md:px-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-6 lg:gap-8 w-full items-stretch">
          <ServiceCard
            image={image1}
            headline={
              "Your Trusted Source for Quality Car Parts & Global Export Services"
            }
            href="/service-and-parts"
          />
          <ServiceCardTwo
            image={image2}
            headline={
              "Car Finance Made Simple with Our Expert Team & Financing Options"
            }
            href="/finance"
          />
        </div>
      </Container>
    </div>
  );
};

export default BannerGrid;
