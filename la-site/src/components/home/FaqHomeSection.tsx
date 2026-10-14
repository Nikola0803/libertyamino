"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

const LA_FAQ = [
  {
    question: "What does 'Research Use Only' mean?",
    answer:
      "All compounds sold by Liberty Aminos are supplied strictly for in-vitro and laboratory research. They are not intended, labeled, or approved for human or animal diagnostic, therapeutic, or consumptive use of any kind. Purchasers must be 21 or older and have a legitimate laboratory research purpose.",
  },
  {
    question: "How do I verify my compound's purity?",
    answer:
      "Every active lot has a published Certificate of Analysis issued by an independent accredited laboratory. Visit the COA Library and enter your lot number, or scan the QR code on your vial label to open the corresponding report. Purity is confirmed via HPLC analysis.",
  },
  {
    question: "How are orders shipped?",
    answer:
      "Orders are dispatched from the United States. In-stock orders placed before the daily cut-off are processed the same business day. Tracking information is emailed automatically when your shipment is accepted by the carrier. Most domestic orders arrive within 1–2 business days.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept P2P bank transfer, BTC, USDC, and USDT. Full payment instructions are shown on the order confirmation page and included in your order email. Orders are held for 2 hours pending payment; unpaid orders are automatically cancelled and reserved stock is released.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Domestic US orders ship via our standard fulfilment. For international research institution orders, please contact us directly to discuss shipping options, documentation requirements, and applicable regulations for your country.",
  },
  {
    question: "What is the Heroes Program?",
    answer:
      "Liberty Aminos offers a 15% lifetime discount for active and veteran military personnel, first responders, EMS, and firefighters. Apply on our Heroes page — eligibility is verified before the discount is activated on your account.",
  },
] as const;

export function FaqHomeSection() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LA_FAQ;
    return LA_FAQ.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <section
      style={{ background: "var(--color-off-white)", paddingBlock: "5rem 7rem" }}
    >
      <Reveal className="mx-auto grid max-w-[1400px] gap-10 px-4 md:grid-cols-3 md:px-8">
        {/* Left column */}
        <div className="md:col-span-1">
          <p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-navy)" }}
          >
            Common Questions
          </p>
          <h2
            className="font-display text-3xl font-semibold leading-tight md:text-4xl"
            style={{ color: "var(--color-ink)" }}
          >
            Answers before you order.
          </h2>
          <p
            className="mt-4 max-w-xs text-sm leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            Clear answers on RUO compliance, COA verification, shipping, and payment.
          </p>

          <div className="relative mt-6">
            <i
              className="ri-search-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-muted)", opacity: 0.5 }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions"
              className="w-full rounded-md py-2.5 pl-10 pr-4 text-sm transition-colors focus:outline-none"
              style={{
                border: "1px solid var(--color-border-subtle)",
                background: "#fff",
                color: "var(--color-ink)",
              }}
            />
          </div>
        </div>

        {/* Right column — accordion */}
        <div className="md:col-span-2">
          {filtered.length === 0 ? (
            <p
              className="py-10 text-sm"
              style={{ color: "var(--color-muted)" }}
            >
              No questions match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            filtered.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.question}
                  className="py-5"
                  style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className="text-xs font-semibold tabular-nums"
                        style={{ color: "var(--color-navy)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-sm font-medium md:text-base"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {item.question}
                      </span>
                    </span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm transition ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      style={{
                        borderColor: isOpen ? "var(--color-navy)" : "var(--color-border-subtle)",
                        background: isOpen ? "var(--color-navy)" : "transparent",
                        color: isOpen ? "#fff" : "var(--color-ink)",
                      }}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p
                      className="max-w-2xl pl-9 pt-3 text-sm leading-relaxed"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })
          )}

          <div className="mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition"
              style={{ color: "var(--color-navy)" }}
            >
              View All FAQs <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Heroes link */}
      <div className="mx-auto mt-8 max-w-[1400px] px-4 md:px-8">
        <Link
          href="/heroes"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--color-red)" }}
        >
          <span
            style={{
              padding: "2px 8px",
              background: "var(--color-red-light)",
              border: "1px solid var(--color-red)",
              borderRadius: 12,
              fontSize: 10,
              fontWeight: 700,
              color: "var(--color-red)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Heroes
          </span>
          Military · First Responders · EMS · Fire — 15% lifetime discount →
        </Link>
      </div>
    </section>
  );
}
