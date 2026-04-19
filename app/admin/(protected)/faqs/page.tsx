"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

interface Faq {
  id?: string;
  question: string;
  answer: string;
  position: number;
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("faqs")
      .select("*")
      .order("position")
      .then(({ data }) => setFaqs(data ?? []));
  }, []);

  const saveFaq = async (faq: Faq) => {
    setSaving(faq.id ?? "new");
    const supabase = createClient();
    if (faq.id) {
      await supabase
        .from("faqs")
        .update({ question: faq.question, answer: faq.answer })
        .eq("id", faq.id);
    }
    setSaving(null);
  };

  const deleteFaq = async (id: string) => {
    const supabase = createClient();
    await supabase.from("faqs").delete().eq("id", id);
    setFaqs((f) => f.filter((faq) => faq.id !== id));
  };

  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return;
    setAdding(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("faqs")
      .insert({ ...newFaq, position: faqs.length })
      .select()
      .single();
    if (data) {
      setFaqs((f) => [...f, data]);
      setNewFaq({ question: "", answer: "" });
    }
    setAdding(false);
  };

  return (
    <div className="pt-16 lg:pt-0 max-w-3xl">
      <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat mb-6">
        FAQs
      </h1>

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white rounded-2xl p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-bold text-gray-400 mt-1">
                  #{i + 1}
                </span>
                <button
                  onClick={() => deleteFaq(faq.id!)}
                  className="shrink-0 text-xs text-red-500 hover:underline font-semibold"
                >
                  Delete
                </button>
              </div>
              <div className="space-y-2">
                <input
                  className={inputCls}
                  value={faq.question}
                  onChange={(e) =>
                    setFaqs((f) =>
                      f.map((q) =>
                        q.id === faq.id
                          ? { ...q, question: e.target.value }
                          : q,
                      ),
                    )
                  }
                  placeholder="Question"
                />
                <textarea
                  className={inputCls}
                  rows={2}
                  value={faq.answer}
                  onChange={(e) =>
                    setFaqs((f) =>
                      f.map((q) =>
                        q.id === faq.id ? { ...q, answer: e.target.value } : q,
                      ),
                    )
                  }
                  placeholder="Answer"
                />
                <button
                  onClick={() => saveFaq(faq)}
                  disabled={saving === faq.id}
                  className="text-xs bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {saving === faq.id ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add new */}
      <div className="bg-white rounded-2xl p-5 border border-dashed border-gray-300">
        <h3 className="font-bold text-gray-700 text-sm mb-3">Add New FAQ</h3>
        <div className="space-y-2">
          <input
            className={inputCls}
            value={newFaq.question}
            onChange={(e) =>
              setNewFaq((f) => ({ ...f, question: e.target.value }))
            }
            placeholder="Question"
          />
          <textarea
            className={inputCls}
            rows={2}
            value={newFaq.answer}
            onChange={(e) =>
              setNewFaq((f) => ({ ...f, answer: e.target.value }))
            }
            placeholder="Answer"
          />
          <button
            onClick={addFaq}
            disabled={adding}
            className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {adding ? "Adding..." : "+ Add FAQ"}
          </button>
        </div>
      </div>
    </div>
  );
}
