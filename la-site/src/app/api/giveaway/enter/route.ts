import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Not used in Liberty Aminos.
export async function POST(_req: Request) {
  return NextResponse.json({ error: "Giveaways are not available." }, { status: 503 });
}
