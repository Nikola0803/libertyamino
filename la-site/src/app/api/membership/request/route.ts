import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/membership/request { token } - requests Member access on the
// shopper's EXISTING customer account (resolved server-side from `token`).
// Manually reviewed before it unlocks member-exclusive blends (Wolverine
// Stack, GLOW, KLOW) -- see MEMBERSHIP.md.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Membership requests aren't connected yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/membership/request", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
