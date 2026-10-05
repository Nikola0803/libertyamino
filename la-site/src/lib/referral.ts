"use client";

/**
 * Two related but distinct pieces of state:
 *
 * 1. Auto-captured affiliate referral: ?ref=CODE on any landing URL gets
 *    remembered for 30 days so an affiliate's link still attributes the
 *    sale even if the visitor browses around before buying.
 * 2. An explicitly-applied coupon/promo code: whatever the shopper actually
 *    typed into the cart drawer or checkout field. Doesn't expire, and
 *    isn't silently overwritten by a stray ?ref= on a later page view.
 *
 * Both ultimately feed the same couponCode/affiliateRef fields on checkout
 * - the CRM's order-engine.ts already matches either against Affiliate
 * records end-to-end; the missing piece was ever collecting one from the
 * storefront in the first place.
 */
const REF_KEY = "evlv_ref_code";
const REF_EXPIRES_KEY = "evlv_ref_expires";
const REF_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CODE_KEY = "evlv_coupon_code";

export function captureReferralFromUrl() {
  if (typeof window === "undefined") return;
  const ref = new URLSearchParams(window.location.search).get("ref");
  if (!ref) return;
  const code = ref.trim().toUpperCase();
  try {
    localStorage.setItem(REF_KEY, code);
    localStorage.setItem(REF_EXPIRES_KEY, String(Date.now() + REF_TTL_MS));
  } catch {
    /* localStorage unavailable -- referral just won't be remembered */
  }

  // Best-effort affiliate click counter -- most ?ref= codes will be
  // customer referral codes, not affiliate ones (the CRM route no-ops if
  // the code doesn't match an Affiliate). Never block on this.
  fetch("/api/affiliate/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  }).catch(() => {});
}

export function getStoredReferralCode(): string {
  if (typeof window === "undefined") return "";
  try {
    const expires = Number(localStorage.getItem(REF_EXPIRES_KEY) ?? 0);
    if (!expires || Date.now() > expires) return "";
    return localStorage.getItem(REF_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Whatever code the shopper is actually using at checkout: an explicitly
 * applied coupon/promo code if they entered one, else the auto-captured
 * referral (if not expired). */
export function getStoredCouponCode(): string {
  if (typeof window === "undefined") return "";
  try {
    const explicit = localStorage.getItem(CODE_KEY);
    if (explicit) return explicit;
  } catch {
    /* ignore */
  }
  return getStoredReferralCode();
}

export function setStoredCouponCode(code: string) {
  if (typeof window === "undefined") return;
  try {
    if (code.trim()) localStorage.setItem(CODE_KEY, code.trim().toUpperCase());
    else localStorage.removeItem(CODE_KEY);
  } catch {
    /* ignore */
  }
}

export function clearStoredCouponCode() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CODE_KEY);
  } catch {
    /* ignore */
  }
}
