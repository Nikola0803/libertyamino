import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/giveaway/enter - the free, no-purchase-necessary entry path
// (see peptides-crm-app's /api/store/giveaway/enter for why this has to
// exist). Proxied server-side same as checkout, so the CRM's store API
// key never reaches the browser.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Giveaway isn't connected right now." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/giveaway/enter", { email: body?.email });
  return NextResponse.json(data, { status: ok ? 200 : status });
}
