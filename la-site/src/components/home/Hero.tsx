import Link from "next/link";

export function Hero() {
  return (
    <section className="la-hero">
      {/* Image placeholder — swap for hero image when supplied by Jerod */}
      <div className="la-hero-bg" aria-hidden="true" />
      <div className="la-hero-inner">
        <div className="la-hero-copy">
          <p className="la-hero-eyebrow">For Research Use Only · 21+ Only</p>
          <h1>
            Third-Party Tested<br />
            <span>Research Amino Compounds</span>
          </h1>
          <p className="la-hero-sub">
            Batch-level COA verification on every order. US-fulfilled with transparent lab
            documentation.
          </p>
          <div className="la-hero-actions">
            <Link href="/shop" className="la-hero-cta-primary">Shop All Products</Link>
            <Link href="/coas" className="la-hero-cta-secondary">View COA Library</Link>
          </div>
          <div className="la-hero-trust">
            <span><i className="ri-check-line" aria-hidden /> Third-Party Tested</span>
            <span><i className="ri-check-line" aria-hidden /> US Fulfilled</span>
            <span><i className="ri-check-line" aria-hidden /> COA Every Batch</span>
          </div>
        </div>
      </div>
    </section>
  );
}
