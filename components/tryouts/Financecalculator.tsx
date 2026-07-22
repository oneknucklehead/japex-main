"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateLoanPayment,
  formatCurrency,
  FREQUENCY_LABEL,
  type PaymentFrequency,
} from "@/lib/financeCalculations";
import Container from "../Container";
import { BookTickIcon, CalendarIcon, MessageIcon } from "../Icons/Icons";
import { Car } from "@/types/car";
import GlowingTransparentDivTestimonial from "../GlowingTransparentDivTestimonial";

const TERM_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
const FREQUENCIES: PaymentFrequency[] = ["weekly", "monthly", "yearly"];
const MIN_RATE = 6;
const MAX_RATE = 15;
interface Props {
  car: Car & { car_images: any[] };
}

export default function FinanceCalculator({ car }: Props) {
  const [finalPrice, setFinalPrice] = useState(car.price);
  const [depositAmount, setDepositAmount] = useState(0);
  const [termYears, setTermYears] = useState(2);
  const [interestRate, setInterestRate] = useState(10);
  const [frequency, setFrequency] = useState<PaymentFrequency>("weekly");

  const result = useMemo(
    () =>
      calculateLoanPayment({
        finalPrice,
        depositAmount,
        termYears,
        interestRate,
        frequency,
      }),
    [finalPrice, depositAmount, termYears, interestRate, frequency],
  );

  const sliderPercent =
    ((interestRate - MIN_RATE) / (MAX_RATE - MIN_RATE)) * 100;

  return (
    <div className="px-6">
      <Container>
        <section className="w-full bg-black text-white py-16">
          <div className="mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left copy column */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="font-poppins text-4xl font-bold leading-tight sm:text-5xl">
                Custom car financing that puts you in control.
              </h2>
              <p className="font-dm-sans mt-6 max-w-md text-sm text-white/60 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <ul className="mt-10 space-y-6">
                {[
                  {
                    title: "Open and transparent interest rates and fees",
                    logo: <BookTickIcon />,
                  },
                  {
                    title: "Quick and simple paperless process",
                    logo: <MessageIcon />,
                  },
                  {
                    title: "Fast approvals typically by the same business day",
                    logo: <CalendarIcon />,
                  },
                ].map((item, i) => (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className="flex h-8 w-8 p-1 shrink-0 items-center justify-center rounded-md border border-white/20">
                      {item.logo}
                    </span>
                    <span className="font-dm-sans text-sm font-medium sm:text-base">
                      {item.title}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right calculator card */}
            <GlowingTransparentDivTestimonial border="2xl">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="relative p-6 sm:p-8"
              >
                {/* red glow accent */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-3xl bg-red-600/20 blur-3xl" />

                <div className="relative">
                  <span className="inline-flex items-center rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold font-dm-sans">
                    How much do you want to spend?
                  </span>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <NumberField
                      label="Final price"
                      value={finalPrice}
                      onChange={setFinalPrice}
                    />
                    <NumberField
                      label="Deposit amount"
                      value={depositAmount}
                      onChange={setDepositAmount}
                    />
                  </div>

                  <div className="my-6 h-px w-full bg-white/10" />

                  <p className="text-base font-dm-sans font-semibold text-white/90">
                    Term of loan (in years)
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TERM_OPTIONS.map((year) => {
                      const active = year === termYears;
                      return (
                        <div
                          key={year}
                          className="p-px bg-linear-to-r from-white to-[#666666] rounded-full"
                        >
                          <motion.button
                            type="button"
                            onClick={() => setTermYears(year)}
                            whileTap={{ scale: 0.9 }}
                            // whileHover={{ scale: active ? 1 : 1.06 }}
                            className={`relative flex h-9 px-6 items-center justify-center rounded-full text-sm font-semibold transition-colors
                             cursor-pointer shadow-sm hover:shadow-md duration-300 z-10 
                            hover:bg-linear-to-b hover:from-black hover:to-brand-primary
                            bg-linear-to-b from-black to-[#313131]
                            ${
                              active
                                ? "bg-linear-to-b from-black to-brand-primary"
                                : "bg-linear-to-b from-black to-[#313131]"
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="term-active"
                                className="absolute inset-0 rounded-full"
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 28,
                                }}
                              />
                            )}
                            <span className="relative font-bricolage">
                              {year}
                            </span>
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-7 flex items-center justify-between">
                    <div>
                      <p className="text-base font-dm-sans font-semibold text-white/90">
                        Interest rate
                      </p>
                      <p className="text-sm  font-dm-sans text-white/50">
                        Slide between {MIN_RATE}% and {MAX_RATE}%
                      </p>
                    </div>
                    {/* <div className="p-px bg-linear-to-r from-white to-[#666666] rounded-xl"> */}
                    <div className="rounded-xl border border-white font-bricolage px-4 py-1.5 text-sm font-semibold">
                      {interestRate}%
                    </div>
                    {/* </div> */}
                  </div>

                  <div className="relative mt-4 flex h-5 items-center">
                    <div className="h-1.5 w-full rounded-full bg-white/15">
                      <div
                        className="h-1.5 rounded-full bg-white/40 transition-all duration-150"
                        style={{ width: `${sliderPercent}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={MIN_RATE}
                      max={MAX_RATE}
                      step={0.5}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="range-thumb absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
                      aria-label="Interest rate"
                    />
                  </div>

                  {/* frequency toggle */}
                  <div className="mt-7">
                    <p className="text-base font-dm-sans font-semibold text-white/90">
                      Repayment frequency
                    </p>
                    <div className="relative mt-3 grid grid-cols-3 rounded-xl bg-white/5 p-1">
                      {FREQUENCIES.map((f) => {
                        const active = f === frequency;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setFrequency(f)}
                            className="relative z-10 rounded-lg py-2 text-xs font-semibold capitalize font-dm-sans  sm:text-sm"
                          >
                            {active && (
                              <motion.span
                                layoutId="freq-active"
                                className="absolute inset-0 -z-10 rounded-lg bg-red-600"
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 30,
                                }}
                              />
                            )}
                            <span
                              className={
                                active ? "text-white" : "text-white/60"
                              }
                            >
                              {f}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <motion.div
                    layout
                    className="mt-7 overflow-hidden rounded-2xl bg-white text-black"
                  >
                    <div className="px-6 pt-5 text-center">
                      <p className="text-sm font-dm-sans font-semibold text-black/50">
                        Your estimated {frequency} repayment
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`${result.periodicPayment.toFixed(0)}-${frequency}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 text-4xl font-bricolage font-extrabold sm:text-5xl"
                        >
                          {formatCurrency(result.periodicPayment)}
                          <span className="text-base font-dm-sans font-semibold text-black/50">
                            /{FREQUENCY_LABEL[frequency]}*
                          </span>
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ backgroundColor: "#b91c1c" }}
                      whileTap={{ scale: 0.98 }}
                      className="my-5 w-[85%] block text-center mx-auto bg-brand-primary py-4 text-sm font-semibold text-white font-dm-sans  transition-colors cursor-pointer rounded-full sm:text-base"
                    >
                      Get personalized quote
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </GlowingTransparentDivTestimonial>
          </div>

          <style jsx global>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          background: #dc2626;
          border: 3px solid white;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          margin-top: 0;
        }
        .range-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          background: #dc2626;
          border: 3px solid white;
          cursor: pointer;
        }
        .range-thumb::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          background: transparent;
        }
      `}</style>
        </section>
      </Container>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="font-bricolage block rounded-xl border border-white/15 px-4 py-2.5 focus-within:border-red-500 transition-colors">
      <span className="block text-xs font-medium text-white/50">{label}</span>
      <span className="flex items-center gap-1">
        <span className="text-white/60">$</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(Number(e.target.value) || 0, 0))}
          className="w-full bg-transparent text-lg font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </span>
    </label>
  );
}
