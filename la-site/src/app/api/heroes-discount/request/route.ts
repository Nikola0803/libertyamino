import { NextResponse } from "next/server";

export const runtime = "nodejs";

// POST /api/heroes-discount/request { name, email, status, branch, proofFileName,
// proofFileType, proofFileDataUrl } — submits to the Liberty Aminos WP backend
// POST ${NEXT_PUBLIC_WC_URL}/wp-json/la/v1/heroes
// If the WP URL is not configured, the request is logged and a 200 placeholder
// is returned so the storefront does not break during development.
export async function POST(req: Request) {
  const wcUrl = process.env.NEXT_PUBLIC_WC_URL;
  if (!wcUrl) {
    console.warn("[heroes-discount] NEXT_PUBLIC_WC_URL is not set — skipping WP submission (placeholder).");
    return NextResponse.json({ ok: true, placeholder: true }, { status: 200 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const upstream = await fetch(`${wcUrl}/wp-json/la/v1/heroes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.ok ? 200 : upstream.status });
  } catch (err) {
    console.error("[heroes-discount] Upstream error:", err);
    return NextResponse.json({ error: "Could not submit application. Please try again." }, { status: 502 });
  }
}
