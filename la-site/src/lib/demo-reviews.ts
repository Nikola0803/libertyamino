import type { GoogleReviewsData } from "./google-reviews";

/**
 * PLACEHOLDER content for internal design review only -- not real customer
 * feedback. Only ever rendered when DEMO_REVIEWS=true is explicitly set
 * (see getGoogleReviews in google-reviews.ts), which should never be set in
 * the production environment real customers see. Swap for real reviews
 * (Google Places, or another real source) before that flag is ever enabled
 * anywhere customer-facing.
 */
export const DEMO_REVIEWS_DATA: GoogleReviewsData = {
  rating: 4.8,
  reviewCount: 57,
  mapsUrl: "https://www.google.com/search?q=EVLV+Peptides",
  reviews: [
    {
      author: "Marcus T.",
      rating: 5,
      text: "Batch reports were easy to find and matched the code on the vial. Ordering process was straightforward and shipping was quicker than I expected.",
      relativeTime: "2 weeks ago",
    },
    {
      author: "Priya S.",
      rating: 5,
      text: "Appreciate how much documentation is available per batch. Support answered a question about storage within a day.",
      relativeTime: "3 weeks ago",
    },
    {
      author: "Daniel K.",
      rating: 4,
      text: "Solid experience overall. Packaging was discreet and the tracking updates were accurate. Would like to see a couple more compounds added to the catalog.",
      relativeTime: "1 month ago",
    },
    {
      author: "Elena V.",
      rating: 5,
      text: "Third-party testing is clearly labeled and easy to cross-reference. That transparency is the main reason I keep coming back.",
      relativeTime: "1 month ago",
    },
    {
      author: "Jordan M.",
      rating: 5,
      text: "Clean checkout, clear pricing, no surprise fees. Everything arrived exactly as described on the product page.",
      relativeTime: "6 weeks ago",
    },
    {
      author: "Anika R.",
      rating: 5,
      text: "Their COA archive is genuinely useful -- I checked a batch before ordering and it saved me from emailing support with a basic question.",
      relativeTime: "2 months ago",
    },
  ],
};
