import { NextResponse } from "next/server";
import { laPost } from "@/lib/woocommerce";

export const runtime = "nodejs";

/**
 * POST /api/contact { name, email, subject, message, phone? }
 *
 * Submits the contact form to the WP backend, which emails the LA inbox
 * and stores consent with a timestamp.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  if (!body.email || !body.message) {
    return NextResponse.json({ error: "Email and message are required." }, { status: 400 });
  }

  const { ok, status, data } = await laPost("/contact", {
    name: body.name,
    email: body.email,
    subject: body.subject ?? "Contact Form",
    message: body.message,
    phone: body.phone ?? "",
    consent_timestamp: new Date().toISOString(),
  });

  if (!ok) {
    return NextResponse.json(data ?? { error: "Could not send message. Please email us directly." }, { status });
  }

  return NextResponse.json({ success: true });
}
