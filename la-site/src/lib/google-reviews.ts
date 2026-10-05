import "server-only";

/**
 * Real reviews via the Google Places API (Place Details), replacing
 * Trustpilot. Needs GOOGLE_PLACES_API_KEY (a Places API key from Google
 * Cloud Console, restricted to the Places API) and GOOGLE_PLACE_ID (find
 * yours at https://developers.google.com/maps/documentation/places/web-service/place-id
 * -- search for the EVLV business listing). Server-only: the key isn't
 * prefixed with NEXT_PUBLIC_ so it never reaches the browser. Returns null
 * until both are set, or on any API error, rather than showing broken/fake
 * reviews.
 */
export interface GoogleReview {
  author: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface GoogleReviewsData {
  rating: number;
  reviewCount: number;
  reviews: GoogleReview[];
  mapsUrl: string;
}

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

export function googleReviewsConfigured() {
  return Boolean(API_KEY && PLACE_ID);
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  if (!googleReviewsConfigured()) {
    // Placeholder content for internal design review -- never in production.
    // DEMO_REVIEWS=true is the explicit opt-in for any environment; Vercel
    // Preview deployments (VERCEL_ENV=preview, set automatically by Vercel,
    // never on the Production environment/domain) show it automatically so
    // PR previews are review-ready without needing a manually-set env var.
    // See lib/demo-reviews.ts.
    if (process.env.DEMO_REVIEWS === "true" || process.env.VERCEL_ENV === "preview") {
      const { DEMO_REVIEWS_DATA } = await import("./demo-reviews");
      return DEMO_REVIEWS_DATA;
    }
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=rating,user_ratings_total,reviews,url&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.status !== "OK" || !data?.result) {
      console.error("[google-reviews] Places API error", data?.status, data?.error_message);
      return null;
    }

    const result = data.result as {
      rating?: number;
      user_ratings_total?: number;
      url?: string;
      reviews?: { author_name: string; profile_photo_url?: string; rating: number; text: string; relative_time_description: string }[];
    };

    return {
      rating: result.rating ?? 0,
      reviewCount: result.user_ratings_total ?? 0,
      mapsUrl: result.url ?? `https://search.google.com/local/reviews?placeid=${PLACE_ID}`,
      reviews: (result.reviews ?? []).map((r) => ({
        author: r.author_name,
        authorPhotoUrl: r.profile_photo_url,
        rating: r.rating,
        text: r.text,
        relativeTime: r.relative_time_description,
      })),
    };
  } catch (err) {
    console.error("[google-reviews] fetch failed", err);
    return null;
  }
}
