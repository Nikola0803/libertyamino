import { Metadata } from "next";
import { faqItems } from "@/lib/content";
import { Accordion } from "@/components/ui/Accordion";
import { getShopListProducts } from "@/lib/products";
import { getCatalogProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Research Peptide FAQ",
  description: "Answers about EVLV research-use-only products, lot-specific COAs, U.S. shipping, order tracking, institutional orders, and analytical testing.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const products = getShopListProducts(await getCatalogProducts()).slice(0, 4);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="cp-info-hero cp-info-support -mt-[90px] bg-charcoal pb-20 pt-[150px] text-center text-white md:-mt-[100px] md:pb-32 md:pt-[170px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <h1 className="mb-4 font-display text-4xl font-semibold md:text-5xl lg:text-6xl">Popular Questions</h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Find quick answers to common questions about orders, shipping, tracking, and product testing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <Accordion items={faqItems} />

          <div className="mt-12 rounded-lg border border-stone bg-ivory-soft p-8 text-center">
            <h3 className="mb-2 font-display text-xl font-semibold text-charcoal">Still have questions?</h3>
            <p className="mb-4 text-sm text-charcoal/50">Our support team typically responds within minutes during business hours.</p>
            <ButtonLink href="/contact">
              Contact Us <i className="ri-arrow-right-line" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-t border-stone bg-ivory-soft py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <h2 className="mb-8 text-center font-display text-2xl font-semibold text-charcoal md:text-3xl">Our Products</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
