import { NextResponse } from "next/server";

export const runtime = "nodejs";

const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? "";

/**
 * POST /api/account/orders { token }
 *
 * Fetches WooCommerce orders for the authenticated customer.
 * The JWT token (from /api/auth/login) is forwarded as a Bearer token
 * to the WP backend, which resolves the customer server-side.
 */
export async function POST(req: Request) {
  if (!WC_URL) {
    return NextResponse.json({ error: "Order history is not configured yet." }, { status: 503 });
  }

  const { token } = await req.json().catch(() => ({}));
  if (!token) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders?customer=me&per_page=50`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => []);
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Order service unavailable." }, { status: 503 });
  }
}
