import type { NextConfig } from "next";

// Post-cutover: Supabase pattern removed. Only re-add it if
// pre-cutover-check.mjs reports documents still referencing supabase.co.
const appwriteHost = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(
  /^https?:\/\//,
  "",
).replace(/\/v1\/?$/, ""); // endpoint includes /v1; hostname must not

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Appwrite storage. Note the path shape differs from Supabase's:
      //   Appwrite: /v1/storage/buckets/<bucket>/files/<fileId>/view
      ...(appwriteHost
        ? [
            {
              protocol: "https" as const,
              hostname: appwriteHost,
              pathname: "/v1/storage/buckets/**",
            },
          ]
        : []),
      {
        protocol: "https" as const,
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
