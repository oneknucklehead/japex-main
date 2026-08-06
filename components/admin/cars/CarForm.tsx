"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { saveCar, DuplicateVinError } from "@/lib/appwrite/cars";
import ImageUploader from "./ImageUploader";
import PopularFeaturesSelector from "./PopularFeaturesSelector";
interface CustomSpec {
  id: string;
  heading: string;
  value: string;
}
interface CarFormData {
  slug: string;
  vin: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  body_type: string;
  fuel_type: string;
  transmission: string;
  drive_type: string;
  engine: string;
  odometer_km: number;
  color_exterior: string;
  color_interior: string;
  seats: number;
  doors: number;
  power_steering: string;
  price: number;
  was_price: number | null;
  description: string;
  features: string;
  popular_feature_ids: string[];
  condition: string;
  is_featured: boolean;
  is_published: boolean;
  availability: "In stock" | "Coming soon" | "Sold out";
  extended_warranty: boolean; // ← add
}

interface UploadedImage {
  url: string;
  alt: string;
  position: number;
}

const DEFAULTS: CarFormData = {
  slug: "",
  vin: "",
  make: "",
  model: "",
  variant: "",
  year: new Date().getFullYear(),
  body_type: "SUV",
  fuel_type: "Petrol",
  transmission: "Automatic",
  drive_type: "FWD",
  engine: "",
  odometer_km: 0,
  color_exterior: "",
  color_interior: "",
  seats: 5,
  doors: 4,
  power_steering: "",
  price: 0,
  was_price: null,
  description: "",
  features: "",
  popular_feature_ids: [],
  condition: "Good",
  is_featured: false,
  is_published: true,
  availability: "In stock",
  extended_warranty: false, // ← add
};

const SELECT_OPTS = {
  body_type: [
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
  ],
  fuel_type: [
    "Petrol",
    "Diesel",
    "Hybrid Petrol",
    "Plug-in Hybrid",
    "Electric",
    "Hybrid Diesel",
  ],
  transmission: ["Automatic", "Manual"],
  drive_type: ["FWD", "AWD", "4WD", "RWD"],
  condition: ["Excellent", "Good", "Fair"],
};

interface Props {
  initialData?: Partial<CarFormData> & {
    id?: string;
    car_images?: UploadedImage[];
    custom_specs?: { id?: string; heading: string; value: string }[];
  };
  mode: "create" | "edit";
}

// Reusable field components
const Field = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div>
    <label className="text-xs font-semibold text-gray-600 block mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors bg-white";

export default function CarForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CarFormData>(() => {
    const merged = { ...DEFAULTS, ...initialData };
    // A null from a nullable DB column (e.g. rego_expiry) would clobber a
    // non-null default and break controlled inputs. Restore the default for
    // any null — but leave was_price alone, since its default is legitimately null.
    (Object.keys(DEFAULTS) as (keyof CarFormData)[]).forEach((k) => {
      if (merged[k] === null && DEFAULTS[k] !== null) {
        (merged as any)[k] = DEFAULTS[k];
      }
    });
    return merged;
  });
  const [images, setImages] = useState<UploadedImage[]>(
    initialData?.car_images ?? [],
  );

  const [customSpecs, setCustomSpecs] = useState<CustomSpec[]>(() =>
    (initialData?.custom_specs ?? []).map((s) => ({
      id: s.id ?? crypto.randomUUID(),
      heading: s.heading,
      value: s.value,
    })),
  );
  const addCustomSpec = () =>
    setCustomSpecs((s) => [
      ...s,
      { id: crypto.randomUUID(), heading: "", value: "" },
    ]);

  const updateCustomSpec = (
    id: string,
    field: "heading" | "value",
    val: string,
  ) =>
    setCustomSpecs((s) =>
      s.map((spec) => (spec.id === id ? { ...spec, [field]: val } : spec)),
    );

  const removeCustomSpec = (id: string) =>
    setCustomSpecs((s) => s.filter((spec) => spec.id !== id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Temp car id for image uploads before save (create mode)
  const [tempId] = useState(() => initialData?.id ?? crypto.randomUUID());

  const set = (key: keyof CarFormData, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Auto-generate slug from year+make+model
  const autoSlug = () => {
    const s = `${form.year}-${form.make}-${form.model}-${form.variant}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    set("slug", s);
  };
  // HEAD-checks each image against raw storage. Returns false only on a
  // definitive 4xx ("not there"); treats network/5xx as ambiguous so a
  // transient blip can't drop a good upload.

  // const imageExists = async (url: string): Promise<boolean> => {
  //   try {
  //     const res = await fetch(url, { method: "HEAD" });
  //     return res.ok || res.status >= 500;
  //   } catch {
  //     return true;
  //   }
  // };
  // Belt-and-braces check that each image really is in storage.
  //
  // The previous version sent `Range: bytes=0-0` to fetch a single byte. That
  // works against Supabase's public object URLs, but Appwrite's /view endpoint
  // rejects partial-content requests (4xx), so every valid Appwrite image was
  // being reported as missing and saves were blocked.
  //
  // Only a definitive 404 means the file is gone. Anything else — 200, 206,
  // 401, 416, a CORS failure, a network blip — is treated as present, because
  // /api/admin/storage already verifies each upload server-side with getFile()
  // before handing back a URL. This guard exists to catch the rare case where
  // a file is deleted between upload and save, not to re-validate every URL.
  const imageExists = async (url: string): Promise<boolean> => {
    try {
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      return res.status !== 404;
    } catch {
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    // Guard: confirm every image is in storage before writing rows.
    if (images.length > 0) {
      const results = await Promise.all(
        images.map((img) => imageExists(img.url)),
      );
      const broken = images.filter((_, i) => !results[i]);
      if (broken.length > 0) {
        setError(
          `${broken.length} image${broken.length > 1 ? "s" : ""} failed to upload to storage. Remove and re-add ${broken.length > 1 ? "them" : "it"} before saving.`,
        );
        setSaving(false);
        return;
      }
    }
    const featuresArray = form.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const cleanedSpecs = customSpecs
      .filter((s) => s.heading.trim())
      .map(({ heading, value }) => ({ heading, value })); // strip local id

    // `form` may carry relational/system keys hydrated from the edit-mode row
    // (car_images, custom_specs, fts, timestamps). Those aren't writable
    // attributes, so strip them before saving. saveCar() strips Appwrite
    // system fields ($id, $createdAt, ...) as a second line of defence.
    const {
      car_images,
      custom_specs,
      fts,
      created_at,
      updated_at,
      id: _id,
      ...formCols
    } = form as any;

    let carId: string;
    try {
      // saveCar() also writes the two fields Postgres used to generate:
      //   search_blob      (replaces the fts tsvector)
      //   availability_rank (replaces the generated column)
      // and trims text fields so filter facets don't split on stray whitespace.
      carId = await saveCar(
        {
          ...formCols,
          features: featuresArray,
          custom_specs: cleanedSpecs,
        },
        {
          mode,
          carId: initialData?.id,
          images: images.map((img) => ({ url: img.url, alt: img.alt })),
        },
      );
    } catch (err: any) {
      setError(
        err instanceof DuplicateVinError
          ? err.message
          : (err?.message ?? "Could not save this car."),
      );
      setSaving(false);
      return;
    }

    router.push("/admin/cars");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Images */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 font-montserrat mb-4">Images</h3>
        <ImageUploader
          carId={tempId}
          existingImages={images}
          onImagesChange={setImages}
        />
      </div>

      {/* Identification */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 font-montserrat mb-4">
          Identification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="VIN" required>
            <input
              className={`${inputCls} font-mono uppercase tracking-wider`}
              value={form.vin}
              onChange={(e) => set("vin", e.target.value.toUpperCase())}
              placeholder="JTEBU5JR8K5123456"
              // maxLength={17}
              // minLength={17}
              // pattern="[A-HJ-NPR-Z0-9]{17}"
              // title="17 characters — letters and numbers, excluding I, O and Q"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              17 characters. Letters and numbers only.
            </p>
          </Field>

          <Field label="Brand" required>
            <input
              className={inputCls}
              value={form.make}
              onChange={(e) => set("make", e.target.value)}
              onBlur={autoSlug}
              placeholder="Toyota"
              required
            />
          </Field>
          <Field label="Model" required>
            <input
              className={inputCls}
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
              onBlur={autoSlug}
              placeholder="LandCruiser"
              required
            />
          </Field>
          <Field label="Variant">
            <input
              className={inputCls}
              value={form.variant}
              onChange={(e) => set("variant", e.target.value)}
              onBlur={autoSlug}
              placeholder="GXL 4WD"
            />
          </Field>
          <Field label="Year" required>
            <input
              type="number"
              className={inputCls}
              value={form.year}
              onChange={(e) => set("year", +e.target.value)}
              onBlur={autoSlug}
              min={1990}
              max={2030}
              required
            />
          </Field>
          <Field label="Slug" required>
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="2023-toyota-landcruiser-gxl"
                required
              />
              <button
                type="button"
                onClick={autoSlug}
                className="shrink-0 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl font-semibold text-gray-600 transition-colors"
              >
                Auto
              </button>
            </div>
          </Field>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 font-montserrat mb-4">Specs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(SELECT_OPTS) as (keyof typeof SELECT_OPTS)[]).map(
            (key) => (
              <Field
                key={key}
                label={key
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              >
                <select
                  className={inputCls}
                  value={form[key] as string}
                  onChange={(e) => set(key, e.target.value)}
                >
                  {SELECT_OPTS[key].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            ),
          )}
          <Field label="Engine">
            <input
              className={inputCls}
              value={form.engine}
              onChange={(e) => set("engine", e.target.value)}
              placeholder="2.8L Turbo Diesel"
            />
          </Field>
          <Field label="Odometer (km)" required>
            <input
              type="number"
              className={inputCls}
              value={form.odometer_km}
              onChange={(e) => set("odometer_km", +e.target.value)}
              min={0}
              required
            />
          </Field>
          <Field label="Seats">
            <input
              type="number"
              className={inputCls}
              value={form.seats}
              onChange={(e) => set("seats", +e.target.value)}
              min={1}
              max={12}
            />
          </Field>
          <Field label="Doors">
            <input
              type="number"
              className={inputCls}
              value={form.doors}
              onChange={(e) => set("doors", +e.target.value)}
              min={2}
              max={5}
            />
          </Field>
          <Field label="Exterior Colour">
            <input
              className={inputCls}
              value={form.color_exterior}
              onChange={(e) => set("color_exterior", e.target.value)}
              placeholder="White"
            />
          </Field>
          <Field label="Interior Colour">
            <input
              className={inputCls}
              value={form.color_interior}
              onChange={(e) => set("color_interior", e.target.value)}
              placeholder="Black Leather"
            />
          </Field>
          <Field label="Power Steering">
            <input
              className={inputCls}
              value={form.power_steering}
              onChange={(e) => set("power_steering", e.target.value)}
              placeholder="e.g. Electric / Hydraulic / Yes"
            />
          </Field>
        </div>
      </div>
      {/* Custom specs */}
      {customSpecs.length > 0 && (
        <div className="mt-4 space-y-3">
          {customSpecs.map((spec) => (
            <div key={spec.id} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                  Specification
                </label>
                <input
                  className={inputCls}
                  value={spec.heading}
                  onChange={(e) =>
                    updateCustomSpec(spec.id, "heading", e.target.value)
                  }
                  placeholder="e.g. Bull Bar"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                  Value
                </label>
                <input
                  className={inputCls}
                  value={spec.value}
                  onChange={(e) =>
                    updateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="e.g. Fitted / 2 inch / Yes"
                />
              </div>
              <button
                type="button"
                onClick={() => removeCustomSpec(spec.id)}
                className="shrink-0 w-10 h-[42px] rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center"
                aria-label="Remove spec"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addCustomSpec}
        className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5"
      >
        <span className="text-lg leading-none">+</span> Add Specification
      </button>
      {/* Pricing */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 font-montserrat mb-4">
          Pricing
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Price ($)" required>
            <input
              type="number"
              className={inputCls}
              value={form.price}
              onChange={(e) => set("price", +e.target.value)}
              min={0}
              required
            />
          </Field>
          <Field label="Was Price ($) — optional">
            <input
              type="number"
              className={inputCls}
              value={form.was_price ?? ""}
              onChange={(e) =>
                set("was_price", e.target.value ? +e.target.value : null)
              }
              min={0}
              placeholder="Leave blank if no sale"
            />
          </Field>
        </div>
        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          {(
            [{ key: "extended_warranty", label: "Extended Warranty" }] as const
          ).map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div
                onClick={() => set(key, !form[key])}
                className={`w-10 h-5 rounded-full transition-colors relative ${form[key] ? "bg-red-600" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 font-montserrat mb-4">
          Content
        </h3>
        <div className="space-y-4">
          <Field label="Description">
            <textarea
              className={inputCls}
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the vehicle..."
            />
          </Field>
          <Field label="Features (comma-separated)">
            <textarea
              className={inputCls}
              rows={3}
              value={form.features}
              onChange={(e) => set("features", e.target.value)}
              placeholder="Apple CarPlay, Rear Camera, Leather Seats..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate each feature with a comma
            </p>
          </Field>
        </div>
      </div>
      {/* Popular Features */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 font-montserrat mb-4">
          Popular Features
        </h3>
        <PopularFeaturesSelector
          value={form.popular_feature_ids ?? []}
          onChange={(ids) => set("popular_feature_ids", ids)}
        />
      </div>
      {/* Status */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 font-montserrat mb-4">Status</h3>

        {/* Availability — single choice */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 block mb-2">
            Availability
          </label>
          <div className="flex flex-wrap gap-2">
            {(["In stock", "Coming soon", "Sold out"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set("availability", opt)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  form.availability === opt
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          {(
            [
              { key: "is_published", label: "Published" },
              { key: "is_featured", label: "Featured" },
            ] as const
          ).map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div
                onClick={() => set(key, !form[key])}
                className={`w-10 h-5 rounded-full transition-colors relative ${form[key] ? "bg-red-600" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create Car"
              : "Save Changes"}
        </motion.button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
