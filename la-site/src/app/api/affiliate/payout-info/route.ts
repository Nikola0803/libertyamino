import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/affiliate/payout-info { token, payoutMethod, payoutDestination?, bankAccountHolder?,
// bankRoutingNumber?, bankAccountNumber?, bankAccountType? } - proxies to the CRM's
// /api/store/affiliate/payout-info, which resolves the affiliate from the token
// server-side and saves how they want to be paid. Doesn't exist on the CRM
// yet - see AFFILIATE-PORTAL.md.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Payout settings aren't connected yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/affiliate/payout-info", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
