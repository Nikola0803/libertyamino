import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getShopListProducts } from "@/lib/products";
import { getCatalogProducts } from "@/lib/catalog";
import { getCoaMap } from "@/lib/coa-data";
import { ShopClient } from "./ShopClient";
import { TrustIconRow } from "@/components/ui/TrustIconRow";

export const metadata: Metadata = {
  title: "Research Peptides for Sale in the USA",
  description: "Browse EVLV research-use-only peptides and laboratory supplies with lot-specific COAs, current purity data, and U.S. order fulfillment.",
  alternates: { canonical: "/shop" },
};

const SHOP_TRUST_ITEMS = [
  { icon: "ri-shield-check-line", label: "Transparent Documentation", sublabel: "Exact reports clearly identified" },
  { icon: "ri-truck-line", label: "US & Canada Shipping", sublabel: "1-2 business day delivery" },
  { icon: "ri-lock-line", label: "Secure Payments", sublabel: "Encrypted checkout" },
  { icon: "ri-customer-service-2-line", label: "Expert Support", sublabel: "Response within minutes" },
];

export default async function ShopPage() {
  const products = getShopListProducts(await getCatalogProducts());
  const verifiedCoaSlugs = Object.keys(await getCoaMap());

  return (
    <>
      <Suspense fallback={null}>
        <ShopClient products={products} verifiedCoaSlugs={verifiedCoaSlugs} />
      </Suspense>
      <section className="border-t border-stone bg-ivory-soft py-14 md:py-20" aria-labelledby="shop-research-heading">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 md:grid-cols-[1.1fr_0.9fr] md:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-deep">U.S. research supply</p>
            <h2 id="shop-research-heading" className="mt-3 font-display text-3xl font-semibold text-charcoal md:text-4xl">
              Research-use-only products with batch traceability
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-soft-gray md:text-base">
              EVLV product pages identify the compound, labeled quantity, SKU, current availability, and available
              batch documentation. Match the lot on a received item to the report in our COA Library before beginning
              laboratory work. All products are strictly for lawful research and analytical use—not for human or
              veterinary use.
            </p>
          </div>
          <div className="grid gap-3 self-start rounded-lg border border-stone bg-white p-6 text-sm">
            <Link className="font-semibold text-sage-deep" href="/research-peptides-usa">How to evaluate research peptides in the USA →</Link>
            <Link className="font-semibold text-sage-deep" href="/coas">Search lot-specific Certificates of Analysis →</Link>
            <Link className="font-semibold text-sage-deep" href="/sourcing">Review EVLV testing and sourcing standards →</Link>
            <Link className="font-semibold text-sage-deep" href="/ruo">Understand the research-use-only policy →</Link>
          </div>
        </div>
      </section>
      <TrustIconRow items={SHOP_TRUST_ITEMS} tone="plain" />
    </>
  );
}
