"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { usePackSelection } from "./PackSelector";
import { useCart } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";
import { getStoredUser } from "@/lib/auth";
import { getProductImage } from "@/lib/product-images";

export function ProductCard({ product, coaVerified = false }: { product: Product; coaVerified?: boolean }) {
  const { selected } = usePackSelection(product);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    // Authorization is intentionally read after hydration because it lives in localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthorized(user?.membershipStatus === "APPROVED" || user?.researcherStatus === "APPROVED");
  }, []);

  const locked = (!!product.memberOnly || !!product.restricted) && !authorized;
  return (
    <article className="cp-product-card">
      {coaVerified && <span className="cp-coa-badge">✓ Exact COA Available</span>}
      <Link href={`/shop/${product.slug}`} className="cp-product-shot">
        <Image src={getProductImage(product)} alt={`${product.name} EVLV research product`} width={1200} height={1200} />
      </Link>
      <div className="cp-purity">{coaVerified ? <>Reported purity <b>{product.purity || "See COA"}</b></> : <>Documentation <b>See product page</b></>}</div>
      <div className="cp-product-copy">
        <Link href={`/shop/${product.slug}`}><h3>{product.name}</h3></Link>
        <div className="cp-product-bottom"><strong>{formatPrice(product.price)}</strong>{locked ? <Link href="/account?tab=verification" className="cp-card-add">Verify</Link> : <button type="button" className="cp-card-add" disabled={!product.inStock} onClick={() => addToCart(product, 1, selected.unitPrice, selected.label)}>{product.inStock ? <><span className="hidden md:inline">Add to Cart</span><span className="md:hidden">Buy</span></> : "Sold out"}</button>}</div>
      </div>
    </article>
  );
}
