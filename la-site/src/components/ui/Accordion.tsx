"use client";

import { useState } from "react";

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.question}
            className={`rounded-xl border transition ${isOpen ? "border-sage-light bg-sage-mist/40" : "border-stone hover:border-sage-light/60"}`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
              aria-expanded={isOpen}
            >
              <h3 className="font-display text-base font-semibold text-charcoal md:text-lg">{item.question}</h3>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${isOpen ? "bg-sage text-white" : "bg-ivory-soft text-charcoal/50"}`}>
                <i className={isOpen ? "ri-subtract-line text-lg" : "ri-add-line text-lg"} />
              </div>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 md:px-6 md:pb-6">
                <p className="whitespace-pre-line text-sm leading-relaxed text-charcoal/65 md:text-base">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
