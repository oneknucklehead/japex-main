"use client";

import { motion } from "framer-motion";

interface Props {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {/* Prev */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
          page === 1
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-300 text-gray-600 hover:border-gray-400"
        }`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
          >
            …
          </span>
        ) : (
          <motion.button
            key={p}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
              p === page
                ? "bg-red-600 text-white border border-red-600"
                : "border border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {p}
          </motion.button>
        ),
      )}

      {/* Next */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          page === totalPages
            ? "border border-gray-200 text-gray-300 cursor-not-allowed"
            : "bg-red-600 text-white"
        }`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  );
}
