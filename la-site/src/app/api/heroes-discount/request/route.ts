import { NextResponse } from "next/server";
import { laPost } from "@/lib/woocommerce";

export const runtime = "nodejs";

/**
 * POST /api/heroes-discount/request
 *
 * Submits a Heroes Program application to the WP backend.
 * The LA WP plugin (la/v1/heroes) stores the submission, emails the admin,
 * and — after manual review — issues a personal 15% WC coupon to the applicant.
 * The credential file is deleted from the server after review.
 *
 * Body: {
 *   name, email, status, branch?, serviceNumber?,
 *   proofFileName, proofFileType, proofFileDataUrl,
 *   note?, certify
 * }
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const required = ["name", "email", "status", "proofFileDataUrl", "certify"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const { ok, status, data } = await laPost("/heroes", body);
  return NextResponse.json(data, { status: ok ? 200 : status });
}
