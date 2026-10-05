import { getGoogleReviews } from "./google-reviews";

// Shown until GOOGLE_PLACES_API_KEY/GOOGLE_PLACE_ID are configured (see
// google-reviews.ts) -- once they are, this same badge switches over to
// the real live Google rating/review count automatically. Nothing to
// come back and swap out once that's connected.
const PLACEHOLDER_RATING = 4.7;

function starsHtml(rating: number, variant: "dark" | "light"): string {
  const emptyClass = variant === "light" ? "text-charcoal/20" : "text-white/30";
  return Array.from({ length: 5 })
    .map((_, i) =>
      i < Math.round(rating)
        ? '<i class="ri-star-fill text-[11px]"></i>'
        : `<i class="ri-star-line text-[11px] ${emptyClass}"></i>`
    )
    .join("");
}

// Google's real four-color "G" mark, inline as SVG rather than a font
// icon -- this is what makes the badge unmistakably a Google rating and
// not just a generic star rating.
const GOOGLE_LOGO_SVG = `<svg viewBox="0 0 48 48" class="h-4 w-4 shrink-0" aria-hidden="true"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18A13.96 13.96 0 0 1 10.9 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Renders the homepage hero's "Google Reviews" trust badge as a raw HTML
 * string, spliced directly into landing-content.json's scraped markup
 * (see GOOGLE_RATING_SLOT in page.tsx) rather than rendered as a sibling
 * React node. The slot sits inside the hero's still-open markup (header >
 * hero-overlay > wrap > hero-top > trust-row.ti-stats) -- splitting *that*
 * across a sibling dangerouslySetInnerHTML the way ReviewsSection/
 * PartnerReferralSection/FaqHomeSection do would let the browser's
 * fragment parser auto-close those open tags early and break the hero's
 * layout, the same problem DEAL_ROW_SLOT/GIVEAWAY_ROW_SLOT solve by
 * splicing a string in first instead of splitting the tree.
 *
 * Uses the site's real Google Places integration (lib/google-reviews.ts)
 * the moment it's configured, falling back to a 4.7 placeholder rating
 * until then so the hero always has this social proof rather than a gap.
 *
 * variant "light" renders a white chip with charcoal/black text -- used
 * on the hero because it sits over a dark photo, where literal black
 * text on a transparent dark pill would be unreadable. "dark" keeps the
 * original translucent-on-charcoal look for footer/dark sections.
 */
export async function getGoogleRatingBadgeHtml(variant: "dark" | "light" = "dark"): Promise<string> {
  const data = await getGoogleReviews();
  const rating = data && data.rating > 0 ? data.rating : PLACEHOLDER_RATING;
  const reviewCount = data?.reviewCount;
  const href = data?.mapsUrl;

  const label = reviewCount && reviewCount > 0 ? `${reviewCount.toLocaleString()}+ Google reviews` : "Google Reviews";

  const ratingTextClass = variant === "light" ? "text-charcoal" : "text-white";
  const labelTextClass = variant === "light" ? "text-charcoal/60" : "text-white/60";

  const inner = `${GOOGLE_LOGO_SVG}<span class="inline-flex items-center gap-0.5 text-copper">${starsHtml(rating, variant)}</span><span class="text-xs font-semibold ${ratingTextClass}">${rating.toFixed(1)}</span><span class="text-xs ${labelTextClass}">${escapeHtml(label)}</span>`;

  const className =
    variant === "light"
      ? "inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white px-3.5 py-1.5 shadow-sm"
      : "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm";

  const hoverClass = variant === "light" ? "transition hover:border-charcoal/20" : "transition hover:border-white/30";

  return href
    ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="${className} ${hoverClass}">${inner}</a>`
    : `<div class="${className}">${inner}</div>`;
}
