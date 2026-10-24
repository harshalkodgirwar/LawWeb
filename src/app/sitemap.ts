import { MetadataRoute } from "next";
import { SEED_PRODUCTS, SEED_CATEGORIES } from "@/lib/db/seed-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://advharshal.com";

  const staticRoutes = [
    "",
    "/about",
    "/materials",
    "/resources",
    "/contact",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/license",
    "/disclaimer",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: "2026-10-21T00:00:00Z",
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const productRoutes = SEED_PRODUCTS.map((product) => ({
    url: `${baseUrl}/materials/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
