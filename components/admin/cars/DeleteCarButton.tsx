"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

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
    const supabase = createClient();

    // 1. Fetch image rows FIRST — the cascade will wipe them, so grab URLs now.
    const { data: imgs } = await supabase
      .from("car_images")
      .select("url")
      .eq("car_id", carId);

    // 2. Remove the files from the storage bucket.
    if (imgs?.length) {
      const paths = imgs
        .map((i) => i.url.split("/car-images/")[1])
        .filter(Boolean);
      if (paths.length) await supabase.storage.from("car-images").remove(paths);
    }

    // 3. Delete the car row — `on delete cascade` clears car_images rows.
    const { error } = await supabase.from("cars").delete().eq("id", carId);

    if (error) {
      alert(`Delete failed: ${error.message}`);
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
