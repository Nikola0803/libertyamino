"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";
import { getProductImage } from "@/lib/product-images";

/**
 * Cross-sell: the current product plus up to 2 related items, each its own
 * card (image, category/purity, price) with a checkbox, combining into one
 * total and one add-to-cart. Related-product selection reuses
 * getRelatedProducts (same category) -- there's no real purchase-pattern
 * data to base this on yet, so it's honestly a same-category suggestion,
 * not a fabricated "often bought with" statistic, and every bullet shown
 * (category, purity) is a real field on that product, not invented copy.
 */
export function FrequentlyBoughtTogether({ product, related }: { product: Product; related: Product[] }) {
  const items = [product, ...related.slice(0, 2)];
  const [checked, setChecked] = useState<Set<string>>(new Set(items.map((p) => p.id)));
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  if (items.length < 2) return null;

  function toggle(id: string) {
    if (id === product.id) return; // the current product always stays selected
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selected = items.filter((p) => checked.has(p.id));
  const total = selected.reduce((sum, p) => sum + p.price, 0);

  function addAll() {
    for (const p of selected) addToCart(p, 1, p.price, "1 Vial");
  }

  return (
    <section className="border-t border-stone bg-ivory-soft/60 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <h2 className="mb-2 font-display text-2xl font-semibold text-charcoal md:text-3xl">Frequently bought together</h2>
        <p className="mb-8 text-sm text-charcoal/60">Add related research materials to the same order.</p>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-2.5">
          {items.map((p, i) => {
            const isChecked = checked.has(p.id);
            const isCurrent = p.id === product.id;
            return (
              <div key={p.id} className="flex items-center gap-2.5 sm:flex-1">
                <label
                  className={`relative flex w-full cursor-pointer flex-col rounded-xl border-[1.5px] p-4 transition ${
                    isChecked
                      ? "border-sage-deep bg-white shadow-md"
                      : "border-stone/70 bg-white/40 opacity-55 hover:opacity-80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(p.id)}
                    disabled={isCurrent}
                    className="absolute right-3 top-3 h-4 w-4 accent-sage-deep disabled:opacity-70"
                  />
                  <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-stone bg-white p-3">
                    <Image src={getProductImage(p)} alt={p.name} width={160} height={160} className="h-full w-full object-contain" />
                  </div>
                  <Link href={`/shop/${p.slug}`} className="mt-3 text-sm font-semibold text-charcoal hover:underline">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-xs text-charcoal/60">
                    {p.categoryLabel}
                    {p.purity ? ` -- ${p.purity} purity` : ""}
                  </p>
                  <p className="mt-2 font-display text-base font-semibold text-charcoal">{formatPrice(p.price)}</p>
                  {isCurrent && (
                    <span className="mt-1.5 inline-block w-fit rounded-full bg-sage-deep/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sage-deep">
                      This item
                    </span>
                  )}
                </label>
                {i < items.length - 1 && (
                  <span aria-hidden className="hidden shrink-0 font-display text-2xl font-semibold text-charcoal/25 sm:block">
                    +
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-xl bg-charcoal p-5 sm:flex-row">
          <p className="text-sm text-ivory/70">
            {selected.length} item{selected.length === 1 ? "" : "s"} selected
          </p>
          <div className="flex items-center gap-4">
            <p className="font-display text-xl font-semibold text-ivory">{formatPrice(total)}</p>
            <button
              type="button"
              onClick={addAll}
              disabled={selected.length === 0}
              className="whitespace-nowrap rounded-xl bg-copper px-6 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-copper-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add Selected to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
