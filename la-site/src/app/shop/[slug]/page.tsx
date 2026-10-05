import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProducts, getShopListProducts } from "@/lib/products";
import { getCatalogProducts } from "@/lib/catalog";
import { getCoaMap } from "@/lib/coa-data";
import { ProductClient } from "./ProductClient";
import { getProductImage } from "@/lib/product-images";
import { ProductCard } from "@/components/product/ProductCard";

const SITE_URL = "https://evlvpeptides.com";

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

async function resolveProduct(slug: string) {
  return (await getCatalogProducts()).find((product) => product.slug === slug) ?? getProductBySlug(slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) return {};
  const productType = product.category === "peptides" ? "Research Peptide" : "Research Product";
  const title = `${product.name} ${productType} | COA & Purity`;
  return {
    title,
    description: `${product.shortDescription} ${product.purity ? `Reported purity: ${product.purity}.` : ""} Review current batch documentation. Research use only; not for human or veterinary use.`.trim(),
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description: product.shortDescription,
      images: [{ url: getProductImage(product), width: 800, height: 800, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getCatalogProducts();
  const product = catalog.find((item) => item.slug === slug) ?? getProductBySlug(slug);
  if (!product) notFound();

  const siblingSlugs = new Set(product.variants?.map((variant) => variant.slug) ?? [product.slug]);
  const relatedProducts = getShopListProducts(catalog)
    .filter((item) => item.category === product.category && !siblingSlugs.has(item.slug))
    .slice(0, 4);

  const coaMap = await getCoaMap();
  const coa = coaMap[product.slug];
  const image = getProductImage(product);
  const absoluteImage = image.startsWith("http://") || image.startsWith("https://") ? image : `${SITE_URL}${image}`;
  const productForm = product.slug === "kpv-oral-500mcg"
    ? "Tablets"
    : product.format === "oral"
      ? "Oral research format"
      : product.format === "supplies"
        ? "Laboratory supply"
        : product.format === "nasal" || product.format === "device"
          ? "Research device"
          : "Lyophilized powder";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/shop/${product.slug}#product`,
    url: `${SITE_URL}/shop/${product.slug}`,
    name: product.name,
    sku: product.sku,
    description: `${product.shortDescription} Research use only; not for human or veterinary use.`,
    image: [absoluteImage],
    category: product.categoryLabel,
    brand: { "@type": "Brand", name: "EVLV" },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    audience: { "@type": "BusinessAudience", audienceType: "Qualified laboratory researchers" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://evlvpeptides.com" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "https://evlvpeptides.com/shop" },
      { "@type": "ListItem", position: 3, name: product.name, item: `https://evlvpeptides.com/shop/${product.slug}` },
    ],
  };

  return (
    <div className="cp-pdp-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-[1400px] px-4 pb-4 pt-8 md:px-8 md:pt-10">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-charcoal/50" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-charcoal">Home</Link>
          <i className="ri-arrow-right-s-line" />
          <Link href="/shop" className="transition hover:text-charcoal">Shop</Link>
          <i className="ri-arrow-right-s-line" />
          <span className="font-medium text-charcoal">{product.name}</span>
        </nav>
      </div>
      <div className="mx-auto max-w-[1400px] px-4 pb-5 md:px-8">
        <ProductClient product={product} coa={coa} />
      </div>
      <section className="cp-pdp-details" aria-labelledby="product-description-heading">
        <div>
          <small className="cp-pdp-kicker">Product information</small>
          <h2 id="product-description-heading">Product description</h2>
          <p>{product.description}</p>
          <p>EVLV fulfills research products from the United States and publishes product-specific batch documentation when a matching laboratory report is available. Testing methods and results are specific to the product and batch identified in each report.</p>
          <p>This product is supplied in the format shown on this page: {productForm.toLowerCase()}.</p>
          <p><strong>For laboratory research use only. Not for human or veterinary use.</strong></p>
        </div>
        <div>
          <small className="cp-pdp-kicker">At a glance</small>
          <h2>Research specifications</h2>
          <dl>
            <div><dt>Product</dt><dd>{product.name}</dd></div>
            <div><dt>SKU</dt><dd>{product.sku}</dd></div>
            <div><dt>Purity</dt><dd>{product.purity || "See current COA"}</dd></div>
            <div><dt>Form</dt><dd>{productForm}</dd></div>
            {product.casNumber && <div><dt>CAS number</dt><dd>{product.casNumber}</dd></div>}
            {product.avgMass && <div><dt>Verified content</dt><dd>{product.avgMass}</dd></div>}
          </dl>
        </div>
      </section>
      {relatedProducts.length > 0 && (
        <section className="cp-related" aria-labelledby="related-products-heading">
          <header>
            <div><small>Continue researching</small><h2 id="related-products-heading">Related products</h2></div>
            <Link href={`/shop?category=${product.category}`}>View all products →</Link>
          </header>
          <div className="cp-product-grid">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} coaVerified={Boolean(coaMap[item.slug])} />)}</div>
        </section>
      )}
    </div>
  );
}
