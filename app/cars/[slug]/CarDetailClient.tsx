"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatOdometer, formatPrice } from "@/utils/helpers";
import type { Car } from "@/types/car";
import CarImageGallery from "@/components/Cars/CarImageGallery";
import EnquiryModal from "@/components/Cars/EnquiryModal";
import Container from "@/components/Container";
import {
  AssuranceIcon,
  DeliveryIcon,
  ExpertIcon,
  GuaranteeIcon,
  WarrantyIcon,
} from "@/components/Icons/Icons";

interface Props {
  car: Car & { car_images: any[] };
}

// Trust badge data
const TRUST_BADGES = [
  { icon: <ExpertIcon />, label: "Examined by experts" },
  { icon: <WarrantyIcon />, label: "3 months warranty" },
  { icon: <GuaranteeIcon />, label: "7 day money back guarantee" },
  { icon: <DeliveryIcon />, label: "Free delivery to your door*" },
];

// Spec pill
const SpecPill = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-0.5">
    <p className="text-xs text-gray-400 font-medium">{label}</p>
    <p className="text-sm font-bold text-gray-800">{value}</p>
  </div>
);

export default function CarDetailClient({ car }: Props) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const carName = `${car.year} ${car.make} ${car.model}`;
  // Est. monthly repayment (simple 5yr @ 7.9% p.a.)
  const monthly = Math.round(car.price * 0.0066 + car.price / 60);

  return (
    <>
      <div className="min-h-screen bg-[#efeded] font-dm-sans px-6 py-8">
        <Container>
          <div className="">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-dm-sans"
            >
              <Link href="/" className="hover:text-gray-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/cars"
                className="hover:text-gray-600 transition-colors"
              >
                Cars
              </Link>
              <span>/</span>
              <span className="text-gray-700 font-medium truncate">
                {carName}
              </span>
            </motion.nav>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
              {/* ── LEFT: Image gallery ── */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <CarImageGallery images={car.car_images} carName={carName} />

                {/* Specs grid — below gallery on desktop */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6 bg-white rounded-2xl p-5 border border-gray-200"
                >
                  <h3 className="font-bold text-gray-900 font-montserrat text-base mb-4">
                    Vehicle Specs
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <SpecPill label="Body Type" value={car.body_type} />
                    <SpecPill label="Year" value={String(car.year)} />
                    <SpecPill
                      label="Odometer"
                      value={formatOdometer(car.odometer_km)}
                    />
                    <SpecPill label="Transmission" value={car.transmission} />
                    <SpecPill label="Fuel Type" value={car.fuel_type} />
                    <SpecPill label="Drive Type" value={car.drive_type} />
                    <SpecPill label="Engine" value={car.engine || "—"} />
                    <SpecPill label="Seats" value={String(car.seats)} />
                    <SpecPill label="Doors" value={String(car.doors)} />
                    <SpecPill
                      label="Ext. Colour"
                      value={car.color_exterior || "—"}
                    />
                    <SpecPill
                      label="Int. Colour"
                      value={car.color_interior || "—"}
                    />
                    <SpecPill label="Condition" value={car.condition} />
                    {car.rego && <SpecPill label="Rego" value={car.rego} />}
                  </div>
                </motion.div>

                {/* Description */}
                {car.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-4 bg-white rounded-2xl p-5 border border-gray-200"
                  >
                    <h3 className="font-bold text-gray-900 font-montserrat text-base mb-3">
                      About this car
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-dm-sans">
                      {car.description}
                    </p>
                  </motion.div>
                )}

                {/* Features */}
                {car.features?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="mt-4 bg-white rounded-2xl p-5 border border-gray-200"
                  >
                    <h3 className="font-bold text-gray-900 font-montserrat text-base mb-4">
                      Features & Options
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {car.features.map((f: string) => (
                        <div
                          key={f}
                          className="flex items-center gap-2.5 text-sm text-gray-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* ── RIGHT: Price panel ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4"
              >
                {/* Price card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  {/* Save button */}
                  <div className="flex justify-end mb-1">
                    <button
                      onClick={() => setSaved((s) => !s)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
                    >
                      <svg
                        className={`w-4 h-4 transition-colors ${saved ? "text-brand-primary fill-brand-primary" : "text-gray-400"}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        fill="none"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat leading-tight mb-2">
                    {carName}.
                  </h1>

                  {/* Specs row */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 flex-wrap font-dm-sans">
                    <span>{formatOdometer(car.odometer_km)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{car.transmission}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{car.fuel_type}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    {/* Main price */}
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        {car.was_price && (
                          <p className="text-xs text-gray-400 line-through mb-0.5">
                            {formatPrice(car.was_price)}
                          </p>
                        )}
                        <p className="text-3xl font-black text-gray-900">
                          {formatPrice(car.price)}
                        </p>
                        <p className="text-xs text-gray-400 underline decoration-dotted mt-0.5 cursor-help">
                          *Excl. Govt. charges
                        </p>
                        <p className="text-xs text-gray-400">
                          ^Fees and charges apply
                        </p>
                      </div>
                      {car.condition === "Excellent" && (
                        <span className="bg-brand-primary text-white text-sm font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0">
                          <AssuranceIcon />
                          Assured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-5">
                    {/* Monthly repayment */}
                    <p className="text-2xl font-black text-gray-900">
                      {formatPrice(monthly)}{" "}
                      <span className="text-sm font-medium text-gray-400">
                        per month
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Est. monthly repayment
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer w-full bg-brand-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                    >
                      Get started
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEnquiryOpen(true)}
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-3.5 rounded-xl border border-gray-200 transition-colors text-sm"
                    >
                      Make an enquiry
                    </motion.button>
                  </div>
                </div>

                {/* Trust badges card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="bg-white rounded-2xl p-5 border border-gray-200"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {TRUST_BADGES.map((b) => (
                      <div
                        key={b.label}
                        className="flex items-center gap-2.5 text-xs text-gray-600 font-dm-sans"
                      >
                        <span className="text-base shrink-0">{b.icon}</span>
                        <span>{b.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Google rating */}
                  <div className="border-t border-gray-100 mt-4 pt-4 flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-800">
                      Google
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3.5 h-3.5 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-700">4.7</span>
                    <span className="text-xs text-gray-400">(350)</span>
                  </div>
                </motion.div>

                {/* Rego expiry if available */}
                {car.rego_expiry && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-400">
                        Registration expires
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {new Date(car.rego_expiry).toLocaleDateString("en-AU", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </Container>
      </div>

      {/* Enquiry modal */}
      <AnimatePresence>
        {enquiryOpen && (
          <EnquiryModal
            carId={car.id}
            carName={carName}
            onClose={() => setEnquiryOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
