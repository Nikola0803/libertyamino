import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/affiliate/payout-request { token } - proxies to the CRM's
// /api/store/affiliate/payout-request, which requests payout of the
// affiliate's full available commission balance (resolved server-side from
// the token, amount is never client-supplied). Doesn't exist on the CRM
// yet - see AFFILIATE-PORTAL.md.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Payout requests aren't connected yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/affiliate/payout-request", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
