import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/wholesale/dashboard { token } - proxies to the CRM's
// /api/store/wholesale/dashboard, which resolves the Customer from the
// token server-side and returns their wholesale partner status, notification
// settings, and invoice history. Always 200s with a `status` field
// ("NONE" | "PENDING" | "APPROVED") -- a customer who never applied (or
// whose inquiry hasn't been linked to their account yet) is a legitimate
// "NONE" state, not an error. Doesn't exist on the CRM yet - see
// WHOLESALE-PARTNER-PORTAL.md.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ status: "NONE" }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/wholesale/dashboard", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
