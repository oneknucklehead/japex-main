"use client";

import CarCarousel from "@/components/Cars/CarCarousel";
import Container from "@/components/Container";
import { Car } from "@/types/car";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const ExploreLatestArrivals = () => {
  const [data, setData] = useState<Car[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Querying the 'countries' table
      const { data, error } = await supabase.from("cars").select("*");

      if (error) console.error("Error fetching data:", error);
      else setData(data);

      console.log("Fetched cars:", data);
    };

    fetchData();
  }, []);
  return (
    <div>
      <Container>
        <h1 className="font-extrabold font-montserrat text-5xl text-center">
          Explore our latest arrivals
        </h1>
        <p className="font-bricolage text-lg text-center mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed?
        </p>
        <CarCarousel cars={data} />
      </Container>
    </div>
  );
};

export default ExploreLatestArrivals;
