"use client";

import { useState } from "react";
import { Product } from "@/lib/types";

/**
 * Product-page FAQ accordion. Deliberately research-framed (identity,
 * purity, storage, documentation) rather than personal-use questions like
 * "how often should I take it" or "is it safe" -- see the RUO audit notes;
 * this pattern is the safe alternative to that kind of consumer-health FAQ
 * while keeping the same objection-handling/conversion purpose.
 */
export function ProductFaq({ product, title }: { product: Product; title: string }) {
  const items = [
    {
      q: `What is ${title}?`,
      a: `${title} is a research compound supplied strictly for laboratory and analytical research use. Product-specific laboratory documentation is shown when a matching report is available -- not for human or veterinary consumption.`,
    },
    {
      q: "What does the Certificate of Analysis verify?",
      a: `A matching Certificate of Analysis identifies the tested product and reports the methods and results supplied by the issuing laboratory${
        product.purity ? `, including a catalog purity value of ${product.purity} where supported` : ""
      }. Search the product or batch identifier in our public COA archive; if no exact match is listed, contact support before relying on a report.`,
    },
    {
      q: "How should it be stored, and does it need cold-chain shipping?",
      a: product.storage || "Store as indicated on the vial label. Details are published per batch in the Lab Report tab.",
    },
    {
      q: "What ships with my order?",
      a: "Your order ships in discreet packaging with tracking. Available product-specific documentation can be accessed through the public COA library.",
    },
    {
      q: "Can I order in bulk or for an institution?",
      a: "Yes -- for institutional, lab, or bulk research quantities, reach out through our Contact page and our team will follow up with pricing and lead time.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-stone border-y border-stone">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
            aria-expanded={open === i}
          >
            <span className="font-display text-base font-medium text-charcoal md:text-lg">{item.q}</span>
            <i className={`ri-add-line shrink-0 text-xl text-charcoal/40 transition-transform ${open === i ? "rotate-45" : ""}`} />
          </button>
          {open === i && <p className="max-w-3xl pb-5 text-sm leading-relaxed text-charcoal/60 md:text-base">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
