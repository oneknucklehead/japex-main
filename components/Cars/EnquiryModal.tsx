"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ID } from "appwrite";
import { createClient, DB_ID } from "@/lib/appwrite/client";

interface Props {
  carId: string;
  carName: string;
  onClose: () => void;
}

export default function EnquiryModal({ carId, carName, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // The enquiries collection grants create to anyone (it's a public form),
    // so this writes directly from the browser — no server route needed.
    // It deliberately grants no read permission, so submissions aren't
    // publicly listable.
    try {
      const { databases } = createClient();
      await databases.createDocument(DB_ID, "enquiries", ID.unique(), {
        car_id: carId,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim() || `I am interested in the ${carName}.`,
        is_read: false,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Enquiry submission failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
      >
        {success ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 font-montserrat mb-2">
              Enquiry Sent!
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              We'll be in touch shortly about the {carName}.
            </p>
            <button
              onClick={onClose}
              className="bg-brand-primary text-white font-semibold px-6 py-2.5 rounded-xl w-full"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 font-montserrat">
                Make an Enquiry
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4 bg-gray-50 rounded-xl px-3 py-2 font-medium">
              Re: {carName}
            </p>

            <form onSubmit={submit} className="space-y-3">
              {[
                {
                  key: "name",
                  label: "Full Name",
                  type: "text",
                  required: true,
                },
                { key: "email", label: "Email", type: "email", required: true },
                { key: "phone", label: "Phone", type: "tel", required: false },
              ].map(({ key, label, type, required }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    {label}
                    {required && " *"}
                  </label>
                  <input
                    type={type}
                    required={required}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-colors"
                    placeholder={label}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Message
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder={`I am interested in the ${carName}...`}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-colors resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm"
              >
                {loading ? "Sending..." : "Send Enquiry"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
