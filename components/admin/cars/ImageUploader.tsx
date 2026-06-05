"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface UploadedImage {
  url: string;
  alt: string;
  position: number;
}

interface Props {
  carId: string;
  existingImages?: UploadedImage[];
  onImagesChange?: (images: UploadedImage[]) => void;
}

export default function ImageUploader({
  carId,
  existingImages = [],
  onImagesChange,
}: Props) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [errored, setErrored] = useState<Record<string, boolean>>({});

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    setUploadError("");
    const supabase = createClient();
    const newImages: UploadedImage[] = [];
    const failed: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop();
      const path = `${carId}/${Date.now()}-${i}.${ext}`;

      const { error } = await supabase.storage
        .from("car-images")
        .upload(path, file, { upsert: true });

      if (error) {
        failed.push(file.name);
        continue; // never push a URL for a file that didn't land
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("car-images").getPublicUrl(path);

      newImages.push({
        url: publicUrl,
        alt: "",
        position: images.length + newImages.length,
      });
    }

    const updated = [...images, ...newImages];
    setImages(updated);
    onImagesChange?.(updated);

    if (failed.length) {
      setUploadError(
        `${failed.length} file${failed.length > 1 ? "s" : ""} failed to upload: ${failed.join(", ")}. Try again.`,
      );
    }
    setUploading(false);
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) await uploadFiles(e.dataTransfer.files);
    },
    [images],
  );

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) await uploadFiles(e.target.files);
  };

  const removeImage = async (index: number) => {
    const supabase = createClient();
    const img = images[index];
    const path = img.url.split("/car-images/")[1];

    // 1. Remove the file from storage
    if (path) await supabase.storage.from("car-images").remove([path]);

    // 2. Remove the DB row. No-op in create mode (row doesn't exist yet);
    //    in edit mode this stops an orphaned row pointing at a deleted file.
    await supabase.from("car_images").delete().eq("url", img.url);

    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, position: i }));
    setImages(updated);
    onImagesChange?.(updated);
  };

  const updateAlt = (index: number, alt: string) => {
    const updated = images.map((img, i) =>
      i === index ? { ...img, alt } : img,
    );
    setImages(updated);
    onImagesChange?.(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragOver
            ? "border-red-500 bg-red-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-sm font-semibold text-gray-700">
                Drop images here or click to upload
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WEBP up to 10MB each
              </p>
            </div>
          )}
        </label>
      </div>
      {uploadError && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {uploadError}
        </p>
      )}
      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence>
            {images.map((img, i) => (
              <motion.div
                key={img.url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group rounded-xl overflow-hidden border border-gray-200"
              >
                <div className="relative aspect-video">
                  {!errored[img.url] ? (
                    <Image
                      src={img.url}
                      alt={img.alt || "Car image"}
                      fill
                      className="object-cover"
                      sizes="200px"
                      onError={() =>
                        setErrored((e) => ({ ...e, [img.url]: true }))
                      }
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl">🚗</span>
                    </div>
                  )}
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Cover
                    </span>
                  )}
                </div>
                {/* <div className="relative aspect-video">
                  <Image
                    src={img.url}
                    alt={img.alt || "Car image"}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Cover
                    </span>
                  )}
                </div> */}
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Alt text..."
                    value={img.alt}
                    onChange={(e) => updateAlt(i, e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-red-400"
                  />
                </div>
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
