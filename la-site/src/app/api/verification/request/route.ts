import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/verification/request { token, institution, role, purpose, phone }
// - applies for researcher/institutional verification on the shopper's
// EXISTING customer account (resolved server-side from `token`, same as
// the affiliate program). Manually reviewed by the team before it unlocks
// restricted product formats (nasal sprays, injector pens). Doesn't exist
// on the CRM yet - see RESEARCHER-VERIFICATION.md.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Verification requests aren't connected yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/verification/request", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
