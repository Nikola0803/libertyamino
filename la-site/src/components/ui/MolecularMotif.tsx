/**
 * Shared molecular-graphic language (brief section 11) -- the same visual
 * vocabulary as ShopByCategory's CategoryArt (fragmented/particles/
 * expanding/concentric), reused here as a subtle, restrained-opacity
 * background decoration on dark sections so the motif reads as one
 * consistent system across the page, not confined to category cards.
 */
export function MolecularMotif({
  variant,
  className = "",
}: {
  variant: "concentric" | "particles";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {variant === "concentric" &&
        [80, 60, 40, 20].map((r, i) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={i === 3 ? "#B8875A" : "#FFFFFF"} strokeWidth={i === 3 ? 1.5 : 1} opacity={i === 3 ? 0.5 : 0.08 + i * 0.03} />
        ))}
      {variant === "particles" && (
        <>
          <circle cx="100" cy="100" r="74" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.1" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x = 100 + Math.cos(angle) * 74;
            const y = 100 + Math.sin(angle) * 74;
            return <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 3 : 1.5} fill={i % 4 === 0 ? "#B8875A" : "#FFFFFF"} opacity={i % 4 === 0 ? 0.45 : 0.15} />;
          })}
        </>
      )}
    </svg>
  );
}
