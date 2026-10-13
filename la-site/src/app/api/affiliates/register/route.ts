import { NextResponse } from "next/server";

/**
 * Stub route for affiliate registration.
 * TODO: Wire up to la-wp /la/v1/affiliates once the WP backend is live.
 */
export async function POST() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
