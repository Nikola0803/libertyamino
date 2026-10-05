import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/membership/status { token } - proxies to the CRM's
// /api/store/membership/status, which resolves the Contact from the token
// server-side and returns their real, manually-reviewed Membership status.
// Mirrors /api/verification/status exactly (see MEMBERSHIP.md).
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ status: "NONE" }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/membership/status", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
