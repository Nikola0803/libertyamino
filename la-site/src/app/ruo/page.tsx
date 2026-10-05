import { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "Research Use Only Policy | EVLV",
  description:
    "EVLV's Research Use Only policy: what we can and cannot discuss, purchaser responsibilities, regulatory context and how prohibited inquiries are handled.",
  alternates: { canonical: "/ruo" },
};

const NOT_FOR = [
  "Human consumption or administration in any form",
  "Veterinary consumption or administration",
  "Household, cosmetic or personal-care application",
  "Compounding or preparation of a finished drug product",
  "Implantation, injection, ingestion or topical application",
  "Diagnostic, therapeutic or preventative use",
  "Clinical investigation, unless every legally required authorization has been independently obtained by the responsible investigator or institution",
];

const CANNOT_DISCUSS = [
  {
    icon: "ri-scales-3-line",
    title: "Dosing & Quantity Calculations",
    body: "Dosages, dose ranges, unit conversions, concentration math, frequency, timing or body-weight-based quantities.",
  },
  {
    icon: "ri-syringe-line",
    title: "Administration Instructions",
    body: "Injection technique, route of administration, application site, ingestion, topical or nasal use, or any other delivery method.",
  },
  {
    icon: "ri-drop-line",
    title: "Human-Use Reconstitution",
    body: "Solvent selection, liquid volume, concentration or mixing steps intended to prepare a product for personal use.",
  },
  {
    icon: "ri-repeat-line",
    title: "Stacking & Cycling",
    body: "Combining products, cycling schedules, loading phases, maintenance phases, titration plans or sequencing protocols.",
  },
  {
    icon: "ri-heart-pulse-line",
    title: "Medical Outcomes",
    body: "Expected benefits, treatment results, contraindications, side effects, interactions or symptom management.",
  },
  {
    icon: "ri-user-heart-line",
    title: "Personal Recommendations",
    body: "Selecting a product based on someone's goals, age, health history, lab results, medications or medical condition.",
  },
  {
    icon: "ri-first-aid-kit-line",
    title: "Human-Use Supplies",
    body: "Recommendations for needles, syringes, injection supplies, applicators or other administration accessories.",
  },
  {
    icon: "ri-checkbox-circle-line",
    title: "Third-Party Protocol Review",
    body: "Confirming, correcting or validating dosing, administration or human-use protocols found on forums, social media or elsewhere.",
  },
];

const CAN_DISCUSS = [
  "Order status, payment, shipping and delivery questions",
  "Product identity, labeled quantity and available package sizes",
  "Batch numbers and published Certificates of Analysis",
  "General descriptions of our analytical testing methods and reported lab results",
  "Storage or handling information printed on the product label for unopened research material",
  "General laboratory-handling guidance for qualified research environments, where it cannot reasonably be read as personal-use instruction",
  "Return, replacement, claim, account and customer-service policies",
  "Publicly available scientific literature, presented without individualized interpretation or use recommendations",
];

const RESPONSIBILITIES = [
  "Determining whether purchasing, possessing, importing, storing and using the material is lawful in your jurisdiction",
  "Obtaining any required institutional, regulatory, ethics, biosafety, import or governmental approvals",
  "Maintaining suitable laboratory facilities, equipment and safety procedures",
  "Restricting access to qualified, authorized research personnel",
  "Reviewing applicable safety information and conducting your own risk assessment",
  "Properly labeling, storing, tracking and disposing of research materials",
  "Preventing diversion, resale, transfer or use for any purpose outside legitimate research",
];

const ENFORCEMENT_STEPS = [
  "We decline to answer the prohibited part of the inquiry.",
  "We may restate that EVLV products are supplied for research use only.",
  "Where possible, we help with a separate, permissible question about the order, label, batch documentation or testing.",
  "Repeated or concerning inquiries may be logged and referred for compliance review.",
];

const RUO_FAQ = [
  {
    question: "Can EVLV calculate a dose or convert milligrams into units for me?",
    answer:
      "No. We can't perform, verify or discuss any calculation aimed at determining an amount for human or veterinary administration, regardless of how the question is framed.",
  },
  {
    question: "Can support walk me through reconstitution?",
    answer:
      "Not for personal, medical, cosmetic or veterinary use. We can share general laboratory-handling documentation for qualified research settings when it can't reasonably double as personal-use guidance.",
  },
  {
    question: "Can someone confirm whether a protocol I found online is correct?",
    answer:
      "No. We don't review, approve, correct or validate third-party dosing, administration, stacking, cycling or human-use protocols, sourced from anywhere.",
  },
  {
    question: "If EVLV links to a published study, does that mean the product is recommended for that use?",
    answer:
      "No. Scientific references are shared for general research context only. They aren't a recommendation, instruction or claim about safety or suitability for personal use.",
  },
  {
    question: "What can customer support actually help with?",
    answer:
      "Orders, shipping, payments, account access, batch identification, available Certificates of Analysis, site policies and other non-medical, administrative matters.",
  },
  {
    question: "What happens if I keep asking for guidance you can't provide?",
    answer:
      "Repeated requests may be referred for compliance review, and can lead to order cancellation, account restrictions, or refusal of future service.",
  },
];

export default function RuoPolicyPage() {
  return (
    <>
      <section className="cp-info-hero cp-info-quality -mt-[90px] bg-charcoal pb-16 pt-[150px] text-center text-white md:-mt-[100px] md:pb-24 md:pt-[170px]">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Legal · Compliance</p>
          <h1 className="font-display text-3xl font-semibold uppercase leading-tight md:text-5xl">
            Research Use Only Policy
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
            What EVLV supplies, what our team can and can&apos;t discuss with you, and what that means before you
            reach out.
          </p>
          <p className="mt-4 text-xs text-white/40">Effective date: August 2026 · Applies to our website, email, chat and phone support</p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <div className="mb-14 rounded-lg border border-copper/40 bg-copper/5 p-6 md:p-8">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-copper">
              <i className="ri-alert-line" /> Please read before contacting us
            </p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70 md:text-base">
              We can&apos;t answer questions about dosing, administration, injection, reconstitution for personal
              use, treatment recommendations, human-use protocols, or veterinary use - no matter how the question is
              worded. Our team is glad to help with orders, product documentation, testing results, and unopened-
              product storage instead.
            </p>
          </div>

          <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: "ri-flask-line", title: "Research Use Only", body: "Every product is supplied solely for controlled laboratory research and analytical testing." },
              { icon: "ri-forbid-line", title: "No Human-Use Guidance", body: "We don't provide directions, calculations or protocols for use in or on people or animals." },
              { icon: "ri-shield-check-line", title: "Enforced Consistently", body: "Suspected misuse can mean declined support, canceled orders or account restrictions." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-stone bg-white p-5">
                <i className={`${item.icon} text-2xl text-sage-deep`} />
                <p className="mt-3 text-sm font-semibold text-charcoal">{item.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-charcoal/55">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="space-y-14">
            <PolicySection num="1" title="Purpose & Scope">
              <p>
                This policy sets the boundaries of what EVLV, our staff, contractors and representatives can discuss
                about the products listed on this website. It covers every channel we use to talk to you - product
                pages, articles, Certificates of Analysis, email, live chat, phone, text, support tickets and social
                media - and it applies whether a request is framed as hypothetical, personal, professional,
                educational, or on behalf of someone or something else.
              </p>
            </PolicySection>

            <PolicySection num="2" title="What Research Use Only Means for Our Products">
              <p>
                Unless a product is expressly labeled otherwise, everything EVLV sells is intended exclusively for
                qualified laboratory, analytical and non-clinical research. Our products are not sold as drugs,
                foods, supplements, cosmetics or medical devices, and none of them are intended to diagnose, treat,
                cure or prevent any condition. Specifically, our products are not for:
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {NOT_FOR.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                    <i className="ri-close-circle-line mt-0.5 shrink-0 text-copper" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-charcoal/60">
                A product name, research description, published study, or customer review doesn&apos;t change this -
                none of it should be read as an instruction to use a product in humans or animals.
              </p>
            </PolicySection>

            <PolicySection num="3" title="Guidance We Cannot Provide">
              <p>
                Our team won&apos;t provide, confirm, calculate, interpret or discuss anything that could reasonably
                help facilitate human or veterinary use - directly, informally, hypothetically, or through examples.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {CANNOT_DISCUSS.map((item) => (
                  <div key={item.title} className="rounded-lg border border-stone bg-ivory-soft p-4">
                    <i className={`${item.icon} text-lg text-copper`} />
                    <p className="mt-2 text-sm font-semibold text-charcoal">{item.title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-charcoal/60">{item.body}</p>
                  </div>
                ))}
              </div>
            </PolicySection>

            <PolicySection num="4" title="Guidance We Can Provide">
              <p>Within these limits, our team is glad to help with the administrative and research-supply side of things:</p>
              <ul className="mt-5 space-y-2.5">
                {CAN_DISCUSS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                    <i className="ri-check-line mt-0.5 shrink-0 text-sage-deep" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-charcoal/60">
                Sharing a Certificate of Analysis, product spec, or research article isn&apos;t a recommendation
                about safety, dosage, administration or suitability for use in humans or animals.
              </p>
            </PolicySection>

            <PolicySection num="5" title="Scientific Literature & Educational Content">
              <p>
                We may reference published studies, lab findings, biochemical pathways or other scientific
                information purely for general research context. None of it is medical advice, and none of it
                endorses a clinical, therapeutic, diagnostic, cosmetic, veterinary or personal application - studies
                involving humans or animals describe third-party research only and don&apos;t change what our
                products are sold for. Product names, site categories, and search results shouldn&apos;t be read as
                personal-use instructions either.
              </p>
            </PolicySection>

            <PolicySection num="6" title="How We Handle a Prohibited Question">
              <p>
                When a request touches on dosing, administration or another prohibited topic, our team follows the
                same steps every time:
              </p>
              <ol className="mt-5 space-y-3">
                {ENFORCEMENT_STEPS.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-charcoal/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-semibold text-white">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </PolicySection>

            <PolicySection num="7" title="Purchaser Responsibilities">
              <p>
                By creating an account or purchasing from EVLV, you confirm that you&apos;re obtaining products for
                lawful research purposes and that you have the knowledge, facilities, training and authority to
                receive and handle them appropriately. You&apos;re independently responsible for:
              </p>
              <ul className="mt-5 space-y-2.5">
                {RESPONSIBILITIES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                    <i className="ri-user-settings-line mt-0.5 shrink-0 text-copper" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-charcoal/60">
                EVLV doesn&apos;t determine whether your proposed research satisfies federal, state, local,
                institutional or international requirements - that determination is yours to make.
              </p>
            </PolicySection>

            <PolicySection num="8" title="Accidental Exposure or Medical Concerns">
              <p>
                Our support team is not medically trained and can&apos;t diagnose symptoms, assess a reaction, or
                give emergency instructions. If a product has been ingested, injected, inhaled, absorbed, or
                otherwise involved in a human or animal exposure, contact a licensed medical professional, emergency
                services, poison control, or a veterinarian right away.
              </p>
              <p className="mt-3 text-sm font-semibold text-charcoal">
                Contacting EVLV is never a substitute for contacting qualified medical or emergency personnel.
              </p>
            </PolicySection>

            <PolicySection num="9" title="Regulatory Context">
              <p>
                EVLV operates as a supplier of materials for lawful laboratory research and analytical use.
                Requirements vary by product, labeling, intended use, and jurisdiction - the references below are
                general context, not a claim that any single rule covers every product, transaction or customer.
              </p>
              <div className="mt-5 space-y-3">
                {[
                  { code: "21 CFR Part 312", body: "Governs investigational new drugs and clinical investigations for products subject to the Federal Food, Drug, and Cosmetic Act." },
                  { code: "21 CFR § 312.160", body: "Covers shipment of certain drugs intended solely for in-vitro testing or laboratory-animal research, including labeling and recordkeeping conditions." },
                  { code: "21 U.S.C. § 331", body: "Lists prohibited acts under the Federal Food, Drug, and Cosmetic Act, including conduct involving adulterated, misbranded or unlawfully distributed products." },
                ].map((item) => (
                  <div key={item.code} className="rounded-lg border border-stone bg-ivory-soft p-4">
                    <p className="font-mono text-xs font-semibold text-sage-deep">{item.code}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-charcoal/60">{item.body}</p>
                  </div>
                ))}
              </div>
            </PolicySection>

            <PolicySection num="10" title="Compliance Review & Enforcement">
              <p>
                We may review orders, communications and account activity for signs of prohibited, unsafe or
                non-compliant conduct. Where we reasonably believe a product may be diverted away from legitimate
                research use, we may decline to respond, request additional verification, hold an order for manual
                review, cancel or refuse an order, restrict or suspend an account, refuse future service, or
                preserve records as permitted or required by law. Accepting one order doesn&apos;t obligate us to
                accept a future one, and not enforcing this policy on one occasion doesn&apos;t waive our right to
                enforce it later.
              </p>
            </PolicySection>

            <PolicySection num="11" title="Questions We Get Often">
              <Accordion items={RUO_FAQ} />
            </PolicySection>

            <PolicySection num="12" title="Updates to This Policy">
              <p>
                We may update this policy to reflect changes in our operations, regulations, or safety practices.
                The version published on this page at the time of your order governs, unless the law requires
                otherwise. If any part of this policy is found unenforceable, the rest continues to apply.
              </p>
            </PolicySection>
          </div>

          <div className="mt-16 rounded-lg border border-stone bg-charcoal p-8 text-center text-white md:p-10">
            <h3 className="font-display text-xl font-semibold md:text-2xl">Research with responsibility</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
              By purchasing from EVLV, you acknowledge our products are supplied exclusively for lawful research and
              that our team can&apos;t provide guidance for human or veterinary use.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-1 rounded-md bg-copper px-6 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-copper-light"
            >
              Contact Compliance <i className="ri-arrow-right-line" />
            </Link>
          </div>

          <div className="mt-12 border-t border-stone pt-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal/40">Related Legal Documents</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="text-charcoal/60 transition hover:text-charcoal">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-charcoal/60 transition hover:text-charcoal">
                Terms of Service
              </Link>
              <Link href="/returns" className="text-charcoal/60 transition hover:text-charcoal">
                Returns Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PolicySection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="flex items-baseline gap-2 font-display text-xl font-semibold text-charcoal">
        <span className="text-copper">{num}.</span> {title}
      </h2>
      <div className="mt-3 text-base leading-relaxed text-soft-gray">{children}</div>
    </div>
  );
}
