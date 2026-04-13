"use client";

import { useState } from "react";
import type { CarFilters } from "@/types/car";

// ── Reusable sub-components ─────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
      {children}
    </p>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
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
    <div className="mb-5">
      <SectionLabel>{label}</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
              selected.includes(opt)
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-red-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function RangeSelects({
  label,
  minOptions,
  maxOptions,
  minVal,
  maxVal,
  onMinChange,
  onMaxChange,
}: {
  label: string;
  minOptions: { label: string; value: number }[];
  maxOptions: { label: string; value: number }[];
  minVal?: number;
  maxVal?: number;
  onMinChange: (v?: number) => void;
  onMaxChange: (v?: number) => void;
}) {
  return (
    <div className="mb-5">
      <SectionLabel>{label}</SectionLabel>
      <div className="flex gap-2">
        <select
          value={minVal ?? ""}
          onChange={(e) =>
            onMinChange(e.target.value ? +e.target.value : undefined)
          }
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-red-400 bg-white"
        >
          <option value="">No min</option>
          {minOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={maxVal ?? ""}
          onChange={(e) =>
            onMaxChange(e.target.value ? +e.target.value : undefined)
          }
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-red-400 bg-white"
        >
          <option value="">No max</option>
          {maxOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ── Filter option constants ─────────────────────────────────────────────────

const PRICE_OPTS = [
  10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000,
  80000, 90000, 100000, 150000, 200000, 300000,
].map((v) => ({ label: `$${v.toLocaleString()}`, value: v }));

const YEAR_OPTS = Array.from({ length: 15 }, (_, i) => 2024 - i).map((v) => ({
  label: String(v),
  value: v,
}));

const KM_OPTS = [10000, 20000, 40000, 60000, 80000, 100000, 150000, 200000].map(
  (v) => ({ label: `${v.toLocaleString()} km`, value: v }),
);

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
  "Hybrid Diesel",
];
const TRANSMISSIONS = ["Automatic", "Manual"];
const DRIVE_TYPES = ["FWD", "AWD", "4WD", "RWD"]; // ← matches drive_type column
const SEATS = ["2", "4", "5", "7", "8"];
const DOORS_OPTS = ["2", "3", "4", "5"];
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
]; // ← color_exterior values
const CONDITIONS = ["Excellent", "Good", "Fair"];
const FEATURES = [
  "Apple CarPlay",
  "Android Auto",
  "Rear Parking Camera",
  "Rear Parking Sensors",
  "Adaptive Cruise Control",
  "Blind Spot Monitoring",
  "Leather Seats",
  "Heated Seats",
  "Ventilated Seats",
  "Sunroof",
  "360 Degree Camera",
  "Heads Up Display",
  "GPS Navigation",
  "Keyless Entry",
  "Push Start",
  "Tow Pack",
  "Roof Rails",
  "Alloy Wheels",
  "Power Tailgate",
  "Power Sliding Doors",
];

// ── Main component ──────────────────────────────────────────────────────────

interface Props {
  filters: CarFilters;
  onChange: (f: CarFilters) => void;
  total: number;
}

export default function FilterSidebar({ filters, onChange, total }: Props) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  const set = (partial: Partial<CarFilters>) =>
    onChange({ ...filters, ...partial });

  const clearAll = () => {
    setSearchInput("");
    onChange({ sortBy: filters.sortBy });
  };

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
    filters.seats?.length,
    filters.doors?.length,
    filters.colors?.length,
    filters.features?.length,
    filters.condition?.length,
    filters.availableOnly,
  ].filter(Boolean).length;

  return (
    <aside className="w-full lg:w-72 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
          {activeCount > 0 && (
            <span className="text-xs bg-red-600 text-white rounded-full px-2 py-0.5 font-semibold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        {/* Full-text search — uses fts column */}
        <div className="mb-5">
          <SectionLabel>Search</SectionLabel>
          <div className="relative">
            <input
              type="text"
              placeholder="Make, model, features..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && set({ search: searchInput || undefined })
              }
              onBlur={() => set({ search: searchInput || undefined })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-9 focus:outline-none focus:border-red-400"
            />
            <svg
              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
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
        </div>

        {/* Make */}
        <CheckboxGroup
          label="Make"
          options={MAKES}
          selected={filters.make ?? []}
          onChange={(v) => set({ make: v.length ? v : undefined })}
        />

        {/* Body Type */}
        <CheckboxGroup
          label="Body Type"
          options={BODY_TYPES}
          selected={filters.bodyTypes ?? []}
          onChange={(v) => set({ bodyTypes: v.length ? v : undefined })}
        />

        {/* Price */}
        <RangeSelects
          label="Price"
          minOptions={PRICE_OPTS}
          maxOptions={PRICE_OPTS}
          minVal={filters.priceMin}
          maxVal={filters.priceMax}
          onMinChange={(v) => set({ priceMin: v })}
          onMaxChange={(v) => set({ priceMax: v })}
        />

        {/* Year */}
        <RangeSelects
          label="Year"
          minOptions={YEAR_OPTS}
          maxOptions={YEAR_OPTS}
          minVal={filters.yearMin}
          maxVal={filters.yearMax}
          onMinChange={(v) => set({ yearMin: v })}
          onMaxChange={(v) => set({ yearMax: v })}
        />

        {/* Kilometres — maps to odometer_km */}
        <RangeSelects
          label="Kilometres"
          minOptions={KM_OPTS}
          maxOptions={KM_OPTS}
          minVal={filters.kmMin}
          maxVal={filters.kmMax}
          onMinChange={(v) => set({ kmMin: v })}
          onMaxChange={(v) => set({ kmMax: v })}
        />

        {/* Fuel Type */}
        <CheckboxGroup
          label="Fuel Type"
          options={FUEL_TYPES}
          selected={filters.fuelTypes ?? []}
          onChange={(v) => set({ fuelTypes: v.length ? v : undefined })}
        />

        {/* Transmission */}
        <CheckboxGroup
          label="Transmission"
          options={TRANSMISSIONS}
          selected={filters.transmissions ?? []}
          onChange={(v) => set({ transmissions: v.length ? v : undefined })}
        />

        {/* Drive Type — maps to drive_type column */}
        <CheckboxGroup
          label="Drive Type"
          options={DRIVE_TYPES}
          selected={filters.driveTypes ?? []}
          onChange={(v) => set({ driveTypes: v.length ? v : undefined })}
        />

        {/* Seats */}
        <CheckboxGroup
          label="Seats"
          options={SEATS}
          selected={(filters.seats ?? []).map(String)}
          onChange={(v) => set({ seats: v.length ? v.map(Number) : undefined })}
        />

        {/* Doors */}
        <CheckboxGroup
          label="Doors"
          options={DOORS_OPTS}
          selected={(filters.doors ?? []).map(String)}
          onChange={(v) => set({ doors: v.length ? v.map(Number) : undefined })}
        />

        {/* Colour — maps to color_exterior column */}
        <CheckboxGroup
          label="Exterior Colour"
          options={COLORS}
          selected={filters.colors ?? []}
          onChange={(v) => set({ colors: v.length ? v : undefined })}
        />

        {/* Features */}
        <CheckboxGroup
          label="Features"
          options={FEATURES}
          selected={filters.features ?? []}
          onChange={(v) => set({ features: v.length ? v : undefined })}
        />

        {/* Condition */}
        <CheckboxGroup
          label="Condition"
          options={CONDITIONS}
          selected={filters.condition ?? []}
          onChange={(v) => set({ condition: v.length ? v : undefined })}
        />

        {/* Available only — maps to is_sold = false */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-700 font-medium">
            Available only
          </span>
          <button
            onClick={() => set({ availableOnly: !filters.availableOnly })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              filters.availableOnly ? "bg-red-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                filters.availableOnly ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        <span className="font-semibold text-gray-900">{total}</span> cars found
      </p>
    </aside>
  );
}
