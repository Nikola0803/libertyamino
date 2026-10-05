import "server-only";

import { crmConfigured } from "./crm-proxy";
import { getLiveProducts, mergeProducts } from "./product-feed";
import { getProducts, withQuantityPricing } from "./products";

// Immediate storefront safety net for SKUs confirmed unavailable in the
// 2026-10-04 Stockroom export. The CRM sync applies the complete sheet, but
// these must remain unpurchasable even while a stale CRM deployment/feed is
// being refreshed.
const CONFIRMED_UNAVAILABLE = new Set([
  "hcg-2000iu",
  "hcg-5000iu",
  "kpv-oral-500mcg",
  "tb-500-20mg",
]);

export async function getCatalogProducts() {
  const liveProducts = await getLiveProducts();

  // Once the CRM is connected it is the only authority for availability.
  // Static product records still supply curated copy and imagery, but a SKU
  // absent from the CRM feed must not remain purchasable from stale bundled
  // inventory or a Google Sheet snapshot.
  if (crmConfigured()) {
    const liveSlugs = new Set(liveProducts.map((product) => product.slug));
    return mergeProducts(getProducts(), liveProducts).map((product) =>
      withQuantityPricing({
        ...product,
        inStock: !CONFIRMED_UNAVAILABLE.has(product.slug) && liveSlugs.has(product.slug) && product.inStock,
      }),
    );
  }

  // Local development can still render the maintained static catalogue when
  // no CRM connection has been configured at all.
  return getProducts().map((product) => withQuantityPricing({
    ...product,
    inStock: !CONFIRMED_UNAVAILABLE.has(product.slug) && product.inStock,
  }));
}
