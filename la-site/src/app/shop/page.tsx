import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getShopListProducts } from "@/lib/products";
import { getCatalogProducts } from "@/lib/catalog";
import { getCoaMap } from "@/lib/coa-data";
import { ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop Research Amino Compounds",
  description:
    "Browse Liberty Aminos research-use-only amino acids and peptides with lot-specific COAs, third-party testing documentation, and US fulfillment.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = getShopListProducts(await getCatalogProducts());
  const verifiedCoaSlugs = Object.keys(await getCoaMap());

  return (
    <>
      <Suspense fallback={null}>
        <ShopClient products={products} verifiedCoaSlugs={verifiedCoaSlugs} />
      </Suspense>

      {/* Below-fold: context + quick links */}
      <section className="la-shop-info">
        <div className="la-wrap">
          <div className="la-shop-info-inner">
            <div>
              <small>Research use only · 21+ only</small>
              <h2>Third-Party Tested Research Compounds</h2>
              <p>
                Liberty Aminos product pages identify the compound, labeled quantity, SKU, current
                availability, and available batch documentation. Match the lot on your received item
                to the report in our COA Library before beginning laboratory work. All products are
                strictly for lawful research and analytical use — not for human or veterinary use.
              </p>
            </div>
            <nav aria-label="Research resources">
              <Link href="/coas">Search lot-specific Certificates of Analysis →</Link>
              <Link href="/faq">Research FAQ →</Link>
              <Link href="/policies/research-use">Research Use Policy →</Link>
              <Link href="/policies/prohibited-guidance">Prohibited Guidance Policy →</Link>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
