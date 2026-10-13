import "server-only";

import { getLiveProducts, mergeProducts } from "./product-feed";
import { getProducts, withQuantityPricing } from "./products";

export async function getCatalogProducts() {
  const liveProducts = await getLiveProducts();

  if (liveProducts.length > 0) {
    return mergeProducts(getProducts(), liveProducts).map((product) =>
      withQuantityPricing(product),
    );
  }

  return getProducts().map((product) => withQuantityPricing(product));
}
