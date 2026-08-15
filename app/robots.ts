import type { MetadataRoute } from "next";

const BASE = "https://www.japexmotors.com.au";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin panel is behind auth anyway, but there's no reason for it to
      // appear in search results. /api/* would only produce noise.
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    // Reinforces which hostname is authoritative — the appwrite.network
    // subdomain serves identical content and would otherwise be indexed as
    // duplicate.
    host: BASE,
  };
}
