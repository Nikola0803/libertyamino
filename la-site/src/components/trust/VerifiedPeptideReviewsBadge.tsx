const VPR_URL = "https://verifiedpeptidereviews.com/vendors/evlv-peptides";

type Variant = "home" | "product";

export function VerifiedPeptideReviewsBadge({ variant = "home" }: { variant?: Variant }) {
  if (variant === "product") {
    return (
      <a className="cp-pdp-vpr" href={VPR_URL} target="_blank" rel="noreferrer">
        <img className="cp-vpr-logo" src="/images/brand/vpr-logo-clean.png" alt="Verified Peptide Reviews" />
        <span>
          <small>FEATURED REVIEW RATING</small>
          <strong>
            <span className="cp-vpr-stars" aria-label="5 out of 5 stars">★★★★★</span>{" "}
            Highest Safety Rating · 4.9 / 5 · 712 reviews
          </strong>
        </span>
        <em>
          <span className="cp-vpr-domain-full">verifiedpeptidereviews.com ↗</span>
          <span className="cp-vpr-domain-mobile">VPR.com ↗</span>
        </em>
      </a>
    );
  }

  return (
    <a className="cp-vpr" href={VPR_URL} target="_blank" rel="noreferrer">
      <img className="cp-vpr-logo" src="/images/brand/vpr-logo-clean.png" alt="Verified Peptide Reviews" />
      <span>
        <small>Verified Peptide Reviews</small>
        <strong>
          <span className="cp-vpr-stars" aria-label="5 out of 5 stars">★★★★★</span>{" "}
          4.9 · 712 reviews
        </strong>
      </span>
      <em>Verify us ↗</em>
    </a>
  );
}
