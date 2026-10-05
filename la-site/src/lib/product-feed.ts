import { crmConfigured, crmGet } from "./crm-proxy";
import type { Product } from "./types";

interface FeedVariant {
  slug: string;
  sku: string;
  label: string;
  priceCents: number;
  inStock: boolean;
  coaUrl?: string;
  imageUrl?: string;
  shortDescription?: string;
  description?: string;
  purity?: string;
  categoryLabel?: string;
  storageInstructions?: string;
  reconstitutionInstructions?: string;
}

interface FeedGroup {
  groupSlug: string;
  name: string;
  variants: FeedVariant[];
}

const STANDARD_STORAGE = "Store lyophilized vials at 2–8°C. After reconstitution, use within 30 days and refrigerate.";

// Real supplier products imported into the CRM (see supplier-import.ts on
// the CRM side), fetched live so a dropship partner's price list actually
// shows up on the storefront instead of just sitting in the CRM. Falls
// back to an empty list -- callers merge this into the static demo
// catalog rather than depending on it exclusively, so the shop never goes
// blank if the CRM is unreachable.
export async function getLiveProducts(): Promise<Product[]> {
  if (!crmConfigured()) return [];
  const { ok, data } = await crmGet("/api/store/products", { revalidate: 120 });
  if (!ok || !Array.isArray(data)) return [];

  const products: Product[] = [];
  for (const group of data as FeedGroup[]) {
    const variants = group.variants.map((v) => ({ slug: v.slug, label: v.label, price: v.priceCents / 100, inStock: v.inStock }));
    for (const v of group.variants) {
      products.push({
        id: `crm-${v.sku}`,
        slug: v.slug,
        sku: v.sku,
        name: `${group.name}${group.variants.length > 1 ? ` ${v.label}` : ""}`.toUpperCase(),
        category: "peptides",
        categoryLabel: v.categoryLabel || "Peptide Research",
        // CRM-managed photo/content wins when set (see Product.imageUrl
        // etc. in peptide-saas's schema + the Storefront content card on
        // its product page) -- mergeProducts() also keeps the static
        // catalog's own photo as a fallback for a matching slug when the
        // CRM hasn't been given a photo yet. A genuinely new (no static
        // counterpart) live product with no CRM photo either falls back
        // to ProductVisual's SVG placeholder, same as any other
        // unphotographed SKU.
        image: v.imageUrl,
        price: v.priceCents / 100,
        purity: v.purity,
        rating: 0,
        reviewCount: 0,
        inStock: v.inStock,
        // Left empty (not defaulted here) when the CRM hasn't been given
        // real content yet -- mergeProducts() only overlays these onto a
        // matching static product when they're actually non-empty, and
        // fills the generic fallback text itself for a genuinely new,
        // static-catalog-less product that still has none set.
        shortDescription: v.shortDescription ?? "",
        description: v.description ?? "",
        storage: v.storageInstructions ?? "",
        reconstitution: v.reconstitutionInstructions,
        variants: group.variants.length > 1 ? variants : undefined,
      });
    }
  }
  return products;
}

// Merges the live CRM feed into the static demo catalog. CRM storefront
// content wins when it is populated, while the owner's inventory snapshot
// is applied last so sheet price, SKU and availability remain authoritative.
// A live product still contributes its variants and any storefront content
// (photo, purity, descriptions, storage/recon copy, category) the CRM has
// actually been given (see Product.imageUrl etc. in peptide-saas's schema
// and the Storefront content card on its product page), field by field:
// a field the CRM hasn't filled in yet just falls through to the static
// entry's own value instead of overwriting it with something blank. A
// live product with no static counterpart is appended as-is, generating
// generic fallback text for any content field the CRM also left blank
// (Product's shortDescription/description/storage are required strings).
// Slugs whose photo is a real, curated product shot that must never be
// swapped out by whatever the CRM happens to have on file for the
// matching live SKU -- came up when EVLV-1/2/3's real inventory turned
// out to be duplicated in the CRM under a different (supplier-codename)
// listing, "GP-1/2/3", that needed its slugs renamed to merge into these
// exact rows. Renaming the slug is what makes the live price/stock flow
// in; this is what stops that same merge from also silently swapping the
// real product photo for whatever generic/placeholder image the GP
// listing happens to have.
//
// Every product in the static catalog now has a real EVLV-branded shot
// (see products.ts), so this is just the full slug list -- a curated
// photo should never lose to a live SKU's own (often blank or generic)
// imageUrl. Add new slugs here as soon as they're given a real photo.
const PHOTO_LOCKED_SLUGS = new Set([
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
  "bpc-157-5mg",
  "bpc-157-10mg",
  "bpc-157-20mg",
  "tb-500-5mg",
  "tb-500-10mg",
  "tb-500-20mg",
  "bpc-tb-500-blend-10mg",
  "bpc-tb-500-blend-20mg",
  "tesamorelin-10mg",
  "tesamorelin-20mg",
  "ghk-cu-50mg",
  "mots-c-10mg",
  "mots-c-40mg",
  "thymosin-alpha-1-5mg",
  "glow-70mg",
  "klow-80mg",
  "selank-10mg",
  "semax-10mg",
  "cjc-ipa-blend-10mg",
  "cjc-ipa-blend-20mg",
  "aod-9604-10mg",
  "cartalax-20mg",
  "igf-1-lr3-1mg",
  "kpv-10mg",
  "kpv-oral-500mcg",
  "hcg-5000iu",
  "melanotan-ii-10mg",
  "nad-500mg",
  "korean-pink-glutathione-1200mg",
  "oxytocin-10mg",
  "pt-141-10mg",
  "ss-31-10mg",
]);

export function mergeProducts(staticProducts: Product[], liveProducts: Product[], preserveStaticStock = false): Product[] {
  if (liveProducts.length === 0) return staticProducts;
  const bySlug = new Map(staticProducts.map((p) => [p.slug, p]));
  for (const live of liveProducts) {
    const existing = bySlug.get(live.slug);
    if (existing) {
      bySlug.set(live.slug, {
        ...existing,
        price: live.price,
        inStock: preserveStaticStock ? existing.inStock : live.inStock,
        sku: live.sku,
        variants: preserveStaticStock
          ? (live.variants ?? existing.variants)?.map((variant) => ({
              ...variant,
              inStock: existing.variants?.find((item) => item.slug === variant.slug)?.inStock ?? variant.inStock,
            }))
          : live.variants,
        image: PHOTO_LOCKED_SLUGS.has(existing.slug) ? existing.image : live.image || existing.image,
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
        storage: live.storage || STANDARD_STORAGE,
      });
    }
  }
  return [...bySlug.values()];
}
