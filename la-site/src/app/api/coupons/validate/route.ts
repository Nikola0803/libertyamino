import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/coupons/validate - proxies to the CRM's own
// /api/store/coupons/validate: a dry-run preview of exactly what a coupon
// code would discount, using the same resolveCoupons()/evaluateCoupons()
// logic runCheckout() uses for the real order (including the wholesale-
// margin floor), so the number shown here is never wrong at checkout.
// Body: { items: [{slug, quantity}], code }.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ valid: false, discountCents: 0, errors: [{ code: "", reason: "Store not connected" }] });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/coupons/validate", body);
  // The CRM is authoritative because it knows whether this customer is an
  // approved wholesale partner (40% ceiling) or retail (30% ceiling), and
  // applies the same calculation again when the order is actually created.
  return NextResponse.json(data, { status: ok ? 200 : status });
}
