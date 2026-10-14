import { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Liberty Aminos",
  description: "Liberty Aminos is a research supply company providing third-party tested amino compounds with full COA transparency.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    title: "Transparency",
    body: "Every batch has a COA. Every lot number is documented and searchable. No blanket claims — only batch-level verification.",
  },
  {
    title: "Precision",
    body: "99%+ purity verified by independent HPLC testing. We state what is in every vial and back it with a certificate.",
  },
  {
    title: "Integrity",
    body: "RUO compliance is non-negotiable. We make no human-use, treatment, or veterinary claims. Ever.",
  },
];

const TESTING_STEPS = [
  { num: "01", title: "Synthesis", body: "Compounds are synthesized in ISO-controlled facilities with sequence and identity verification." },
  { num: "02", title: "Independent Testing", body: "Every lot is submitted to an independent, ISO-accredited laboratory for HPLC purity analysis and mass verification." },
  { num: "03", title: "COA Publication", body: "Certificates of Analysis are made available per batch. No COA means no listing." },
  { num: "04", title: "US Fulfilment", body: "Orders are fulfilled domestically. Products ship in ambient-stable lyophilized form — no cold-chain packaging required." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-off-white py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <span className="mb-4 inline-block rounded-full border border-border-subtle bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            About Liberty Aminos
          </span>
          <h1 className="font-display max-w-2xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Research supply, built on documentation.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Liberty Aminos is a research supply company providing amino compounds and peptides with full
            COA transparency. We exist to make it easy for qualified researchers to source compounds
            they can actually verify.
          </p>
        </div>
      </section>

      <section className="bg-navy py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <h2 className="mb-10 font-display text-3xl font-semibold md:text-4xl">Core values.</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                <h3 className="font-display text-base font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">Testing & Documentation</p>
          <h2 className="mb-2 font-display text-3xl font-semibold text-ink md:text-4xl">
            Batch-level, not blanket.
          </h2>
          <p className="mb-10 text-sm text-muted">
            Every compound we list has been independently tested. Here is how each batch is verified before it ships.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TESTING_STEPS.map((s) => (
              <div key={s.num} className="rounded-lg border border-border-subtle bg-surface p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-navy">{s.num}</p>
                <h3 className="mt-2 font-display text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
          <ButtonLink href="/coas" className="mt-10">
            View COA Library <i className="ri-arrow-right-line" />
          </ButtonLink>
        </div>
      </section>

      <section className="bg-off-white py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">What we are not.</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Liberty Aminos is a research-use-only supplier. Products are sold strictly for laboratory and
            research purposes — not for human consumption, not for medical use, not for veterinary use, and
            not as treatment for any condition. We make no therapeutic claims.
          </p>
          <div className="mt-6 inline-block rounded-md bg-red-light px-4 py-3 text-sm font-medium text-red">
            <i className="ri-shield-check-line mr-2" />
            Research Use Only · 21+ · Not for human or veterinary use
          </div>
        </div>
      </section>

      <section className="border-t border-border-subtle py-16 text-center md:py-24">
        <div className="mx-auto max-w-[800px] px-4 md:px-8">
          <p className="font-display text-2xl font-semibold leading-snug text-ink md:text-3xl">
            Third-party tested. US fulfilment. COA for every batch.
          </p>
          <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-muted">
            All products sold on this site are strictly for research use, not for human or veterinary consumption.
            Must be 21 or older to purchase.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/shop" className="rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-dark">
              Shop Research Compounds
            </Link>
            <Link href="/contact" className="rounded-md border border-navy px-6 py-3 text-sm font-semibold text-navy transition hover:bg-navy-light">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
