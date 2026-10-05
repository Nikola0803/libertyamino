export type ProductCategory = "peptides" | "ancillaries";

/** Shop-page "Shop by Format" filter dimension. Most current products are
 * standalone lyophilized vials and don't belong to any of these buckets
 * (they still show up under "All Formats"). */
export type ProductFormat = "blend" | "supplies" | "oral" | "nasal" | "device";

export interface BulkOption {
  qty: number;
  price: number;
  savePercent: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  format?: ProductFormat;
  image?: string;
  /**
   * Extra gallery media for the product page's rotating media viewer, shown
   * alongside `image` (which always renders first). Videos loop muted/inline.
   * No per-product video assets exist yet -- MediaGallery falls back to the
   * shared /videos/product-hover.mp4 clip when a product has no `gallery`.
   */
  gallery?: { type: "image" | "video"; src: string }[];
  price: number;
  bulkOption?: BulkOption;
  purity?: string;
  /** CAS registry number(s) for this compound -- multiple, comma-separated,
   * for a pre-combined blend (e.g. BPC-157/TB-500). Shown on the product
   * card and the product page's spec sheet for research-identity purposes. */
  casNumber?: string;
  avgMass?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  /** Current source-of-truth inventory quantity when supplied by the sheet. */
  stockQty?: number;
  shortDescription: string;
  description: string;
  storage: string;
  reconstitution?: string;
  badges?: string[];
  /** Only purchasable by Member-plan accounts (see /plans) - a paid loyalty
   * tier, unrelated to research-use compliance. */
  memberOnly?: boolean;
  /**
   * Only purchasable by accounts with an APPROVED researcher/institutional
   * verification (see /account's Verification tab and
   * RESEARCHER-VERIFICATION.md) - a compliance gate for delivery-adjacent
   * formats (nasal sprays, injector pens), distinct from memberOnly.
   */
  restricted?: boolean;
  batch?: {
    code: string;
    date: string;
    status: "PASS" | "PENDING";
  };
  /**
   * Sibling size/dose options sharing this product's base name (e.g.
   * BPC-157 5mg/10mg/20mg), each its own independently priced/stocked
   * product with its own slug/page. Every sibling in a group carries an
   * identical `variants` array (including itself) - see the `*_VARIANTS`
   * consts in lib/products.ts. The variants power dose switching on product
   * pages; each in-stock dose still appears independently in the shop grid.
   */
  variants?: ProductVariant[];
}

export interface ProductVariant {
  slug: string;
  label: string;
  price: number;
  inStock: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
  source: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
