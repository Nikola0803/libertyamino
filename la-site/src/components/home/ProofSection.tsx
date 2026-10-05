/**
 * Institutional trust strip -- replaces the previous Google-reviews
 * masonry (real reviews, not fabricated, but still consumer-review-style
 * social proof that doesn't belong on a B2B/analytical supplier catalog).
 * No fabricated client quotes or testimonials here by design: an
 * unverifiable institutional quote is the same credibility problem as a
 * fake consumer review, just with a lab coat on. Static copy only.
 */
export function ProofSection() {
  return (
    <section className="bg-ivory-soft py-16 md:py-20">
      <div className="mx-auto max-w-[900px] px-4 text-center md:px-8">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-charcoal/40">Institutional Supply</p>
        <h2 className="font-display text-2xl font-semibold text-charcoal md:text-3xl">
          Supplying university, contract-research, and analytical laboratory accounts.
        </h2>
        <p className="mx-auto mt-4 max-w-[640px] text-sm leading-relaxed text-charcoal/60">
          Exact product and batch reports are identified in the public COA library when available. All compounds are
          supplied strictly for laboratory, in-vitro, and analytical research use.
        </p>
      </div>
    </section>
  );
}
