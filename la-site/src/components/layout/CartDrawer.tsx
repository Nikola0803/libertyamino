"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";
import { ShippingProgressBar, BacWaterOffer, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_COST } from "./CartUpsellOffers";
import { getStoredCouponCode, setStoredCouponCode } from "@/lib/referral";
import { useCouponValidation } from "@/lib/use-coupon-validation";
import { getStoredUser } from "@/lib/auth";
import { getProductImage } from "@/lib/product-images";
import type { Product } from "@/lib/types";
import { trackEvent } from "@/lib/pixel";

export function CartDrawer({ products = [] }: { products?: Product[] }) {
  const { lines, subtotal, isOpen, closeCart, removeLine, setLineQty } = useCart();
  const { formatPrice } = useCurrency();
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState(() => getStoredCouponCode());
  const [promoSaved, setPromoSaved] = useState(false);
  const router = useRouter();

  function handleCheckoutClick() {
    trackEvent("cart_checkout_click", {
      currency: "USD",
      valueCents: Math.round(subtotal * 100),
      item_count: lines.reduce((sum, line) => sum + line.qty, 0),
    });
    closeCart();
    router.push("/checkout");
  }

  const cartItemsForCoupon = lines.map((l) => ({ slug: l.product.slug, quantity: l.qty }));
  // The cart drawer has no email field of its own -- a personal lifetime
  // deal can only auto-preview here for a signed-in account.
  const couponCustomerEmail = getStoredUser()?.email || undefined;
  const coupon = useCouponValidation(promoCode, cartItemsForCoupon, couponCustomerEmail);
  const discount = coupon.valid ? coupon.discountUsd : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  const total = Math.max(0, subtotal - discount + shipping);

  useEffect(() => {
    if (!isOpen) return;
    trackEvent("view_cart", {
      currency: "USD",
      valueCents: Math.round(subtotal * 100),
      items: lines.map((line) => ({
        item_id: line.product.sku,
        item_name: line.product.name,
        quantity: line.qty,
        price: line.unitPrice,
      })),
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart, lines, subtotal]);

  return (
    <>
      <div
        aria-hidden
        onClick={closeCart}
        className={`fixed inset-0 z-[110] bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[120] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-stone px-5 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sage-deep">Secure checkout</p>
            <h2 className="font-display text-lg font-semibold text-charcoal">Your research cart</h2>
          </div>
          <button type="button" onClick={closeCart} aria-label="Close cart" className="flex h-8 w-8 items-center justify-center text-charcoal/60 transition hover:text-charcoal">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {lines.length === 0 ? (
            <p className="mt-10 text-center text-sm text-charcoal/50">Your cart is empty.</p>
          ) : (
            <>
              <ShippingProgressBar />

              <div className="space-y-5">
                {lines.map((line) => (
                  <div key={`${line.product.id}-${line.packLabel}`} className="flex gap-3">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-ivory-soft">
                      <Image src={getProductImage(line.product)} alt={line.product.name} width={120} height={150} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-charcoal">{line.product.name}</p>
                        <button
                          type="button"
                          onClick={() => removeLine(line.product.id, line.packLabel)}
                          aria-label="Remove"
                          className="text-charcoal/40 transition hover:text-charcoal"
                        >
                          <i className="ri-close-line text-sm" />
                        </button>
                      </div>
                      <p className="text-xs text-charcoal/50">{line.qty === 1 ? "1 Vial" : `${line.qty} Pack`}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-md border border-stone px-2 py-1">
                          <button type="button" onClick={() => setLineQty(line.product.id, line.packLabel, line.qty - 1)} className="text-charcoal/60 hover:text-charcoal">
                            <i className="ri-subtract-line text-xs" />
                          </button>
                          <span className="w-4 text-center text-xs font-medium">{line.qty}</span>
                          <button type="button" onClick={() => setLineQty(line.product.id, line.packLabel, line.qty + 1)} className="text-charcoal/60 hover:text-charcoal">
                            <i className="ri-add-line text-xs" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-charcoal">{formatPrice(line.qty * line.unitPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <BacWaterOffer products={products} />
            </>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-stone px-5 py-5">
            {promoOpen ? (
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoSaved(false);
                    }}
                    placeholder="Promo code"
                    className="flex-1 rounded-md border border-stone bg-white px-3 py-2 text-sm text-charcoal outline-none placeholder:text-charcoal/40 focus:border-copper"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setStoredCouponCode(promoCode);
                      setPromoSaved(true);
                    }}
                    className="rounded-md border border-charcoal px-3 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-charcoal hover:text-ivory"
                  >
                    Apply
                  </button>
                </div>
                {coupon.checking && <p className="mt-1.5 text-xs text-charcoal/40">Checking code...</p>}
                {!coupon.checking && coupon.valid && (
                  <p className="mt-1.5 text-xs font-medium text-sage-deep">
                    {promoCode.trim() ? "Code applied" : "Member reward applied"} -- {formatPrice(coupon.discountUsd)} off
                  </p>
                )}
                {!coupon.checking && !coupon.valid && promoSaved && (
                  <p className="mt-1.5 text-xs text-charcoal/40">Saved - will still be checked as a referral code at checkout.</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPromoOpen(true)}
                className="mb-4 text-xs text-charcoal/50 underline decoration-charcoal/30 underline-offset-2 transition hover:text-charcoal"
              >
                Have a promo code? Click here
              </button>
            )}

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-charcoal/60">Subtotal</span>
                <span className="font-medium text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sage-deep">Discount</span>
                  <span className="font-medium text-sage-deep">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-charcoal/60">Shipping</span>
                <span className="font-medium text-charcoal">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
            </div>
            <div className="mb-4 mt-2 flex items-center justify-between border-t border-stone pt-3">
              <span className="text-sm text-charcoal/60">Total</span>
              <span className="font-display text-lg font-semibold text-charcoal">{formatPrice(total)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckoutClick}
              className="w-full rounded-md bg-sage-deep px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-charcoal"
            >
              Continue to Secure Checkout
            </button>
            <Link href="/shop" onClick={closeCart} className="mt-3 block text-center text-xs uppercase tracking-wide text-charcoal/50 transition hover:text-charcoal">
              Continue Shopping
            </Link>
            <p className="mt-4 text-center text-[10px] leading-relaxed text-charcoal/35">
              For laboratory and research use only. Not for human or veterinary use.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
