"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCarCompletely } from "@/lib/appwrite/cars";

export default function DeleteCarButton({ carId }: { carId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Delete this car permanently? This removes the listing and all its images, and cannot be undone.",
      )
    )
      return;

    setDeleting(true);

    // Deletion happens server-side in /api/admin/cars, in this order:
    //   1. storage files  2. car_images rows  3. the car document
    //
    // Appwrite has no `on delete cascade`, so the image rows must be removed
    // explicitly — a cascade used to handle that. Files go first so a partial
    // failure leaves a visible broken row rather than an invisible orphaned
    // file, and unlike the previous version the result is actually checked
    // instead of ignored.
    try {
      const result = await deleteCarCompletely(carId);
      if (result.rowsDeleted > 0 && result.filesDeleted < result.rowsDeleted) {
        alert(
          `Car deleted, but ${result.rowsDeleted - result.filesDeleted} image file(s) ` +
            `could not be removed from storage. They're no longer referenced.`,
        );
      }
    } catch (err: any) {
      alert(`Delete failed: ${err?.message ?? "unknown error"}`);
      setDeleting(false);
      return;
    }

    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs font-semibold text-gray-400 hover:text-red-600 hover:underline disabled:opacity-50"
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
