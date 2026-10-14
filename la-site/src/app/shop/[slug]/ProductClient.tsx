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
import { CoaVerifyPanel } from "@/components/product/CoaVerifyPanel";

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
      <div className="cp-pdp-gallery">
        {getProductImage(product) ? (
          <Image src={getProductImage(product)!} alt={`${product.name} Liberty Aminos research compound`} width={1600} height={1600} priority />
        ) : (
          <div style={{ width: "100%", height: "100%", minHeight: 460, background: "linear-gradient(160deg,#0a1840 0%,#0e2153 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, borderRadius: 16 }}>
            <i className="ri-flask-line" style={{ fontSize: 48, color: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: ".1em", textTransform: "uppercase", textAlign: "center", padding: "0 20px" }}>{product.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: ".12em", textTransform: "uppercase" }}>Product image pending</span>
          </div>
        )}
      </div>
      <div className="cp-pdp-summary">
        <small className="cp-pdp-kicker">Research Compound · RUO</small>
        <h1>{product.name}</h1>
        <div className="cp-pdp-price"><div><strong>{formatPrice(selected.unitPrice)}</strong></div><span>● In stock · Ready to dispatch</span></div>
        <p className="cp-pdp-description">{product.shortDescription}</p>
        {product.variants && product.variants.length > 1 && <div className="cp-size-row">{product.variants.map(v => <Link key={v.slug} href={`/shop/${v.slug}`} className={v.slug === product.slug ? "active" : ""}>{v.label}</Link>)}</div>}
        <PackSelector packs={packs} packIndex={packIndex} onSelect={setPackIndex} formatPrice={formatPrice} />
        {locked ? <Link className="cp-pdp-add" href="/account?tab=verification">Apply for verification</Link> : <button className="cp-pdp-add" type="button" disabled={!product.inStock} onClick={add}>{product.inStock ? `Add to cart · ${formatPrice(total)}` : "Out of stock"}</button>}
        <CoaVerifyPanel lot={coa?.label ?? product.batch?.code ?? ""} pdfUrl={coa?.url} />
        <p className="cp-pdp-mobile-description">{product.shortDescription}</p>
        <div className="cp-pdp-trust">
          {coa && <><div><i className="ri-checkbox-circle-line" />Third-Party Tested</div><div><i className="ri-file-shield-2-line" />Lot-Specific COA</div></>}
          {FULFILLMENT_TRUST.map((item, i) => <div key={item}><i className={i === 0 ? "ri-map-pin-line" : i === 1 ? "ri-time-line" : i === 2 ? "ri-send-plane-line" : "ri-customer-service-2-line"} />{item}</div>)}
        </div>
        <div className="cp-ruo"><b>Research use only.</b> Not for human or veterinary use. For in-vitro research by qualified personnel only. 21+.</div>
        <Link className="cp-lab-support" href="/contact">Ask a Specialist →</Link>
      </div>
    </section>
    {!locked && <div className="cp-mobile-buy"><span><small>{product.name}</small><b>{formatPrice(total)}</b></span><button type="button" onClick={add}>Add to cart</button></div>}
  </>;
}
