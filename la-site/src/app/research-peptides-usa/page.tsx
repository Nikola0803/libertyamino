import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://evlvpeptides.com";

export const metadata: Metadata = {
  title: "Research Peptides USA | RUO Laboratory Supply & COAs",
  description:
    "U.S.-dispatched research peptides for qualified laboratory use. Review lot-specific COAs, purity data, handling information, and RUO requirements.",
  alternates: { canonical: "/research-peptides-usa" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/research-peptides-usa`,
    title: "Research Peptides USA | EVLV",
    description:
      "Research-use-only materials with batch-level documentation, U.S. dispatch, and a searchable COA library.",
    images: [
      {
        url: "/images/certified/evlv-quality-transparency-v2.png",
        width: 1536,
        height: 1024,
        alt: "EVLV research material with batch documentation",
      },
    ],
  },
};

const EVALUATION_POINTS = [
  {
    title: "Lot-specific documentation",
    body: "The batch code on the product should connect to documentation for that same lot, rather than a generic or unrelated report.",
  },
  {
    title: "Identity and purity reporting",
    body: "Review the reported analytical method, identity data where applicable, purity result, sample identifier, and test date.",
  },
  {
    title: "Clear research-use labeling",
    body: "The product page, label, and supplier policy should consistently state that the material is not for human or veterinary use.",
  },
  {
    title: "Traceable product details",
    body: "A useful listing identifies the compound, labeled amount, SKU, current availability, and storage information without medical claims.",
  },
];

const FAQ = [
  {
    question: "What are research-use-only peptides?",
    answer:
      "Research-use-only, or RUO, peptides are materials supplied for controlled laboratory, in-vitro, and analytical work. They are not intended or approved for human or veterinary administration, diagnosis, treatment, or consumption.",
  },
  {
    question: "Can EVLV research products be used in humans or animals?",
    answer:
      "No. EVLV products are supplied strictly for lawful laboratory and analytical research. They are not for human or veterinary use, and EVLV does not provide dosing, administration, or personal-use guidance.",
  },
  {
    question: "How do I verify an EVLV research peptide batch?",
    answer:
      "Match the lot or batch code on the product to the corresponding entry in the EVLV COA Library. The report presents the available analytical results for that specific lot.",
  },
  {
    question: "Does EVLV ship research materials within the USA?",
    answer:
      "Yes. EVLV ships eligible orders across the United States. In-stock orders placed before the daily cutoff are prioritized for same-day processing, with tracking supplied after carrier acceptance.",
  },
  {
    question: "What should a laboratory review before ordering?",
    answer:
      "Review the product identity, labeled quantity, current lot documentation, storage requirements, institutional approvals, applicable law, and the supplier's research-use policy before ordering.",
  },
  {
    question: "Does a Certificate of Analysis make a material suitable for personal use?",
    answer:
      "No. A Certificate of Analysis reports test results for a sample or lot. It does not make an RUO material approved, safe, or appropriate for human or veterinary use.",
  },
] as const;

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/research-peptides-usa#webpage`,
  url: `${SITE_URL}/research-peptides-usa`,
  name: "Research Peptides USA",
  description:
    "A practical guide to selecting research-use-only peptide materials, reviewing batch documentation, and ordering from a U.S. supplier.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: [
    { "@type": "Thing", name: "Research peptides" },
    { "@type": "Thing", name: "Research use only materials" },
    { "@type": "Thing", name: "Certificates of Analysis" },
  ],
  audience: { "@type": "BusinessAudience", audienceType: "Qualified laboratory researchers" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Research Peptides USA",
      item: `${SITE_URL}/research-peptides-usa`,
    },
  ],
};

function jsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function ResearchPeptidesUsaPage() {
  return (
    <div className="bg-white text-charcoal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }} />

      <section className="-mt-[90px] bg-charcoal pb-20 pt-[150px] text-white md:-mt-[100px] md:pb-28 md:pt-[175px]">
        <div className="mx-auto max-w-[1100px] px-4 text-center md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">
            U.S. laboratory supply · Research use only
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
            Research Peptides in the USA
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
            EVLV supplies research-use-only materials with searchable product data, lot-level documentation, and U.S.
            order fulfillment for qualified laboratory and analytical work.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="rounded-md bg-copper px-7 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal" href="/shop?category=peptides">
              Browse research products
            </Link>
            <Link className="rounded-md border border-white/30 px-7 py-3 text-xs font-semibold uppercase tracking-wide text-white" href="/coas">
              Search COA library
            </Link>
          </div>
          <p className="mt-6 text-xs font-medium text-white/45">Not for human or veterinary use.</p>
        </div>
      </section>

      <main>
        <section className="mx-auto max-w-[1100px] px-4 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-deep">Start with the evidence</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
                What should you look for in a U.S. research peptide supplier?
              </h2>
              <p className="mt-5 leading-relaxed text-soft-gray">
                Begin with traceability. A credible research listing should let a laboratory connect the item being
                ordered to its identity, labeled quantity, current batch, and available analytical documentation.
                Marketing language is not a substitute for a lot-matched report.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {EVALUATION_POINTS.map((item, index) => (
                <article key={item.title} className="rounded-lg border border-stone bg-ivory-soft p-6">
                  <p className="font-mono text-xs font-semibold text-copper">0{index + 1}</p>
                  <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft-gray">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-stone bg-ivory-soft py-16 md:py-24">
          <div className="mx-auto max-w-[1100px] px-4 md:px-8">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-deep">Documentation first</p>
              <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">How EVLV connects products to COAs</h2>
              <p className="mt-5 leading-relaxed text-soft-gray">
                Each available report in the EVLV COA Library is organized around a product and batch identifier. A
                researcher can compare the lot code on the received item with the published report and review the
                available purity, identity, content, and test-date information. Results are batch-specific and should
                not be assumed to apply to a different lot.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <article className="rounded-lg border border-stone bg-white p-6">
                <h3 className="font-display text-xl font-semibold">1. Identify the product</h3>
                <p className="mt-2 text-sm leading-relaxed text-soft-gray">Confirm the product name, labeled amount, SKU, and format on the listing.</p>
              </article>
              <article className="rounded-lg border border-stone bg-white p-6">
                <h3 className="font-display text-xl font-semibold">2. Match the lot</h3>
                <p className="mt-2 text-sm leading-relaxed text-soft-gray">Use the batch code to locate the corresponding analytical record in the COA Library.</p>
              </article>
              <article className="rounded-lg border border-stone bg-white p-6">
                <h3 className="font-display text-xl font-semibold">3. Review the report</h3>
                <p className="mt-2 text-sm leading-relaxed text-soft-gray">Read the method, sample details, reported result, and testing date before use in research.</p>
              </article>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold">
              <Link className="text-sage-deep underline decoration-sage-deep/30 underline-offset-4" href="/coas">Open the COA Library</Link>
              <Link className="text-sage-deep underline decoration-sage-deep/30 underline-offset-4" href="/sourcing">Read our testing standards</Link>
              <Link className="text-sage-deep underline decoration-sage-deep/30 underline-offset-4" href="/ruo">Read the full RUO policy</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 py-16 md:px-8 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-deep">Common questions</p>
              <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Research peptide FAQ</h2>
              <div className="mt-8 space-y-4">
                {FAQ.map((item) => (
                  <details key={item.question} className="rounded-lg border border-stone bg-white p-5">
                    <summary className="cursor-pointer list-none pr-6 font-semibold">{item.question}</summary>
                    <p className="mt-3 text-sm leading-relaxed text-soft-gray">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
            <aside className="h-fit rounded-lg bg-charcoal p-8 text-white lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">Research-use boundary</p>
              <h2 className="mt-3 font-display text-2xl font-semibold">What EVLV can help with</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                Support can help with product identity, labeled quantity, batch documentation, unopened-product
                storage, order status, shipping, and institutional inquiries. EVLV cannot provide dosing,
                administration, reconstitution for personal use, treatment, or veterinary guidance.
              </p>
              <Link className="mt-6 inline-flex text-sm font-semibold text-copper underline underline-offset-4" href="/faq">
                View all support questions →
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
