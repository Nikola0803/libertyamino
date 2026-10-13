import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Phase 2: Affiliate click tracking — not available at launch.
export async function POST(_req: Request) {
  return NextResponse.json({ tracked: false });
}
