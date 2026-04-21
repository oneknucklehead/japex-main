"use client";

import TestimonialsCarousel from "@/components/TestimonialCarousel";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
  review: string;
  rating: number;
}

const TestimonialsClient = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function fetchTestimonials() {
      const supabase = createClient();
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("position", { ascending: true });
      setTestimonials(data ?? []);
    }
    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <div>
      <TestimonialsCarousel testimonials={testimonials} />
    </div>
  );
};

export default TestimonialsClient;
