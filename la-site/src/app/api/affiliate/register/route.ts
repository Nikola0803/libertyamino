import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/affiliate/register { token, referredBy?, socialLink, phone, address,
// postalCode, city, province, country } - applies for affiliate status on the
// shopper's EXISTING customer account (resolved server-side from `token`, same
// bearer token /api/auth/login already issues). Affiliates are a role on the
// Customer record, not a separate login - see AFFILIATE-PORTAL.md. This CRM
// endpoint doesn't exist yet as of 2026-08 (peptides-crm-app's Affiliate model
// is currently admin-created only). Until then this correctly 503s rather than
// pretending to work.
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ error: "Affiliate signup isn't connected yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await crmFetch("/api/store/affiliate/register", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
