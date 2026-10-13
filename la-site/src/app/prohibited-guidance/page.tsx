import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prohibited Guidance Policy | Liberty Aminos",
  description:
    "Liberty Aminos' Prohibited Guidance Policy: what our staff can and cannot advise on, RUO status, prohibited categories, and customer responsibilities.",
  alternates: { canonical: "/prohibited-guidance" },
};

const PROHIBITED_CATEGORIES = [
  {
    icon: "ri-scales-3-line",
    title: "Human use",
    body: "Any guidance related to self-administration, personal dosing, injection, ingestion, topical use, or therapeutic application in humans.",
  },
  {
    icon: "ri-bear-smile-line",
    title: "Animal use",
    body: "Dosing, administration routes, or protocols for veterinary or animal research use.",
  },
  {
    icon: "ri-calculator-line",
    title: "Dosing & calculations",
    body: "Dose ranges, quantity calculations, unit conversions, or body-weight-based calculations for any purpose.",
  },
  {
    icon: "ri-clipboard-line",
    title: "Protocols",
    body: "Cycling schedules, stacking combinations, loading phases, titration plans, or sequencing protocols.",
  },
  {
    icon: "ri-syringe-line",
    title: "Administration advice",
    body: "Injection technique, route of administration, application site, or delivery method selection.",
  },
];

const CAN_PROVIDE = [
  "Compound identity, molecular formula, CAS number, and labeled quantity",
  "Certificate of Analysis (COA) data: lot number, lab, test date, purity result",
  "Safety Data Sheet (SDS) access for material safety information",
  "General storage and handling information as printed on product labels",
  "Order, shipping, payment, and account questions",
  "Links to publicly available scientific literature (presented without personalized interpretation)",
];

const STAFF_CONDUCT = [
  "Decline to answer any part of a request that falls into a prohibited category",
  "Restate that all products are sold for in-vitro research use only",
  "Where possible, redirect to a permissible question about order details, COA, or SDS",
  "Log repeated or concerning inquiries for compliance review",
];

const CUSTOMER_RESPONSIBILITIES = [
  "Confirm that purchasing, possessing, importing, and using products is lawful in your jurisdiction",
  "Obtain required institutional, regulatory, ethics, or biosafety approvals independently",
  "Maintain suitable laboratory facilities, equipment, and safety procedures",
  "Restrict access to qualified, authorized research personnel",
  "Review applicable safety information and conduct your own risk assessment",
  "Properly label, store, track, and dispose of research materials",
  "Prevent diversion, resale, or use outside legitimate in-vitro research",
];

const FAQ = [
  {
    q: "Can you tell me how to use this?",
    a: "No. Liberty Aminos products are sold for in-vitro research use only. We cannot provide dosing instructions, administration guidance, protocols, or any advice that could facilitate human or animal use — regardless of how the question is framed.",
  },
  {
    q: "What if I ask anyway?",
    a: "Our staff will decline to answer prohibited questions. Repeated requests may be flagged for compliance review, which can result in order cancellation, account restrictions, or refusal of future service.",
  },
  {
    q: "Where can I find safety data?",
    a: "Safety Data Sheets (SDS) are available in the COA Library for compounds that have published SDS documents. COA reports showing compound identity and purity results are available on the COA Library page and on each product page.",
  },
];

export default function ProhibitedGuidancePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="cp-info-hero -mt-[90px] pb-16 pt-[150px] text-center text-white md:-mt-[100px] md:pb-24 md:pt-[170px]"
        style={{ background: "var(--navy)" }}
      >
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Legal · Compliance
          </p>
          <h1 className="font-display text-3xl font-semibold uppercase leading-tight md:text-5xl">
            Prohibited Guidance Policy
          </h1>
          <p
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed md:text-base"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            What our staff cannot advise on, why, and what we can help with instead.
          </p>
          <p
            className="mt-4 text-xs"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Effective date: October 2026 · Applies to all Liberty Aminos channels
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-24" style={{ background: "var(--off-white)" }}>
        <div className="mx-auto max-w-[900px] px-4 md:px-8">

          {/* Alert box */}
          <div
            className="mb-14 rounded-lg p-6 md:p-8"
            style={{ border: "1px solid rgba(196,33,39,0.3)", background: "var(--red-light)" }}
          >
            <p
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] mb-3"
              style={{ color: "var(--red)" }}
            >
              <i className="ri-alert-line" /> Please read before contacting us
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
              Our staff cannot answer questions about dosing, administration, injection, reconstitution
              for personal use, treatment recommendations, or protocols — no matter how the question
              is worded. We are happy to help with COA data, SDS access, orders, and product specifications.
            </p>
          </div>

          <div className="space-y-14">

            {/* 1. Purpose & Scope */}
            <PolicySection num="1" title="Purpose &amp; Scope">
              <p>
                This policy defines what Liberty Aminos staff, contractors, and representatives may
                not advise on across all channels — product pages, email, chat, phone, support tickets,
                and social media — and applies regardless of how a request is framed (hypothetical,
                professional, educational, or on behalf of a third party).
              </p>
              <p className="mt-3">
                It supplements the{" "}
                <Link href="/ruo" className="font-semibold underline underline-offset-2" style={{ color: "var(--navy)" }}>
                  Research Use Policy
                </Link>{" "}
                and applies to all customer-facing personnel.
              </p>
            </PolicySection>

            {/* 2. RUO Status */}
            <PolicySection num="2" title="RUO Status">
              <p>
                All Liberty Aminos products are sold exclusively for <strong>in-vitro (laboratory)
                research use only</strong>. Products are not drugs, supplements, foods, cosmetics, or
                medical devices. They are not intended to diagnose, treat, cure, or prevent any
                condition in humans or animals.
              </p>
              <p className="mt-3">
                Purchasers must be 21+ and must obtain products for lawful research purposes only.
              </p>
            </PolicySection>

            {/* 3. Prohibited categories */}
            <PolicySection num="3" title="Prohibited Guidance Categories">
              <p className="mb-5">
                Staff will not provide, confirm, calculate, or discuss anything in the following categories:
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {PROHIBITED_CATEGORIES.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg p-4"
                    style={{ border: "1px solid var(--border-subtle)", background: "white" }}
                  >
                    <i className={`${item.icon} text-xl mb-2 block`} style={{ color: "var(--red)" }} />
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--ink)" }}>{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </PolicySection>

            {/* 4. What we CAN provide */}
            <PolicySection num="4" title="What We Can Provide">
              <p className="mb-5">Within these limits, our team is glad to help with:</p>
              <ul className="space-y-2.5">
                {CAN_PROVIDE.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    <i className="ri-check-line mt-0.5 shrink-0" style={{ color: "var(--navy)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </PolicySection>

            {/* 5. Staff conduct */}
            <PolicySection num="5" title="Staff Conduct">
              <p className="mb-5">
                When a request includes a prohibited topic, every team member follows the same steps:
              </p>
              <ol className="space-y-3">
                {STAFF_CONDUCT.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ background: "var(--navy)" }}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </PolicySection>

            {/* 6. Customer responsibilities */}
            <PolicySection num="6" title="Customer Responsibilities">
              <p className="mb-5">
                By creating an account or purchasing from Liberty Aminos, you confirm that you are
                obtaining products for lawful research purposes and that you independently take
                responsibility for:
              </p>
              <ul className="space-y-2.5">
                {CUSTOMER_RESPONSIBILITIES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    <i className="ri-user-settings-line mt-0.5 shrink-0" style={{ color: "var(--navy)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </PolicySection>

            {/* 7. Enforcement */}
            <PolicySection num="7" title="Enforcement">
              <p>
                Liberty Aminos may review orders, communications, and account activity for signs of
                prohibited or non-compliant conduct. Where we reasonably believe a product may be
                used outside legitimate in-vitro research, we may decline to respond, hold an order
                for review, cancel or refuse an order, restrict or suspend an account, or refuse
                future service. Accepting one order does not obligate us to accept a future one.
              </p>
            </PolicySection>

            {/* 8. FAQ */}
            <PolicySection num="8" title="FAQ">
              <div className="space-y-6">
                {FAQ.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-lg p-5"
                    style={{ border: "1px solid var(--border-subtle)", background: "white" }}
                  >
                    <p className="font-semibold text-sm mb-2" style={{ color: "var(--ink)" }}>
                      {item.q}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </PolicySection>

          </div>

          {/* Footer CTA */}
          <div
            className="mt-16 rounded-lg p-8 text-center text-white md:p-10"
            style={{ background: "var(--navy)" }}
          >
            <h3 className="font-display text-xl font-semibold md:text-2xl">Research with responsibility</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              By purchasing from Liberty Aminos, you acknowledge our products are supplied exclusively
              for lawful in-vitro research and that our team cannot provide guidance for human or
              veterinary use.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-1 rounded-md bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wide transition hover:bg-[var(--off-white)]"
              style={{ color: "var(--navy)" }}
            >
              Contact Compliance <i className="ri-arrow-right-line" />
            </Link>
          </div>

          <div className="mt-12 border-t pt-8" style={{ borderColor: "var(--border-subtle)" }}>
            <p
              className="mb-3 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Related Legal Documents
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/ruo" className="transition hover:underline" style={{ color: "var(--muted)" }}>
                Research Use Policy
              </Link>
              <Link href="/privacy" className="transition hover:underline" style={{ color: "var(--muted)" }}>
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition hover:underline" style={{ color: "var(--muted)" }}>
                Terms of Service
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
      <h2
        className="flex items-baseline gap-2 font-display text-xl font-semibold"
        style={{ color: "var(--ink)" }}
      >
        <span style={{ color: "var(--navy)" }}>{num}.</span>{" "}
        <span dangerouslySetInnerHTML={{ __html: title }} />
      </h2>
      <div className="mt-3 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
        {children}
      </div>
    </div>
  );
}
