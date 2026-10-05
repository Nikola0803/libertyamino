/**
 * Collapsed-by-default RUO disclosure, placed right under the price so it's
 * visible before checkout without taking up buy-box real estate unless
 * someone opens it. Copy is written in our own words (not lifted from any
 * competitor's page).
 */
export function ResearchUseNotice() {
  return (
    <details className="group mt-4 rounded-lg border border-sage-deep/25 bg-sage-mist/25 open:pb-3">
      <summary className="flex cursor-pointer list-none items-start gap-2.5 px-3.5 py-2.5 marker:content-none">
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-sage-deep/50 text-[10px] font-semibold text-sage-deep">
          i
        </span>
        <span className="flex-1 text-xs leading-snug text-charcoal/70">
          <span className="font-semibold text-charcoal">Research-use information</span>
          <br />
          This product is for research use only. Not for human or veterinary use.
        </span>
        <i className="ri-arrow-down-s-line mt-0.5 shrink-0 text-charcoal/40 transition group-open:rotate-180" />
      </summary>
      <p className="px-3.5 text-xs leading-relaxed text-charcoal/60">
        Everything sold here is supplied strictly for laboratory and analytical research -- not for human or animal
        consumption. These are not medicines or drugs, and none of it has been evaluated or approved by the U.S. Food
        and Drug Administration for diagnosing, treating, curing, or preventing any disease or condition, nor is any
        of it intended for clinical, diagnostic, or therapeutic use.
        <br />
        <br />
        Product photos are representative and not a guarantee of the exact batch you&apos;ll receive. We test and
        stock multiple active batches of most products at any given time; every current batch is documented in this
        page&apos;s Certificate of Analysis records, but we&apos;re unable to accommodate requests for a specific
        batch. Labels, packaging, and product color can vary between batches.
      </p>
    </details>
  );
}
