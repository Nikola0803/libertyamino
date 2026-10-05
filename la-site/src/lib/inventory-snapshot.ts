import type { Product } from "./types";

export interface InventoryRow {
  slug: string;
  sku: string;
  productName: string;
  status: string;
  stockStatus: string;
  stockQty: number;
  retailPrice?: number;
}

/** Last verified fallback from the owner's private Google Sheet. */
export const INVENTORY_SNAPSHOT: InventoryRow[] = [
  ["aod-9604-10mg", "10AD", "AOD-9604 — 10mg", 10, 64.99],
  ["bpc-tb-500-blend-20mg", "BB20", "BPC+TB-500 Blend — 20mg", 11, 79.99],
  ["cartalax-20mg", "CART20", "Cartalax — 20mg", 10, 59.99],
  ["cerebrolysin-60mg", "CBL60", "Cerebrolysin — 60mg", 10, 54.99],
  ["cjc-ipa-blend-10mg", "CP10", "CJC/Ipa Blend — 10mg", 31, 74.99],
  ["cjc-ipa-blend-20mg", "CP20", "CJC/Ipa Blend — 20mg", 10, 129.99],
  ["ghk-cu-50mg", "GHK50", "GHK-CU — 50mg", 29, 39.99],
  ["glow-70mg", "GW70", "GLOW Blend — 70mg", 9, 99.99],
  ["kpv-10mg", "KPV10", "KPV — 10mg", 20, 39.99],
  ["klow-80mg", "KW80", "KLOW Blend — 80mg", 75, 109.99],
  ["mots-c-10mg", "MOT10", "MOTS-C — 10mg", 25, 39.99],
  ["mots-c-40mg", "MOT40", "MOTS-C — 40mg", 20, 109.99],
  ["nad-500mg", "NAD500", "NAD+ — 500mg", 19, 64.99],
  ["oxytocin-10mg", "OXY10", "Oxytocin — 10mg", 10, 39.99],
  ["korean-pink-glutathione-1200mg", "PG1200", "Korean Pink Glutathione — 1200mg", 25, 59.99],
  ["pt-141-10mg", "PT10", "PT-141 — 10mg", 10, 39.99],
  ["evlv-3-10mg", "RET10", "GLP3-R — 10mg", 40, 59.99],
  ["evlv-3-15mg", "RET15", "GLP3-R — 15mg", 24, 79.99],
  ["evlv-3-30mg", "RET30", "GLP3-R — 30mg", 20, 129.99],
  ["evlv-1-10mg", "SEM10", "GLP1-S — 10mg", 15, 74.99],
  ["evlv-1-5mg", "SEM5", "GLP1-S — 5mg", 20, 49.99],
  ["selank-10mg", "SLK10", "Selank — 10mg", 4, 49.99],
  ["semax-10mg", "SMX10", "Semax — 10mg", 5, 49.99],
  ["ss-31-10mg", "SS3110", "SS-31 — 10mg", 10, 45],
  ["thymosin-alpha-1-5mg", "TA15", "Thymosin Alpha-1 — 5mg", 10, 44.99],
  ["tesamorelin-10mg", "TES10", "Tesamorelin — 10mg", 5, 59.99],
  ["evlv-2-10mg", "TIR10", "GLP2-T — 10mg", 19, 59.99],
  ["evlv-2-15mg", "TIR15", "GLP2-T — 15mg", 30, 89.99],
  ["evlv-2-30mg", "TIR30", "GLP2-T — 30mg", 19, 149.99],
  ["evlv-2-60mg", "TIR60", "GLP2-T — 60mg", 7, 274.99],
  ["bacteriostatic-water-30ml", "BAC30", "Hospira Bacteriostatic Water — 30mL", 44, 25],
].map(([slug, sku, productName, stockQty, retailPrice]) => ({
  slug: String(slug), sku: String(sku), productName: String(productName), status: "publish", stockStatus: "instock",
  stockQty: Number(stockQty), retailPrice: Number(retailPrice),
}));

export const SLUG_BY_INVENTORY_SKU: Record<string, string> = {
  "10AD": "aod-9604-10mg", AR90: "ara-290-50mg", BB10: "bpc-tb-500-blend-10mg", BB20: "bpc-tb-500-blend-20mg", BB30: "bpc-tb-500-blend-30mg",
  BPC10: "bpc-157-10mg", BPC20: "bpc-157-20mg", BPC5: "bpc-157-5mg", CART20: "cartalax-20mg", CBL60: "cerebrolysin-60mg",
  CGL10: "cagrilintide-10mg", CGL20: "cagrilintide-20mg", CGL5: "cagrilintide-5mg", CP10: "cjc-ipa-blend-10mg", CP20: "cjc-ipa-blend-20mg",
  GHK50: "ghk-cu-50mg", GW70: "glow-70mg", HU10: "humanin-10mg", IGF1: "igf-1-lr3-1mg", KPV10: "kpv-10mg", KPVO500: "kpv-oral-500mcg",
  KW80: "klow-80mg", MOT10: "mots-c-10mg", MOT20: "mots-c-20mg", MOT40: "mots-c-40mg", "MT-2": "melanotan-ii-10mg",
  NAD1000: "nad-1000mg", NAD500: "nad-500mg", OXY10: "oxytocin-10mg", PG1200: "korean-pink-glutathione-1200mg", PT10: "pt-141-10mg",
  RET10: "evlv-3-10mg", RET15: "evlv-3-15mg", RET30: "evlv-3-30mg", RET60: "evlv-3-60mg", SEM10: "evlv-1-10mg", SEM5: "evlv-1-5mg",
  SLK10: "selank-10mg", SMX10: "semax-10mg", SS3110: "ss-31-10mg", SS3150: "ss-31-50mg", TA15: "thymosin-alpha-1-5mg",
  TB10: "tb-500-10mg", TB20: "tb-500-20mg", TB5: "tb-500-5mg", TES10: "tesamorelin-10mg", TES20: "tesamorelin-20mg",
  TIR10: "evlv-2-10mg", TIR15: "evlv-2-15mg", TIR30: "evlv-2-30mg", TIR60: "evlv-2-60mg", BAC30: "bacteriostatic-water-30ml",
  "5AM": "5-amino-1mq-5mg", "10AM": "5-amino-1mq-10mg", "50AM": "5-amino-1mq-50mg",
};

const normalizedSku = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");
const usablePrice = (value: number | undefined) => typeof value === "number" && Number.isFinite(value) && value > 0;
const displayName = (value: string) => value.replace(/\s+[—-]\s+(?=\d)/, " ").toUpperCase();
const isAvailable = (row: InventoryRow) => row.status.toLowerCase() === "publish" && row.stockStatus.toLowerCase() === "instock" && row.stockQty > 0;

export function applyInventoryRows(source: Product[], rows: InventoryRow[], addMissing = false, preserveUnlisted = false): Product[] {
  const resolvedRows = rows.map((row) => ({ ...row, slug: row.slug || SLUG_BY_INVENTORY_SKU[row.sku.toUpperCase()] || "" }));
  const bySlug = new Map(resolvedRows.filter((row) => row.slug).map((row) => [row.slug, row]));
  const bySku = new Map(resolvedRows.map((row) => [normalizedSku(row.sku), row]));
  const products: Product[] = source.map((product) => {
    const row = bySlug.get(product.slug) ?? bySku.get(normalizedSku(product.sku));
    return {
      ...product,
      sku: row?.sku ?? product.sku,
      name: row ? displayName(row.productName) : product.name,
      stockQty: row?.stockQty ?? (preserveUnlisted ? product.stockQty : 0),
      price: usablePrice(product.price) ? product.price : row?.retailPrice ?? product.price,
      inStock: row ? isAvailable(row) : preserveUnlisted ? product.inStock : false,
      variants: product.variants?.map((variant) => {
        const variantRow = bySlug.get(variant.slug);
        return {
          ...variant,
          price: usablePrice(variant.price) ? variant.price : variantRow?.retailPrice ?? variant.price,
          inStock: variantRow ? isAvailable(variantRow) : preserveUnlisted ? variant.inStock : false,
        };
      }),
    };
  });

  if (!addMissing) return products;
  const existingSlugs = new Set(products.map((product) => product.slug));
  for (const row of resolvedRows) {
    if (!row.slug || existingSlugs.has(row.slug) || !isAvailable(row) || !usablePrice(row.retailPrice)) continue;
    const name = displayName(row.productName);
    products.push({
      id: `sheet-${row.sku}`, slug: row.slug, sku: row.sku, name,
      category: row.slug.includes("water") ? "ancillaries" : "peptides",
      categoryLabel: row.slug.includes("water") ? "Research Supplies" : "Peptide Research",
      format: row.slug.includes("water") ? "supplies" : undefined,
      price: row.retailPrice!, rating: 0, reviewCount: 0, inStock: true, stockQty: row.stockQty,
      shortDescription: `${name} for research protocols.`, description: `${name}, supplied for laboratory research use only.`,
      storage: "Store lyophilized vials at 2–8°C. After reconstitution, refrigerate.",
    });
    existingSlugs.add(row.slug);
  }
  return products;
}

export function applyInventorySnapshot(source: Product[]): Product[] {
  // The bundled snapshot is deliberately partial. If the live sheet cannot be
  // reached, use its known stock overrides without hiding the rest of the
  // locally maintained in-stock catalogue.
  return applyInventoryRows(source, INVENTORY_SNAPSHOT, false, true);
}
