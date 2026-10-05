# Liberty Aminos — Project Reference

Research-use-only amino / peptide e-commerce storefront. **Forked from `evlv-site` on 2026-10-05** — same
Next.js 16 App Router + TypeScript + Tailwind v4 architecture, re-themed to the Liberty Aminos brand.
Headless: storefront on Vercel, catalog/cart/orders in WooCommerce at `db.libertyaminos.com`.

**Repo (storefront):** `Nikola0803/libertyamino` — `la-site/` subdirectory  
**Repo (WP plugins):** same repo — `la-wp/` subdirectory  
**Backend:** https://db.libertyaminos.com (WooCommerce REST + Store API)  
**Vercel team:** Vintage — deploys on push to `main`  
**Dev server:** `npm run dev` (inside `la-site/`)

---

## Brand — Liberty Aminos

- **Name:** Liberty Aminos. Brand voice: scientific, precise, trustworthy, clean. NOT spa, NOT supplement-loud.
- **Feel:** ionpeptide.com / EVLV — COA-forward, white-primary, clinical precision.
- **Must NOT feel like:** generic supplement brand, bodybuilder store, pharma corp, hype/urgency ecomm.
- **Voice:** calm, factual, transparent. No "miracle / magic / instant / guaranteed". No fake urgency or scarcity.
- **RUO compliance:** never make human-use, treatment, weight-loss or animal-use claims. RUO / 21+ everywhere.
- **Trust:** third-party tested, US fulfilment, COA for every batch, no fake reviews or ratings.

### Logo
Horizontal lockup goes in the header. Logo files are final and used as supplied. A text placeholder is shown
until the real SVG asset is provided. Never recreate the logo as tracked-out text.

### Color tokens (`src/app/globals.css`)
White-primary. Navy and red are accent-only (never primary backgrounds or dominant CTAs).

| Role | Token name | Hex |
|---|---|---|
| Page background (primary) | `white` | `#FFFFFF` |
| Page background (soft off-white) | `off-white` | `#F8F9FB` |
| Surface / card bg | `surface` | `#F2F4F8` |
| Border / divider | `border-subtle` | `#E2E6ED` |
| Body text | `ink` | `#1A1F2E` |
| Secondary text | `muted` | `#5A6272` |
| Navy accent (CTAs, header, headings) | `navy` | `#0E2153` |
| Navy hover | `navy-dark` | `#0A1840` |
| Navy light (tints, chips) | `navy-light` | `#EEF1F8` |
| Red accent (pills, alerts, trust tiles) | `red` | `#C42127` |
| Red hover | `red-dark` | `#9E1A1F` |
| Red light (tints) | `red-light` | `#FEF2F2` |

Target visual balance: ~55% white/off-white, ~25% ink/muted text, ~15% navy, ~5% red. Never hardcode a hex in
a component — always use the CSS token.

### Typography
**Plus Jakarta Sans** throughout (headings and body). Load from Google Fonts.
- Headings: 600 / 700
- Body: 400 / 500
- No other display font. No serif accent.
- Icons: Remix Icon via CDN (same pattern as EVLV).

### Design system rules
- Border radius: 4–8px on cards/inputs; 999px for pill chips only.
- Buttons: primary = navy bg / white text, hover navy-dark. Secondary = white bg, 1px navy border, hover navy-light bg.
  Red is never a primary CTA — red is for utility pills (RUO, Heroes, alerts) only.
- Cards: white bg, thin border-subtle border, small radius, minimal shadow.
- Motion: subtle fades and gentle reveals only. No bouncing, no heavy parallax.
- No countdown timers, "X people viewing", or fake scarcity anywhere.
- No star ratings or review counts until real reviews exist.

---

## Architecture

Inherited from EVLV / ALTR fork — same patterns, renamed for LA:

- `src/lib/types.ts` — Product type (size variants, COA/lot data, spec facts).
- `src/lib/products.ts` — placeholder catalog (real data synced by WooCommerce REST API).
- `src/lib/woocommerce.ts` — WooCommerce REST / Store API client. Backend: `db.libertyaminos.com/wp-json/`.
- `src/lib/cart-context.tsx` — client-side cart state + WooCommerce cart sync.
- `src/lib/coa-data.ts` — COA library data (driven by WP COA endpoint, not a static file).
- `src/lib/payment-config.ts` — payment rail config (P2P, BTC, USDC/USDT) pulled from WP settings.
- `src/components/home/*`, `src/components/product/*`, `src/components/layout/*` — same structure.
- Pages: `/`, `/shop`, `/shop/[slug]`, `/coas`, `/coas/[lot]`, `/heroes`, `/affiliates`, `/track-order`,
  `/about`, `/contact`, `/checkout`, `/order-success`, `/account`, and all policy pages.

### Key integration rules
- Prices and stock come from WooCommerce only — no separate source. Never mock prices in the frontend.
- Products are grouped on the frontend by a `compound_group` meta field — NOT by product title text.
- Custom WP REST endpoints live in `la-wp/` — never duplicate business logic in the frontend.
- Any route that writes data (orders, subscriptions, hero applications) must require auth, a nonce, or a
  verified signature.
- Cart is re-checked against live prices and stock at checkout start.

### Payment rails
P2P, BTC, USDC/USDT — same pattern as VP. Rail config (handles/addresses) stored in WP settings, not in code.
A rail with no handle configured is hidden from checkout. Payment instructions show on the thank-you page and in
order emails. Orders are created on-hold; stock is reserved at order time; unpaid orders auto-cancel after 2h.

### WooCommerce Store API (cart/checkout)
The LA storefront uses WooCommerce's Store API (`/wp-json/wc/store/v1/`) for cart and checkout, not the legacy
REST API. Nonce header `Nonce: <value>` is required for cart mutations. Fetch the nonce from
`/wp-json/wc/v3/nonce` (or the store API's cart response header) before any cart write.

---

## Product catalog

SKUs from the product list (06-Product-List in the brand folder). Sizes are separate WooCommerce products
sharing a `compound_group` meta. Pack-size pricing (1/3/5/10 vials) is quantity-based on the same SKU. Hide rule:
a compound is hidden only when ALL sizes are OOS — if any size is in stock, all sizes show (OOS ones marked).

### GLP placeholder names
Use `GLP1-S`, `GLP2-T`, `GLP3-R` until final naming arrives from Jerod.

---

## COA system

`/coas` — COA Library page, data-driven from WP endpoint, not a static file.  
`/coas/[lot]` — per-lot verification page, linked from QR codes on product pages.  
Product page has a "Verify this batch" panel: size selector, current lot, QR code, PDF download.  
COA records must match the PDF exactly. No placeholder data.

---

## Common gotchas (inherited)

- `useSearchParams()` requires a `<Suspense>` boundary — already in `/shop/page.tsx`, don't regress it.
- Verify Vercel-affecting changes with `npm run build` (not just `dev`).
- `rm -rf .next` + restart dev server for stale Turbopack errors.
- All EVLV-brand color tokens (`sage-deep`, `copper`, `charcoal`, etc.) are replaced by LA tokens — never
  import or reference the old EVLV palette.
- `NEXT_PUBLIC_WC_URL` must point at `https://db.libertyaminos.com` — confirm in `.env.local`.

---

## Awaiting from Jerod

- Homepage hero image
- Site copy and policy text (Terms, Privacy, RUO Policy, Prohibited Guidance Policy)
- COA/lot data format + files, SDS PDFs
- Pack-size discount schedule, free-shipping threshold, coupon stacking rules
- Final product naming (GLP1-S / GLP2-T / GLP3-R)
- LA payment rail handles/addresses
- LA email address for FluentSMTP
- Real logo SVG (horizontal lockup)
