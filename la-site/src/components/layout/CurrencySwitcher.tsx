"use client";

import { useCurrency, type Currency } from "@/lib/currency-context";

const OPTIONS: Currency[] = ["USD", "CAD"];

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center rounded-full border border-white/20 p-0.5 text-[10px] font-semibold uppercase tracking-wide">
      {OPTIONS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={`rounded-full px-2.5 py-0.5 transition ${currency === c ? "bg-copper text-charcoal" : "text-white/60 hover:text-white"}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
