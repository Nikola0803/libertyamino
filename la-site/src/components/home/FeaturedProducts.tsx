import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="bg-ivory py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">02 / Our Collection</p>
          <h2 className="font-display text-4xl font-semibold text-charcoal md:text-5xl lg:text-6xl">Featured Research</h2>
          <p className="mt-5 text-base leading-relaxed text-soft-gray md:text-lg">
            Our most requested research compounds, independently tested and prepared to exacting standards.
          </p>
        </Reveal>

        <Reveal stagger className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Reveal>

        <div className="mt-14 flex justify-center md:mt-16">
          <ButtonLink href="/shop" variant="secondary">
            View All Products <i className="ri-arrow-right-line" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
