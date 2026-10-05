# Liberty Aminos — WordPress Plugin Reference

WordPress + WooCommerce backend for Liberty Aminos. Forked from `evlv-cms-plugin` (itself from `altr-cms-plugin`)
on 2026-10-05. Runs at `db.libertyaminos.com`. Not a theme — custom post types, admin UI, REST endpoints, and
WooCommerce extensions for the headless Next.js frontend at `libertyaminos.com`.

**Plugin slug:** `la-cms` (renamed from `altr-cms`)  
**Internal prefix:** `la_` (renamed from `altr_`)  
**Server:** 89.58.59.253, user `nikola`, Ubuntu 24.04, nginx, PHP 8.3, MariaDB 10.11, Redis  
**WP version:** 7.1 · WooCommerce: 11.1  
**Deploy path:** `/var/www/libertyaminos/wp-content/`

---

## What it does

Custom WooCommerce extensions and REST endpoints for the LA headless storefront:

### Custom REST endpoints (`includes/rest-api.php`)
All write endpoints require auth (WC nonce or application password). GET endpoints for the storefront are public.

- `GET  /la/v1/products` — catalog with grouping meta
- `GET  /la/v1/products/{slug}` — single product with lot/COA data
- `GET  /la/v1/coas` — COA library (lot, lab, test date, PDF URL, compound)
- `GET  /la/v1/coas/{lot}` — single lot verification
- `GET  /la/v1/payment-config` — active payment rails (handles/addresses from WP options)
- `GET  /la/v1/shipping-config` — shipping zones/rates
- `POST /la/v1/heroes` — Heroes application submission (stores to DB, emails inbox)
- `POST /la/v1/affiliates` — Affiliate application submission
- `POST /la/v1/track/purchase` — server-side Meta pixel purchase event

### WooCommerce extensions (`includes/woo-*.php`)
- Order auto-cancel after 2h unpaid (WP-Cron, releases reserved stock once).
- Customer tier meta (`retail` / `wholesale` / `ff`) applied to pricing at cart total.
- Quantity pricing for pack sizes (1/3/5/10 vials) applied on the same SKU.
- Bac water upsell rule — surfaced in cart when vials are present and bac water is absent.
- UTM / fbclid saved to order meta from the checkout request.
- Prohibited Guidance: no advisory on human/animal use — staff conduct enforced in WP admin notices.

### Custom post types (`includes/post-types.php`)
- `la_coa` — COA entries. Fields: compound, lot, lab, test_date, pdf_url, sku, status (current/archived).
- `la_sds` — Safety Data Sheet entries. Fields: compound, sku, pdf_url, published_date.
- `la_content` — Page content blocks for sections the frontend renders from the CMS.
- `la_popup` — Marketing popups (welcome, abandoned-cart trigger copy). Off by default.

### COA Admin UI (`includes/admin-menu.php`)
Top-level "Liberty Aminos CMS" menu → COA Library, SDS Library, Site Content, Popups.
COA import: admin can upload CSV or paste lot data; idempotent (skips existing lots).

---

## Conventions

- Every custom field is prefixed `_la_` in `postmeta`.
- All CPTs `public => false`, `show_in_rest => false` — only the `la/v1` namespace is public.
- Nonces + `current_user_can()` on every save handler.
- No secrets in code — handles/addresses/API keys in `wp-config.php` / WP options only.
- No changes on server not also committed to this repo.

---

## Deploy

1. Commit changes here.
2. SSH to 89.58.59.253 as `nikola`.
3. `cd /var/www/libertyaminos/wp-content/plugins && git pull` (once the deploy method is agreed with Jerod).
4. No file-manager or direct wp-admin edits.

---

## Known gaps / not yet done

- Plugin not yet activated on the live WP install — test activation with `php -l` on every file first.
- `la_cms_import_products` importer: seeded with placeholder SKUs — update `includes/importer-data.php` once
  the real product list (06-Product-List) is confirmed.
- FluentSMTP mail config: configured by VVG, not in this repo. Verify end-to-end order emails before launch.
- ShipStation integration: WooCommerce ShipStation plugin is separate — confirm with Jerod that it's installed.
- COA/lot data format: finalize with Jerod before building the CSV importer.
