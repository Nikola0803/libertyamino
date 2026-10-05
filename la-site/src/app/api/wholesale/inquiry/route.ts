import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/wholesale/inquiry { companyName, contactName, email, phone, website?,
// monthlyVolume, message? } - proxies to the CRM's /api/store/wholesale/inquiry.
// This is a B2B lead form, not a self-serve signup -- every inquiry is meant to
// be reviewed and followed up manually (sales conversation, not automated
// onboarding), so the CRM side just needs to land these somewhere visible
// (e.g. a Lead/Inquiry table, or route into the existing SupportTicket
// inbox with a distinct channel) rather than a full workflow. Doesn't exist
// on the CRM yet.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Wholesale inquiries aren't connected yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/wholesale/inquiry", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
