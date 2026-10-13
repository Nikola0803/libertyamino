const ITEMS = ["Free Shipping $300+", "Exact COAs Clearly Labeled", "Research Use Only", "Not for Human Consumption", "U.S. Fulfillment", "Transparent Batch Data"];

// One continuous marquee row, duplicated once so the CSS animation can
// scroll a full width and loop seamlessly (see .animate-ticker in
// globals.css). The U.S. fulfillment item gets the same visual emphasis
// without making an unsupported country-of-origin manufacturing claim.
function TickerRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex flex-shrink-0 items-center" aria-hidden={ariaHidden}>
      {ITEMS.map((item, i) => (
        <span key={i} className="mx-8 inline-flex items-center whitespace-nowrap">
          <span className="mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-navy" />
          <span
            className={`font-sans text-[10px] uppercase tracking-widest ${
              item === "U.S. Fulfillment" ? "font-semibold text-navy-dark" : "font-normal text-ink"
            }`}
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
    <div className="relative z-40 w-full overflow-hidden border-b border-border-subtle bg-off-white py-2.5">
      <div className="flex animate-ticker">
        <TickerRow />
        <TickerRow ariaHidden />
      </div>
    </div>
  );
}
