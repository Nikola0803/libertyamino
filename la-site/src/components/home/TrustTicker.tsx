const ITEMS = [
  "U.S. Fulfillment",
  "Batch-Level COAs",
  "Independent Lab Reports",
  "99%+ Purity HPLC",
  "Buy More, Save More",
  "Research Use Only · 21+",
];

// One continuous marquee row, duplicated once so the CSS animation can
// scroll a full width and loop seamlessly (see .animate-ticker in globals.css).
function TickerRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex flex-shrink-0 items-center" aria-hidden={ariaHidden}>
      {ITEMS.map((item, i) => (
        <span key={i} className="mx-8 inline-flex items-center whitespace-nowrap">
          <span
            className="mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full"
            style={{ background: "var(--color-navy)" }}
          />
          <span
            className="font-sans text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}

export function TrustTicker() {
  return (
    <div
      className="relative z-40 w-full overflow-hidden py-2.5"
      style={{ borderBottom: "1px solid var(--color-border-subtle)", background: "var(--color-off-white)" }}
    >
      <div className="flex animate-ticker">
        <TickerRow />
        <TickerRow ariaHidden />
      </div>
    </div>
  );
}
