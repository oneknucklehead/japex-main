"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { formatPrice, getPreviewUrl } from "@/utils/helpers";

interface Props {
  carId: string;
  carName: string;
  carVariant?: string;
  carPrice?: number;
  carImage?: string;
  carSlug?: string;
  onClose: () => void;
}

const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Inline month calendar.
 *
 * A native <input type="date"> would be less code, but it renders with the
 * browser's own chrome — light-themed and inconsistent across platforms —
 * which looks wrong inside a dark modal. This keeps the booking flow on-brand
 * and matches the reference design.
 */
function Calendar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (d: string) => void;
}) {
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  // Bookings are limited to the next 60 days — far enough ahead to be useful,
  // close enough that the dealership can realistically honour it.
  // Change + 60 to any number of days you want to allow for booking in the future.
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 60);
    return d;
  }, [today]);

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const daysInMonth = new Date(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      0,
    ).getDate();

    const out: (Date | null)[] = Array(first.getDay()).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      out.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
    }
    return out;
  }, [cursor]);

  const canGoBack =
    cursor.getFullYear() > today.getFullYear() ||
    (cursor.getFullYear() === today.getFullYear() &&
      cursor.getMonth() > today.getMonth());
  const canGoForward =
    cursor.getFullYear() < maxDate.getFullYear() ||
    (cursor.getFullYear() === maxDate.getFullYear() &&
      cursor.getMonth() < maxDate.getMonth());

  const shift = (n: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1));

  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      {/* month header */}
      <div className="flex items-center justify-between bg-brand-primary px-3 py-2">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="w-7 h-7 flex items-center justify-center rounded-full text-white disabled:opacity-30 enabled:hover:bg-white/20 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="m15 18-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-sm font-bold text-white font-poppins">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={!canGoForward}
          aria-label="Next month"
          className="w-7 h-7 flex items-center justify-center rounded-full text-white disabled:opacity-30 enabled:hover:bg-white/20 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="m9 18 6-6-6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="p-2 bg-black/40">
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              className="text-center text-[11px] font-semibold text-brand-gray py-1"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((date, i) => {
            if (!date) return <div key={`pad-${i}`} />;

            const value = iso(date);
            const isPast = date < today;
            const isTooFar = date > maxDate;
            const disabled = isPast || isTooFar;
            const isSelected = value === selected;

            return (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(value)}
                className={`aspect-square text-xs rounded-md transition-colors ${
                  isSelected
                    ? "bg-brand-primary text-white font-bold"
                    : disabled
                      ? "text-white/20 cursor-not-allowed"
                      : "text-brand-gray hover:bg-white/10 cursor-pointer"
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TestDriveModal({
  carId,
  carName,
  carVariant,
  carPrice,
  carImage,
  carSlug,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    postcode: "",
    date: "",
    time: TIME_SLOTS[1],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) {
      setError("Please choose a date for your test drive.");
      return;
    }
    setLoading(true);
    setError("");

    // Posted to /api/forms so the booking is stored AND emailed to the
    // dealership together — a booking request nobody sees is a missed sale.
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "test_drive",
          carId,
          carName,
          carSlug: carSlug ?? "",
          name: form.name,
          phone: form.phone,
          email: form.email,
          postcode: form.postcode,
          preferred_date: form.date,
          preferred_time: form.time,
          notes: form.notes,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
    } catch (err) {
      console.error("Test drive booking failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary transition-colors";

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-linear-to-b from-[#150606] to-black border border-white/10 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto font-dm-sans"
      >
        {success ? (
          <div className="text-center p-8">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-white font-poppins mb-2">
              Booking requested
            </h3>
            <p className="text-brand-gray text-sm mb-6">
              We&apos;ll call you shortly to confirm your test drive of the{" "}
              {carName}.
            </p>
            <button
              onClick={onClose}
              className="bg-brand-primary hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full w-full transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-[#150606] z-10">
              <h3 className="text-lg font-bold text-white font-poppins">
                Book a Test Drive
              </h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-white"
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

            <div className="p-5 space-y-4">
              <p className="text-xs text-brand-gray">
                You are booking a test drive for this vehicle.
              </p>

              {/* vehicle summary */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                {carImage && (
                  <div className="relative aspect-16/9 bg-black">
                    <Image
                      src={getPreviewUrl(carImage, { width: 640 })}
                      alt={carName}
                      fill
                      sizes="400px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-3">
                  <p className="font-bold text-white font-poppins">{carName}</p>
                  {carVariant && (
                    <p className="text-xs text-brand-gray mt-0.5">
                      {carVariant}
                    </p>
                  )}
                  {typeof carPrice === "number" && (
                    <div className="flex items-end justify-between mt-3 pt-3 border-t border-white/10">
                      <span className="text-sm text-brand-gray">Price</span>
                      <div className="text-right">
                        <p className="text-lg font-black text-white font-bricolage">
                          {formatPrice(carPrice)}
                        </p>
                        <p className="text-[10px] text-brand-gray">
                          Excl. Govt. charges
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-brand-gray">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                West Gosford NSW 2250
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-white block mb-2">
                    Preferred date *
                  </label>
                  <Calendar
                    selected={form.date}
                    onSelect={(d) => setForm((f) => ({ ...f, date: d }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">
                    Preferred time *
                  </label>
                  <select
                    value={form.time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, time: e.target.value }))
                    }
                    className={`${inputCls} cursor-pointer`}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t} className="text-brand-dark">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-white mb-2">
                    Contact details
                  </p>
                  <div className="space-y-2.5">
                    {[
                      {
                        key: "name",
                        label: "Full Name",
                        type: "text",
                        required: true,
                      },
                      {
                        key: "phone",
                        label: "Mobile Number",
                        type: "tel",
                        required: true,
                      },
                      {
                        key: "email",
                        label: "Email",
                        type: "email",
                        required: true,
                      },
                      {
                        key: "postcode",
                        label: "Postcode",
                        type: "text",
                        required: false,
                      },
                    ].map(({ key, label, type, required }) => (
                      <input
                        key={key}
                        type={type}
                        required={required}
                        value={form[key as keyof typeof form]}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, [key]: e.target.value }))
                        }
                        placeholder={label}
                        className={inputCls}
                      />
                    ))}
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, notes: e.target.value }))
                      }
                      placeholder="Anything else we should know? (optional)"
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>

                {error && <p className="text-brand-primary text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-full transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "Sending…" : "Request Booking"}
                </button>

                <p className="text-[11px] text-brand-gray/70 text-center">
                  A request, not a confirmed booking — we&apos;ll call to
                  confirm.
                </p>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
