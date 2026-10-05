import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/checkout - proxies to the CRM's /api/store/checkout, which
// places a real order in the same database the CRM dashboard reads from.
// Body must match peptides-crm-app's CheckoutInput shape (lib/order-engine.ts):
// { items: [{slug, quantity}], paymentMethod, paymentMemo, billing: {...}, customerNote? }
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Checkout isn't connected to the CRM yet." }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const items = Array.isArray(body.items) ? body.items : [];
  const discountCode = typeof body.discountCode === "string" ? body.discountCode : undefined;
  const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail : undefined;

  // Fail closed above the tier ceiling returned by the CRM: 30% retail,
  // 40% for an approved wholesale partner. Default to retail if an older
  // CRM deployment does not yet return the tier value.
  const preview = await crmFetch("/api/store/coupons/validate", { items, code: discountCode, customerEmail });
  if (preview.ok) {
    const result = preview.data as Record<string, unknown>;
    const subtotalCents = typeof result.subtotalCents === "number" ? result.subtotalCents : 0;
    const discountCents = typeof result.discountCents === "number" ? result.discountCents : 0;
    const maximumDiscountPercent = result.maximumDiscountPercent === 40 ? 40 : 30;
    if (subtotalCents > 0 && discountCents > Math.floor(subtotalCents * (maximumDiscountPercent / 100))) {
      return NextResponse.json({ error: `This promotion exceeds EVLV's ${maximumDiscountPercent}% maximum discount and cannot be applied.` }, { status: 422 });
    }
  }
  // The CRM sits behind this server, so it can only ever see this
  // server's own IP unless we forward the real one -- used for fraud
  // review (see Order.ipAddress in the CRM), not for anything that blocks
  // checkout.
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;
  const { ok, status, data } = await crmFetch("/api/store/checkout", { ...body, ipAddress, userAgent });
  return NextResponse.json(data, { status: ok ? 200 : status });
}
