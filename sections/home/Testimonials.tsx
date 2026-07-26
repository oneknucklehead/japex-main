import GlowingTransparentdiv from "@/components/GlowingTransparentdiv";
import Tagline from "@/components/Tagline";
import TestimonialsCarousel from "@/components/TestimonialCarousel";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import googleLogo from "../../assets/googleLogo.webp";
import Container from "@/components/Container";
import LightShard from "@/components/LightShard";

async function getTestimonials() {
  const supabase = await createClient();
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
    fill="currentColor"
    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 shrink-0"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Testimonials = async () => {
  const testimonials = await getTestimonials();

  return (
    <div className="relative overflow-hidden">
      <LightShard className="pointer-events-none absolute left-0 -z-10 hidden w-48 -ml-8 sm:block sm:w-56 md:w-64 lg:w-72 h-auto" />
      <LightShard className="pointer-events-none absolute right-0 -z-10 hidden w-48 -mr-8 -rotate-90 sm:block sm:w-56 md:w-64 lg:w-72 h-auto" />
      <Container>
        <div className="text-white flex flex-col justify-center items-center py-8 sm:py-14 md:py-16 px-6 sm:px-5 md:px-6">
          <div>
            <Tagline text="Customer Reviews" />
          </div>
          <h1 className="font-bold font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center px-2 sm:px-4 md:px-0">
            Trusted by Drivers Across Australia
          </h1>
          <p className="font-bricolage text-brand-white-alternate font-semibold text-sm sm:text-base md:text-lg text-center mt-2 mb-5 sm:mb-6 max-w-2xl px-2 sm:px-4 md:px-0">
            Real customers. Real imports. Real peace of mind - from West Gosford
            to interstate delivery.
          </p>

          <div className="pb-5 sm:pb-6 w-full flex justify-center">
            <GlowingTransparentdiv>
              <div className="flex gap-2 sm:gap-3 py-3 px-4 sm:py-4 sm:px-5 items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0">
                  <Image
                    src={googleLogo}
                    alt="Google logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex gap-x-2 gap-y-0.5 items-center flex-wrap">
                    <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
                      Google Rated 5.0
                    </p>
                    <div className="flex items-center text-brand-primary">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <p className="text-xs sm:text-sm text-brand-gray pl-1 pr-1 sm:pr-2 whitespace-nowrap">
                        - 33 reviews
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-gray">
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
