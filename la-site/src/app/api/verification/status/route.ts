import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/verification/status { token } - proxies to the CRM's
// /api/store/verification/status, which resolves the Customer from the
// token server-side and returns their researcher-verification status.
// Always 200s with { status: "NONE" | "PENDING" | "APPROVED" } - this is
// never a 404/error case, a customer who hasn't applied is a legitimate
// "NONE" state. Doesn't exist on the CRM yet - see RESEARCHER-VERIFICATION.md.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ status: "NONE" }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/verification/status", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
