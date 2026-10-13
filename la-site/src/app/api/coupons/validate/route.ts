import { NextResponse } from "next/server";
import { wcGet, isWooCommerceConfigured } from "@/lib/woocommerce";

export const runtime = "nodejs";

interface WcCoupon {
  id: number;
  code: string;
  discount_type: string;
  amount: string;
  minimum_amount: string;
  maximum_amount: string;
  usage_limit: number | null;
  usage_count: number;
  usage_limit_per_user: number | null;
  product_ids: number[];
  excluded_product_ids: number[];
  date_expires: string | null;
}

/**
 * POST /api/coupons/validate { code, items?: [{productId, quantity}] }
 *
 * Validates a coupon code against WooCommerce and returns discount info.
 * WooCommerce enforces all coupon rules (minimum spend, usage limits,
 * product restrictions) at actual order creation time.
 */
export async function POST(req: Request) {
  if (!isWooCommerceConfigured()) {
    return NextResponse.json({ valid: false, discountCents: 0, errors: [{ code: "", reason: "Store not connected" }] });
  }

  const { code } = await req.json().catch(() => ({}));
  if (!code) {
    return NextResponse.json({ valid: false, discountCents: 0, errors: [{ code: "", reason: "No coupon code provided" }] });
  }

  const { ok, data } = await wcGet<WcCoupon[]>(`/wc/v3/coupons?code=${encodeURIComponent(code)}&per_page=1`);
  if (!ok || !Array.isArray(data) || data.length === 0) {
    return NextResponse.json({ valid: false, discountCents: 0, errors: [{ code, reason: "Invalid or expired coupon" }] });
  }

  const coupon = data[0];
  const now = new Date();
  if (coupon.date_expires && new Date(coupon.date_expires) < now) {
    return NextResponse.json({ valid: false, discountCents: 0, errors: [{ code, reason: "Coupon has expired" }] });
  }
  if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
    return NextResponse.json({ valid: false, discountCents: 0, errors: [{ code, reason: "Coupon usage limit reached" }] });
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discount_type,
    amount: coupon.amount,
    minimumAmount: coupon.minimum_amount,
    errors: [],
  });
}
