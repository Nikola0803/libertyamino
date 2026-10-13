import "server-only";
import { laGet } from "@/lib/woocommerce";

export interface CoaEntry {
  slug: string;
  url: string;
  label?: string;
  productName?: string;
  compound?: string;
  purity?: string;
  tested?: string;
  lab?: string;
  lot?: string;
  status?: "current" | "archived";
}

/**
 * Local placeholder COA entries for development.
 * Real COA data comes from the WP backend endpoint GET /la/v1/coas.
 * COA records must match the actual PDFs exactly — no placeholder dates or purity values.
 */
export const LOCAL_COAS: CoaEntry[] = [];

const PRIMARY_LOCAL_COA_MAP: Record<string, CoaEntry> = {};
for (const coa of [...LOCAL_COAS].reverse()) PRIMARY_LOCAL_COA_MAP[coa.slug] = coa;

export async function getCoaMap(): Promise<Record<string, CoaEntry>> {
  const { ok, data } = await laGet<CoaEntry[]>("/coas", { revalidate: 120 });
  if (!ok || !Array.isArray(data)) return PRIMARY_LOCAL_COA_MAP;

  const map: Record<string, CoaEntry> = {};
  for (const coa of data) {
    if (coa.slug && coa.url) map[coa.slug] = coa;
  }
  return map;
}

export async function getCoaEntries(): Promise<CoaEntry[]> {
  const { ok, data } = await laGet<CoaEntry[]>("/coas", { revalidate: 120 });
  if (!ok || !Array.isArray(data)) return LOCAL_COAS;
  return data;
}

export async function getCoaByLot(lot: string): Promise<CoaEntry | null> {
  const { ok, data } = await laGet<CoaEntry>(`/coas/${encodeURIComponent(lot)}`, { revalidate: 120 });
  if (!ok || !data) return null;
  return data;
}
