// Mobile safety net for the ported desktop mockup in landing-content.json.
// Rendered in a <style> tag placed right after data.css in page.tsx, so
// these rules win the cascade at equal specificity without having to
// touch the giant scraped HTML/CSS blob itself.
//
// Two real, confirmed bugs this fixes on phones (checked live on the
// production homepage at an iPhone 16 Pro Max viewport, 430x932):
//
// 1) A small number of scraped elements carry an inline
//    `style="width: 730px"` or `style="text-wrap:nowrap"` baked into the
//    source mockup -- these are this page's only real horizontal-overflow
//    bugs on a phone (confirmed: exactly 5 elements render wider than the
//    viewport, all traceable to one of these two inline-style patterns).
//    max-width caps a fixed inline pixel width down to the viewport;
//    overriding the nowrap lets that heading wrap onto multiple lines
//    instead of forcing its container wide.
//
// 2) The hero's numeric trust-stat row (99%+ avg purity / 100% published
//    COA / 48h lab turnaround / 12 mo shelf life) is hidden on phones per
//    request -- dense, small type that eats space above the fold without
//    adding much on a screen this narrow.
export const MOBILE_FIX_CSS = `
@media (max-width: 640px) {
  .ev-d [style*="width"] { max-width: 100% !important; }
  .ev-d [style*="nowrap"] { white-space: normal !important; text-wrap: wrap !important; }
  .ev-d .hero .trust-row.ti-stats { display: none !important; }
  body, .ev-d { overflow-x: hidden; }
}
`;
