import "server-only";

/**
 * Shared config/helper for proxying to the custom CRM (peptides-crm-app).
 * CRM_API_URL / CRM_ORG_API_KEY / CRM_STORE_DOMAIN are server-only env vars
 * (no NEXT_PUBLIC_ prefix) so the API key never reaches the browser. The
 * CRM's getStoreContext() resolves this brand via the x-store-domain +
 * x-store-api-key header pair (see peptides-crm-app/src/lib/store-context.ts)
 * since a cross-origin call here won't carry evlvpeptides.com as its Host
 * header the way a same-domain request would.
 */
export function crmConfigured() {
  return Boolean(process.env.CRM_API_URL && process.env.CRM_ORG_API_KEY && process.env.CRM_STORE_DOMAIN);
}

export async function crmFetch(path: string, body: unknown) {
  const res = await fetch(`${process.env.CRM_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-store-domain": process.env.CRM_STORE_DOMAIN!,
      "x-store-api-key": process.env.CRM_ORG_API_KEY!,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/** GET variant, for read-only CRM endpoints like /api/store/products. */
export async function crmGet(path: string, opts?: { revalidate?: number }) {
  const res = await fetch(`${process.env.CRM_API_URL}${path}`, {
    headers: {
      "x-store-domain": process.env.CRM_STORE_DOMAIN!,
      "x-store-api-key": process.env.CRM_ORG_API_KEY!,
    },
    next: { revalidate: opts?.revalidate ?? 60 },
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}
