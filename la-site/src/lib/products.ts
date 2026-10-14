import { Product, ProductVariant } from "./types";
import { applyInventorySnapshot } from "./inventory-snapshot";
import { getQuantityUnitPrice } from "./quantity-pricing";

/**
 * Liberty Aminos placeholder catalog.
 * Products are grouped by compound_group meta in WooCommerce.
 * Swap getProducts / getProductBySlug for real WooCommerce REST API fetches
 * once the backend is live — see lib/woocommerce.ts.
 *
 * GLP placeholder names (GLP1-S, GLP2-T, GLP3-R) are used until final
 * naming arrives from Jerod.
 */

const GLP1_S_VARIANTS: ProductVariant[] = [
  { slug: "glp1-s-5mg", label: "5mg", price: 49, inStock: true },
  { slug: "glp1-s-10mg", label: "10mg", price: 89, inStock: true },
  { slug: "glp1-s-30mg", label: "30mg", price: 249, inStock: true },
];

const GLP2_T_VARIANTS: ProductVariant[] = [
  { slug: "glp2-t-5mg", label: "5mg", price: 54, inStock: true },
  { slug: "glp2-t-10mg", label: "10mg", price: 99, inStock: true },
];

const GLP3_R_VARIANTS: ProductVariant[] = [
  { slug: "glp3-r-2mg", label: "2mg", price: 38, inStock: true },
  { slug: "glp3-r-5mg", label: "5mg", price: 79, inStock: true },
];

export const products: Product[] = [
  // ---- GLP1-S ----
  {
    id: "1",
    slug: "glp1-s-5mg",
    sku: "GLP1S-5",
    name: "GLP1-S 5MG",
    category: "peptides",
    categoryLabel: "Peptide Research",
    image: "/images/products/glp1-s-5mg.png",
    price: 49,
    purity: "99%+",
    inStock: true,
    rating: 0,
    reviewCount: 0,
    shortDescription: "GLP-1 receptor agonist research peptide, 5mg vial.",
    description: "GLP1-S 5mg vial for research protocols. 99%+ purity verified by independent third-party HPLC testing.",
    storage: "Store lyophilized vials at 2–8°C. After reconstitution, use within 30 days and refrigerate.",
    reconstitution: "Reconstitute with bacteriostatic or sterile water appropriate for laboratory use.",
    badges: ["COA Available"],
    batch: { code: "LA-PLACEHOLDER", date: "2026-10-01", status: "PASS" },
    variants: GLP1_S_VARIANTS,
  },
  {
    id: "2",
    slug: "glp1-s-10mg",
    sku: "GLP1S-10",
    name: "GLP1-S 10MG",
    category: "peptides",
    categoryLabel: "Peptide Research",
    image: "/images/products/glp1-s-10mg.png",
    price: 89,
    purity: "99%+",
    inStock: true,
    rating: 0,
    reviewCount: 0,
    shortDescription: "GLP-1 receptor agonist research peptide, 10mg vial.",
    description: "GLP1-S 10mg vial for research protocols. 99%+ purity verified by independent third-party HPLC testing.",
    storage: "Store lyophilized vials at 2–8°C. After reconstitution, use within 30 days and refrigerate.",
    reconstitution: "Reconstitute with bacteriostatic or sterile water appropriate for laboratory use.",
    badges: ["COA Available"],
    batch: { code: "LA-PLACEHOLDER", date: "2026-10-01", status: "PASS" },
    variants: GLP1_S_VARIANTS,
  },
  {
    id: "3",
    slug: "glp1-s-30mg",
    sku: "GLP1S-30",
    name: "GLP1-S 30MG",
    category: "peptides",
    categoryLabel: "Peptide Research",
    image: "/images/products/glp1-s-30mg.png",
    price: 249,
    purity: "99%+",
    inStock: true,
    rating: 0,
    reviewCount: 0,
    shortDescription: "GLP-1 receptor agonist research peptide, 30mg vial.",
    description: "GLP1-S 30mg vial for research protocols. 99%+ purity verified by independent third-party HPLC testing.",
    storage: "Store lyophilized vials at 2–8°C. After reconstitution, use within 30 days and refrigerate.",
    reconstitution: "Reconstitute with bacteriostatic or sterile water appropriate for laboratory use.",
    badges: ["COA Available"],
    batch: { code: "LA-PLACEHOLDER", date: "2026-10-01", status: "PASS" },
    variants: GLP1_S_VARIANTS,
  },

  // ---- GLP2-T ----
  {
    id: "4",
    slug: "glp2-t-5mg",
    sku: "GLP2T-5",
    name: "GLP2-T 5MG",
    category: "peptides",
    categoryLabel: "Peptide Research",
    image: "/images/products/glp2-t-5mg.png",
    price: 54,
    purity: "99%+",
    inStock: true,
    rating: 0,
    reviewCount: 0,
    shortDescription: "GIP/GLP-1 dual-agonist research peptide, 5mg vial.",
    description: "GLP2-T 5mg vial for research protocols. 99%+ purity verified by independent third-party HPLC testing.",
    storage: "Store lyophilized vials at 2–8°C. After reconstitution, use within 30 days and refrigerate.",
    reconstitution: "Reconstitute with bacteriostatic or sterile water appropriate for laboratory use.",
    badges: ["COA Available"],
    batch: { code: "LA-PLACEHOLDER", date: "2026-10-01", status: "PASS" },
    variants: GLP2_T_VARIANTS,
  },
  {
    id: "5",
    slug: "glp2-t-10mg",
    sku: "GLP2T-10",
    name: "GLP2-T 10MG",
    category: "peptides",
    categoryLabel: "Peptide Research",
    image: "/images/products/glp2-t-10mg.png",
    price: 99,
    purity: "99%+",
    inStock: true,
    rating: 0,
    reviewCount: 0,
    shortDescription: "GIP/GLP-1 dual-agonist research peptide, 10mg vial.",
    description: "GLP2-T 10mg vial for research protocols. 99%+ purity verified by independent third-party HPLC testing.",
    storage: "Store lyophilized vials at 2–8°C. After reconstitution, use within 30 days and refrigerate.",
    reconstitution: "Reconstitute with bacteriostatic or sterile water appropriate for laboratory use.",
    badges: ["COA Available"],
    batch: { code: "LA-PLACEHOLDER", date: "2026-10-01", status: "PASS" },
    variants: GLP2_T_VARIANTS,
  },

  // ---- GLP3-R ----
  {
    id: "6",
    slug: "glp3-r-2mg",
    sku: "GLP3R-2",
    name: "GLP3-R 2MG",
    category: "peptides",
    categoryLabel: "Peptide Research",
    image: "/images/products/glp3-r-2mg.png",
    price: 38,
    purity: "99%+",
    inStock: true,
    rating: 0,
    reviewCount: 0,
    shortDescription: "Tri-agonist research peptide, 2mg vial.",
    description: "GLP3-R 2mg vial for research protocols. 99%+ purity verified by independent third-party HPLC testing.",
    storage: "Store lyophilized vials at 2–8°C. After reconstitution, use within 30 days and refrigerate.",
    reconstitution: "Reconstitute with bacteriostatic or sterile water appropriate for laboratory use.",
    badges: ["COA Available"],
    batch: { code: "LA-PLACEHOLDER", date: "2026-10-01", status: "PASS" },
    variants: GLP3_R_VARIANTS,
  },
  {
    id: "7",
    slug: "glp3-r-5mg",
    sku: "GLP3R-5",
    name: "GLP3-R 5MG",
    category: "peptides",
    categoryLabel: "Peptide Research",
    image: "/images/products/glp3-r-5mg.png",
    price: 79,
    purity: "99%+",
    inStock: true,
    rating: 0,
    reviewCount: 0,
    shortDescription: "Tri-agonist research peptide, 5mg vial.",
    description: "GLP3-R 5mg vial for research protocols. 99%+ purity verified by independent third-party HPLC testing.",
    storage: "Store lyophilized vials at 2–8°C. After reconstitution, use within 30 days and refrigerate.",
    reconstitution: "Reconstitute with bacteriostatic or sterile water appropriate for laboratory use.",
    badges: ["COA Available"],
    batch: { code: "LA-PLACEHOLDER", date: "2026-10-01", status: "PASS" },
    variants: GLP3_R_VARIANTS,
  },

  // ---- Bacteriostatic Water ----
  {
    id: "8",
    slug: "bac-water",
    sku: "BAC30",
    name: "BACTERIOSTATIC WATER 30ML",
    category: "ancillaries",
    categoryLabel: "Research Supplies",
    format: "supplies",
    image: "/images/products/bac-water.png",
    price: 12,
    inStock: true,
    rating: 0,
    reviewCount: 0,
    shortDescription: "30mL bacteriostatic water vial for laboratory preparation workflows.",
    description: "Bacteriostatic water 30mL, supplied for laboratory research use only.",
    storage: "Store according to the manufacturer's labeled conditions.",
  },
];

export function getProducts() {
  return applyInventorySnapshot(products).map(withQuantityPricing);
}

/** Normalize every catalog source to the same public quantity offer. */
export function withQuantityPricing(product: Product): Product {
  const savePercent = 10;
  const qty = 10;
  return {
    ...product,
    bulkOption: {
      qty,
      savePercent,
      price: Number((getQuantityUnitPrice(product.price, qty) * qty).toFixed(2)),
    },
  };
}

export function getFeaturedProducts() {
  const inventoryProducts = getProducts();
  const order = ["glp1-s-5mg", "glp2-t-5mg", "glp3-r-2mg", "bac-water"];
  return order
    .map((slug) => inventoryProducts.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p?.inStock));
}

export function getProductBySlug(slug: string) {
  return getProducts().find((p) => p.slug === slug);
}

/**
 * Every published, in-stock SKU gets its own shop card.
 */
export function getShopListProducts(source?: Product[]) {
  const catalog = source ?? applyInventorySnapshot(products);
  return catalog.filter((product) => product.inStock);
}

export function getRelatedProducts(slug: string, limit = 4) {
  const current = getProductBySlug(slug);
  if (!current) return [];
  return getProducts()
    .filter((p) => p.slug !== slug && p.category === current.category && p.inStock)
    .slice(0, limit);
}

export const categories: { value: Product["category"] | "all"; label: string }[] = [
  { value: "all", label: "All Research" },
  { value: "peptides", label: "Peptide Research" },
  { value: "ancillaries", label: "Ancillary Research" },
];

export const formats: { value: NonNullable<Product["format"]> | "all"; label: string }[] = [
  { value: "all", label: "All Formats" },
  { value: "blend", label: "Blends" },
  { value: "supplies", label: "Supplies" },
  { value: "oral", label: "Oral / Capsules" },
  { value: "nasal", label: "Nasal Sprays" },
  { value: "device", label: "Multi-Dose Cartridges" },
];
