import { NextResponse } from "next/server";
import { wcCreateCustomer } from "@/lib/woocommerce";

export const runtime = "nodejs";

/**
 * POST /api/auth/register { email, password, name?, marketingOptIn? }
 *
 * Creates a WooCommerce customer via the REST API.
 */
export async function POST(req: Request) {
  const { email, password, name, marketingOptIn: _opt } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const [first_name, ...rest] = (name ?? "").trim().split(" ");
  const last_name = rest.join(" ");

  const { ok, status, data } = await wcCreateCustomer({
    email,
    password,
    first_name: first_name || "",
    last_name: last_name || "",
    username: email,
  });

  if (!ok) {
    const d = data as Record<string, unknown>;
    return NextResponse.json({ error: d?.message ?? "Could not create account." }, { status });
  }

  const d = data as Record<string, unknown>;
  return NextResponse.json({
    email,
    username: email,
    user_id: String(d.id ?? ""),
  });
}
