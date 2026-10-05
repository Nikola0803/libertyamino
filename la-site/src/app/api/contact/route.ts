import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/contact { name, email, subject, message }
 * Proxies to the CRM's /api/forms/submit, which creates a real Conversation
 * (channel: CONTACT_FORM) visible in the CRM's Support inbox. That endpoint
 * authenticates with a per-brand `publicKey` (from TrackingConfig, the same
 * key the tracking pixel uses) rather than the x-store-domain/x-store-api-key
 * pair the rest of this proxy uses -- see peptide-saas's
 * src/app/api/forms/submit/route.ts.
 */
export async function POST(req: Request) {
  const publicKey = process.env.CRM_CONTACT_FORM_KEY;
  if (!process.env.CRM_API_URL || !publicKey) {
    return NextResponse.json({ error: "Contact form isn't connected to the CRM yet." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));

  const res = await fetch(`${process.env.CRM_API_URL}/api/forms/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicKey, ...body }),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}
