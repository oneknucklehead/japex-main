"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import ImageUploader from "./ImageUploader";

interface CarFormData {
  slug: string;
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
  rego: string;
  rego_expiry: string;
  price: number;
  was_price: number | null;
  description: string;
  features: string;
  condition: string;
  is_featured: boolean;
  is_sold: boolean;
  is_published: boolean;
}

interface UploadedImage {
  url: string;
  alt: string;
  position: number;
}

const DEFAULTS: CarFormData = {
  slug: "",
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
  rego: "",
  rego_expiry: "",
  price: 0,
  was_price: null,
  description: "",
  features: "",
  condition: "Good",
  is_featured: false,
  is_sold: false,
  is_published: true,
};

const SELECT_OPTS = {
  body_type: [
    "SUV",
    "Sedan",
    "Hatchback",
    "Ute",
    "Coupe",
    "Van",
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
  const [form, setForm] = useState<CarFormData>({
    ...DEFAULTS,
    ...initialData,
  });
  const [images, setImages] = useState<UploadedImage[]>(
    initialData?.car_images ?? [],
  );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const featuresArray = form.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      features: featuresArray,
      was_price: form.was_price || null,
      rego_expiry: form.rego_expiry || null,
      id: mode === "create" ? tempId : initialData?.id,
    };

    let carId = initialData?.id ?? tempId;

    if (mode === "create") {
      const { data, error: err } = await supabase
        .from("cars")
        .insert(payload)
        .select("id")
        .single();
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      carId = data.id;
    } else {
      const { error: err } = await supabase
        .from("cars")
        .update(payload)
        .eq("id", carId);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }

    // Save car_images
    if (mode === "edit") {
      await supabase.from("car_images").delete().eq("car_id", carId);
    }
    if (images.length > 0) {
      await supabase
        .from("car_images")
        .insert(images.map((img) => ({ ...img, car_id: carId })));
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
          <Field label="Make" required>
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
          <Field label="Rego">
            <input
              className={inputCls}
              value={form.rego}
              onChange={(e) => set("rego", e.target.value)}
              placeholder="ABC123"
            />
          </Field>
          <Field label="Rego Expiry">
            <input
              type="date"
              className={inputCls}
              value={form.rego_expiry}
              onChange={(e) => set("rego_expiry", e.target.value)}
            />
          </Field>
        </div>
      </div>

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

      {/* Status */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 font-montserrat mb-4">Status</h3>
        <div className="flex flex-wrap gap-6">
          {(
            [
              { key: "is_published", label: "Published" },
              { key: "is_featured", label: "Featured" },
              { key: "is_sold", label: "Sold" },
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
