"use client";

import { useEffect, useRef, useState } from "react";

export interface CouponValidation {
  checking: boolean;
  valid: boolean;
  // Converted to USD dollars already -- every other amount in this app
  // (cart subtotal, product.price, formatPrice) is a plain USD float, but
  // the CRM's coupon engine works in integer cents, so this hook is the
  // one place that does the /100 conversion.
  discountUsd: number;
  errors: { code: string; reason: string }[];
  flooredByMargin: boolean;
}

const EMPTY: CouponValidation = { checking: false, valid: false, discountUsd: 0, errors: [], flooredByMargin: false };

/**
 * Debounced call to /api/coupons/validate (proxied through to the CRM's
 * /api/store/coupons/validate). Silent -- not an error state -- when the
 * code is blank or doesn't match a real discount coupon: it may still be a
 * valid Affiliate referral code, which this endpoint knows nothing about
 * and never blocks checkout over.
 *
 * customerEmail, when known (a logged-in account, or already typed at
 * checkout), lets a personal/lifetime-deal coupon (assigned to that one
 * customer -- see the CRM's Coupon.assignedContactId) auto-apply with
 * zero code entry: the CRM merges it in automatically, so this hook
 * still runs the validate call even when `code` is blank, as long as
 * an email is known.
 */
export function useCouponValidation(
  code: string,
  items: { slug: string; quantity: number }[],
  customerEmail?: string
): CouponValidation {
  const [result, setResult] = useState<CouponValidation>(EMPTY);
  const requestId = useRef(0);
  const itemsKey = JSON.stringify(items);

  useEffect(() => {
    const trimmed = code.trim();
    const email = customerEmail?.trim();
    // Nothing to check unless there's either a typed code or a known
    // customer who might have a personal deal waiting.
    if ((!trimmed && !email) || items.length === 0) {
      setResult(EMPTY);
      return;
    }

    const id = ++requestId.current;
    setResult((prev) => ({ ...prev, checking: true }));

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, code: trimmed || undefined, customerEmail: email || undefined }),
        });
        if (id !== requestId.current) return; // a newer request already superseded this one
        if (!res.ok) {
          setResult(EMPTY);
          return;
        }
        const data = await res.json();
        const discountCents = typeof data.discountCents === "number" ? data.discountCents : 0;
        setResult({
          checking: false,
          valid: Boolean(data.valid) && discountCents > 0,
          discountUsd: discountCents / 100,
          errors: Array.isArray(data.errors) ? data.errors : [],
          flooredByMargin: Boolean(data.flooredByMargin),
        });
      } catch {
        if (id === requestId.current) setResult(EMPTY);
      }
    }, 500);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, itemsKey, customerEmail]);

  return result;
}
