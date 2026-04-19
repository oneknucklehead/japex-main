"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
].map((v) => ({ label: `$${v.toLocaleString()}`, value: v }));
const YEAR_OPTS = Array.from({ length: 15 }, (_, i) => 2024 - i).map((v) => ({
  label: String(v),
  value: v,
}));
const KM_OPTS = [10000, 20000, 40000, 60000, 80000, 100000, 150000, 200000].map(
  (v) => ({ label: `${v.toLocaleString()} km`, value: v }),
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
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left mb-1"
      >
        <span className="text-sm font-bold text-gray-800 font-montserrat">
          {title}
        </span>
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
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div
            onClick={() => toggle(opt)}
            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
              selected.includes(opt)
                ? "bg-red-600 border-red-600"
                : "border-gray-300 group-hover:border-red-400"
            }`}
          >
            {selected.includes(opt) && (
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-600 select-none">{opt}</span>
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
  return (
    <div className="flex gap-2">
      {[
        { opts: minOpts, val: minVal, on: onMin, ph: "Min" },
        { opts: maxOpts, val: maxVal, on: onMax, ph: "Max" },
      ].map(({ opts, val, on, ph }) => (
        <select
          key={ph}
          value={val ?? ""}
          onChange={(e) => on(e.target.value ? +e.target.value : undefined)}
          className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-red-400 bg-white text-gray-700"
        >
          <option value="">{ph}</option>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}

// ── Main Sidebar ─────────────────────────────────────────────────────────────
interface Props {
  filters: CarFilters;
  onChange: (f: CarFilters) => void;
  total: number;
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
  ].filter(Boolean).length;

  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 font-montserrat text-base">
            Filters
          </span>
          {activeCount > 0 && (
            <span className="text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => {
              setSearch("");
              onChange({ sortBy: filters.sortBy });
            }}
            className="text-xs text-red-600 font-semibold hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="px-5">
        {/* Search */}
        <Section title="Search">
          <div className="relative">
            <input
              type="text"
              placeholder="Make, model, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && set({ search: search || undefined })
              }
              onBlur={() => set({ search: search || undefined })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-red-400"
            />
            <svg
              className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </Section>

        {/* Make */}
        <Section title="Make and Model">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            Popular Makes
          </p>
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

        {/* Available toggle */}
        <div className="py-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Available only
          </span>
          <button
            onClick={() => set({ availableOnly: !filters.availableOnly })}
            className={`relative w-10 h-5 rounded-full transition-colors ${filters.availableOnly ? "bg-red-600" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${filters.availableOnly ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
