# Liberty Aminos — Implementation Task List

Tracking doc for Claude Code / Codex sessions. All work targets the `la-site/` (Next.js storefront) and
`la-wp/` (WordPress plugins) subdirectories. Backend: `db.libertyaminos.com`. Storefront: `libertyaminos.com`.

Work log format:
- `[ ]` not started
- `[~]` in progress
- `[x]` complete
- `[!]` blocked — waiting on Jerod

---

## Phase 0 — Repo bootstrap (do first, one-time)

- [x] Copy `evlv-site` → `la-site/` as base
- [x] Copy `evlv-cms-plugin` → `la-wp/` as base
- [x] Write `CLAUDE.md`, `PROJECT.md`, `TASKS.md`, `README.md` for both packages
- [x] **Rename all EVLV/ALTR internal references** in `la-site/`:
  - `la-site/package.json` → name `liberty-aminos-site`
  - All remaining `evlv` / `altr` text in comments and config
- [x] **Rename plugin internals** in `la-wp/`:
  - Plugin file header: name, slug, prefix
  - PHP prefix: `altr_` → `la_`, `ALTR_CMS_` → `LA_CMS_`
  - Postmeta prefix: `_altr_` → `_la_`
  - REST namespace: `altr/v1` → `la/v1`
  - Admin menu: "ALTR CMS" → "Liberty Aminos CMS"
- [x] Create `.env.example` for `la-site/`
- [x] Push initial commit to `claude/determined-cray-rf8hc3` and open draft PR

---

## Phase 1 — Brand & Design System

### 1.1 Design tokens
- [ ] Replace all EVLV color tokens in `la-site/src/app/globals.css` with LA palette:
  - `white` `#FFFFFF`, `off-white` `#F8F9FB`, `surface` `#F2F4F8`
  - `border-subtle` `#E2E6ED`, `ink` `#1A1F2E`, `muted` `#5A6272`
  - `navy` `#0E2153`, `navy-dark` `#0A1840`, `navy-light` `#EEF1F8`
  - `red` `#C42127`, `red-dark` `#9E1A1F`, `red-light` `#FEF2F2`
- [ ] Replace Poppins/Inter font stack → **Plus Jakarta Sans** (Google Fonts import in `layout.tsx`)
- [ ] Remove all legacy EVLV token aliases (`sage-deep`, `copper`, `charcoal`, etc.) from components

### 1.2 Logo & identity
- [ ] `src/components/ui/Logo.tsx` — render text placeholder "LIBERTY AMINOS" until real SVG provided
- [!] Wire real horizontal lockup SVG when Jerod provides it
- [ ] Update `favicon.ico` / `opengraph-image` placeholder with LA colors

### 1.3 Layout shell
- [ ] Header (`src/components/layout/Header.tsx`):
  - Logo left, nav center (Shop · COA Library · Track Order · About), icons right (search, account, cart)
  - RUO utility bar above header: red bg, "For Research Use Only · 21+ Only" + Heroes pill
  - Sticky header, white bg, navy text, `border-b border-subtle`
- [ ] Footer: LA name, nav links, policy links, social icons, RUO disclaimer, payment rail icons
- [ ] Cart drawer: slide-in from right, shows items, bac water upsell tile, checkout CTA
- [ ] Remove EVLV-specific nav items (ambassadors, bundles, journal, plans, giveaway, ruo standalone page,
  indemnity-waiver, wholesale redirect, sourcing, landing-content, research-peptides-usa)

---

## Phase 2 — Core Pages [Launch]

### 2.1 Home page (`src/app/page.tsx` + `src/components/home/`)
- [ ] Utility bar: RUO notice + Heroes pill (red, medal icon, "Military & First Responders – 15% Off, For Life")
- [ ] Hero: full-width image (swappable), headline, two CTAs ("Shop" + "View COAs")
- [!] Hero image placeholder until Jerod provides final asset
- [ ] Trust strip: third-party tested · US fulfilment · shipping cut-off · free-shipping threshold · RUO/21+
- [ ] Featured products grid (in-stock items, price per size, "COA Verified" chip)
- [ ] COA callout section: "Every batch. Third-party verified." → link to /coas
- [ ] Prohibited Guidance tile: icon + two-sentence summary + "Read the policy" link

### 2.2 Shop page (`src/app/shop/page.tsx`)
- [ ] Category pills, search, sort
- [ ] Product card: name, code, price per size, "COA Verified" chip when current COA exists
- [ ] Hide rule: hide compound only when ALL sizes OOS; show OOS sizes as marked, not hidden
- [ ] Data: fetch from WooCommerce REST API (not mock data)

### 2.3 Product page (`src/app/shop/[slug]/page.tsx`)
- [ ] Size buttons — selecting a size updates price, stock, SKU, COA panel
- [ ] Vial image on COA lattice background pattern
- [ ] "99%+ Purity" badge (this wording only — no measured percentages anywhere)
- [ ] RUO-safe description, spec facts (CAS, formula, form, avg mass, storage)
- [ ] Shipping cut-off note + "Add to Cart" button
- [ ] "Verify this batch" panel: lot number, QR code linking to `/coas/[lot]`, PDF download
- [ ] Pack-size pricing display: 1/3/5/10 vials, per-vial price, "save X%" label
- [!] Discount schedule from Jerod

### 2.4 COA Library (`src/app/coas/page.tsx`)
- [ ] Card per lot: compound, strength, lot number, lab, test date, "Open COA" button
- [ ] Search, filter by compound and lab
- [ ] Current lots / past lots sections
- [ ] Real-data counters (total lots, labs)
- [ ] Data from `GET /la/v1/coas` — not a static file
- [ ] SDS row under each product on the COA page, linking to SDS PDF

### 2.5 COA per-lot page (`src/app/coas/[lot]/page.tsx`)
- [ ] Full COA display: compound, lot, lab, test date, result, PDF iframe/download
- [ ] QR code for this lot URL (for labeling use)

### 2.6 Cart & Checkout
- [ ] Cart drawer (slide-in, accessible): item list, remove, quantity change, subtotal, checkout CTA
- [ ] Full cart page (`/cart`) as fallback
- [ ] Bac water upsell tile in cart when vials present and no bac water
- [ ] Checkout page: one-page, guest by default, address, payment rail selector
- [ ] Price/coupon/shipping calculated server-side (WooCommerce) — no client-side total math
- [ ] Cart re-checked against live prices/stock at checkout start
- [ ] Thank-you page: order number, payment instructions for chosen rail, 2h payment countdown
- [ ] Order auto-cancel after 2h unpaid (WP-Cron in `la-wp`)

### 2.7 Track Order (`src/app/track-order/page.tsx`)
- [ ] Lookup by order number — shows status and carrier tracking link

### 2.8 Account (`src/app/account/page.tsx`)
- [ ] Order history, addresses — minimal
- [ ] Never required to buy; guest checkout default

### 2.9 Heroes page (`src/app/heroes/page.tsx`)
- [ ] Headline "15% off, for life. For those who serve." + one-paragraph promise
- [ ] Application form: status (Active Military/Veteran/First Responder), name, email, branch,
  optional service/badge number, credential upload (jpg/png/pdf ≤5 MB), optional note,
  certification checkbox, submit
- [ ] Three trust tiles: manual review ~24h · yours forever · ID deleted after review
- [ ] Eligible: active duty, Reserve, National Guard, honorably discharged vets, police, EMS/paramedics, fire
- [ ] Backend: POST to `la/v1/heroes` → emails inbox; manual coupon issue at launch

### 2.10 Affiliates page (`src/app/affiliates/page.tsx`)
- [ ] Hero section, three-step how-it-works, tier ladder (10%/15%/20%)
- [ ] Earnings calculator (interactive)
- [ ] Portal feature tiles, FAQ, apply form
- [ ] Apply form POSTs to `la/v1/affiliates`

### 2.11 About & Contact
- [ ] About page: brand story, team (if provided), trust facts
- [ ] Contact page: form (name, email, message) + LA phone + LA email
- [ ] Contact form POSTs to inbox

### 2.12 Policy pages
- [!] Full text from Jerod for: Terms, Privacy, Research Use Policy, Prohibited Guidance Policy
- [ ] `/policies/prohibited-guidance` — full policy page (purpose, scope, RUO status, prohibited categories,
  staff conduct, customer responsibilities, accidental exposure, regulatory context, enforcement, FAQ)
- [ ] `/policies/shipping-returns` — at-a-glance tiles, processing vs transit, carrier delays, claims form
- [ ] `/policies/terms`, `/policies/privacy`, `/policies/research-use`
- [ ] Woo terms-page setting points at `/policies/terms`

---

## Phase 3 — E-commerce Integration [Launch]

### 3.1 WooCommerce REST integration (`la-site/src/lib/woocommerce.ts`)
- [ ] Product catalog: `GET /wc/v3/products` with compound_group grouping
- [ ] Stock/price: read from WooCommerce only (Stockroom pushes updates via WC REST API)
- [ ] Cart: WooCommerce Store API (`/wc/store/v1/cart`)
- [ ] Checkout: WooCommerce Store API (`/wc/store/v1/checkout`)
- [ ] Orders: created as real WC line items (product, quantity, price) — never as a single fee
- [ ] Customer tier applied from logged-in session meta

### 3.2 Payments (`la-site/src/lib/payment-config.ts`)
- [ ] P2P, BTC, USDC/USDT rails — fetch configs from `GET /la/v1/payment-config`
- [ ] Rail hidden when handle/address not configured in WP settings
- [ ] Payment instructions on thank-you page and in order emails (order number = memo)
- [!] LA payment handles/addresses from Jerod

### 3.3 Shipping
- [ ] Woo zones with flat rate + free-shipping threshold
- [!] Shipping numbers from Jerod

### 3.4 Coupons
- [ ] All coupon logic through Woo's own rules (min spend, usage limits, product restrictions)
- [!] Confirm which coupons can stack

### 3.5 Order emails
- [ ] LA-branded order emails from an LA address (FluentSMTP config by VVG)
- [ ] Post-discount totals correct in emails
- [ ] No VP or MSV branding anywhere in emails

---

## Phase 4 — Marketing Features [Launch]

### 4.1 Age gate
- [ ] Full-screen gate on first visit: "21+ and for research use only. Confirm to continue."
- [ ] One tap, 30-day cookie
- [ ] Stays on the URL the visitor landed on — UTM and fbclid preserved
- [ ] Works in Instagram and Facebook in-app browsers (no sessionStorage-only solution)

### 4.2 Welcome pop-up
- [ ] "Join the researchers' list – first access, insiders newsletter, 20% off your first purchase"
- [ ] Once per visitor, after age gate + a scroll or delay
- [ ] Never covers add-to-cart on mobile
- [ ] Captures email, shows a unique code to type at checkout (no auto-apply)
- [ ] Code: unique per email, one use per customer (Woo coupon generated via `la/v1/welcome-code`)

### 4.3 Abandoned-cart email (WP-Cron in `la-wp`)
- [ ] Triggered ~1h after checkout captured email with no completed order
- [ ] Second reminder at ~24h
- [ ] Stops on purchase
- [ ] Unpaid on-hold order → payment reminder instead of cart reminder
- [ ] WP-Cron implementation, no paid service

### 4.4 UTM / fbclid tracking
- [ ] Capture UTM params + fbclid from URL on landing; save to session / cookie
- [ ] Attach to order meta at checkout creation
- [ ] Preserved through age gate and welcome pop-up

### 4.5 Meta Pixel
- [ ] PageView on every page
- [ ] ViewContent on product pages (SKU, value, currency)
- [ ] AddToCart on add-to-cart (SKU, value, currency)
- [ ] InitiateCheckout on checkout start
- [ ] Purchase: fires browser event + deduplication; canonical fire is server-side from WP on order → processing
- [ ] Server-side purchase: `POST /la/v1/track/purchase` called from WP order status hook
- [ ] Purchase does NOT fire on order creation or cancellation — only on status → processing
- [!] Meta Pixel ID from Jerod

---

## Phase 5 — WP Plugin Buildout (`la-wp/`)

### 5.1 Plugin foundation
- [ ] Rename `altr-cms.php` → `la-cms.php`, update plugin header
- [ ] Replace all `altr_` → `la_` function/hook prefixes throughout
- [ ] Replace all `_altr_` → `_la_` postmeta keys
- [ ] REST namespace `altr/v1` → `la/v1`

### 5.2 COA post type & admin UI
- [ ] `la_coa` CPT: lot, compound, lab, test_date, pdf_url, sku, strength, status
- [ ] Admin list with search/filter
- [ ] CSV import: upload a CSV of lot data (idempotent by lot number)
- [ ] REST: `GET /la/v1/coas`, `GET /la/v1/coas/{lot}`

### 5.3 SDS post type
- [ ] `la_sds` CPT: compound, sku, pdf_url, published_date
- [ ] REST: available via COA endpoint response

### 5.4 Heroes application handler
- [ ] `POST /la/v1/heroes` — save to DB, email credentials attachment to inbox, return 200
- [ ] Credential file stored temporarily, deleted after admin review
- [ ] No credential exposed in REST response

### 5.5 Affiliates application handler
- [ ] `POST /la/v1/affiliates` — save to DB, email inbox

### 5.6 Welcome code generator
- [ ] `POST /la/v1/welcome-code` — generates unique Woo coupon (20% off, one-use, email-scoped)

### 5.7 Abandoned-cart WP-Cron
- [ ] Schedule: check every 30 min for abandoned checkouts
- [ ] 1h reminder email with restore-cart link
- [ ] 24h second reminder
- [ ] Cancel schedule on completed order
- [ ] Unpaid on-hold: payment reminder instead

### 5.8 Order auto-cancel
- [ ] On order creation (on-hold): schedule cancel event in 2h
- [ ] Cancel: set status → cancelled, release stock once
- [ ] De-schedule on payment received

### 5.9 Payment config
- [ ] WP options: `la_payment_p2p_handle`, `la_payment_btc_address`, `la_payment_usdc_address`
- [ ] REST: `GET /la/v1/payment-config` returns only configured rails

### 5.10 Server-side purchase tracking
- [ ] Hook on WC order status → processing
- [ ] POST to Meta CAPI with event_id matching browser event (order ID)
- [ ] Never fires on creation or cancellation

---

## Phase 6 — Performance & Quality [Launch]

- [ ] All product images: WebP, ~900–1200px, ≤150 KB
- [ ] Hero image: WebP, ≤250 KB
- [ ] No console errors or 404s on home, shop, product, cart, checkout (mobile + desktop)
- [ ] `useSearchParams()` wrapped in `<Suspense>` on all pages that use it
- [ ] `npm run build` clean (no type errors, no missing module errors)
- [ ] LCP < 2.5s on home and product pages (mobile, 4G)
- [ ] RUO disclaimer visible on all product and shop pages
- [ ] Age gate tested on Instagram in-app browser (iOS + Android)

---

## Launch acceptance checklist (from Technical Requirements §9)

- [ ] Test order completes with each payment method; instructions show on screen and in email
- [ ] Customer and admin emails arrive and render correctly
- [ ] Order appears in ShipStation
- [ ] Stock decreases correctly; Stockroom price/stock update shows on storefront
- [ ] Percentage coupon applies correctly
- [ ] Purchase tracking fires once per order (no double-count, no silent zero)
- [ ] No console errors or failed requests on home, shop, product, cart, checkout (mobile + desktop)
- [ ] RUO disclaimers and age gate as specified

---

## Phase 7 — Phase 2 (post-launch, not blocking)

- [ ] Bundles / stacks as real Woo products
- [ ] Reviews (once real reviews exist)
- [ ] Learn / education hub, blog
- [ ] Wholesale inquiry page
- [ ] Live chat
- [ ] Affiliate portal: real-time dashboard, link-in-bio page, custom-stack builder, creatives library, leaderboard
- [ ] SMS opt-in (order updates, abandoned cart, STOP handling)
- [ ] Store credit and referral rewards

---

## Waiting on Jerod

- [!] Homepage hero image
- [!] Site copy and policy text (Terms, Privacy, RUO Policy, Prohibited Guidance Policy)
- [!] COA/lot data format + files, SDS PDFs
- [!] Pack-size discount schedule
- [!] Free-shipping threshold
- [!] Coupon stacking rules
- [!] Final GLP product naming
- [!] LA payment rail handles/addresses
- [!] LA email address for FluentSMTP / order emails
- [!] Real LA logo SVG (horizontal lockup)
- [!] Meta Pixel ID
- [!] LA phone number
