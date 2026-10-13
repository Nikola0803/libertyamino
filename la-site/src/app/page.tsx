import Link from "next/link";
import { getCatalogProducts } from "@/lib/catalog";
import { getShopListProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { getCoaMap } from "@/lib/coa-data";
import { WelcomeOffer } from "@/components/home/WelcomeOffer";
import ProhibitedGuidanceTile from "@/components/home/ProhibitedGuidanceTile";

const WHY = [
  {
    title: "Third-Party Tested",
    copy: "Every active lot is independently verified by an accredited external laboratory before release.",
  },
  {
    title: "COA Every Batch",
    copy: "A Certificate of Analysis is published for each lot. Match the batch code on your vial to its report.",
  },
  {
    title: "US Fulfilment",
    copy: "Inventory is dispatched from the United States with tracked delivery to research institutions.",
  },
  {
    title: "99%+ Purity HPLC",
    copy: "HPLC purity reports are included with each Certificate of Analysis, compound and lot specific.",
  },
];

const FAQ = [
  [
    "What does 'Research Use Only' mean?",
    "Products are supplied strictly for in-vitro and laboratory research. They are not intended, labeled, or approved for human or animal use of any kind. Purchasers must be 21 or older and have a legitimate laboratory research purpose.",
  ],
  [
    "How do I verify my compound's purity?",
    "Every active lot has a published Certificate of Analysis. Visit the COA Library and enter your lot number, or scan the QR code on your vial label. Each report is issued by an independent accredited laboratory.",
  ],
  [
    "How are orders shipped?",
    "Orders are dispatched from the United States. In-stock orders placed before the daily cutoff are processed the same business day. Tracking information is sent to your email automatically.",
  ],
  [
    "What payment methods do you accept?",
    "We accept P2P bank transfer, BTC, USDC, and USDT. Payment instructions are shown on the order confirmation page and included in your order email. Orders are held for 2 hours pending payment.",
  ],
  [
    "Do you ship internationally?",
    "Domestic US orders ship via our standard fulfilment. For international research institution orders, please contact us directly to discuss shipping options and documentation requirements.",
  ],
  [
    "What is the Heroes Program?",
    "Liberty Aminos offers a 15% lifetime discount for active and veteran military, first responders, EMS, and firefighters. Apply on our Heroes page — eligibility is verified before the discount is activated.",
  ],
] as const;

export default async function Home() {
  let products: ReturnType<typeof getShopListProducts> = [];
  try {
    const catalog = await getCatalogProducts();
    products = getShopListProducts(catalog).slice(0, 4);
  } catch {
    products = [];
  }
  const coaMap = await getCoaMap().catch(() => ({}));

  return (
    <div className="cp-home">
      {/* Hero */}
      <section className="cp-hero cp-wrap">
        <div className="cp-hero-copy">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#a1b5e2", marginBottom: 18 }}>
            Third-Party Tested · COA Every Batch
          </p>
          <h1>
            Research amino<br />
            <span>compounds.</span><br />
            <span style={{ fontSize: "0.62em", fontWeight: 400, color: "#d3e0db" }}>Verified to the lot.</span>
          </h1>
          <p>
            Every compound ships with an independent certificate of analysis. No exceptions, no exclusions.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            {["COA Verified — All Active Lots", "US Fulfilment", "99%+ Purity HPLC"].map((badge) => (
              <span
                key={badge}
                style={{
                  padding: "5px 12px",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#d3e0db",
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="cp-primary" href="/shop">Shop All Compounds</Link>
            <Link
              href="/coas"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                padding: "0 28px",
                borderRadius: 25,
                border: "1px solid rgba(255,255,255,0.38)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              View COA Library
            </Link>
          </div>
        </div>
        <div
          className="cp-hero-image"
          style={{ background: "linear-gradient(135deg, #0a1840 0%, #0e2153 60%, #162d6a 100%)" }}
          aria-label="Liberty Aminos research vial placeholder"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 40 }}>
            <div
              style={{
                width: 120,
                height: 200,
                background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Hero<br />Image
            </div>
            <div
              style={{
                padding: "10px 18px",
                background: "#fff",
                borderRadius: 8,
                color: "#0e2153",
                fontSize: 11,
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              ✓ COA Verified · Lot Active
            </div>
          </div>
        </div>
      </section>

      {/* Trust Ticker */}
      <section className="cp-ticker" aria-label="Liberty Aminos trust standards">
        <div className="cp-ticker-track">
          {[0, 1].map((group) => (
            <div className="cp-ticker-group" key={group}>
              {[
                "U.S. Fulfillment",
                "Batch-Level COAs",
                "Independent Lab Reports",
                "99%+ Purity HPLC",
                "Buy More, Save More",
                "Research Use Only · 21+",
              ].map((item, i) => (
                <span key={item}>
                  <i style={{ backgroundPosition: `${i * 20}% center` }} />
                  <b>{item}</b>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="cp-section cp-wrap" id="products">
        <header className="cp-section-head">
          <div>
            <small>Third-party tested · COA every lot</small>
            <h2>Research Compounds</h2>
          </div>
          <p>Certificate of Analysis for every lot. Purity verified by independent laboratory.</p>
        </header>
        <div className="cp-product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              coaVerified={Boolean((coaMap as Record<string, unknown>)[product.slug])}
            />
          ))}
        </div>
        <div className="cp-center">
          <Link className="cp-primary" href="/shop" style={{ background: "#0e2153", color: "#fff" }}>
            View All Compounds
          </Link>
        </div>
      </section>

      {/* Quality / COA dark section */}
      <section className="cp-quality">
        <div className="cp-wrap">
          <div>
            <small>Quality assurance</small>
            <h2>
              Documented Compounds.<br />
              Transparent Results.
            </h2>
            <p>
              Every active lot carries a Certificate of Analysis from an independent accredited laboratory.
              Batch codes on vials match published reports — no exceptions.
            </p>
            <div className="cp-quality-links">
              <Link href="/coas">View COA Library</Link>
              <Link href="/about">About Liberty Aminos</Link>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: 440,
              background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.35)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            Quality Image — Awaiting Asset
          </div>
        </div>
      </section>

      {/* Prohibited Guidance tile */}
      <section className="cp-section cp-wrap" style={{ paddingBlock: "60px 0" }}>
        <ProhibitedGuidanceTile />
      </section>

      {/* Why Choose Us */}
      <section className="cp-section cp-why">
        <div className="cp-wrap">
          <h2>Why Choose Liberty Aminos?</h2>
          <div>
            {WHY.map(({ title, copy }) => (
              <article key={title}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    margin: "0 auto 18px",
                    borderRadius: "50%",
                    background: "#eef1f8",
                    border: "2px solid #e2e6ed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    color: "#0e2153",
                  }}
                >
                  ✓
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="cp-section cp-faq cp-wrap">
        <h2>Common Questions</h2>
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span>+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>

      <WelcomeOffer />
    </div>
  );
}
