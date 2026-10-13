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

const FULFILLMENT_TRUST = [
  { icon: "ri-map-pin-line", label: "US Dispatch" },
  { icon: "ri-time-line", label: "Same-Day Processing" },
  { icon: "ri-send-plane-line", label: "Tracked Delivery" },
  { icon: "ri-customer-service-2-line", label: "Expert Support" },
];

export function ProductClient({ product, coa }: { product: Product; coa?: CoaEntry }) {
  const { packIndex, setPackIndex, packs, selected } = usePackSelection(product);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    // Authorization is intentionally read after hydration because it lives in localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthorized(user?.membershipStatus === "APPROVED" || user?.researcherStatus === "APPROVED");
    trackEvent("view_content", {
      properties: { name: product.name, slug: product.slug, sku: product.sku },
    });
  }, [product]);

  const locked = (!!product.memberOnly || !!product.restricted) && !authorized;
  const total = selected.unitPrice * selected.qty;
  const add = () => addToCart(product, selected.qty, selected.unitPrice, selected.label);

  return (
    <>
      <section className="la-pdp">
        <div className="la-pdp-gallery">
          <Image
            src={getProductImage(product)}
            alt={`${product.name} research compound`}
            width={1600}
            height={1600}
            priority
          />
        </div>
        <div className="la-pdp-summary">
          <small className="la-pdp-kicker">Research Amino Compound · RUO</small>
          <h1>{product.name}</h1>

          <div className="la-pdp-price">
            <div>
              <strong>{formatPrice(selected.unitPrice)}</strong>
            </div>
            <span>{product.inStock ? "● In stock · Ready to dispatch" : "● Out of stock"}</span>
          </div>

          <p className="la-pdp-description">{product.shortDescription}</p>

          {product.variants && product.variants.length > 1 && (
            <div className="la-size-row">
              {product.variants.map((v) => (
                <Link
                  key={v.slug}
                  href={`/shop/${v.slug}`}
                  className={v.slug === product.slug ? "active" : ""}
                >
                  {v.label}
                </Link>
              ))}
            </div>
          )}

          <PackSelector
            packs={packs}
            packIndex={packIndex}
            onSelect={setPackIndex}
            formatPrice={formatPrice}
          />

          {locked ? (
            <Link className="la-pdp-add" href="/account?tab=verification">
              Apply for verification
            </Link>
          ) : (
            <button
              className="la-pdp-add"
              type="button"
              disabled={!product.inStock}
              onClick={add}
            >
              {product.inStock ? `Add to cart · ${formatPrice(total)}` : "Out of stock"}
            </button>
          )}

          <div className="la-pdp-urgency">
            <i className="ri-time-line" aria-hidden />
            <span>
              <b>Order before 2 PM ET for same-day processing.</b> Tracked US delivery. Free
              priority shipping over $300.
            </span>
          </div>

          {coa ? (
            <a className="la-pdp-coa-cta" href={coa.url} target="_blank" rel="noreferrer">
              <i className="ri-file-list-3-line" aria-hidden /> View batch COA
            </a>
          ) : (
            <Link className="la-pdp-coa-cta" href="/coas">
              <i className="ri-search-line" aria-hidden /> Search COA Library
            </Link>
          )}

          <p className="la-pdp-mobile-description">{product.shortDescription}</p>

          <div className="la-pdp-trust">
            {coa && (
              <>
                <div><i className="ri-checkbox-circle-line" aria-hidden />Third-Party Report</div>
                <div><i className="ri-file-shield-2-line" aria-hidden />Exact Batch COA</div>
              </>
            )}
            {FULFILLMENT_TRUST.map(({ icon, label }) => (
              <div key={label}>
                <i className={icon} aria-hidden />
                {label}
              </div>
            ))}
          </div>

          <div className="la-pdp-ruo">
            <b>Research use only.</b> Not for human or veterinary use. Purchasers must be
            qualified to handle research materials.
          </div>

          <Link className="la-pdp-contact" href="/contact">
            Ask a lab specialist →
          </Link>
        </div>
      </section>

      {!locked && (
        <div className="la-mobile-buy">
          <span>
            <small>{product.name}</small>
            <b>{formatPrice(total)}</b>
          </span>
          <button type="button" onClick={add}>
            Add to cart
          </button>
        </div>
      )}
    </>
  );
}
