"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

interface Testimonial {
  id?: string;
  name: string;
  role: string;
  review: string;
  rating: number;
  is_published: boolean;
  position: number;
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white";
const BLANK = {
  name: "",
  role: "",
  review: "",
  rating: 5,
  is_published: true,
  position: 0,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<Testimonial, "id">>({ ...BLANK });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("testimonials")
      .select("*")
      .order("position")
      .then(({ data }) => setItems(data ?? []));
  }, []);

  const save = async (item: Testimonial) => {
    setSaving(item.id ?? "new");
    const supabase = createClient();
    await supabase
      .from("testimonials")
      .update({
        name: item.name,
        role: item.role,
        review: item.review,
        rating: item.rating,
        is_published: item.is_published,
      })
      .eq("id", item.id!);
    setSaving(null);
  };

  const remove = async (id: string) => {
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    setItems((f) => f.filter((i) => i.id !== id));
  };

  const add = async () => {
    if (!newItem.name || !newItem.review) return;
    setAdding(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("testimonials")
      .insert({ ...newItem, position: items.length })
      .select()
      .single();
    if (data) {
      setItems((f) => [...f, data]);
      setNewItem({ ...BLANK });
    }
    setAdding(false);
  };

  const update = (id: string, key: keyof Testimonial, val: any) =>
    setItems((f) => f.map((i) => (i.id === id ? { ...i, [key]: val } : i)));

  const TestimonialFields = ({
    item,
    onChange,
  }: {
    item: Partial<Testimonial>;
    onChange: (k: string, v: any) => void;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          className={inputCls}
          value={item.name ?? ""}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Name"
        />
        <input
          className={inputCls}
          value={item.role ?? ""}
          onChange={(e) => onChange("role", e.target.value)}
          placeholder="Role (e.g. Car Buyer)"
        />
      </div>
      <textarea
        className={inputCls}
        rows={2}
        value={item.review ?? ""}
        onChange={(e) => onChange("review", e.target.value)}
        placeholder="Review text..."
      />
      <div className="flex items-center gap-3">
        <select
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none bg-white"
          value={item.rating ?? 5}
          onChange={(e) => onChange("rating", +e.target.value)}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} stars
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="pt-16 lg:pt-0 max-w-3xl">
      <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat mb-6">
        Testimonials
      </h1>

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-400">
                  #{i + 1}
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
                    <div
                      onClick={() =>
                        update(item.id!, "is_published", !item.is_published)
                      }
                      className={`w-8 h-4 rounded-full relative transition-colors ${item.is_published ? "bg-green-500" : "bg-gray-200"}`}
                    >
                      <span
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${item.is_published ? "translate-x-4" : "translate-x-0.5"}`}
                      />
                    </div>
                    Published
                  </label>
                  <button
                    onClick={() => remove(item.id!)}
                    className="text-xs text-red-500 hover:underline font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <TestimonialFields
                item={item}
                onChange={(k, v) => update(item.id!, k as keyof Testimonial, v)}
              />
              <button
                onClick={() => save(item)}
                disabled={saving === item.id}
                className="mt-2 text-xs bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-60"
              >
                {saving === item.id ? "Saving..." : "Save"}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-dashed border-gray-300">
        <h3 className="font-bold text-gray-700 text-sm mb-3">
          Add New Testimonial
        </h3>
        <TestimonialFields
          item={newItem}
          onChange={(k, v) => setNewItem((f) => ({ ...f, [k]: v }))}
        />
        <button
          onClick={add}
          disabled={adding}
          className="mt-3 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-700 disabled:opacity-60"
        >
          {adding ? "Adding..." : "+ Add Testimonial"}
        </button>
      </div>
    </div>
  );
}
