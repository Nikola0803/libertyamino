import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Phase 2: Wholesale dashboard — not available at launch.
export async function POST(_req: Request) {
  return NextResponse.json({ status: "NONE" });
}
