import { NextResponse } from "next/server";
import { wcGet, isWooCommerceConfigured } from "@/lib/woocommerce";

export const runtime = "nodejs";

/**
 * POST /api/order-tracking { orderNumber, email }
 *
 * Looks up a WooCommerce order by order number and billing email.
 * Returns status and carrier tracking info only.
 */
export async function POST(req: Request) {
  if (!isWooCommerceConfigured()) {
    return NextResponse.json({ error: "Order tracking is temporarily unavailable." }, { status: 503 });
  }

  const { orderNumber, email } = await req.json().catch(() => ({}));
  if (!orderNumber || !email) {
    return NextResponse.json({ error: "Order number and email are required." }, { status: 400 });
  }

  const { ok, data } = await wcGet<unknown[]>(`/wc/v3/orders?number=${encodeURIComponent(orderNumber)}&per_page=1`);
  if (!ok || !Array.isArray(data) || data.length === 0) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const order = data[0] as Record<string, unknown>;
  const billingEmail = (order.billing as Record<string, unknown>)?.email;
  if (typeof billingEmail !== "string" || billingEmail.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const meta = Array.isArray(order.meta_data) ? order.meta_data as Array<{ key: string; value: string }> : [];
  const trackingNumber = meta.find((m) => m.key === "_tracking_number")?.value ?? null;
  const trackingCarrier = meta.find((m) => m.key === "_tracking_carrier")?.value ?? null;
  const trackingUrl = meta.find((m) => m.key === "_tracking_url")?.value ?? null;

  return NextResponse.json({
    orderNumber,
    status: order.status,
    tracking: trackingNumber ? { number: trackingNumber, carrier: trackingCarrier, url: trackingUrl } : null,
  });
}
