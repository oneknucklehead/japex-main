import type { MetadataRoute } from "next";
import { Query } from "node-appwrite";
import { createAdminClient, DB_ID } from "@/lib/appwrite/server";

// Generated at request time, so newly published cars appear without a rebuild
// and sold-out listings drop off on their own.
export const dynamic = "force-dynamic";

const BASE = "https://www.japexmotors.com.au";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/cars`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${BASE}/service-and-parts`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${BASE}/finance`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    {
      url: `${BASE}/terms-and-condition`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  try {
    const { databases } = createAdminClient();
    const res = await databases.listDocuments(DB_ID, "cars", [
      Query.equal("is_published", true),
      Query.limit(5000),
    ]);

    const cars: MetadataRoute.Sitemap = (res.documents as any[]).map((c) => ({
      url: `${BASE}/cars/${c.slug}`,
      lastModified: new Date(c.$updatedAt),
      changeFrequency: "weekly" as const,
      // Available stock ranks above sold — those pages still have SEO value
      // but shouldn't compete with cars a customer can actually buy.
      priority: c.availability === "Sold out" ? 0.4 : 0.8,
    }));

    return [...staticRoutes, ...cars];
  } catch (e) {
    // A failed query shouldn't produce a 500 for crawlers — serve the static
    // routes and let the next crawl pick up the listings.
    console.error("sitemap: could not load cars", e);
    return staticRoutes;
  }
}
