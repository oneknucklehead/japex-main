import { Car } from "@/types/car";
import { formatOdometer, formatPrice, getCoverImage } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CarCard = ({ car }: { car: Car }) => {
  const href = `/cars/${car?.slug}`;
  const coverImage = getCoverImage(car);
  const priority = car?.is_featured; // Prioritize loading if it's a featured car
  return (
    <Link
      href={href}
      className="group font-dm-sans flex flex-col h-full bg-brand-white border border-gray-300 hover:border-gray-400 hover:shadow-md card block overflow-hidden rounded-2xl transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${car?.year} ${car?.make} ${car?.model}`}
            fill
            className=" p-2 rounded-2xl object-cover transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-5xl">🚗</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {car?.was_price ? (
            <span className="bg-brand-primary text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
              Sale
            </span>
          ) : car?.is_featured ? (
            <span className="bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Featured
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Make / Model */}
        <p className="text-xs text-brand-600 font-semibold uppercase tracking-wider mb-0.5">
          {car?.make}
        </p>
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-0.5 group-hover:text-brand-600 transition-colors">
          {car?.year} {car?.model}
        </h3>
        <p className="text-xs text-gray-400 mb-3">{car?.variant}</p>

        {/* Specs row */}
        <div className="flex flex-wrap items-center space-x-3 space-y-1 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            {formatOdometer(car?.odometer_km)}
          </span>
          <svg
            width="4"
            height="4"
            viewBox="0 0 4 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="2" cy="2" r="2" fill="#6a7282" />
          </svg>

          <span className="flex items-center gap-1">{car?.transmission}</span>
          <svg
            width="4"
            height="4"
            viewBox="0 0 4 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="2" cy="2" r="2" fill="#6a7282" />
          </svg>

          <span className="flex items-center gap-1">{car?.fuel_type}</span>
        </div>

        {/* Price */}
        <div className="flex flex-wrap space-x-4 space-y-1 items-end justify-between mt-auto">
          <div>
            {car?.was_price && (
              <p className="text-xs text-gray-400 line-through">
                {formatPrice(car?.was_price)}
              </p>
            )}
            <p className="text-xl font-black text-gray-900">
              {formatPrice(car?.price)}
            </p>
          </div>
          {/* <span className="text-xs font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            {car?.body_type}
          </span> */}
          <button className="bg-brand-primary text-brand-white text-sm font-semibold px-3 py-2 rounded-xl flex items-center gap-4 hover:bg-red-700 transition-colors cursor-pointer ">
            <p>View details</p>
            <span className="bg-brand-white rounded-lg p-2">
              <svg
                width="7"
                height="7"
                viewBox="0 0 7 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.85352 0.499999C6.85352 0.223857 6.62966 -4.30791e-07 6.35352 -5.57231e-07L1.85352 -1.56836e-07C1.57737 -3.25423e-07 1.35352 0.223857 1.35352 0.5C1.35352 0.776142 1.57737 1 1.85352 1L5.85352 1L5.85352 5C5.85352 5.27614 6.07737 5.5 6.35352 5.5C6.62966 5.5 6.85352 5.27614 6.85352 5L6.85352 0.499999ZM0.353516 6.5L0.707069 6.85355L6.70707 0.853553L6.35352 0.5L5.99996 0.146446L-3.77595e-05 6.14645L0.353516 6.5Z"
                  fill="black"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
