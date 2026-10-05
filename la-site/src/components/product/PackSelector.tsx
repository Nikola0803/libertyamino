"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { getQuantityUnitPrice, QUANTITY_DISCOUNT_TIERS } from "@/lib/quantity-pricing";

export interface Pack {
  label: string;
  qty: number;
  unitPrice: number;
  totalPrice?: number;
  savePercent?: number;
}

/** EVLV's store-wide quantity ladder. Keep this aligned with the normalized
 * bulk option returned by the catalog so product pages and checkout agree. */
function buildPacks(product: Product): Pack[] {
  if (!product.bulkOption) return [{ label: "1 Vial", qty: 1, unitPrice: product.price }];

  return QUANTITY_DISCOUNT_TIERS.map(({ qty, savePercent }) => {
    if (qty === 1) return { label: "1 Vial", qty: 1, unitPrice: product.price };
    const unitPrice = getQuantityUnitPrice(product.price, qty);
    return { label: `${qty} Pack`, qty, unitPrice, totalPrice: unitPrice * qty, savePercent };
  });
}

export function usePackSelection(product: Product) {
  const packs = buildPacks(product);
  const [packIndex, setPackIndex] = useState(0);
  return { packIndex, setPackIndex, packs, selected: packs[packIndex] };
}

export function PackSelector({
  packs,
  packIndex,
  onSelect,
  formatPrice,
}: {
  packs: Pack[];
  packIndex: number;
  onSelect: (i: number) => void;
  formatPrice: (n: number) => string;
}) {
  if (packs.length < 2) return null;

  return (
    <div className="cp-pack-selector">
      <label>Pack size <span>Choose quantity</span></label>
      <div className="cp-pack-grid">
        {packs.map((pack, i) => {
          const active = packIndex === i;
          return (
            <button
              key={pack.label}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(i)}
              className={`cp-pack-option${active ? " active" : ""}`}
            >
              <div className="cp-pack-heading">
                <span>{pack.label}</span>
                <i aria-hidden="true" className={active ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"} />
              </div>
              {pack.savePercent ? (
                <span className="cp-pack-saving">Save {pack.savePercent}%</span>
              ) : (
                <span className="cp-pack-saving">Standard price</span>
              )}
              <span className="cp-pack-price">
                {formatPrice(pack.unitPrice)}
                <small>/vial</small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
