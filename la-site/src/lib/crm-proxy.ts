import "server-only";

/**
 * Liberty Aminos does NOT use a custom CRM. This file is kept as a stub
 * so that any EVLV-era import still compiles while the remaining references
 * are migrated to the WooCommerce / LA WP plugin layer (see woocommerce.ts).
 *
 * `crmConfigured()` always returns false — callers that guard on it will
 * fall back to WooCommerce or an appropriate default.
 */
export function crmConfigured(): boolean {
  return false;
}

export async function crmFetch(_path: string, _body: unknown) {
  return { ok: false, status: 503, data: { error: "CRM not used in Liberty Aminos." } };
}

export async function crmGet<T = unknown>(_path: string, _opts?: { revalidate?: number }): Promise<{ ok: boolean; status: number; data: T | null }> {
  return { ok: false, status: 503, data: null };
}
