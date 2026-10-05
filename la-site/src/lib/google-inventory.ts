import "server-only";

import { createSign } from "node:crypto";
import { SLUG_BY_INVENTORY_SKU, type InventoryRow } from "./inventory-snapshot";

const DEFAULT_SHEET_ID = "1Omlm--Tn0jgqH6h0Mk8t-4hxSofPgbIo";
const DEFAULT_RANGE = "'Inventory'!A:F";

let cachedToken: { value: string; expiresAt: number } | undefined;

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

async function getServiceAccountToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const email = process.env.GOOGLE_INVENTORY_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_INVENTORY_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) return null;

  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64Url(JSON.stringify({
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${signer.sign(privateKey, "base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cachedToken.value;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index += 1; } else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function numeric(value: unknown) {
  const parsed = Number(String(value ?? "").replace(/[$,]/g, "").trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function rowsFromMatrix(values: unknown[][]): InventoryRow[] {
  if (values.length < 2) return [];
  const normalized = (value: unknown) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const headerIndex = values.findIndex((row) => row.some((value) => normalized(value) === "sku"));
  if (headerIndex < 0) return [];
  const headers = values[headerIndex].map(normalized);
  const at = (row: unknown[], ...names: string[]) => {
    const index = names.map(normalized).map((name) => headers.indexOf(name)).find((candidate) => candidate >= 0) ?? -1;
    return index >= 0 ? row[index] : undefined;
  };
  const hasDedicatedPublicationStatus = headers.some((header) => ["publicationstatus", "publishstatus", "catalogstatus"].includes(header));
  return values.slice(headerIndex + 1).flatMap((row) => {
    const sku = String(at(row, "sku") ?? "").trim();
    const productName = String(at(row, "product_name", "product") ?? "").trim();
    if (!sku || !productName) return [];
    const availability = String(at(row, "stock_status", "availability", "status") ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    return [{
      slug: SLUG_BY_INVENTORY_SKU[sku.toUpperCase()] ?? "",
      sku,
      productName,
      status: hasDedicatedPublicationStatus
        ? String(at(row, "publication_status", "publish_status", "catalog_status") ?? "").trim()
        : "publish",
      stockStatus: availability,
      stockQty: numeric(at(row, "stock_qty", "in_stock_vials", "in_stock", "quantity", "qty")) ?? 0,
      retailPrice: numeric(at(row, "price_retail", "retail_price")),
    }];
  });
}

async function fetchPublishedFeed(url: string) {
  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) return null;
  const text = await response.text();
  if (text.trimStart().startsWith("{")) {
    const data = JSON.parse(text) as { values?: unknown[][] } | { rows?: Record<string, unknown>[] };
    if ("values" in data && Array.isArray(data.values)) return rowsFromMatrix(data.values);
    if ("rows" in data && Array.isArray(data.rows)) {
      const objects = data.rows;
      const headers = objects.length ? Object.keys(objects[0]) : [];
      return rowsFromMatrix([headers, ...objects.map((row) => headers.map((header) => row[header]))]);
    }
  }
  return rowsFromMatrix(parseCsv(text));
}

export async function getGoogleInventoryRows(): Promise<InventoryRow[] | null> {
  try {
    const feedUrl = process.env.GOOGLE_INVENTORY_FEED_URL;
    if (feedUrl) return await fetchPublishedFeed(feedUrl);

    const token = await getServiceAccountToken();
    if (!token) return null;
    const sheetId = process.env.GOOGLE_INVENTORY_SHEET_ID || DEFAULT_SHEET_ID;
    const range = process.env.GOOGLE_INVENTORY_SHEET_RANGE || DEFAULT_RANGE;
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(range)}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { values?: unknown[][] };
    return Array.isArray(data.values) ? rowsFromMatrix(data.values) : null;
  } catch {
    return null;
  }
}
