import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Order tracking is temporarily unavailable." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/order-tracking", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
