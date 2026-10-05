/**
 * Placeholder for the future headless WooCommerce connection.
 *
 * Once the WordPress + WooCommerce site is live, replace the mock reads in
 * lib/products.ts with calls through here. Two supported paths:
 *
 * 1. WooCommerce REST API (simplest, no extra plugin):
 *    GET {WP_URL}/wp-json/wc/v3/products
 *    Auth via consumer key/secret (server-side only, never exposed to the client).
 *
 * 2. WPGraphQL + WooGraphQL (richer querying, better for App Router RSC/ISR):
 *    POST {WP_URL}/graphql
 *
 * Env vars to add when ready (see .env.example):
 *   WORDPRESS_URL=
 *   WOOCOMMERCE_CONSUMER_KEY=
 *   WOOCOMMERCE_CONSUMER_SECRET=
 *
 * The `Product` shape in lib/types.ts was modeled after the WooCommerce
 * product resource (id, slug, sku, price, stock_status, categories,
 * meta_data) specifically so that mapping a real API response onto it is a
 * thin adapter function, not a rewrite of every component that consumes it.
 */

const WORDPRESS_URL = process.env.WORDPRESS_URL;

export function isWooCommerceConfigured() {
  return Boolean(WORDPRESS_URL && process.env.WOOCOMMERCE_CONSUMER_KEY && process.env.WOOCOMMERCE_CONSUMER_SECRET);
}

// TODO: implement once credentials are available.
// export async function fetchWooProducts(): Promise<Product[]> { ... }
// export async function fetchWooProductBySlug(slug: string): Promise<Product | null> { ... }
