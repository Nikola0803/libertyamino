import { getProductBySlug, getProducts } from "./products";
import type { Product } from "./types";

/** Groupings for the Shop mega-menu, by pharmacological/compound class (not by personal research goal). Every curated static SKU appears exactly once. */
const GROUPS: { slug: string; label: string; slugs: string[] }[] = [
  {
    slug: "Synthetic-Structural-Peptides",
    label: "Synthetic Structural Peptides",
    slugs: [
      "bpc-157-5mg",
      "bpc-157-10mg",
      "bpc-157-20mg",
      "tb-500-5mg",
      "tb-500-10mg",
      "tb-500-20mg",
      "bpc-tb-500-blend-10mg",
      "bpc-tb-500-blend-20mg",
      "thymosin-alpha-1-5mg",
    ],
  },
  {
    slug: "Metabolic-Assay-Peptides",
    label: "Metabolic Assay Peptides",
    slugs: [
      "evlv-3-10mg",
      "evlv-3-15mg",
      "evlv-3-30mg",
      "evlv-3-60mg",
      "evlv-1-5mg",
      "evlv-1-10mg",
      "evlv-2-10mg",
      "evlv-2-15mg",
      "evlv-2-30mg",
      "evlv-2-60mg",
    ],
  },
  {
    slug: "Secretagogue-Class-Peptides",
    label: "Secretagogue-Class Peptides",
    slugs: ["tesamorelin-10mg", "tesamorelin-20mg", "cjc-ipa-blend-10mg", "cjc-ipa-blend-20mg"],
  },
  {
    slug: "Copper-Metallopeptides",
    label: "Copper & Metallopeptides",
    slugs: ["ghk-cu-50mg", "mots-c-10mg", "mots-c-40mg", "ss-31-10mg", "nad-500mg", "glow-70mg", "klow-80mg"],
  },
  {
    slug: "Neuropeptide-Class",
    label: "Neuropeptide Class",
    slugs: ["selank-10mg", "semax-10mg"],
  },
  {
    slug: "Specialty-Research-Peptides",
    label: "Specialty Research Peptides",
    slugs: [
      "pt-141-10mg",
      "melanotan-ii-10mg",
      "oxytocin-10mg",
      "aod-9604-10mg",
      "cartalax-20mg",
      "igf-1-lr3-1mg",
      "kpv-10mg",
    ],
  },
];

export interface ShopMenuGroup {
  slug: string;
  label: string;
  products: Product[];
}

/**
 * Builds the mega-menu groups. Pass the CRM-merged catalog (see
 * mergeProducts(getProducts(), await getLiveProducts()) in product-feed.ts)
 * so a live SKU the CRM adds shows up here too, not just on /shop -- the
 * menu and the shop grid read the same list, they just group it differently.
 * Falls back to the static catalog when no list is supplied (existing
 * callers keep working unchanged).
 *
 * Any product in `products` whose slug isn't in one of the curated GROUPS
 * (e.g. a brand-new CRM SKU that hasn't been assigned a focus area yet)
 * lands in "New & Other" rather than silently vanishing from the menu.
 */
export function getShopMenuGroups(products?: Product[]): ShopMenuGroup[] {
  const bySlug = new Map((products ?? getProducts()).map((p) => [p.slug, p]));

  const curated = GROUPS.map((g) => ({
    slug: g.slug,
    label: g.label,
    products: g.slugs
      .map((slug) => bySlug.get(slug) ?? getProductBySlug(slug))
      .filter((p): p is Product => Boolean(p)),
  }));

  const claimedSlugs = new Set(GROUPS.flatMap((g) => g.slugs));
  const leftover = [...bySlug.values()].filter((p) => !claimedSlugs.has(p.slug));

  const groups =
    leftover.length > 0
      ? [...curated, { slug: "New-Other-Compounds", label: "New & Other Compounds", products: leftover }]
      : curated;

  return groups.filter((g) => g.products.length > 0);
}

/** One representative product per top-level shop category, used for the
 * mega-menu's big image tiles. Picks the first in-stock match from the
 * supplied (CRM-merged) list, falling back to the static catalog. */
export function getCategoryTileProduct(category: Product["category"], products?: Product[]): Product | undefined {
  const list = products ?? getProducts();
  return list.find((p) => p.category === category && p.image) ?? list.find((p) => p.category === category);
}
