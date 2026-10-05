import "server-only";
import { crmConfigured, crmGet } from "@/lib/crm-proxy";

export interface CoaEntry {
  slug: string;
  url: string;
  label?: string;
  productName?: string;
  compound?: string;
  purity?: string;
  tested?: string;
  lab?: string;
}

/**
 * Public COA library. Each PDF begins with an EVLV identification cover and
 * then includes the original laboratory-issued report pages unchanged.
 * Multiple entries for one slug are intentional: they represent distinct lots.
 */
export const LOCAL_COAS: CoaEntry[] = [
  { slug: "evlv-3-30mg", url: "/coas/evlv-f6d8-nu9m.pdf", label: "3RT-090426 / F6D8-NU9M", productName: "GLP3-R 30MG", compound: "Retatrutide", purity: "99.966%", tested: "Sep 14, 2026", lab: "Accumark Labs" },
  { slug: "klow-80mg", url: "/coas/evlv-7229-axh3.pdf", label: "KLOW20260826 / 7229-AXH3", productName: "KLOW 80MG", compound: "GHK-Cu / KPV / TB-500 / BPC-157", purity: "99.83% blend", tested: "Sep 8, 2026", lab: "Accumark Labs" },
  { slug: "ghk-cu-50mg", url: "/coas/evlv-msv-5556366-p.pdf", label: "MSV-5556366-P", productName: "GHK-CU 50MG", compound: "GHK-Cu", purity: "99.39%", tested: "May 26, 2026", lab: "Horizon Analytical" },
  { slug: "tesamorelin-10mg", url: "/coas/evlv-msv-4250856-p.pdf", label: "MSV-4250856-P", productName: "TESAMORELIN 10MG", compound: "Tesamorelin", purity: "99.2%", tested: "Jun 8, 2026", lab: "Horizon Analytical" },
  { slug: "evlv-1-10mg", url: "/coas/evlv-msv-2885342-p.pdf", label: "MSV-2885342-P", productName: "GLP1-S 10MG", compound: "Semaglutide", purity: "99.23%", tested: "May 3, 2026", lab: "Horizon Analytical" },
  { slug: "nad-500mg", url: "/coas/evlv-msv-2978946-p.pdf", label: "MSV-2978946-P", productName: "NAD+ 500MG", compound: "NAD+", purity: "99.62%", tested: "May 26, 2026", lab: "Horizon Analytical" },
  { slug: "cjc-ipa-blend-10mg", url: "/coas/evlv-msv-3437208-p.pdf", label: "MSV-3437208-P", productName: "CJC-1295 / IPAMORELIN 10MG", compound: "CJC-1295 no DAC / Ipamorelin", purity: "99.36% / 99.28%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "evlv-2-15mg", url: "/coas/evlv-msv-3795846-p.pdf", label: "MSV-3795846-P", productName: "GLP2-T 15MG", compound: "Tirzepatide", purity: "99.28%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "bpc-tb-500-blend-20mg", url: "/coas/evlv-msv-4152086-p.pdf", label: "MSV-4152086-P", productName: "BPC-157 / TB-500 BLEND 20MG", compound: "BPC-157 / TB-500", purity: "99.41% / 99.65%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "evlv-1-5mg", url: "/coas/evlv-msv-4193082-p.pdf", label: "MSV-4193082-P", productName: "GLP1-S 5MG", compound: "Semaglutide", purity: "99.19%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "kpv-10mg", url: "/coas/evlv-msv-4451178-p.pdf", label: "MSV-4451178-P", productName: "KPV 10MG", compound: "KPV", purity: "99.28%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "evlv-3-15mg", url: "/coas/evlv-msv-5244055-p.pdf", label: "MSV-5244055-P", productName: "GLP3-R 15MG", compound: "Retatrutide", purity: "99.41%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "evlv-2-30mg", url: "/coas/evlv-msv-6006482-p.pdf", label: "MSV-6006482-P", productName: "GLP2-T 30MG", compound: "Tirzepatide", purity: "99.29%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "evlv-3-30mg", url: "/coas/evlv-msv-6472318-p.pdf", label: "MSV-6472318-P", productName: "GLP3-R 30MG", compound: "Retatrutide", purity: "99.43%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "mots-c-10mg", url: "/coas/evlv-msv-7058391-p.pdf", label: "MSV-7058391-P", productName: "MOTS-C 10MG", compound: "MOTS-c", purity: "99.53%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "evlv-3-10mg", url: "/coas/evlv-msv-7184415-p.pdf", label: "MSV-7184415-P", productName: "GLP3-R 10MG", compound: "Retatrutide", purity: "99.34%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "bpc-tb-500-blend-10mg", url: "/coas/evlv-msv-8212693-p.pdf", label: "MSV-8212693-P", productName: "BPC-157 / TB-500 BLEND 10MG", compound: "BPC-157 / TB-500", purity: "99.31% / 99.59%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "evlv-2-10mg", url: "/coas/evlv-msv-9109868-p.pdf", label: "MSV-9109868-P", productName: "GLP2-T 10MG", compound: "Tirzepatide", purity: "99.44%", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "glow-70mg", url: "/coas/evlv-msv-9377026-p.pdf", label: "MSV-9377026-P", productName: "GLOW 70MG", compound: "GHK-Cu / BPC-157 / TB-500", purity: "See analyte results", tested: "Jun 3, 2026", lab: "Horizon Analytical" },
  { slug: "klow-80mg", url: "/coas/evlv-dps-2431473.pdf", label: "DPS-2431473", productName: "KLOW 80MG", compound: "GHK-Cu / KPV / TB-500 / BPC-157", purity: "See analyte results", tested: "Jul 18, 2026", lab: "Horizon Analytical" },
  { slug: "bpc-tb-500-blend-20mg", url: "/coas/evlv-dps-4339222.pdf", label: "DPS-4339222", productName: "BPC-157 / TB-500 BLEND 20MG", compound: "BPC-157 / TB-500", purity: "99.36% / 99.37%", tested: "Jul 18, 2026", lab: "Horizon Analytical" },
  { slug: "pt-141-10mg", url: "/coas/evlv-dps-9050324.pdf", label: "DPS-9050324", productName: "PT-141 10MG", compound: "PT-141", purity: "99.28%", tested: "Jul 18, 2026", lab: "Horizon Analytical" },
];

const PRIMARY_LOCAL_COA_MAP: Record<string, CoaEntry> = {};
for (const coa of [...LOCAL_COAS].reverse()) PRIMARY_LOCAL_COA_MAP[coa.slug] = coa;
PRIMARY_LOCAL_COA_MAP["bpc-tb-500-blend-20mg"] = LOCAL_COAS.find((coa) => coa.label === "DPS-4339222")!;

export async function getCoaMap(): Promise<Record<string, CoaEntry>> {
  if (!crmConfigured()) return PRIMARY_LOCAL_COA_MAP;

  const { ok, data } = await crmGet("/api/store/coas", { revalidate: 120 });
  if (!ok || !Array.isArray(data)) return PRIMARY_LOCAL_COA_MAP;

  const map: Record<string, CoaEntry> = { ...PRIMARY_LOCAL_COA_MAP };
  for (const coa of data as CoaEntry[]) {
    if (coa.slug && coa.url) map[coa.slug] = coa;
  }
  return map;
}

export async function getCoaEntries(): Promise<CoaEntry[]> {
  if (!crmConfigured()) return LOCAL_COAS;

  const { ok, data } = await crmGet("/api/store/coas", { revalidate: 120 });
  if (!ok || !Array.isArray(data)) return LOCAL_COAS;

  const knownUrls = new Set(LOCAL_COAS.map((coa) => coa.url));
  const remote = (data as CoaEntry[]).filter((coa) => coa.slug && coa.url && !knownUrls.has(coa.url));
  return [...LOCAL_COAS, ...remote];
}
