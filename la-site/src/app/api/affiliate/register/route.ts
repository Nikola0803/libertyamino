import { NextResponse } from "next/server";
import { laPost } from "@/lib/woocommerce";

export const runtime = "nodejs";

/**
 * POST /api/affiliate/register
 *
 * Submits an affiliate application to the WP backend (/la/v1/affiliates).
 * The LA WP plugin stores the application and emails the admin for review.
 *
 * Body: { name, email, socialLink, phone, address, postalCode, city, country, note? }
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  if (!body.email || !body.name) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const { ok, status, data } = await laPost("/affiliates", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
