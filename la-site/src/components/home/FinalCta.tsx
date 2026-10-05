import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section className="bg-sage-deep py-24 text-center text-white md:py-32">
      <Reveal className="mx-auto max-w-[1400px] px-4 md:px-8">
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-[1.05] md:text-5xl">Ready to research?</h2>
        <p className="mx-auto mt-5 max-w-md text-base text-white/70 md:text-lg">
          Explore independently tested research compounds with batch-level transparency.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/shop" size="lg" className="!bg-ivory !text-charcoal hover:!bg-sage-light">
            Explore Materials <i className="ri-arrow-right-line" />
          </ButtonLink>
          <ButtonLink href="/coas" variant="secondary" size="lg" className="!border-white/40 !text-ivory hover:!bg-ivory hover:!text-charcoal">
            View COAs
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
