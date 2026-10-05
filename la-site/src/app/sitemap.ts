import type { MetadataRoute } from "next";
import { getCatalogProducts } from "@/lib/catalog";
import { getJournalArticles } from "@/lib/journal-data";

const BASE_URL = "https://evlvpeptides.com";

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "daily" as const },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/research-peptides-usa", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/coas", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/journal", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/track-order", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/wholesale", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/heroes-discount", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/plans", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/shipping", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/returns", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/ruo", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getCatalogProducts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/shop/${p.slug}`,
    lastModified: p.batch?.date ? new Date(p.batch.date) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const journalEntries: MetadataRoute.Sitemap = getJournalArticles().map((a) => ({
    url: `${BASE_URL}/journal/${a.slug}`,
    lastModified: new Date(a.publishedDate),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...productEntries, ...journalEntries];
}
