import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Phase 2: Affiliate payout settings — not available at launch.
export async function POST(_req: Request) {
  return NextResponse.json({ error: "Affiliate payout settings are not available yet." }, { status: 503 });
}
