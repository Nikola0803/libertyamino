"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";
import { getProductBySlug, getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import { getProductImage } from "@/lib/product-images";

const BAC_WATER_SLUG = "bac-water";
const FEATURED_SLUG = "bpc-157-10mg";
const FEATURED_DISCOUNT_PERCENT = 25;
const FEATURED_PACK_LABEL = `1 PCS (${FEATURED_DISCOUNT_PERCENT}% Off Offer)`;

const ALSO_ADD_DISCOUNT_PERCENT = 10;
const ALSO_ADD_PACK_LABEL = `1 PCS (${ALSO_ADD_DISCOUNT_PERCENT}% Off Offer)`;

export const FREE_SHIPPING_THRESHOLD = 300;
export const FLAT_SHIPPING_COST = 15;

function ProductThumb({ product, className = "" }: { product: Product; className?: string }) {
  const imgSrc = getProductImage(product);
  return (
    <div className={`shrink-0 overflow-hidden rounded-md bg-navy-light ${className}`}>
      {imgSrc ? (
        <Image src={imgSrc} alt={product.name} width={90} height={112} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(160deg,#0a1840 0%,#0e2153 100%)" }}>
          <i className="ri-flask-line" style={{ fontSize: 20, color: "rgba(255,255,255,0.3)" }} />
        </div>
      )}
    </div>
  );
}

export function ShippingProgressBar() {
  const { subtotal } = useCart();
  const { formatPrice } = useCurrency();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = remaining === 0;

  return (
    <div
      className={`mb-5 rounded-lg border p-4 shadow-sm ${
        unlocked ? "border-navy/40 bg-navy/[0.07]" : "border-navy/30 bg-white"
      }`}
    >
      <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
        <i className={`text-sm ${unlocked ? "ri-checkbox-circle-fill text-navy" : "ri-truck-line text-navy"}`} />
        {unlocked ? "You've unlocked free shipping!" : `Spend ${formatPrice(remaining)} more for free shipping!`}
      </p>
      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-navy transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function BacWaterOffer({ products = [] }: { products?: Product[] }) {
  const { lines, addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const product = products.find((item) => item.slug === BAC_WATER_SLUG) ?? getProductBySlug(BAC_WATER_SLUG);

  const alreadyInCart = lines.some((l) => l.product.slug === BAC_WATER_SLUG);
  const needsIt = lines.some((l) => Boolean(l.product.reconstitution));
  if (alreadyInCart || !needsIt || !product) return null;

  return (
    <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface p-4">
      <p className="text-sm font-medium text-ink">Add Bacteriostatic Water — {formatPrice(product.price)}</p>
      <button
        type="button"
        onClick={() => addToCart(product, 1, product.price, "1 PCS")}
        className="shrink-0 rounded-md border border-navy px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
      >
        Add
      </button>
    </div>
  );
}

export function FeaturedOfferCard() {
  const { lines, addToCart, removeLine } = useCart();
  const { formatPrice } = useCurrency();
  const product = getProductBySlug(FEATURED_SLUG);
  if (!product) return null;

  const checked = lines.some((l) => l.product.id === product.id && l.packLabel === FEATURED_PACK_LABEL);
  const alreadyInCartElsewhere = lines.some((l) => l.product.id === product.id && l.packLabel !== FEATURED_PACK_LABEL);
  if (alreadyInCartElsewhere) return null;

  const discountedPrice = product.price * (1 - FEATURED_DISCOUNT_PERCENT / 100);

  function toggle() {
    if (!product) return;
    if (checked) {
      removeLine(product.id, FEATURED_PACK_LABEL);
    } else {
      addToCart(product, 1, discountedPrice, FEATURED_PACK_LABEL);
    }
  }

  return (
    <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-navy/20 bg-navy/[0.03] p-4">
      <input type="checkbox" checked={checked} onChange={toggle} className="mt-1 h-4 w-4 shrink-0 accent-navy" />
      <ProductThumb product={product} className="h-14 w-11" />
      <div className="flex-1">
        <p className="text-sm font-medium text-ink">
          Add {product.name} ({FEATURED_DISCOUNT_PERCENT}% off today only)
        </p>
        <p className="mt-0.5 text-xs text-muted">Pairs well with what&apos;s in your cart.</p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-xs text-muted line-through">{formatPrice(product.price)}</span>
          <span className="text-sm font-semibold text-navy">{formatPrice(discountedPrice)}</span>
        </div>
      </div>
    </label>
  );
}

export function ResearchersAlsoAdd() {
  const { lines, addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const inCartIds = new Set(lines.map((l) => l.product.id));
  const items = getProducts()
    .filter((p) => !inCartIds.has(p.id) && p.slug !== FEATURED_SLUG && p.inStock)
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <div className="mt-6 border-t border-border-subtle pt-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Researchers Also Add</p>
      <div className="space-y-3">
        {items.map((p) => {
          const discountedPrice = p.price * (1 - ALSO_ADD_DISCOUNT_PERCENT / 100);
          return (
            <div key={p.id} className="flex items-center gap-3">
              <ProductThumb product={p} className="h-14 w-11" />
              <div className="flex-1">
                <p className="text-xs font-medium text-ink">{p.name}</p>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-[11px] text-muted line-through">{formatPrice(p.price)}</span>
                  <span className="text-xs font-semibold text-ink">{formatPrice(discountedPrice)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => addToCart(p, 1, discountedPrice, ALSO_ADD_PACK_LABEL)}
                className="rounded-md bg-navy px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white transition hover:bg-navy-dark"
              >
                Add {ALSO_ADD_DISCOUNT_PERCENT}% Off
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
