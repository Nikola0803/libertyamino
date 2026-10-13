import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Account deletion status is handled manually via WP admin at launch.
export async function POST(_req: Request) {
  return NextResponse.json({ status: "PENDING" });
}
