# Liberty Aminos

Monorepo for the Liberty Aminos storefront and WordPress backend.

```
la-site/    Next.js 16 storefront (deploys to Vercel)
la-wp/      WordPress plugins + WooCommerce extensions (deploys to db.libertyaminos.com)
```

## la-site

```bash
cd la-site
cp .env.example .env.local   # fill in values
npm install
npm run dev                   # http://localhost:3000
npm run build                 # verify before pushing to main
```

**Environment variables:** see `la-site/.env.example`. All secrets in Vercel env vars — never commit `.env.local`.

**Deploy:** push to `main` → Vercel auto-deploys. Feature branches get preview URLs.

## la-wp

PHP WordPress plugin. Deploy to `/var/www/libertyaminos/wp-content/plugins/la-cms/` on the backend server.

```bash
# Validate PHP syntax before deploying
find la-wp -name "*.php" -exec php -l {} \;
```

**No changes on the server that are not also committed here.**

## Architecture

Headless: the Next.js storefront fetches catalog, cart and orders from WooCommerce at
`db.libertyaminos.com/wp-json/`. Custom endpoints live in `la-wp/`. See `la-site/PROJECT.md` and
`la-wp/PROJECT.md` for full details.

## Task list

See `TASKS.md` for the full implementation checklist (Launch vs Phase 2).
