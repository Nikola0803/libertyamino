import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sourcing & Quality Policy | EVLV",
  description:
    "How EVLV approaches supplier confidentiality, independent testing, batch traceability and quality review across every research peptide we supply.",
  alternates: { canonical: "/sourcing" },
};

const BADGES = ["Independent Testing", "Batch Traceability", "RUO Standards", "Supplier Confidentiality"];

const SECTIONS = [
  { num: "1", title: "Purpose", href: "purpose" },
  { num: "2", title: "Our Sourcing Approach", href: "approach" },
  { num: "3", title: "Supplier Confidentiality", href: "confidentiality" },
  { num: "4", title: "Quality Verification", href: "quality" },
  { num: "5", title: "COAs & Traceability", href: "coa" },
  { num: "6", title: "Multi-Region Supply", href: "regions" },
  { num: "7", title: "Research Use Only", href: "ruo" },
  { num: "8", title: "Documentation Requests", href: "requests" },
  { num: "9", title: "Limitations", href: "limitations" },
  { num: "10", title: "Updates", href: "updates" },
];

const APPROACH_CHECKS = [
  "Analytical verification",
  "Batch-specific records",
  "Controlled release review",
  "Label and lot integrity",
  "Internal inspection standards",
  "Research identification",
];

const COA_LEFT = [
  "Batch-specific Certificates of Analysis (COAs)",
  "Lot and batch identification",
  "Product identity documentation",
  "Labeling for research identification",
];

const COA_RIGHT = [
  "Internal quality review records",
  "Packaging and fulfillment checks",
  "Release review procedures",
  "Documentation retention where applicable",
];

export default function SourcingPolicyPage() {
  return (
    <>
      <section className="cp-info-hero cp-info-quality -mt-[90px] bg-charcoal pb-16 pt-[150px] text-center text-white md:-mt-[100px] md:pb-24 md:pt-[170px]">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Legal · Compliance</p>
          <h1 className="font-display text-3xl font-semibold uppercase leading-tight md:text-5xl">
            Sourcing & Quality Policy
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
            EVLV is built around analytical quality, documentation and batch integrity - not where a compound was
            made. Here&apos;s how we think about sourcing, and why we keep supplier identities confidential.
          </p>
          <p className="mt-4 text-xs text-white/40">Effective date: September 2025</p>

          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
            {BADGES.map((b) => (
              <span key={b} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/70">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <div className="mb-14 rounded-lg border border-stone bg-ivory-soft p-5 md:p-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/40">Policy Sections</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {SECTIONS.map((s) => (
                <a key={s.href} href={`#${s.href}`} className="text-charcoal/60 transition hover:text-sage-deep">
                  {s.num}. {s.title}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-14">
            <PolicySection id="purpose" num="1" title="Purpose of This Policy">
              <p>
                This policy explains how EVLV approaches supplier confidentiality, analytical verification, batch
                documentation and quality review for the research-use-only compounds we supply. Our aim is to be
                clear about what we verify, what we document, and why we don&apos;t publish specific supplier
                identities or sourcing locations.
              </p>
              <p className="mt-3">
                We evaluate products on testing, documentation, batch integrity and release standards - not
                marketing claims tied to a country of origin.
              </p>
            </PolicySection>

            <PolicySection id="approach" num="2" title="Our Sourcing Approach">
              <p>
                EVLV works with vetted manufacturing and supply partners to keep research compounds consistently
                available. Products may move through different supply channels depending on availability,
                production schedules, inventory planning and quality requirements.
              </p>
              <p className="mt-3">
                We don&apos;t represent a product as better or worse based on geographic origin alone. Instead, we
                focus on standards we can actually verify:
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {APPROACH_CHECKS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                    <i className="ri-checkbox-circle-line mt-0.5 shrink-0 text-sage-deep" /> {item}
                  </li>
                ))}
              </ul>
            </PolicySection>

            <PolicySection id="confidentiality" num="3" title="Supplier & Manufacturing Confidentiality">
              <p>
                EVLV works with a network of vetted manufacturing and supply partners. Consistent with standard
                practice across pharmaceutical, research, specialty-chemical and laboratory-supply chains, we don&apos;t
                publish specific manufacturers, laboratories, supplier names, production facilities or sourcing
                locations.
              </p>
              <p className="mt-3">
                Keeping supplier details confidential protects supply-chain integrity, supports long-term quality
                partnerships, reduces disruption risk, and helps us keep quality consistent from batch to batch.
              </p>
              <p className="mt-3 text-sm font-semibold text-charcoal">
                Confidentiality doesn&apos;t replace verification - we still use analytical documentation and batch
                review to decide what actually ships.
              </p>
            </PolicySection>

            <PolicySection id="quality" num="4" title="Independent Quality Verification">
              <p>
                Every product goes through quality review before release. Where applicable, we use independent
                third-party analytical testing to verify identity, purity and related quality attributes against
                our internal benchmarks.
              </p>
              <p className="mt-3">
                That review can include analytical documentation, batch inspection, label verification, lot
                tracking, and comparison against our internal acceptance standards. Every product meets these
                requirements before distribution, regardless of supplier or region.
              </p>
            </PolicySection>

            <PolicySection id="coa" num="5" title="Certificates of Analysis & Batch Traceability">
              <p>EVLV supports batch-level documentation and traceability for everything we release. That can include:</p>
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ul className="space-y-2.5">
                  {COA_LEFT.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                      <i className="ri-file-shield-2-line mt-0.5 shrink-0 text-copper" /> {item}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2.5">
                  {COA_RIGHT.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                      <i className="ri-file-shield-2-line mt-0.5 shrink-0 text-copper" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-charcoal/60">
                COAs and testing records support research identification and quality review. They are not medical,
                therapeutic, diagnostic or regulatory approvals. See our{" "}
                <Link href="/coas" className="font-semibold text-copper hover:underline">
                  COA archive
                </Link>{" "}
                for published batch reports.
              </p>
            </PolicySection>

            <PolicySection id="regions" num="6" title="Multi-Region Supply & Quality Consistency">
              <p>
                Depending on availability, production requirements and supply-chain conditions, products may be
                sourced from more than one region. We don&apos;t treat region of origin as a proxy for quality -
                every product goes through the same internal quality expectations, documentation standards and
                analytical review regardless of where it was sourced.
              </p>
              <p className="mt-3 text-sm font-semibold text-charcoal">
                Testing, batch integrity, documentation and release review are our standard. Supplier location isn&apos;t.
              </p>
            </PolicySection>

            <PolicySection id="ruo" num="7" title="Research-Use-Only Positioning">
              <p>
                Everything EVLV supplies is intended strictly for research and laboratory use. Products are not
                intended for human consumption, veterinary use, diagnosis, treatment, mitigation, cure or prevention
                of disease, and we don&apos;t market them as finished pharmaceuticals, dietary supplements, food
                ingredients, cosmetics, medical treatments or veterinary products.
              </p>
              <p className="mt-3">
                Full detail on what our team can and can&apos;t discuss lives in our{" "}
                <Link href="/ruo" className="font-semibold text-copper hover:underline">
                  Research Use Only policy
                </Link>
                .
              </p>
            </PolicySection>

            <PolicySection id="requests" num="8" title="Documentation & Information Requests">
              <p>
                You can reach out about analytical testing, batch documentation, COA access, lot verification and
                other quality documentation covered by this policy. We&apos;ll provide what we can within appropriate
                confidentiality, compliance and operational limits.
              </p>
              <p className="mt-3">
                We may decline requests seeking confidential supplier details, protected business information,
                proprietary documentation, or anything outside the scope of research-use-only product support.
              </p>
            </PolicySection>

            <PolicySection id="limitations" num="9" title="Limitations of Disclosure">
              <p>
                EVLV doesn&apos;t disclose confidential supplier, manufacturer, laboratory, logistics, procurement or
                sourcing-location information, except where required by law, regulation, court order, valid legal
                process, or an authorized compliance review.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
                Nothing in this policy guarantees uninterrupted supply, identical sourcing for every batch, or
                disclosure of proprietary business relationships.
              </p>
            </PolicySection>

            <PolicySection id="updates" num="10" title="Policy Updates">
              <p>
                We may update this policy at any time to reflect operational changes, supply-chain developments,
                documentation practices, quality standards or compliance requirements. The most current version is
                always the one published on this page.
              </p>
            </PolicySection>
          </div>

          <div className="mt-16 rounded-lg border border-stone bg-charcoal p-8 text-center text-white md:p-10">
            <h3 className="font-display text-xl font-semibold md:text-2xl">Our commitment</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
              We believe independent testing, batch traceability, internal review and documentation are the
              meaningful indicators of quality - not supplier location or country-of-origin marketing. For questions
              about testing, documentation or quality standards, we&apos;re glad to help within the limits above.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-1 rounded-md bg-copper px-6 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-copper-light"
            >
              Contact Us <i className="ri-arrow-right-line" />
            </Link>
          </div>

          <div className="mt-12 border-t border-stone pt-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal/40">Related Legal Documents</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/ruo" className="text-charcoal/60 transition hover:text-charcoal">
                Research Use Only
              </Link>
              <Link href="/privacy" className="text-charcoal/60 transition hover:text-charcoal">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-charcoal/60 transition hover:text-charcoal">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PolicySection({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-28">
      <h2 className="flex items-baseline gap-2 font-display text-xl font-semibold text-charcoal">
        <span className="text-copper">{num}.</span> {title}
      </h2>
      <div className="mt-3 text-base leading-relaxed text-soft-gray">{children}</div>
    </div>
  );
}
