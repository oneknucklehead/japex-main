import React from "react";

const Tagline = ({ text = "New Arrivals" }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <div className="rotate-180 bg-linear-to-r h-0.5 w-8 border-r-full from-[#CA281C] via-[#B23A3A] to-[#990000]/0 "></div>
      <p className="text-[#CA281C] font-poppins font-medium uppercase">
        {text}
      </p>
      <div className="bg-linear-to-r h-0.5 w-8 border-r-full from-[#CA281C] via-[#B23A3A] to-[#990000]/0 "></div>
    </div>
  );
};

export default Tagline;
