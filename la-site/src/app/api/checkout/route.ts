import { NextResponse } from "next/server";
import { storePost, fetchStoreNonce, isWooCommerceConfigured } from "@/lib/woocommerce";

export const runtime = "nodejs";

/**
 * POST /api/checkout
 *
 * Proxies checkout to the WooCommerce Store API (/wc/store/v1/checkout).
 * Orders are created as real WC line items on-hold; the WP plugin
 * auto-cancels unpaid orders after 2 hours and releases reserved stock.
 *
 * Expected body:
 * {
 *   billing_address: { first_name, last_name, address_1, city, state, postcode, country, email, phone },
 *   payment_method: "cashapp" | "zelle" | "venmo" | "btc" | "usdc" | "usdt",
 *   coupon_code?: string,
 *   customer_note?: string,
 * }
 *
 * The cart must already be populated via the Store API before calling this.
 */
export async function POST(req: Request) {
  if (!isWooCommerceConfigured()) {
    return NextResponse.json({ error: "Checkout is not configured yet. Set NEXT_PUBLIC_WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET." }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const nonce = await fetchStoreNonce();
  if (!nonce) {
    return NextResponse.json({ error: "Could not initialize checkout session. Please try again." }, { status: 502 });
  }

  const { ok, status, data } = await storePost(
    "/checkout",
    {
      billing_address: body.billing_address,
      shipping_address: body.shipping_address ?? body.billing_address,
      payment_method: body.payment_method ?? "cod",
      additional_fields: {
        payment_method_la: body.payment_method,
      },
      customer_note: body.customer_note ?? "",
      coupon_lines: body.coupon_code
        ? [{ code: body.coupon_code }]
        : undefined,
    },
    nonce,
  );

  return NextResponse.json(data, { status: ok ? 200 : status });
}
