import GlowingTransparentdiv from "@/components/GlowingTransparentdiv";
import Tagline from "@/components/Tagline";
import TestimonialsCarousel from "@/components/TestimonialCarousel";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import googleLogo from "../../assets/googleLogo.webp";
import React from "react";
import Container from "@/components/Container";
import LightShard from "@/components/LightShard";

async function getTestimonials() {
  const supabase = createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });
  return data ?? [];
}
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);
const Testimonials = async () => {
  const testimonials = await getTestimonials();

  return (
    <div className="relative overflow-hidden">
      <LightShard
        // src={lightshardleft}
        className="absolute left-0 w-72 h-72 -ml-10 -z-10"
      />
      <LightShard
        // src={lightshardleft}
        className="-rotate-90 absolute right-0 w-72 h-72 -mr-10 -z-10"
      />
      <Container>
        <div className="text-white flex flex-col justify-center items-center  py-12 sm:py-16 px-4 sm:px-6">
          <div>
            <Tagline text="Customer Reviews" />
          </div>
          <h1 className="font-bold font-poppins text-3xl md:text-5xl text-center px-4 md:px-0">
            Trusted by Drivers Across Australia
          </h1>
          <p className="font-bricolage text-brand-white-alternate font-semibold text-lg text-center mt-2 mb-6">
            Real customers. Real imports. Real peace of mind - from West Gosford
            to interstate delivery.
          </p>
          <div className="pb-6">
            <GlowingTransparentdiv>
              <div className="flex gap-2 py-4 px-5 items-center">
                <div className="w-14 h-14">
                  <Image src={googleLogo} alt="google logo" />
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-1 items-center flex-wrap">
                    <p className="font-semibold">Google Rated 5.0</p>
                    <div className="flex items-center text-brand-primary">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <p className="text-sm text-brand-gray pr-2">
                        - 33 reviews
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-brand-gray">
                    Japex Motors Gosford
                  </p>
                </div>
              </div>
            </GlowingTransparentdiv>
          </div>

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </Container>
    </div>
  );
};

export default Testimonials;
