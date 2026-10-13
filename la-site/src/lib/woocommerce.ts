import "server-only";

/**
 * WooCommerce REST API + Store API client for Liberty Aminos.
 *
 * REST API  (server-side, consumer key / secret):
 *   GET /wp-json/wc/v3/products
 *   GET /wp-json/wc/v3/products/{id}
 *   GET /wp-json/wc/v3/orders/{id}
 *   GET /wp-json/wc/v3/customers
 *
 * Store API (cart / checkout, nonce required for mutations):
 *   GET/POST /wp-json/wc/store/v1/cart
 *   POST     /wp-json/wc/store/v1/checkout
 *
 * Custom LA plugin endpoints (/wp-json/la/v1/):
 *   GET  /la/v1/products           catalog with grouping meta
 *   GET  /la/v1/products/{slug}    single product with lot/COA data
 *   GET  /la/v1/coas               COA library
 *   GET  /la/v1/coas/{lot}         single lot verification
 *   GET  /la/v1/payment-config     active payment rails
 *   GET  /la/v1/shipping-config    shipping zones/rates
 *   POST /la/v1/heroes             Heroes application submission
 *   POST /la/v1/affiliates         Affiliate application
 *   POST /la/v1/track/purchase     server-side Meta pixel purchase
 *
 * Env vars (see .env.example):
 *   NEXT_PUBLIC_WC_URL              https://db.libertyaminos.com
 *   WC_CONSUMER_KEY                 ck_...
 *   WC_CONSUMER_SECRET              cs_...
 *   WC_STORE_NONCE_SECRET           server-side secret for nonce generation (optional)
 */

const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? "";
const WC_KEY = process.env.WC_CONSUMER_KEY ?? "";
const WC_SECRET = process.env.WC_CONSUMER_SECRET ?? "";

export function isWooCommerceConfigured(): boolean {
  return Boolean(WC_URL && WC_KEY && WC_SECRET);
}

function authHeader(): string {
  const token = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
  return `Basic ${token}`;
}

export interface WcFetchResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

/** Authenticated WooCommerce REST API GET. */
export async function wcGet<T = unknown>(
  path: string,
  opts?: { revalidate?: number },
): Promise<WcFetchResult<T>> {
  if (!isWooCommerceConfigured()) return { ok: false, status: 503, data: null as T };
  try {
    const res = await fetch(`${WC_URL}/wp-json${path}`, {
      headers: { Authorization: authHeader() },
      next: { revalidate: opts?.revalidate ?? 60 },
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 503, data: null as T };
  }
}

/** Authenticated WooCommerce REST API POST/PUT/PATCH. */
export async function wcPost<T = unknown>(
  path: string,
  body: unknown,
  method = "POST",
): Promise<WcFetchResult<T>> {
  if (!isWooCommerceConfigured()) return { ok: false, status: 503, data: null as T };
  try {
    const res = await fetch(`${WC_URL}/wp-json${path}`, {
      method,
      headers: { Authorization: authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 503, data: null as T };
  }
}

/** Public WC Store API GET — no auth needed for reads. */
export async function storeGet<T = unknown>(
  path: string,
  opts?: { revalidate?: number },
): Promise<WcFetchResult<T>> {
  if (!WC_URL) return { ok: false, status: 503, data: null as T };
  try {
    const res = await fetch(`${WC_URL}/wp-json/wc/store/v1${path}`, {
      next: { revalidate: opts?.revalidate ?? 30 },
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 503, data: null as T };
  }
}

/**
 * Store API POST — requires a Nonce header for cart mutations.
 * The nonce is fetched per-request from the WC nonce endpoint; callers
 * that already have one (from a previous cart response header) should
 * pass it to avoid an extra round-trip.
 */
export async function storePost<T = unknown>(
  path: string,
  body: unknown,
  nonce?: string,
): Promise<WcFetchResult<T>> {
  if (!WC_URL) return { ok: false, status: 503, data: null as T };
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (nonce) headers["Nonce"] = nonce;
  try {
    const res = await fetch(`${WC_URL}/wp-json/wc/store/v1${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 503, data: null as T };
  }
}

/** Custom LA plugin endpoint GET (public endpoints). */
export async function laGet<T = unknown>(
  path: string,
  opts?: { revalidate?: number },
): Promise<WcFetchResult<T>> {
  if (!WC_URL) return { ok: false, status: 503, data: null as T };
  try {
    const res = await fetch(`${WC_URL}/wp-json/la/v1${path}`, {
      next: { revalidate: opts?.revalidate ?? 60 },
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 503, data: null as T };
  }
}

/** Custom LA plugin endpoint POST (public write endpoints — validated by nonce / signature server-side). */
export async function laPost<T = unknown>(
  path: string,
  body: unknown,
): Promise<WcFetchResult<T>> {
  if (!WC_URL) return { ok: false, status: 503, data: null as T };
  try {
    const res = await fetch(`${WC_URL}/wp-json/la/v1${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 503, data: null as T };
  }
}

/**
 * Fetch a WC Store API nonce from the backend.
 * The nonce is required for all cart mutation requests.
 */
export async function fetchStoreNonce(): Promise<string | null> {
  if (!WC_URL) return null;
  try {
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/nonce`, { cache: "no-store" });
    const data = await res.json().catch(() => null);
    return data?.nonce ?? null;
  } catch {
    return null;
  }
}

/** WooCommerce customer auth via WP application password or JWT plugin. */
export async function wcCustomerLogin(email: string, password: string): Promise<WcFetchResult> {
  if (!WC_URL) return { ok: false, status: 503, data: { error: "Backend not configured." } };
  try {
    const token = Buffer.from(`${email}:${password}`).toString("base64");
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/customers`, {
      method: "GET",
      headers: { Authorization: `Basic ${token}`, "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 503, data: { error: "Backend unavailable." } };
  }
}

/** Create a WooCommerce customer account. */
export async function wcCreateCustomer(body: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}): Promise<WcFetchResult> {
  return wcPost("/wc/v3/customers", body);
}
