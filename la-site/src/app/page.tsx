import Image from "next/image";
import Link from "next/link";
import { getShopListProducts } from "@/lib/products";
import { getCatalogProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { VerifiedPeptideReviewsBadge } from "@/components/trust/VerifiedPeptideReviewsBadge";
import { getCoaMap } from "@/lib/coa-data";
import { WelcomeOffer } from "@/components/home/WelcomeOffer";

const CATEGORIES = [
  { title: "Shop Peptides", sub: "Third-party verified", href: "/shop?category=peptides", image: "category-peptides.png" },
  { title: "Bioregulators", sub: "Research precision", href: "/shop?focus=bioregulators", image: "category-bioregulators.png" },
  { title: "Lipotropics", sub: "Science inspired", href: "/shop?focus=metabolic", image: "category-lipotropics.png" },
  { title: "Peptide Capsules", sub: "Research products", href: "/shop?format=oral", image: "category-capsules.png" },
  { title: "Shop Sales", sub: "Limited-time savings", href: "/shop", image: "category-sale.png" },
];

const WHY = [
  ["U.S.-Based Fulfillment", "Inventory is dispatched from the United States with tracked delivery.", "why-manufacturing.png"],
  ["Independent 3rd-Party Reports", "Matching product and batch reports are published when available.", "why-testing.png"],
  ["Real People, Real Support", "Full-time U.S.-based support via chat, phone, or email.", "why-support.png"],
  ["Same-Day / Next-Day Shipping", "Tracked domestic delivery for dependable arrival.", "why-shipping.png"],
];

const TICKER = [
  ["U.S. Fulfillment", 0],
  ["Product-Specific COAs", 1],
  ["Transparent Batch Data", 0],
  ["Independent Lab Reports", 2],
  ["Buy More, Save More", 3],
  ["7 days a week support", 4],
] as const;

const FAQ = [
  ["Are EVLV products intended for human use?", "No. Every product sold by EVLV is supplied strictly for laboratory and analytical research. Products are not for human or veterinary consumption."],
  ["Who can purchase research products from EVLV?", "Purchasers must be at least 21 years old, understand safe laboratory handling requirements, and have a legitimate research purpose."],
  ["How can I verify the batch I receive?", "Use the lot number on your vial or carton in our COA Library to open the corresponding Certificate of Analysis and testing documentation."],
  ["How does EVLV verify purity and identity?", "Available batches are supported by independent analytical testing, including HPLC purity reporting and identity documentation where applicable."],
  ["When will my research order dispatch?", "In-stock orders placed before 2 PM ET are prioritized for same-day processing. Tracking is provided when the shipment is accepted by the carrier."],
  ["Can I speak with someone before ordering?", "Yes. Our U.S.-based support team can help with documentation, order status, wholesale inquiries, and general product information without providing medical advice."],
] as const;

export default async function Home() {
  const products = getShopListProducts(await getCatalogProducts()).slice(0, 8);
  const coaMap = await getCoaMap();
  return (
    <div className="cp-home">
      <section className="cp-hero cp-wrap">
        <div className="cp-hero-copy">
          <VerifiedPeptideReviewsBadge />
          <h1>Premium Peptides<br /><span>&amp; BioRegulators</span></h1>
          <p>EVLV is built for researchers who expect precise documentation, consistent quality, and premium presentation.</p>
          <Link className="cp-primary" href="/shop?category=peptides">Shop All Peptides</Link>
        </div>
        <div className="cp-hero-image" aria-label="EVLV premium peptide vials and matching cartons" />
      </section>

      <section className="cp-ticker" aria-label="EVLV trust standards"><div className="cp-ticker-track">{[0,1].map(group => <div className="cp-ticker-group" key={group}>{TICKER.map(([item,icon]) => <span key={item}><i style={{backgroundPosition:`${icon * 25}% center`}} /><b>{item}</b></span>)}</div>)}</div></section>

      <section className="cp-categories cp-wrap">{CATEGORIES.map(card => <Link key={card.title} href={card.href} className="cp-category" style={{backgroundImage:`url('/images/certified/${card.image}')`}}><span><b>{card.title}</b><small>{card.sub}</small></span></Link>)}</section>

      <section className="cp-section cp-wrap" id="products"><header className="cp-section-head"><div><small>Transparent documentation</small><h2>Our Featured Collection</h2></div><p>Research-ready products with exact COA availability clearly identified.</p></header><div className="cp-product-grid">{products.map(product => <ProductCard key={product.id} product={product} coaVerified={Boolean(coaMap[product.slug])} />)}</div><div className="cp-center"><Link className="cp-primary" href="/shop">Discover All Products</Link></div></section>

      <section className="cp-quality"><div className="cp-wrap"><div><small>Quality assurance</small><h2>Documented Products.<br />Transparent Results.</h2><p>Exact product and batch reports are published when available, with unmatched documentation clearly distinguished.</p><div className="cp-quality-links"><Link href="/coas">View COA Reports</Link><Link href="/sourcing">Our testing standards</Link><Link href="/research-peptides-usa">Research peptides USA guide</Link></div></div><Image src="/images/certified/evlv-quality-transparency-v2.png" alt="EVLV GLP3-R research vial with transparent label detail" width={1536} height={1024} /></div></section>

      <section className="cp-section cp-proof cp-wrap"><header className="cp-proof-title"><h2>Driven by science, we deliver<br /><span>trusted results</span></h2></header><div className="cp-proof-grid"><article className="cp-proof-main"><small>DOCUMENTATION-FIRST QUALITY</small><h3>Published reports</h3><div><b>EXACT MATCHES, CLEARLY LABELED</b><p>Product, batch, purity, identity, and content details where reported.</p><Link href="/coas">View reports →</Link></div></article><article className="cp-proof-review"><small>VERIFIED CUSTOMER REVIEWS</small><h3>Top Rated Peptides Online</h3><p>Read what researchers say.</p></article><article className="cp-proof-ship"><small>NEXT-DAY DISPATCH</small><h3>Shipped Priority Fast</h3></article><article className="cp-proof-science"><small>PREMIUM QUALITY</small><h3>Science-Driven Innovation</h3><p>Precision-led research products with transparent batch documentation where available.</p><Link href="/sourcing">Explore testing standards →</Link></article></div></section>

      <section className="cp-section cp-manufacturing cp-wrap"><Image src="/images/certified/evlv-manufacturing-lab.png" alt="EVLV laboratory quality process" width={1000} height={1000} /><div><small>PRECISION AT EVERY STEP</small><h2>Documentation-First Quality</h2><p>Our catalog emphasizes identifiable products, published reports, and traceable batch records rather than unsupported blanket claims.</p><Link className="cp-primary" href="/about">Read More About Us</Link></div></section>

      <section className="cp-section cp-why"><div className="cp-wrap"><h2>Why Choose Us?</h2><div>{WHY.map(([title,copy,image]) => <article key={title}><Image src={`/images/certified/${image}`} alt="" width={300} height={300} /><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className="cp-section cp-faq cp-wrap"><h2>Want to learn more?</h2>{FAQ.map(([q,a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</section>

      <WelcomeOffer />
    </div>
  );
}
