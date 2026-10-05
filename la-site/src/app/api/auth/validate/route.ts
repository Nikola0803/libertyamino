import { NextResponse } from "next/server";
import { crmConfigured, crmFetch } from "@/lib/crm-proxy";

export const runtime = "nodejs";

// POST /api/auth/validate { token } -> { valid, email?, username?, user_id? }
export async function POST(req: Request) {
  if (!crmConfigured()) {
    return NextResponse.json({ valid: false });
  }
  const body = await req.json().catch(() => ({}));
  const { data } = await crmFetch("/api/auth/validate", body);
  return NextResponse.json(data);
}
