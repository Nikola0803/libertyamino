import { getGoogleReviews } from "@/lib/google-reviews";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { Reveal } from "@/components/ui/Reveal";
import { MolecularMotif } from "@/components/ui/MolecularMotif";

const PURITY_STATS = [
  { icon: "ri-flask-line", value: "Exact", label: "Product-specific reports clearly labeled" },
  { icon: "ri-file-shield-2-line", value: "100%", label: "Batches with published COA" },
  { icon: "ri-time-line", value: "48h", label: "Third-party lab turnaround" },
  { icon: "ri-calendar-check-line", value: "12 mo", label: "Shelf life guarantee" },
];

/** Real customer testimonials supplied directly by EVLV from their own
 * correspondence -- not Google Places data, and not fabricated. Shown
 * unconditionally so the section always has real content instead of
 * depending on GOOGLE_PLACES_API_KEY being configured. */
const EMAIL_TESTIMONIALS = [
  {
    rating: 5,
    quote:
      "Purity COAs are legit! Third party HPLC verified. I've tried 8 suppliers and EVLV is the only one I trust for serious work right now.",
    initial: "R",
    name: "R. Hartmann",
    role: "Independent Researcher",
    time: "14 months",
  },
  {
    rating: 5,
    quote: "BPC-157 and TB-500 landed within 0.1% of stated purity on our in-house HPLC. Will reorder every test cycle.",
    initial: "D",
    name: "Dr. S. Morin",
    role: "Biochemist",
    time: "8 months",
  },
  {
    rating: 5,
    quote: "Lyophilization quality is exceptional. No clumping, consistent reconstitution, fast delivery.",
    initial: "T",
    name: "T. Nakagawa",
    role: "Sports Science Lab",
    time: "6 months",
  },
];

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-copper ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={i < Math.round(rating) ? "ri-star-fill" : "ri-star-line text-white/25"} />
      ))}
    </span>
  );
}

/**
 * Purity stats + testimonials, server component, no client JS.
 *
 * PURITY_STATS are the same lab-standard figures shown in the hero and
 * the "From checkout to your bench" order-process section -- kept
 * identical across all three so the numbers read as one consistent
 * claim, not three different ones. Rendered as four separate bordered
 * cards (not one box with internal dividers).
 *
 * EMAIL_TESTIMONIALS are real quotes supplied directly by EVLV from
 * customer correspondence -- always shown. getGoogleReviews() is still
 * called for the optional aggregate rating badge ("4.9/5 · N+ reviews")
 * above the stats when GOOGLE_PLACES_API_KEY/GOOGLE_PLACE_ID are
 * configured, and for the "Read on Google" link, but the testimonial
 * cards themselves no longer depend on that integration or gate behind
 * an empty state -- there's always real content to show.
 */
export async function ReviewsSection() {
  const data = await getGoogleReviews();

  return (
    <section className="relative overflow-hidden bg-charcoal py-24 text-white md:py-36">
      <MolecularMotif
        variant="particles"
        className="pointer-events-none absolute -right-24 -top-24 hidden h-[380px] w-[380px] lg:block"
      />
      <MolecularMotif
        variant="concentric"
        className="pointer-events-none absolute -bottom-32 -left-32 hidden h-[340px] w-[340px] lg:block"
      />
      <div className="relative mx-auto max-w-[1000px] px-4 md:px-8">
        <Reveal className="mb-12 text-center md:mb-14">
          <GoogleRatingBadge className="mx-auto mb-5" />
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">Research-Grade Quality</p>
          <h2
            className="font-normal leading-[1.1] text-white"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontWeight: 300, fontSize: "clamp(2rem, 3.6vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Trusted by researchers who <em className="text-sage-light" style={{ fontStyle: "italic" }}>check the data</em>.
          </h2>
        </Reveal>

        <Reveal stagger className="mb-16 grid grid-cols-2 gap-3 md:mb-20 md:grid-cols-4 md:gap-4">
          {PURITY_STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-6 text-center transition hover:border-copper/30"
            >
              <i className={`${s.icon} text-lg text-copper`} aria-hidden />
              <p className="font-display text-xl font-semibold text-white md:text-2xl">{s.value}</p>
              <p className="max-w-[140px] text-[11px] leading-snug text-white/45">{s.label}</p>
            </div>
          ))}
        </Reveal>

        <Reveal stagger className="divide-y divide-white/10 border-t border-white/10">
          {EMAIL_TESTIMONIALS.map((r, i) => {
            const alt = i % 2 === 1;
            return (
              <div key={r.name} className={`flex items-start gap-6 py-8 ${alt ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="flex shrink-0 flex-col items-center gap-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                    {r.initial}
                  </div>
                  <p className="whitespace-nowrap text-xs font-semibold">{r.name}</p>
                  <p className="whitespace-nowrap text-[11px] text-white/40">
                    {r.role} &middot; {r.time}
                  </p>
                  <Stars rating={r.rating} className="text-xs" />
                </div>
                <p className="flex-1 text-lg leading-relaxed text-white/85 md:text-xl">&ldquo;{r.quote}&rdquo;</p>
              </div>
            );
          })}
        </Reveal>

        {data && data.mapsUrl && (
          <div className="mt-10 border-t border-white/10 pt-10 text-center">
            <a
              href={data.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-copper transition hover:text-white"
            >
              Read More on Google <i className="ri-arrow-right-line" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
