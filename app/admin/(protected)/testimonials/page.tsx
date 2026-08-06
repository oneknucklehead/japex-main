"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Query } from "appwrite";
import { createClient, DB_ID } from "@/lib/appwrite/client";

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

/**
 * Defined at module scope, NOT inside AdminTestimonialsPage.
 *
 * When a component is declared inside another component's body, every render
 * creates a new function identity. React treats that as a different component
 * type, unmounts the old subtree and mounts a fresh one — so the input loses
 * focus after each keystroke. Hoisting it keeps the identity stable.
 */
function TestimonialFields({
  item,
  onChange,
}: {
  item: Partial<Testimonial>;
  onChange: (k: string, v: any) => void;
}) {
  return (
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
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<Testimonial, "id">>({ ...BLANK });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const { databases } = createClient();
    databases
      .listDocuments(DB_ID, "testimonials", [
        Query.orderAsc("position"),
        Query.limit(200),
      ])
      .then((res: any) =>
        setItems(
          (res.documents as any[]).map((d) => ({
            id: d.$id,
            name: d.name,
            role: d.role,
            review: d.review,
            rating: d.rating,
            is_published: d.is_published,
            position: d.position,
          })),
        ),
      )
      .catch((e: any) => console.error("Could not load testimonials:", e));
  }, []);

  // Reads are direct (public read); writes go through /api/admin/content.
  const save = async (item: Testimonial) => {
    if (!item.id) return;
    setSaving(item.id);
    try {
      await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "testimonials",
          id: item.id,
          data: {
            name: item.name,
            role: item.role,
            review: item.review,
            rating: item.rating,
            is_published: item.is_published,
          },
        }),
      });
    } catch (e) {
      console.error("Could not save testimonial:", e);
    } finally {
      setSaving(null);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "testimonials", id }),
      });
      if (!res.ok) return;
      setItems((f) => f.filter((i) => i.id !== id));
    } catch (e) {
      console.error("Could not delete testimonial:", e);
    }
  };

  const add = async () => {
    if (!newItem.name || !newItem.review) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "testimonials",
          data: { ...newItem, position: items.length },
        }),
      });
      const data = await res.json();
      if (res.ok && data.document) {
        const d = data.document;
        setItems((f) => [
          ...f,
          {
            id: d.$id,
            name: d.name,
            role: d.role,
            review: d.review,
            rating: d.rating,
            is_published: d.is_published,
            position: d.position,
          },
        ]);
        setNewItem({ ...BLANK });
      }
    } catch (e) {
      console.error("Could not add testimonial:", e);
    } finally {
      setAdding(false);
    }
  };

  const update = (id: string, key: keyof Testimonial, val: any) =>
    setItems((f) => f.map((i) => (i.id === id ? { ...i, [key]: val } : i)));

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
