import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/affiliate/click { code } - proxies to the CRM's
// /api/store/affiliate/click, a fire-and-forget counter. Public, no auth
// beyond the usual store header pair the proxy already attaches.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/affiliate/click", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
