import React from "react";
import Container from "./Container";

const CTAFooterBanner = () => {
  return (
    <div className="bg-black py-24 px-6">
      <Container>
        <div className="flex gap-4 flex-wrap justify-between items-center">
          <div className="text-brand-white">
            <h2 className="font-montserrat text-3xl lg:text-5xl font-extrabold leading-tight mb-4">
              Let&apos;s Find Your Perfect Car
            </h2>
            <p className="text-brand-white-alternate font-dm-sans max-w-xl">
              Start your journey with our trusted car experts and discover the
              vehicle that truly fits your lifestyle.
            </p>
          </div>
          <button className="cursor-pointer py-4 px-8 rounded-xl flex gap-4 flex-wrap items-center bg-brand-primary hover:bg-red-700 transition-all text-white">
            <p className="font-extrabold font-montserrat text-lg leading-tight">
              Browse all cars
            </p>
            <span className="bg-brand-white p-2 rounded-lg">
              <svg
                width="10"
                height="9"
                viewBox="0 0 10 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.06375 1.18294C9.09042 0.797263 8.79938 0.462988 8.41371 0.436317L2.12872 0.0016954C1.74304 -0.0249752 1.40876 0.266058 1.38209 0.651736C1.35542 1.03741 1.64646 1.37169 2.03213 1.39836L7.61879 1.78469L7.23246 7.37135C7.20579 7.75703 7.49682 8.0913 7.8825 8.11797C8.26818 8.14464 8.60245 7.85361 8.62913 7.46793L9.06375 1.18294ZM0.458984 8.01831L0.918633 8.54625L8.82506 1.66259L8.36542 1.13465L7.90577 0.606707L-0.000663946 7.49037L0.458984 8.01831Z"
                  fill="black"
                />
              </svg>
            </span>
          </button>
        </div>
      </Container>
    </div>
  );
};

export default CTAFooterBanner;
