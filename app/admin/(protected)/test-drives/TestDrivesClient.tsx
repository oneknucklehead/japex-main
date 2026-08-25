"use client";

import { useState } from "react";
import Link from "next/link";

export interface Booking {
  id: string;
  vin: string;
  car_id: string;
  car_name: string;
  car_slug: string;
  name: string;
  phone: string;
  email: string;
  postcode: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  status: string;
  is_read: boolean;
  created_at: string;
}

const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-red-100 text-red-700 border-red-200",
  Confirmed: "bg-green-100 text-green-700 border-green-200",
  Completed: "bg-gray-100 text-gray-600 border-gray-200",
  Cancelled: "bg-gray-100 text-gray-400 border-gray-200",
};

function formatDate(iso: string) {
  if (!iso) return "No date";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** True when the requested date has already passed — worth flagging. */
function isPast(iso: string) {
  if (!iso) return false;
  const d = new Date(iso + "T23:59:59");
  return d < new Date();
}

export default function TestDrivesClient({
  bookings: initial,
}: {
  bookings: Booking[];
}) {
  const [bookings, setBookings] = useState(initial);
  const [filter, setFilter] = useState<string>("All");
  const [saving, setSaving] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setSaving(id);
    // Optimistic — the list is small and a failed write is reported below.
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      const res = await fetch("/api/admin/test-drives", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("update failed");
    } catch {
      // Roll back so the UI doesn't claim a change that didn't persist.
      setBookings(initial);
      alert("Could not update status. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const visible =
    filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = bookings.filter((b) => b.status === s).length;
    return acc;
  }, {});

  return (
    <div className="pt-16 lg:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat">
          Test Drives
        </h1>
        <p className="text-sm text-gray-400">
          {counts.New ?? 0} new · {bookings.length} total
        </p>
      </div>

      {/* status filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
              filter === s
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {s}
            {s !== "All" && counts[s] > 0 && (
              <span className="ml-1.5 opacity-60">{counts[s]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl p-5 border border-gray-200"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-gray-900">{b.name}</p>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      STATUS_STYLES[b.status] ?? STATUS_STYLES.Pending
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  <a href={`tel:${b.phone}`} className="hover:text-red-600">
                    {b.phone}
                  </a>
                  {" · "}
                  <a href={`mailto:${b.email}`} className="hover:text-red-600">
                    {b.email}
                  </a>
                  {b.postcode && ` · ${b.postcode}`}
                </p>
              </div>

              <div className="text-right shrink-0">
                {b.car_name && (
                  <p className="text-xs font-semibold text-red-600">
                    {b.car_slug ? (
                      <Link
                        href={`/cars/${b.car_slug}`}
                        target="_blank"
                        className="hover:underline"
                      >
                        {b.car_name}
                      </Link>
                    ) : (
                      b.car_name
                    )}
                  </p>
                )}
                {/* {b.vin && ( */}
                <p className="text-xs text-gray-400 mt-0.5">VIN: {b.vin}</p>
                {/* )} */}
                <p className="text-xs text-gray-400 mt-0.5">
                  Requested {new Date(b.created_at).toLocaleDateString("en-AU")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-semibold text-gray-800">
                  {formatDate(b.preferred_date)}
                </span>
                <span className="text-gray-500">at {b.preferred_time}</span>
                {isPast(b.preferred_date) && b.status === "Pending" && (
                  <span className="text-[11px] font-semibold text-amber-600">
                    date passed
                  </span>
                )}
              </div>
            </div>

            {b.notes && <p className="text-sm text-gray-600 mt-3">{b.notes}</p>}

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400 mr-1">Set status:</span>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={saving === b.id || b.status === s}
                  onClick={() => updateStatus(b.id, s)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                    b.status === s
                      ? "bg-gray-900 text-white cursor-default"
                      : "text-gray-500 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            {filter === "All"
              ? "No test drive bookings yet."
              : `No ${filter.toLowerCase()} bookings.`}
          </p>
        )}
      </div>
    </div>
  );
}
