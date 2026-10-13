import { NextResponse } from "next/server";

export const runtime = "nodejs";

const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? "";

/**
 * POST /api/auth/validate { token }
 * Validates a JWT token against the WP JWT plugin.
 * Returns { valid, email?, username?, user_id? }.
 */
export async function POST(req: Request) {
  if (!WC_URL) return NextResponse.json({ valid: false });

  const { token } = await req.json().catch(() => ({}));
  if (!token) return NextResponse.json({ valid: false });

  try {
    const res = await fetch(`${WC_URL}/wp-json/jwt-auth/v1/token/validate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    const valid = res.ok && (data?.code === "jwt_auth_valid_token" || data?.data?.status === 200);
    return NextResponse.json({ valid });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
