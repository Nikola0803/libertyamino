import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/wholesale/settings { token, notificationEmail, businessName? }
// - proxies to the CRM's /api/store/wholesale/settings, saving where an
// approved wholesale partner wants order/invoice notifications sent
// (separate from their login email, in case billing/ops is a different
// inbox than the account owner's). Doesn't exist on the CRM yet - see
// WHOLESALE-PARTNER-PORTAL.md.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Wholesale settings aren't connected yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/wholesale/settings", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
