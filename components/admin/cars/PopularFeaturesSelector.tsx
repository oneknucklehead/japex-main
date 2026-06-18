"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface PopularFeature {
  id: string;
  name: string;
  image_url: string;
  position: number;
}

interface Props {
  value: string[]; // selected popular_feature_ids
  onChange: (ids: string[]) => void;
}

const BUCKET = "car-images";
const FOLDER = "popular-features";

export default function PopularFeaturesSelector({ value, onChange }: Props) {
  const [catalog, setCatalog] = useState<PopularFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("popular_features")
      .select("*")
      .order("position")
      .then(({ data }) => {
        setCatalog(data ?? []);
        setLoading(false);
      });
  }, []);

  const toggle = (id: string) =>
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    );
  const deleteFeature = async (f: PopularFeature) => {
    setDeletingId(f.id);
    const supabase = createClient();

    // Delete the catalog row first — if this fails, leave storage untouched
    const { error: delErr } = await supabase
      .from("popular_features")
      .delete()
      .eq("id", f.id);
    if (delErr) {
      setError(delErr.message);
      setDeletingId(null);
      setConfirmId(null);
      return;
    }

    // Best-effort storage cleanup (an orphaned file is harmless if this fails)
    const marker = `/${BUCKET}/`;
    const idx = f.image_url.indexOf(marker);
    if (idx !== -1) {
      await supabase.storage
        .from(BUCKET)
        .remove([f.image_url.slice(idx + marker.length)]);
    }

    setCatalog((c) => c.filter((x) => x.id !== f.id));
    onChange(value.filter((v) => v !== f.id));
    setDeletingId(null);
    setConfirmId(null);
  };
  const saveNewFeature = async () => {
    if (!newName.trim() || !file) {
      setError("A name and an image are both required.");
      return;
    }
    setUploading(true);
    setError(null);
    const supabase = createClient();

    // 1. upload image
    const ext = file.name.split(".").pop();
    const path = `${FOLDER}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

    // 2. insert catalog row
    const { data: inserted, error: insErr } = await supabase
      .from("popular_features")
      .insert({
        name: newName.trim(),
        image_url: pub.publicUrl,
        position: catalog.length,
      })
      .select()
      .single();

    // 3. on failure, clean up the orphaned upload (matches your ImageUploader pattern)
    if (insErr || !inserted) {
      await supabase.storage.from(BUCKET).remove([path]);
      setError(insErr?.message ?? "Could not save feature.");
      setUploading(false);
      return;
    }

    setCatalog((c) => [...c, inserted]);
    onChange([...value, inserted.id]); // auto-select for this car
    setNewName("");
    setFile(null);
    setAdding(false);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Popular Features
      </label>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {catalog.map((f) => {
            const selected = value.includes(f.id);
            const confirming = confirmId === f.id;
            return (
              <div
                key={f.id}
                onClick={() => toggle(f.id)}
                role="button"
                tabIndex={0}
                className={`relative text-left rounded-xl border overflow-hidden cursor-pointer transition-all ${
                  selected
                    ? "border-red-500 ring-2 ring-red-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {selected && (
                  <span className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    ✓
                  </span>
                )}

                {/* Trash → asks for confirmation */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmId(f.id);
                  }}
                  aria-label="Remove from catalog"
                  className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur text-gray-500 hover:text-red-600 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>

                {f.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image_url}
                    alt={f.name}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100" />
                )}
                <p className="px-2.5 py-2 text-xs font-semibold text-gray-800">
                  {f.name}
                </p>

                {/* Confirm overlay */}
                {confirming && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-2 text-center"
                  >
                    <p className="text-xs font-semibold text-gray-700">
                      Remove from catalog?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => deleteFeature(f)}
                        disabled={deletingId === f.id}
                        className="text-xs bg-red-600 text-white font-bold px-2.5 py-1 rounded-lg hover:bg-red-700 disabled:opacity-60"
                      >
                        {deletingId === f.id ? "…" : "Remove"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="text-xs text-gray-500 font-semibold px-2.5 py-1 rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add-new tile */}
          {!adding && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-xl border border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50/40 flex flex-col items-center justify-center min-h-[8.5rem] text-gray-400 hover:text-red-500 transition-colors"
            >
              <span className="text-2xl leading-none">+</span>
              <span className="text-xs font-semibold mt-1">Add feature</span>
            </button>
          )}
        </div>
      )}

      {/* Inline create form */}
      {adding && (
        <div className="mt-3 bg-white rounded-2xl p-4 border border-dashed border-gray-300 max-w-md">
          <h4 className="font-bold text-gray-700 text-sm mb-3">
            New popular feature
          </h4>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white mb-2"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Apple CarPlay & Android Auto"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold mb-3"
          />
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveNewFeature}
              disabled={uploading}
              className="text-xs bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-60"
            >
              {uploading ? "Saving…" : "Save feature"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setError(null);
                setNewName("");
                setFile(null);
              }}
              className="text-xs text-gray-500 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
