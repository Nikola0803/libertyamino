export function RatingStars({ rating, reviewCount, size = "sm" }: { rating: number; reviewCount?: number; size?: "sm" | "md" }) {
  const textSize = size === "md" ? "text-sm" : "text-xs";
  return (
    <div className={`flex items-center gap-1.5 ${textSize} text-charcoal/70`}>
      <span className="flex items-center gap-0.5 text-sage-deep">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2">
              <path d="M10 1.5l2.63 5.33 5.87.86-4.25 4.14 1 5.85L10 14.9l-5.25 2.78 1-5.85L1.5 7.69l5.87-.86L10 1.5z" strokeLinejoin="round" />
            </svg>
          );
        })}
      </span>
      <span className="font-medium text-charcoal">{rating.toFixed(1)}</span>
      {typeof reviewCount === "number" && <span>({reviewCount})</span>}
    </div>
  );
}
