import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/account/delete-request-status { token } -- proxies to the
// CRM's /api/store/account/delete-request-status. Mirrors /api/verification/status.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ status: "NONE" }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/account/delete-request-status", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
