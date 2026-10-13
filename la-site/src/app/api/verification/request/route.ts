import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Not used in Liberty Aminos at launch.
export async function POST(_req: Request) {
  return NextResponse.json({ error: "Researcher verification is not available." }, { status: 503 });
}
