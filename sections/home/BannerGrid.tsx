"use client";

import Container from "@/components/Container";
import ServiceCard from "./ServiceCard";
import ServiceCardTwo from "./ServiceCardTwo";
import image1 from "../../assets/carparts.png";
import image2 from "../../assets/finance.png";

const BannerGrid = () => {
  return (
    <Container>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full items-start">
          {/* <div className="bg-white"> */}
          <ServiceCard
            image={image1}
            headline={
              "Your Trusted Source for Quality Car Parts & Global Export Services"
            }
          />
          {/* </div> */}
          <ServiceCardTwo
            image={image2}
            headline={
              "Car Finance Made Simple with Our Expert Team & Financing Options"
            }
          />
        </div>
      </div>
    </Container>
  );
};

export default BannerGrid;
