import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Phase 2: Affiliate payout requests — not available at launch.
export async function POST(_req: Request) {
  return NextResponse.json({ error: "Payout requests are not available yet." }, { status: 503 });
}
