// Supabase Storage URL helper
export function getCarStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/car-images/${path}`;
}

export function getAssetsStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/assets/${path}`;
}

// Get cover image URL for a car
export function getCoverImage(car: {
  car_images?: { url: string; position: number }[];
}): string | null {
  if (!car?.car_images || car.car_images.length === 0)
    return "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800";
  const sorted = [...car.car_images].sort((a, b) => a.position - b.position);
  return (
    sorted[0]?.url ??
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
  );
}

// Format odometer --> "63,671 km"
export function formatOdometer(km: number): string {
  return `${new Intl.NumberFormat("en-AU").format(km)} km`;
}

// Format price --> "$48,990"
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
