# EVLV landing — Everlife-style hero

Two files changed. Drop them into your project at the same paths, overwriting the originals:

- src/components/home/Hero.tsx
- src/components/layout/Header.tsx

## What changed and why

**Hero.tsx** — rebuilt from a single full-bleed video hero into an Everlife-style layout:
1. Centered headline + subhead on a light ivory background (was dark charcoal full-bleed).
2. A trust badge row right under the headline — pulls your real Google rating via
   `getGoogleReviews()` if it's configured (same helper ReviewsSection already uses), falls back to
   a generic "Independently Tested & Batch Verified" pill otherwise. Plus the same three claim
   chips you had (Tested Purity / Batch-Level COAs / Research Use Only).
3. A bento-style card grid below that — one big tile, one medium tile, two small tiles — each a
   clickable doorway into a category. This is the actual "Everlife" part: their hero is a grid of
   big tappable image cards, not one full-screen video.
   - Big tile: your existing hero video (hero-mobile.mp4 / hero-21by9.mp4 / hero-evlv.mp4), same
     posters as before.
   - Medium tile: your existing precision-section.mp4/png (borrowed from AboutSection).
   - Two small tiles: charcoal / sage-deep panels using the MolecularMotif graphic you already use
     elsewhere, so nothing new to design — for Peptides and Ancillaries.
4. A row of small pill quick-links under the grid (Shop All, Peptides, Ancillaries, COAs, Journal)
   — mirrors Everlife's small link row under their hero grid.

Colors, fonts, and the Reveal/MolecularMotif/font-display system are all your existing tokens —
nothing new added to globals.css.

**Header.tsx** — one small necessary fix: the header used to be transparent (`bg-charcoal/20`)
until scroll, which only worked because the old hero was a dark full-bleed video sitting right
behind it. Your new hero is light, so a transparent white-text header over it would be hard to
read. Made the header always solid charcoal — same look it already had once scrolled, just
all the time now. This also makes the header safe/consistent on every page, not just this one.

## Notes
- No new npm packages, no new CSS files — just these two components.
- The video/image paths (`/videos/hero-mobile.mp4`, `/images/hero-vial.png`, etc.) are the exact
  same ones your old Hero.tsx and AboutSection.tsx already reference, so nothing to re-upload.
- The rest of the page (FeaturedProducts, ReviewsSection, ShopByCategory, etc.) is untouched —
  this pass focused on the hero/landing template since that's what you asked about. Happy to do
  a similar pass on any other section if you want more of the Everlife feel further down the page.
