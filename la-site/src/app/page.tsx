import Link from "next/link";
import { getCatalogProducts } from "@/lib/catalog";
import { getShopListProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { getCoaMap } from "@/lib/coa-data";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";

const WHY = [
  { icon: "ri-flask-line", title: "Independent Third-Party Testing", copy: "Every batch is sent to independent analytical labs. We publish what we receive — purity, identity, and lot details." },
  { icon: "ri-file-list-3-line", title: "Batch-Level COA Verification", copy: "COAs are tied to specific lot numbers, not generic product pages. Scan the QR code on your vial to verify your exact batch." },
  { icon: "ri-map-pin-line", title: "US Fulfillment", copy: "Inventory is dispatched from the United States with tracked delivery. No long overseas wait times." },
  { icon: "ri-shield-check-line", title: "Research Use Only", copy: "Strictly for laboratory and analytical research. We enforce 21+ age verification and RUO compliance on every order." },
] as const;

const FAQ = [
  ["Are Liberty Aminos products for human use?", "No. Every product sold by Liberty Aminos is supplied strictly for laboratory and analytical research. Products are not for human or veterinary consumption."],
  ["Who can purchase from Liberty Aminos?", "Purchasers must be at least 21 years old, understand safe laboratory handling requirements, and have a legitimate research purpose."],
  ["How do I verify my batch?", "Use the lot number printed on your vial or carton in our COA Library to open the corresponding Certificate of Analysis and testing documentation."],
  ["How does Liberty Aminos verify purity and identity?", "Available batches are supported by independent analytical testing, including HPLC purity reporting and identity documentation where applicable."],
  ["When will my order ship?", "In-stock orders placed before 2 PM ET are prioritized for same-day processing. Tracking is provided when the shipment is accepted by the carrier."],
] as const;

export default async function Home() {
  const products = getShopListProducts(await getCatalogProducts()).slice(0, 8);
  const coaMap = await getCoaMap();

  return (
    <div className="la-home">
      <Hero />
      <TrustBar />

      {/* Featured Products */}
      <section className="la-section la-wrap" id="products">
        <header className="la-section-head">
          <div>
            <small>Transparent documentation</small>
            <h2>Research Amino Compounds</h2>
          </div>
          <p>Research-ready compounds with third-party lab documentation and exact COA availability clearly identified.</p>
        </header>
        <div className="la-product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} coaVerified={Boolean(coaMap[product.slug])} />
          ))}
        </div>
        <div className="la-center">
          <Link className="la-btn-primary" href="/shop">View All Products</Link>
        </div>
      </section>

      {/* COA Callout */}
      <section className="la-coa-callout">
        <div className="la-wrap">
          <div className="la-coa-callout-inner">
            <div>
              <small>Every batch, every order</small>
              <h2>A COA for Every Lot</h2>
              <p>
                We publish the Certificate of Analysis for every batch we sell. Scan the QR code on
                your vial or search by lot number in our COA Library to verify your exact batch.
              </p>
              <div className="la-coa-callout-actions">
                <Link href="/coas" className="la-btn-white">View COA Library</Link>
                <Link href="/shop" className="la-btn-ghost-white">Shop All Products</Link>
              </div>
            </div>
            <div className="la-coa-callout-stats">
              <div>
                <b>100%</b>
                <small>Batches with COA</small>
              </div>
              <div>
                <b>3rd Party</b>
                <small>Independent Labs</small>
              </div>
              <div>
                <b>Lot-Level</b>
                <small>Verification</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Liberty Aminos */}
      <section className="la-section la-why la-wrap">
        <h2>Why Liberty Aminos?</h2>
        <div className="la-why-grid">
          {WHY.map(({ icon, title, copy }) => (
            <article key={title} className="la-why-card">
              <i className={icon} aria-hidden />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Prohibited Guidance Tile */}
      <section className="la-prohibited la-wrap">
        <div className="la-prohibited-inner">
          <i className="ri-error-warning-line" aria-hidden />
          <div>
            <h3>Research Use Only</h3>
            <p>
              All products are intended for laboratory and analytical research only. They are not
              for human dosing, injection, ingestion, or veterinary use. Liberty Aminos staff are
              prohibited from providing guidance on human or animal use.
            </p>
          </div>
          <Link href="/policies/prohibited-guidance" className="la-btn-outline-red">
            Prohibited Guidance Policy
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="la-section la-faq la-wrap">
        <h2>Common Questions</h2>
        {FAQ.map(([q, a]) => (
          <details key={q} className="la-faq-item">
            <summary>{q}<span>+</span></summary>
            <p>{a}</p>
          </details>
        ))}
        <div className="la-center" style={{ marginTop: "32px" }}>
          <Link href="/faq" className="la-btn-secondary">Full FAQ</Link>
        </div>
      </section>
    </div>
  );
}
