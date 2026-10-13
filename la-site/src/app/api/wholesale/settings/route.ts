import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Phase 2: Wholesale settings — not available at launch.
export async function GET(_req: Request) {
  return NextResponse.json({ enabled: false });
}
