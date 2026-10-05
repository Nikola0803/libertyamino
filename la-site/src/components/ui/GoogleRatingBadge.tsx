import { getGoogleReviews } from "@/lib/google-reviews";

// Shown until GOOGLE_PLACES_API_KEY/GOOGLE_PLACE_ID are configured (see
// lib/google-reviews.ts) -- once they are, this same badge switches over
// to the real live Google rating/review count automatically.
const PLACEHOLDER_RATING = 4.7;

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4 shrink-0" aria-hidden>
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18A13.96 13.96 0 0 1 10.9 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

function Stars({ rating, variant }: { rating: number; variant: "dark" | "light" }) {
  const emptyClass = variant === "light" ? "text-charcoal/20" : "text-white/30";
  return (
    <span className="inline-flex items-center gap-0.5 text-copper">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={i < Math.round(rating) ? "ri-star-fill text-[11px]" : `ri-star-line text-[11px] ${emptyClass}`} />
      ))}
    </span>
  );
}

/**
 * Small "Google Reviews" trust badge -- same rating source and 4.7
 * placeholder fallback as the homepage hero's version (lib/google-rating-
 * badge.ts, spliced into landing-content.json's scraped markup), just
 * rendered as a real React server component for use anywhere that isn't
 * that scraped markup (footer, product page, ReviewsSection).
 *
 * variant "dark" (default) is the translucent-on-charcoal look, for dark
 * sections (footer, homepage ReviewsSection). variant "light" is a white
 * chip with charcoal text, for light/white sections (product page).
 */
export async function GoogleRatingBadge({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const data = await getGoogleReviews();
  const rating = data && data.rating > 0 ? data.rating : PLACEHOLDER_RATING;
  const reviewCount = data?.reviewCount;
  const href = data?.mapsUrl;
  const label = reviewCount && reviewCount > 0 ? `${reviewCount.toLocaleString()}+ Google reviews` : "Google Reviews";

  const ratingTextClass = variant === "light" ? "text-charcoal" : "text-white";
  const labelTextClass = variant === "light" ? "text-charcoal/60" : "text-white/60";

  const content = (
    <>
      <GoogleLogo />
      <Stars rating={rating} variant={variant} />
      <span className={`text-xs font-semibold ${ratingTextClass}`}>{rating.toFixed(1)}</span>
      <span className={`text-xs ${labelTextClass}`}>{label}</span>
    </>
  );

  const baseCls =
    variant === "light"
      ? "inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white px-3.5 py-1.5 shadow-sm"
      : "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm";
  const hoverCls = variant === "light" ? "hover:border-charcoal/20" : "hover:border-white/30";
  const cls = `${baseCls} ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} transition ${hoverCls}`}>
        {content}
      </a>
    );
  }
  return <div className={cls}>{content}</div>;
}
