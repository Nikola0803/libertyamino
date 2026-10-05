import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/heroes-discount/request { name, email, status, branch, proofFileName,
// proofFileType, proofFileDataUrl } - proxies to the CRM's
// /api/store/heroes-discount/request. Manually reviewed, like the affiliate
// program: reviewer checks the attached proof of service (ID/DD-214/badge
// photo, sent as a data URL) before approving. On approval the CRM issues a
// personal, single-use 20%-off Coupon (PERCENT, amount: 20) and emails the
// code - reuses the same Coupon model checkout already validates against,
// no new discount mechanism needed. Non-stackable is inherent: checkout
// only ever reads one couponCode field, so this can never combine with
// another code. Doesn't exist on the CRM yet - needs a Coupon row created
// per approved request, storage for the proof-of-service upload (the data
// URL is a few MB at most given the 8MB client-side cap; store it as a
// file/blob, not inline in a row), plus the same "no transactional email"
// gap flagged in REFERRAL-PROGRAM.md / AFFILIATE-PORTAL.md.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "This program isn't connected yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/heroes-discount/request", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
