"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import type { CarFilters } from "@/types/car";

// ── Constants ────────────────────────────────────────────────────────────────
const MAKES = [
  "Audi",
  "Bentley",
  "BMW",
  "Ford",
  "GWM",
  "Honda",
  "Hyundai",
  "Kia",
  "Land Rover",
  "Mazda",
  "Mercedes-Benz",
  "Mitsubishi",
  "Porsche",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
];
const BODY_TYPES = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Ute",
  "Coupe",
  "Van",
  "Minivan",
  "People Mover",
  "Wagon",
  "Convertible",
];
const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Hybrid Petrol",
  "Plug-in Hybrid",
  "Electric",
];
const TRANSMISSIONS = ["Automatic", "Manual"];
const DRIVE_TYPES = ["FWD", "AWD", "4WD", "RWD"];
const COLORS = [
  "Black",
  "Blue",
  "Brown",
  "Green",
  "Grey",
  "Matte Green",
  "Orange",
  "Red",
  "Silver",
  "White",
  "Yellow",
];
const CONDITIONS = ["Excellent", "Good", "Fair"];
const PRICE_OPTS = [
  10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000, 60000, 70000, 80000,
  100000, 150000, 200000, 300000,
].map((v) => ({ label: `$${v.toLocaleString("en-US")}`, value: v }));
const YEAR_OPTS = Array.from({ length: 15 }, (_, i) => 2024 - i).map((v) => ({
  label: String(v),
  value: v,
}));
const KM_OPTS = [10000, 20000, 40000, 60000, 80000, 100000, 150000, 200000].map(
  (v) => ({ label: `${v.toLocaleString("en-US")} km`, value: v }),
);

// ── Sub-components ───────────────────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="font-dm-sans border-[#C0C0C0] py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer flex items-center justify-between w-full text-left mb-1"
      >
        <span className="text-sm font-bold  font-montserrat">{title}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckList({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) =>
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val],
    );
  return (
    <div
      className="cursor-pointer space-y-2 max-h-48 overflow-y-auto pr-1
    scrollbar-thin [scrollbar-color:var(--color-brand-primary)_transparent]
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-brand-primary/60
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb:hover]:bg-brand-primary"
    >
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-2.5 cursor-pointer group/check"
          onClick={() => toggle(opt)}
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
              selected.includes(opt)
                ? "bg-brand-primary border-brand-primary"
                : "border-white/20 group-hover/check:border-brand-primary"
            }`}
          >
            {selected.includes(opt) && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={4}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="font-dm-sans text-sm  select-none">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function RangeRow({
  minOpts,
  maxOpts,
  minVal,
  maxVal,
  onMin,
  onMax,
}: {
  minOpts: { label: string; value: number }[];
  maxOpts: { label: string; value: number }[];
  minVal?: number;
  maxVal?: number;
  onMin: (v?: number) => void;
  onMax: (v?: number) => void;
}) {
  const [minOpen, setMinOpen] = useState(false);
  const [maxOpen, setMaxOpen] = useState(false);

  const rows = [
    {
      opts: minOpts,
      val: minVal,
      on: onMin,
      ph: "Min",
      open: minOpen,
      setOpen: setMinOpen,
    },
    {
      opts: maxOpts,
      val: maxVal,
      on: onMax,
      ph: "Max",
      open: maxOpen,
      setOpen: setMaxOpen,
    },
  ];

  return (
    <div className="space-y-3">
      {rows.map(({ opts, val, on, ph, open, setOpen }) => (
        <div key={ph} className="relative w-full">
          <select
            value={val ?? ""}
            onChange={(e) => on(e.target.value ? +e.target.value : undefined)}
            // onFocus={() => setOpen(true)}
            onClick={() => setOpen(!open)}
            onBlur={() => setOpen(false)}
            className="w-full text-sm border border-white/20 rounded-lg pl-3 pr-9 py-2 focus:outline-none focus:border-brand-primary text-brand-gray cursor-pointer appearance-none"
          >
            <option className="text-brand-dark" value="">
              {ph}
            </option>
            {opts.map((o) => (
              <option className="text-brand-dark" key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </div>
      ))}
    </div>
  );
}

// ── Main Sidebar ─────────────────────────────────────────────────────────────
interface Props {
  filters: CarFilters;
  onChange: (f: CarFilters) => void;
  total?: number;
}

export default function FilterSidebar({ filters, onChange, total }: Props) {
  const [search, setSearch] = useState(filters.search ?? "");
  const set = (p: Partial<CarFilters>) => onChange({ ...filters, ...p });

  const activeCount = [
    filters.search,
    filters.make?.length,
    filters.bodyTypes?.length,
    filters.priceMin,
    filters.priceMax,
    filters.yearMin,
    filters.yearMax,
    filters.kmMin,
    filters.kmMax,
    filters.fuelTypes?.length,
    filters.transmissions?.length,
    filters.driveTypes?.length,
    filters.colors?.length,
    filters.features?.length,
    filters.condition?.length,
    filters.availability?.length,
  ].filter(Boolean).length;
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50); // percent
  const mouseY = useMotionValue(50); // percent

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative group flex flex-col justify-between rounded-xl overflow-hidden w-full h-full`}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{
        // background: `
        //   linear-gradient(#1a1414, #1a1414) padding-box,
        //   linear-gradient(90deg,
        //     rgba(175,175,175,0.18) 0%,
        //     rgba(255,255,255,0.18) 50%,
        //     rgba(126,126,126,0.18) 100%
        //   ) border-box
        // `,
        // border: "1px solid transparent",
        boxShadow: `
          inset 0 0 12.7px rgba(255,255,255,0.25),
          0 2px 10.1px -2px rgba(255,0,0,0.2),
          0 4px 6px -1px rgba(0,0,0,0.1)
        `,
        backdropFilter: "blur(61.8px)",
        WebkitBackdropFilter: "blur(61.8px)",
      }}
    >
      {/* Cursor-tracking glow, hugs border only, all sides */}
      <motion.div
        className={`pointer-events-none absolute inset-0 rounded-xl z-20`}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          padding: "2px",
          background: useMotionTemplate`radial-gradient(140px circle at ${mouseX}% ${mouseY}%, rgba(255,20,20,1) 0%, rgba(180,10,10,0.6) 40%, transparent 70%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <aside className="relative w-full text-white rounded-2xl ">
        {/* Header */}
        <div className="hidden xl:flex items-center justify-between px-5 py-4 ">
          <div className="flex items-center gap-2">
            <span className=" font-bold  font-montserrat text-base">
              Filters
            </span>
            {/* {activeCount > 0 && (
            <span className="text-xs bg-brand-primary text-white rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {activeCount}
            </span>
          )} */}
          </div>
          {activeCount > 0 && (
            <button
              onClick={() => {
                setSearch("");
                onChange({ sortBy: filters.sortBy });
              }}
              className="cursor-pointer font-dm-sans text-brand-dark bg-white px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 "
            >
              Clear
            </button>
          )}
        </div>

        <div className="px-5">
          {/* Make */}
          {activeCount > 0 && (
            <div className="flex text-white xl:hidden py-4 justify-end">
              <button
                onClick={() => {
                  setSearch("");
                  onChange({ sortBy: filters.sortBy });
                }}
                className="cursor-pointer font-dm-sans text-sm text-brand-primary font-semibold hover:underline"
              >
                Clear
              </button>
            </div>
          )}
          <Section title="Brand and Model">
            <div className="relative flex items-center justify-between">
              <input
                type="text"
                placeholder="Search Brands, Models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && set({ search: search || undefined })
                }
                onBlur={() => set({ search: search || undefined })}
                className="w-full text-sm border border-white/20 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-brand-primary"
              />
              <button
                className="cursor-pointer"
                onSubmit={() => set({ search: search || undefined })}
              >
                <svg
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-fit h-fit max-w-6 max-h-6 text-brand-white bg-brand-primary hover:bg-red-700 transition-all p-1.5 rounded-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm font-bold my-4">Popular Brands</p>
            <CheckList
              options={MAKES}
              selected={filters.make ?? []}
              onChange={(v) => set({ make: v.length ? v : undefined })}
            />
          </Section>

          {/* Body Type */}
          <Section title="Body Type">
            <CheckList
              options={BODY_TYPES}
              selected={filters.bodyTypes ?? []}
              onChange={(v) => set({ bodyTypes: v.length ? v : undefined })}
            />
          </Section>

          {/* Price */}
          <Section title="Price">
            <RangeRow
              minOpts={PRICE_OPTS}
              maxOpts={PRICE_OPTS}
              minVal={filters.priceMin}
              maxVal={filters.priceMax}
              onMin={(v) => set({ priceMin: v })}
              onMax={(v) => set({ priceMax: v })}
            />
          </Section>

          {/* Year */}
          <Section title="Year">
            <RangeRow
              minOpts={YEAR_OPTS}
              maxOpts={YEAR_OPTS}
              minVal={filters.yearMin}
              maxVal={filters.yearMax}
              onMin={(v) => set({ yearMin: v })}
              onMax={(v) => set({ yearMax: v })}
            />
          </Section>

          {/* KM */}
          <Section title="Kilometres">
            <RangeRow
              minOpts={KM_OPTS}
              maxOpts={KM_OPTS}
              minVal={filters.kmMin}
              maxVal={filters.kmMax}
              onMin={(v) => set({ kmMin: v })}
              onMax={(v) => set({ kmMax: v })}
            />
          </Section>

          {/* Fuel */}
          <Section title="Fuel Type">
            <CheckList
              options={FUEL_TYPES}
              selected={filters.fuelTypes ?? []}
              onChange={(v) => set({ fuelTypes: v.length ? v : undefined })}
            />
          </Section>

          {/* Transmission */}
          <Section title="Transmission">
            <CheckList
              options={TRANSMISSIONS}
              selected={filters.transmissions ?? []}
              onChange={(v) => set({ transmissions: v.length ? v : undefined })}
            />
          </Section>

          {/* Drive Type */}
          <Section title="Drive Type">
            <CheckList
              options={DRIVE_TYPES}
              selected={filters.driveTypes ?? []}
              onChange={(v) => set({ driveTypes: v.length ? v : undefined })}
            />
          </Section>

          {/* Colour */}
          <Section title="Colour">
            <CheckList
              options={COLORS}
              selected={filters.colors ?? []}
              onChange={(v) => set({ colors: v.length ? v : undefined })}
            />
          </Section>

          {/* Condition */}
          <Section title="Condition">
            <CheckList
              options={CONDITIONS}
              selected={filters.condition ?? []}
              onChange={(v) => set({ condition: v.length ? v : undefined })}
            />
          </Section>

          {/* Availability */}
          <Section title="Availability">
            <CheckList
              options={["In stock", "Coming soon", "Sold out"]}
              selected={filters.availability ?? []}
              onChange={(v) =>
                set({ availability: v.length ? (v as any) : undefined })
              }
            />
          </Section>
        </div>
      </aside>
    </motion.div>
  );
}
