import type { Product } from "./types";

/**
 * The homepage's "Featured products" carousel is scraped static HTML
 * (landing-content.json, see page.tsx's big doc comment) with prices
 * hand-typed in at scrape time -- they silently drift from the real,
 * live shop prices whenever a price changes there. This patches each
 * product card's <div class="pprice"> in place with the real current
 * price, so the homepage always matches the shop instead of needing a
 * second manual edit on every price change. Reference prices are not
 * manufactured here; promotional savings must come from a real coupon or
 * quantity tier with explicit terms.
 *
 * Deliberately a targeted regex substitution over the scraped markup
 * rather than a rebuilt template -- every product's badge/description/
 * feature-bullet copy in that HTML is real, reviewed marketing copy that
 * has nothing to do with pricing, and shouldn't be reconstructed from
 * scratch here (or silently dropped) just to fix a number.
 */
function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

// Small pill row for the other doses of a product (5mg/10mg/20mg etc) --
// same reasoning as the identical addition to ProductCard.tsx: without
// this, a visitor has to open the product page just to find out other
// sizes exist. Only the currently-featured size links out; a visitor
// who wants a different dose clicks through, same as the shop grid.
// Renders as plain <span>s, NOT <a> links -- the whole homepage carousel
// card (see applyLiveFeaturedPricing below) is already one big <a
// class="product"> wrapper scraped from the approved mockup. A nested <a>
// inside an <a> is invalid HTML; browsers silently split the outer anchor
// where the inner one starts, which is what was breaking these cards
// (missing price/description/button, or a fragmented empty card) for any
// product with 2+ variants. These pills are indicator-only here -- picking
// a different size still works, just from the /shop grid or the product
// page (both use ProductCard.tsx, which gives each pill its own real
// non-nested link).
function variantPillsHtml(product: Product): string {
  if (!product.variants || product.variants.length < 2) return "";
  const pills = product.variants
    .map((v) => {
      const active = v.slug === product.slug;
      const style = active
        ? "border:1px solid #3E8556;background:#EAF3EC;color:#3E8556;"
        : "border:1px solid #D8D2C4;background:#fff;color:rgba(28,34,36,.55);";
      const disabled = v.inStock ? "" : "opacity:.4;";
      return `<span style="display:inline-block;margin:0 4px 4px 0;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600;${style}${disabled}">${escapeAttr(v.label)}</span>`;
    })
    .join("");
  return `<div style="margin:2px 0 4px">${pills}</div>`;
}

export function applyLiveFeaturedPricing(html: string, products: Product[]): string {
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const withVariants = html.replace(
    /(href="\/shop\/([a-z0-9-]+)"[^>]*class="product"[\s\S]*?<h4>[^<]*<\/h4>)(<ul class="pfeat">)/g,
    (match, prefix, slug, ulOpen) => {
      const product = bySlug.get(slug);
      if (!product) return match;
      return `${prefix}${variantPillsHtml(product)}${ulOpen}`;
    }
  );

  return withVariants.replace(
    /(href="\/shop\/([a-z0-9-]+)"[^>]*class="product"[\s\S]*?<div class="pprice">)<span class="amt">[^<]*<\/span><span class="per"><\/span><\/div>/g,
    (match, prefix, slug) => {
      const product = bySlug.get(slug);
      if (!product) return match; // unknown slug -- leave whatever was scraped alone rather than guess
      return `${prefix}<span class="amt">$${product.price.toFixed(2)}</span><span class="per"></span></div>`;
    }
  );
}
