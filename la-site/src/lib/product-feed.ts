import { wcGet, isWooCommerceConfigured } from "./woocommerce";
import type { Product } from "./types";

interface WcProduct {
  id: number;
  slug: string;
  sku: string;
  name: string;
  price: string;
  regular_price: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  images: Array<{ src: string }>;
  categories: Array<{ slug: string; name: string }>;
  description: string;
  short_description: string;
  meta_data: Array<{ key: string; value: string }>;
}

function getMeta(product: WcProduct, key: string): string {
  return product.meta_data.find((m) => m.key === key)?.value ?? "";
}

function mapWcProduct(p: WcProduct, siblings: WcProduct[]): Product {
  const compoundGroup = getMeta(p, "compound_group") || p.slug;
  const variants = siblings
    .filter((s) => getMeta(s, "compound_group") === compoundGroup || getMeta(s, "compound_group") === getMeta(p, "compound_group"))
    .map((s) => ({
      slug: s.slug,
      label: getMeta(s, "size_label") || s.name,
      price: parseFloat(s.price) || 0,
      inStock: s.stock_status === "instock",
    }));

  return {
    id: String(p.id),
    slug: p.slug,
    sku: p.sku,
    name: p.name.toUpperCase(),
    category: (p.categories[0]?.slug ?? "peptides") as import("./types").ProductCategory,
    categoryLabel: p.categories[0]?.name ?? "Research Compound",
    image: p.images[0]?.src,
    price: parseFloat(p.price) || 0,
    purity: getMeta(p, "purity") || "99%+",
    rating: 0,
    reviewCount: 0,
    inStock: p.stock_status === "instock",
    shortDescription: p.short_description.replace(/<[^>]*>/g, ""),
    description: p.description.replace(/<[^>]*>/g, ""),
    storage: getMeta(p, "storage_instructions") || "Store lyophilized vials at 2–8°C.",
    reconstitution: getMeta(p, "reconstitution_instructions") || undefined,
    variants: variants.length > 1 ? variants : undefined,
  };
}

export async function getLiveProducts(): Promise<Product[]> {
  if (!isWooCommerceConfigured()) return [];

  const { ok, data } = await wcGet<WcProduct[]>("/wc/v3/products?per_page=100&status=publish", {
    revalidate: 120,
  });
  if (!ok || !Array.isArray(data)) return [];

  return data.map((p) => mapWcProduct(p, data));
}

export function mergeProducts(
  staticProducts: Product[],
  liveProducts: Product[],
): Product[] {
  if (liveProducts.length === 0) return staticProducts;

  const bySlug = new Map(staticProducts.map((p) => [p.slug, p]));
  for (const live of liveProducts) {
    const existing = bySlug.get(live.slug);
    if (existing) {
      bySlug.set(live.slug, {
        ...existing,
        price: live.price,
        inStock: live.inStock,
        sku: live.sku,
        variants: live.variants ?? existing.variants,
        image: existing.image || live.image,
        purity: live.purity || existing.purity,
        categoryLabel: live.categoryLabel || existing.categoryLabel,
        shortDescription: live.shortDescription || existing.shortDescription,
        description: live.description || existing.description,
        storage: live.storage || existing.storage,
        reconstitution: live.reconstitution || existing.reconstitution,
      });
    } else {
      bySlug.set(live.slug, {
        ...live,
        shortDescription: live.shortDescription || `${live.name} for research protocols.`,
        description: live.description || `${live.name}, supplied for laboratory research use only.`,
        storage: live.storage || "Store lyophilized vials at 2–8°C. After reconstitution, use within 30 days and refrigerate.",
      });
    }
  }
  return [...bySlug.values()];
}
