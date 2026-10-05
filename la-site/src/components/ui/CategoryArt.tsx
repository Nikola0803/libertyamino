/**
 * Each category gets its own visual expression of "transformation" instead
 * of a generic molecular-diagram icon, per the EVLV motif system: fragmented
 * lines reconnecting, particle systems, expanding structures, concentric
 * layers - obsidian/charcoal/copper only, no green (green is reserved for
 * brand sections, not decorative category art).
 *
 * Split out of ShopByCategory.tsx so the homepage's "Shop by goal" section
 * can be restored to its original design (see ShopByCategory.tsx) without
 * losing this art, which ShopMegaMenu also depends on independently.
 */
export function CategoryArt({ variant, className = "" }: { variant: "fragmented" | "particles" | "expanding" | "concentric"; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-charcoal ${className}`}>
      {variant === "fragmented" && (
        <svg viewBox="0 0 160 200" className="h-[70%] w-auto" aria-hidden>
          <path d="M40 30 L60 60 M75 75 L95 100 M110 115 L120 170" stroke="#B8875A" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          <path d="M50 40 L45 20 M85 88 L105 78 M115 130 L135 125" stroke="#E7E3DA" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <circle cx="40" cy="30" r="3" fill="#E7E3DA" />
          <circle cx="75" cy="75" r="3.5" fill="#B8875A" />
          <circle cx="110" cy="115" r="4" fill="#E7E3DA" />
          <circle cx="120" cy="170" r="4.5" fill="#B8875A" />
        </svg>
      )}
      {variant === "particles" && (
        <svg viewBox="0 0 160 160" className="h-[70%] w-auto" aria-hidden>
          <circle cx="80" cy="80" r="58" fill="none" stroke="#314743" strokeWidth="1" opacity="0.6" />
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const r = 58;
            const x = 80 + Math.cos(angle) * r;
            const y = 80 + Math.sin(angle) * r;
            return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 3.5 : 2} fill={i % 5 === 0 ? "#B8875A" : "#E7E3DA"} opacity={i % 5 === 0 ? 0.95 : 0.45} />;
          })}
          <circle cx="80" cy="80" r="4" fill="#B8875A" />
        </svg>
      )}
      {variant === "expanding" && (
        <svg viewBox="0 0 160 160" className="h-[70%] w-auto" aria-hidden>
          <rect x="70" y="70" width="20" height="20" fill="none" stroke="#B8875A" strokeWidth="1.5" />
          <rect x="50" y="50" width="60" height="60" fill="none" stroke="#E7E3DA" strokeWidth="1" opacity="0.5" />
          <rect x="25" y="25" width="110" height="110" fill="none" stroke="#314743" strokeWidth="1" opacity="0.6" />
          <path d="M80 25 V10 M80 150 V135 M25 80 H10 M150 80 H135" stroke="#B8875A" strokeWidth="1" opacity="0.7" />
        </svg>
      )}
      {variant === "concentric" && (
        <svg viewBox="0 0 160 160" className="h-[70%] w-auto" aria-hidden>
          {[62, 46, 30, 14].map((r, i) => (
            <circle key={r} cx="80" cy="80" r={r} fill="none" stroke={i === 3 ? "#B8875A" : "#E7E3DA"} strokeWidth={i === 3 ? 1.5 : 1} opacity={i === 3 ? 0.9 : 0.3 + i * 0.08} />
          ))}
          <circle cx="80" cy="80" r="3" fill="#B8875A" />
        </svg>
      )}
    </div>
  );
}
