import { NextResponse } from "next/server";

export const runtime = "nodejs";

const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? "";

/**
 * POST /api/auth/login { email, password }
 *
 * Authenticates against WooCommerce via the WP JWT auth plugin
 * (POST /wp-json/jwt-auth/v1/token) or application passwords.
 * Returns { token, email, username, user_id } on success.
 */
export async function POST(req: Request) {
  if (!WC_URL) {
    return NextResponse.json({ error: "Sign-in is not configured. Set NEXT_PUBLIC_WC_URL." }, { status: 503 });
  }

  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const res = await fetch(`${WC_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: data?.message ?? "Invalid credentials." }, { status: 401 });
    }
    return NextResponse.json({
      token: data.token,
      email: data.user_email ?? email,
      username: data.user_display_name ?? email,
      user_id: String(data.user_id ?? ""),
    });
  } catch {
    return NextResponse.json({ error: "Authentication service unavailable." }, { status: 503 });
  }
}
