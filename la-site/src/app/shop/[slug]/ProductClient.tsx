"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import type { CoaEntry } from "@/lib/coa-data";
import { PackSelector, usePackSelection } from "@/components/product/PackSelector";
import { useCart } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";
import { getStoredUser } from "@/lib/auth";
import { trackEvent } from "@/lib/pixel";
import { getProductImage } from "@/lib/product-images";
import { VerifiedPeptideReviewsBadge } from "@/components/trust/VerifiedPeptideReviewsBadge";

const FULFILLMENT_TRUST = ["U.S. Dispatch","Same-Day Processing","Tracked Delivery","Expert Support"];

export function ProductClient({ product, coa }: { product: Product; coa?: CoaEntry }) {
  const { packIndex, setPackIndex, packs, selected } = usePackSelection(product);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => { const user = getStoredUser();
    // Authorization is intentionally read after hydration because it lives in localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthorized(user?.membershipStatus === "APPROVED" || user?.researcherStatus === "APPROVED"); trackEvent("view_content", { properties: { name: product.name, slug: product.slug, sku: product.sku } }); }, [product]);
  const locked = (!!product.memberOnly || !!product.restricted) && !authorized;
  const total = selected.unitPrice * selected.qty;
  const add = () => addToCart(product, selected.qty, selected.unitPrice, selected.label);

  return <>
    <section className="cp-pdp">
      <div className="cp-pdp-gallery"><Image src={getProductImage(product)} alt={`${product.name} EVLV research product`} width={1600} height={1600} priority /></div>
      <div className="cp-pdp-summary">
        <small className="cp-pdp-kicker">Premium Research Peptide</small>
        <h1>{product.name}</h1>
        <VerifiedPeptideReviewsBadge variant="product" />
        <div className="cp-pdp-price"><div><strong>{formatPrice(selected.unitPrice)}</strong></div><span>● In stock · Ready to dispatch</span></div>
        <p className="cp-pdp-description">{product.shortDescription}</p>
        {product.variants && product.variants.length > 1 && <div className="cp-size-row">{product.variants.map(v => <Link key={v.slug} href={`/shop/${v.slug}`} className={v.slug === product.slug ? "active" : ""}>{v.label}</Link>)}</div>}
        <PackSelector packs={packs} packIndex={packIndex} onSelect={setPackIndex} formatPrice={formatPrice} />
        {locked ? <Link className="cp-pdp-add" href="/account?tab=verification">Apply for verification</Link> : <button className="cp-pdp-add" type="button" disabled={!product.inStock} onClick={add}>{product.inStock ? `Add to cart · ${formatPrice(total)}` : "Out of stock"}</button>}
        <div className="cp-urgency"><i className="ri-time-line" /><span><b>Order before 2 PM ET for same-day processing.</b> Tracked U.S. delivery and free priority shipping over $300.</span></div>
        {coa ? <a className="cp-coa-cta" href={coa.url} target="_blank" rel="noreferrer">✓ View exact product COA</a> : <Link className="cp-coa-cta" href="/coas">Search the COA library</Link>}
        <p className="cp-pdp-mobile-description">{product.shortDescription}</p>
        <div className="cp-pdp-trust">
          {coa && <><div><i className="ri-checkbox-circle-line" />Third-Party Report</div><div><i className="ri-file-shield-2-line" />Exact Product COA</div></>}
          {FULFILLMENT_TRUST.map((item, i) => <div key={item}><i className={i === 0 ? "ri-map-pin-line" : i === 1 ? "ri-time-line" : i === 2 ? "ri-send-plane-line" : "ri-customer-service-2-line"} />{item}</div>)}
        </div>
        <div className="cp-wholesale"><span><b>Need wholesale research pricing?</b><small>Volume options for qualified laboratories and research organizations.</small></span><Link href="/wholesale">View wholesale options ↗</Link></div>
        <div className="cp-ruo"><b>Research use only.</b> Not for human or veterinary use. Purchasers must be qualified to handle research materials.</div>
        <Link className="cp-lab-support" href="/contact">Ask a Lab Specialist →</Link>
      </div>
    </section>
    {!locked && <div className="cp-mobile-buy"><span><small>{product.name}</small><b>{formatPrice(total)}</b></span><button type="button" onClick={add}>Add to cart</button></div>}
  </>;
}
