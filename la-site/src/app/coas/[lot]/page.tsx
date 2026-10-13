import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LOCAL_COAS, getCoaEntries } from "@/lib/coa-data";
import { getProducts } from "@/lib/products";
import { getProductImage } from "@/lib/product-images";

function lotToSlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "-");
}

export function generateStaticParams() {
  return LOCAL_COAS.filter((c) => c.label).map((c) => ({ lot: lotToSlug(c.label!) }));
}

async function resolveLot(lotParam: string) {
  const entries = await getCoaEntries();
  return entries.find((c) => c.label && lotToSlug(c.label) === lotParam);
}

export async function generateMetadata({ params }: { params: Promise<{ lot: string }> }): Promise<Metadata> {
  const { lot } = await params;
  const coa = await resolveLot(lot);
  if (!coa) return {};
  const name = coa.productName ?? coa.compound ?? "Research compound";
  return {
    title: `Lot ${coa.label} — ${name} COA | Liberty Aminos`,
    description: `Third-party batch verification for ${name}, lot ${coa.label}. Tested by ${coa.lab ?? "independent laboratory"}. Purity: ${coa.purity ?? "see report"}.`,
    alternates: { canonical: `/coas/${lot}` },
  };
}

export default async function CоаLotPage({ params }: { params: Promise<{ lot: string }> }) {
  const { lot } = await params;
  const coa = await resolveLot(lot);
  if (!coa) notFound();

  const products = getProducts();
  const product = products.find((p) => p.slug === coa.slug);
  const image = product ? getProductImage(product) : "/images/products/vial-placeholder.png";
  const productName = coa.productName ?? product?.name ?? "Research compound";

  return (
    <div className="la-lot-page">
      <div className="la-pdp-breadcrumb la-wrap">
        <nav aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <i className="ri-arrow-right-s-line" aria-hidden />
          <Link href="/coas">COA Library</Link>
          <i className="ri-arrow-right-s-line" aria-hidden />
          <span>{coa.label}</span>
        </nav>
      </div>

      <div className="la-wrap la-lot-inner">
        <div className="la-lot-img">
          <Image
            src={image}
            alt={`${productName} vial`}
            width={480}
            height={480}
            priority
          />
        </div>
        <div className="la-lot-detail">
          <small className="la-coa-kicker">Batch Verification · Research Use Only</small>
          <h1>{productName}</h1>

          <dl className="la-lot-dl">
            {coa.compound && (
              <div>
                <dt>Compound</dt>
                <dd>{coa.compound}</dd>
              </div>
            )}
            <div>
              <dt>Lot / report ID</dt>
              <dd><code>{coa.label}</code></dd>
            </div>
            {coa.purity && (
              <div>
                <dt>Reported purity</dt>
                <dd className="la-lot-purity">{coa.purity}</dd>
              </div>
            )}
            {coa.lab && (
              <div>
                <dt>Testing laboratory</dt>
                <dd>{coa.lab}</dd>
              </div>
            )}
            {coa.tested && (
              <div>
                <dt>Analysis date</dt>
                <dd>{coa.tested}</dd>
              </div>
            )}
          </dl>

          <div className="la-lot-actions">
            <a
              href={`${coa.url}#page=2`}
              target="_blank"
              rel="noreferrer"
              className="la-btn-primary"
            >
              <i className="ri-file-list-3-line" aria-hidden /> View full lab report
            </a>
            {product && (
              <Link href={`/shop/${product.slug}`} className="la-btn-secondary">
                View product page
              </Link>
            )}
          </div>

          <div className="la-lot-ruo">
            <b>Research use only.</b> This certificate of analysis documents the batch identified
            above. Third-party testing results are specific to the lot number shown. Not for human
            or veterinary use.
          </div>
        </div>
      </div>
    </div>
  );
}
