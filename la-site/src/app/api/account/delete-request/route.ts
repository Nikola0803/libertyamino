import { NextResponse } from "next/server";
import { laPost } from "@/lib/woocommerce";

export const runtime = "nodejs";

/**
 * POST /api/account/delete-request { token, reason? }
 * Submits an account deletion request to the WP backend.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { ok, status, data } = await laPost("/account/delete-request", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
