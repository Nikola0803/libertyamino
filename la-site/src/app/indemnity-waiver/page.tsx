import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Indemnity & Liability Waiver | Liberty Aminos",
  description:
    "The Indemnity, Liability Waiver & Assumption of Risk Agreement that applies to every Liberty Aminos research peptide order.",
  alternates: { canonical: "/indemnity-waiver" },
};

const SECTIONS = [
  { num: "1", title: "Research Use Only", href: "acknowledgment" },
  { num: "2", title: "Age & Legal Compliance", href: "age" },
  { num: "3", title: "Prohibited Uses", href: "prohibited" },
  { num: "4", title: "No Medical Claims", href: "warranties" },
  { num: "5", title: "Assumption of Risk", href: "risk" },
  { num: "6", title: "Release of Liability", href: "release" },
  { num: "7", title: "Indemnification", href: "indemnification" },
  { num: "8", title: "Handling & Storage", href: "handling" },
  { num: "9", title: "Verification & Account Review", href: "verification" },
  { num: "10", title: "Related Policies", href: "policies" },
  { num: "11", title: "Electronic Acceptance", href: "electronic" },
  { num: "12", title: "Governing Law", href: "law" },
];

const PROHIBITED_USES = [
  "Human consumption",
  "Veterinary use",
  "Medical treatment",
  "Diagnostic procedures",
  "Food or dietary use",
  "Cosmetic use",
  "Injection or administration",
  "Resale for unauthorized use",
  "Controlled substance activity",
  "Any purpose outside legitimate research",
];

const RELEASE_ITEMS = [
  "Purchase, possession, handling, storage, use, misuse or disposal of products",
  "Failure to follow applicable laws, safety practices or research protocols",
  "Unauthorized human, veterinary, therapeutic, diagnostic, cosmetic, dietary or clinical use",
  "Improper storage, transportation, preparation or reconstitution",
  "Third-party claims, property damage, personal injury, regulatory action or financial loss",
  "Any conduct inconsistent with this Agreement or Liberty Aminos's policies",
];

const INDEMNIFY_ITEMS = [
  "Your purchase, possession, handling, storage, use, misuse, transfer, resale or disposal of products",
  "Your violation of this Agreement or any Liberty Aminos policy",
  "Misrepresentation of eligibility, research intent, identity, account information, shipping information or legal compliance",
  "Any third-party claim related to products you purchased or facilitated",
  "Any regulatory, civil, criminal or administrative action arising from your conduct",
];

const HANDLING_ITEMS = [
  "Secure storage",
  "Access control",
  "Appropriate labeling",
  "Protective equipment",
  "Qualified personnel",
  "Research documentation",
  "Compliant disposal",
  "Applicable protocols",
];

const RELATED_POLICIES = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/ruo", label: "Research Use Only Policy" },
  { href: "/sourcing", label: "Sourcing & Quality Policy" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/shipping", label: "Shipping Policy" },
  { href: "/returns", label: "Returns Policy" },
];

export default function IndemnityWaiverPage() {
  return (
    <>
      <section className="-mt-[90px] bg-navy pb-16 pt-[150px] text-center text-white md:-mt-[100px] md:pb-24 md:pt-[170px]">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">Legal Agreement · Research Use Only</p>
          <h1 className="font-display text-3xl font-semibold uppercase leading-tight md:text-5xl">
            Indemnity & Liability Waiver
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
            This Indemnity, Liability Waiver &amp; Assumption of Risk Agreement applies to every research peptide,
            reagent and related research-use-only material purchased through Liberty Aminos.
          </p>
          <p className="mt-4 text-xs text-white/40">Effective date: August 2026</p>
        </div>
      </section>

      <section className="bg-off-white py-16 md:py-24">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <div className="mb-14 rounded-lg border border-navy/40 bg-navy/5 p-6 md:p-8">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-navy">
              <i className="ri-scales-3-line" /> Read before purchasing
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/70 md:text-base">
              By browsing Liberty Aminos product pages, creating an account, proceeding through checkout, submitting an order,
              or otherwise accepting this Agreement electronically, you confirm that you&apos;ve read, understood,
              and voluntarily agreed to the terms below. Liberty Aminos products are sold strictly for laboratory research -
              not for human consumption, veterinary use, diagnostic use, therapeutic use, food use, cosmetic use, or
              any other unauthorized application.
            </p>
          </div>

          <div className="mb-14 rounded-lg border border-border-subtle bg-surface p-5 md:p-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/40">Agreement Sections</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {SECTIONS.map((s) => (
                <a key={s.href} href={`#${s.href}`} className="text-ink/60 transition hover:text-navy">
                  {s.num}. {s.title}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-14">
            <PolicySection id="acknowledgment" num="1" title="Acknowledgment of Research Use Only">
              <p>
                By purchasing research compounds, peptides, reagents or other research-use-only materials from
                Liberty Aminos, you acknowledge and agree that all products are intended strictly for legitimate laboratory
                research.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Products are not approved for human consumption, veterinary use, diagnostic use, therapeutic use, or clinical application.",
                  "Products have not been evaluated or approved by the FDA or any other regulatory authority for medical, dietary, cosmetic or veterinary use.",
                  "You are solely responsible for proper handling, storage, use, disposal, recordkeeping and legal compliance.",
                  "Any use outside legitimate research voids any support, warranty, claim, replacement or other accommodation that might otherwise be available.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/70">
                    <i className="ri-close-circle-line mt-0.5 shrink-0 text-navy" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-ink/60">
                Full detail on what our team can and can&apos;t discuss lives in our{" "}
                <Link href="/ruo" className="font-semibold text-navy hover:underline">
                  Research Use Only policy
                </Link>
                . We don&apos;t provide dosing guidance, reconstitution protocols for personal use, administration
                instructions, or clinical interpretation.
              </p>
            </PolicySection>

            <PolicySection id="age" num="2" title="Age Verification & Legal Compliance">
              <p>
                You represent and warrant that you are at least 21 years of age and legally authorized to purchase,
                possess, receive, store and use research compounds in your jurisdiction.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "You're responsible for knowing and following applicable federal, state, local, institutional and workplace requirements.",
                  "Liberty Aminos may request verification of identity, age, billing or shipping information, or research-use eligibility before accepting or fulfilling an order.",
                  "Liberty Aminos may refuse, cancel or restrict orders where legal compliance, age verification, account integrity, fraud risk or suspected misuse can't reasonably be verified.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/70">
                    <i className="ri-shield-check-line mt-0.5 shrink-0 text-navy" /> {item}
                  </li>
                ))}
              </ul>
            </PolicySection>

            <PolicySection id="prohibited" num="3" title="Prohibited Uses">
              <p>You agree that products purchased from Liberty Aminos will not be used for any unlawful, unsafe or unauthorized purpose, including but not limited to:</p>
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {PROHIBITED_USES.map((item) => (
                  <div key={item} className="rounded-md border border-border-subtle bg-surface px-3 py-2 text-xs font-medium text-ink/70">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink/60">
                Any indication of misuse, intended misuse, diversion, unlawful resale, or activity inconsistent with
                research-use-only restrictions can result in order cancellation, account restriction, refusal of
                future service, and cooperation with appropriate authorities where required or permitted by law.
              </p>
            </PolicySection>

            <PolicySection id="warranties" num="4" title="No Medical Claims & No Warranties">
              <p>
                Liberty Aminos makes no express or implied medical claims about the safety, efficacy, suitability or intended
                use of any product for human or animal applications. We don&apos;t guarantee research outcomes,
                experimental results, product performance in any specific methodology, or suitability for a
                particular protocol.
              </p>
              <p className="mt-3">
                Website content, labels, COAs, descriptions, educational material and support communications are
                provided for informational and order-related purposes only. Products are supplied as research-use-
                only materials and, to the fullest extent permitted by law, are sold without warranties of
                merchantability, fitness for a particular purpose, or suitability for any unauthorized application.
              </p>
            </PolicySection>

            <PolicySection id="risk" num="5" title="Assumption of Risk">
              <p>
                Research compounds can require specialized knowledge, equipment, protocols, facilities, storage
                conditions, safety procedures and disposal methods. You voluntarily assume all risks associated
                with the purchase, possession, storage, handling, use, transfer, disposal or misuse of any Liberty Aminos
                product.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">
                Shipping duration, temperature exposure, reconstitution variables, laboratory handling methods,
                storage conditions, diluent quality, research methodology and experimental design are outside
                Liberty AminosLiberty Aminos&apos;sapos;s control once a product leaves our custody.
              </p>
            </PolicySection>

            <PolicySection id="release" num="6" title="Release of Liability">
              <p>To the fullest extent permitted by applicable law, you agree to release Liberty Aminos, its owners, officers, employees, contractors, affiliates, vendors, fulfillment partners, payment processors and agents from liability arising out of or related to:</p>
              <ul className="mt-5 space-y-2.5">
                {RELEASE_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/70">
                    <i className="ri-file-shield-2-line mt-0.5 shrink-0 text-navy" /> {item}
                  </li>
                ))}
              </ul>
            </PolicySection>

            <PolicySection id="indemnification" num="7" title="Indemnification">
              <p>You agree to indemnify, defend and hold harmless Liberty Aminos, its owners, officers, employees, contractors, affiliates, vendors, fulfillment partners, payment processors and agents from any claims, liabilities, damages, losses, penalties, fines, regulatory actions, costs or expenses - including reasonable legal fees - arising from or related to:</p>
              <ul className="mt-5 space-y-2.5">
                {INDEMNIFY_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/70">
                    <i className="ri-file-warning-line mt-0.5 shrink-0 text-navy" /> {item}
                  </li>
                ))}
              </ul>
            </PolicySection>

            <PolicySection id="handling" num="8" title="Laboratory Handling, Storage & Disposal">
              <p>You're solely responsible for maintaining appropriate research controls and safety practices, including:</p>
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {HANDLING_ITEMS.map((item) => (
                  <div key={item} className="rounded-md border border-border-subtle bg-surface px-3 py-2 text-center text-xs font-medium text-ink/70">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink/60">
                Failing to maintain appropriate controls, documentation, storage or handling practices releases Liberty Aminos
                from any obligation related to product condition, research outcomes, complaint eligibility, refund
                eligibility, replacement eligibility or support.
              </p>
            </PolicySection>

            <PolicySection id="verification" num="9" title="Verification & Account Review">
              <p>
                Liberty Aminos may use age verification, account verification, login safeguards, know-your-customer-style
                review, checkout certifications or other reasonable procedures to support account security,
                compliance and fraud prevention.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "You must provide accurate name, email, billing, shipping and account information.",
                  "False information, suspected misuse, fraud indicators, chargeback abuse, policy violations, or refusal to provide required verification may result in account restriction or order cancellation.",
                  "Verification information is handled according to our Privacy Policy and applicable law.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/70">
                    <i className="ri-user-search-line mt-0.5 shrink-0 text-navy" /> {item}
                  </li>
                ))}
              </ul>
            </PolicySection>

            <PolicySection id="policies" num="10" title="Related Policies">
              <p>This Agreement works alongside every other Liberty Aminos policy. By placing an order, you agree to the applicable policies then in effect, including:</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {RELATED_POLICIES.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-xs font-medium text-ink/70 transition hover:border-navy-light hover:text-navy"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </PolicySection>

            <PolicySection id="electronic" num="11" title="Electronic Acceptance & Signature">
              <p>
                By checking an agreement box, creating an account, accessing gated product pages, submitting an
                order, completing checkout, or otherwise electronically accepting Liberty AminosLiberty Aminos&apos;sapos;s terms, you confirm
                that your electronic acceptance constitutes a valid, binding signature to the fullest extent
                permitted by applicable law.
              </p>
              <div className="mt-5 rounded-lg border border-border-subtle bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">Electronic Acceptance Statement</p>
                <p className="mt-2 text-sm italic leading-relaxed text-ink/70">
                  &ldquo;I have read, understood, and voluntarily agree to this Indemnity Waiver Agreement for
                  Research Compounds. I acknowledge that products are strictly for laboratory research use only and
                  that I accept all responsibilities, risks, releases, and indemnification obligations described
                  herein.&rdquo;
                </p>
              </div>
            </PolicySection>

            <PolicySection id="law" num="12" title="Binding Agreement & Governing Law">
              <p>
                This Agreement is binding on you and, where applicable, your heirs, executors, administrators,
                successors, assigns, representatives, employer, institution or affiliated entity.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "This Agreement is governed by the laws applicable in the jurisdiction where Liberty Aminos operates, without regard to conflict-of-law principles.",
                  "If any provision is found invalid or unenforceable, the remaining provisions remain in full force and effect.",
                  "A printed or electronic copy of this Agreement and your acceptance of it may be used in legal, regulatory, payment or dispute proceedings.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/70">
                    <i className="ri-hammer-line mt-0.5 shrink-0 text-navy" /> {item}
                  </li>
                ))}
              </ul>
            </PolicySection>
          </div>

          <div className="mt-16 rounded-lg border border-border-subtle bg-navy p-8 text-center text-white md:p-10">
            <h3 className="font-display text-xl font-semibold md:text-2xl">Final acknowledgment</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
              By proceeding with a purchase from Liberty Aminos, you confirm that you&apos;ve read, understood and voluntarily
              agreed to this Agreement - and that products are strictly for laboratory research use, not for human
              or veterinary use, and will be handled only in compliance with applicable laws, safety standards, and
              research-use restrictions.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-1 rounded-md bg-navy px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink transition hover:bg-navy-light"
            >
              Contact Us <i className="ri-arrow-right-line" />
            </Link>
          </div>

          <div className="mt-12 border-t border-border-subtle pt-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink/40">Related Legal Documents</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/ruo" className="text-ink/60 transition hover:text-ink">
                Research Use Only
              </Link>
              <Link href="/sourcing" className="text-ink/60 transition hover:text-ink">
                Sourcing & Quality
              </Link>
              <Link href="/terms" className="text-ink/60 transition hover:text-ink">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-ink/60 transition hover:text-ink">
                Privacy Policy
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
      <h2 className="flex items-baseline gap-2 font-display text-xl font-semibold text-ink">
        <span className="text-navy">{num}.</span> {title}
      </h2>
      <div className="mt-3 text-base leading-relaxed text-soft-gray">{children}</div>
    </div>
  );
}
