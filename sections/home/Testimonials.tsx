import TestimonialsCarousel from "@/components/TestimonialCarousel";
import { createClient } from "@/utils/supabase/client";
import React from "react";

async function getTestimonials() {
  const supabase = createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });
  return data ?? [];
}
const Testimonials = async () => {
  const testimonials = await getTestimonials();

  return (
    <div>
      <TestimonialsCarousel testimonials={testimonials} />
    </div>
  );
};

export default Testimonials;
