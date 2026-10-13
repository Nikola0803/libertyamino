import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Phase 2: Affiliate dashboard — not available at launch.
export async function POST(_req: Request) {
  return NextResponse.json({ status: "NONE" });
}
