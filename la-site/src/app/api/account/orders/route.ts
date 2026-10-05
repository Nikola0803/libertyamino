import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/account/orders { token } - proxies to the CRM's
// /api/store/account/orders, which resolves "whose orders" from the token
// server-side (never trusts a client-supplied customer id/email).
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Order history isn't connected to the CRM yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/account/orders", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
