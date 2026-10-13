import { NextResponse } from "next/server";
import { laPost } from "@/lib/woocommerce";

export const runtime = "nodejs";

/**
 * POST /api/newsletter { email, source?, marketingOptIn? }
 *
 * Stores newsletter signup in WooCommerce/WP via the LA plugin endpoint.
 * Consent timestamp is recorded server-side.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  if (!body.email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const { ok, status, data } = await laPost("/newsletter", {
    email: body.email,
    source: body.source ?? "website",
    marketing_opt_in: body.marketingOptIn ?? true,
    consent_timestamp: new Date().toISOString(),
  });

  if (!ok) {
    return NextResponse.json(data ?? { error: "Could not subscribe." }, { status });
  }

  return NextResponse.json({ success: true });
}
