import { NextResponse } from "next/server";
import { laPost } from "@/lib/woocommerce";

export const runtime = "nodejs";

/**
 * POST /api/wholesale/inquiry
 *
 * Sends a wholesale/B2B inquiry to the WP backend.
 * Admin reviews and follows up manually.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  if (!body.email || !body.name) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const { ok, status, data } = await laPost("/wholesale-inquiry", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
