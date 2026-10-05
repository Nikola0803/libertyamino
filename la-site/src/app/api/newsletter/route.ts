import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/newsletter { email } - proxies to the CRM's /api/store/newsletter,
// which saves to the CRM's own Contact table (always) and pushes to
// Mailchimp best-effort.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Newsletter signup isn't connected to the CRM yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/newsletter", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
