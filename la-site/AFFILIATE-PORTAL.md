# Affiliate Program — CRM/CMS Build Ticket

Affiliates are a **role on the existing Customer account**, not a separate login system. One
person, one account, one password — the same account they already use to shop, sign in with,
gets an "Affiliate" tab in `/account` once they apply. This replaces an earlier version of this
doc that modeled affiliates with their own email/password (a mistake — caught and fixed
2026-08-27 after it caused real login confusion in testing: a seed credential meant only for the
affiliate system got tried against the regular site login and correctly failed, revealing the
two-account design was the actual problem).

Full spec for making this work end-to-end: sign in (regular account) → apply for affiliate status
from `/account` or `/affiliates` → manual approval → see standing (clicks, sales, commission) →
set payout method (Venmo / Zelle / Cash App / US bank ACH) → request payout → owner pays out
manually and marks it paid. The storefront side is **already built and committed** against every
endpoint/field name below; nothing on the frontend needs to change once these are live.

## Read this first: don't reuse `vp-affiliate-portal`

`C:\Users\PC\Desktop\Vint and MSV\vp-affiliate-portal` is a **different company's**
infrastructure — a shared login/dashboard for Vintage Vitality Group's storefronts (Vintage
Peptides, My Secret Vitality, Liberty Peptides), talking to a shared WordPress `vp-affiliates`
plugin those specific sites run, with its own separate affiliate login system (which is in fact
why the earlier version of this doc copied that same separate-login mistake — it was used as a
UX reference too literally). Its registration field list was still useful reference for what
information to collect, but its account architecture should NOT be replicated. EVLV is headless
(`peptides-crm-app`), not WordPress, and routing EVLV data through an unrelated company's system
would be a real data-boundary mistake regardless.

## Current state in `peptides-crm-app` (grounded in the real schema/code, 2026-08-26)

The `Affiliate` model already exists but is **admin-created only**, with no link back to a
`Customer` at all:

```prisma
model Affiliate {
  id             String       @id @default(cuid())
  organizationId String
  name        String
  slug        String
  ratePercent Float
  couponCode  String
  attributions AffiliateOrderAttribution[]
  createdAt    DateTime @default(now())
  @@unique([organizationId, slug])
}

model AffiliateOrderAttribution {
  id            String    @id @default(cuid())
  affiliateId   String
  orderId       String    @unique
  commissionCents Int
}

model Customer {
  id             String       @id @default(cuid())
  organizationId String
  email          String
  passwordHash   String
  name           String?
  marketingOptIn Boolean      @default(false)
  createdAt      DateTime     @default(now())
  @@unique([organizationId, email])
}
```

`order-engine.ts`'s checkout flow already resolves `affiliateRef`/`couponCode` against
`Affiliate.couponCode`/`slug` and writes `AffiliateOrderAttribution` with the correct commission
on every order — **attribution and commission math already work end-to-end today**. What's
missing: linking `Affiliate` to `Customer`, an apply/status/dashboard flow that uses the
Customer's existing session, click tracking, and payout handling.

### Commission tiers (`/affiliates#tiers` on the storefront)

`Affiliate.ratePercent` is already a free-form `Float` — no schema change needed for tiering,
just an admin convention when approving/upgrading an affiliate:

| Tier | Rate | Qualification |
|---|---|---|
| Researcher | 8% | Default — every approved affiliate starts here |
| Lab Associate | 12% | Consistently active referral volume |
| Principal | 16% | Established, high-volume partner |
| Institutional Partner | 20% | High volume **and** a compliance review of their actual promotional materials — content making therapeutic/dosing/human-use claims disqualifies regardless of volume |

Tier upgrades are a manual admin action (edit `ratePercent` on the `Affiliate` row) — not
automatic, and the storefront copy says as much. The 20% tier is the one place in this program
where "how they promote" is a hard gate, not just a general RUO reminder — worth an actual manual
review of their content/site/social presence before approving that rate, not just a volume
threshold.

## Schema changes needed

```prisma
model Affiliate {
  // ...existing fields above, unchanged (name, slug, ratePercent, couponCode)...
  customer       Customer     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  customerId     String       @unique   // one Affiliate row per Customer, ever
  status         AffiliateStatus @default(PENDING)

  // Application fields (collected once, on apply)
  referredBy     String?
  socialLink     String?
  phone          String?
  address        String?
  city           String?
  province       String?
  postalCode     String?
  country        String?

  // Payout method — one of these three groups is populated depending on payoutMethod.
  payoutMethod        PayoutMethod?
  payoutDestination   String?   // Venmo username / Zelle email-or-phone / $Cashtag
  bankAccountHolder   String?
  bankRoutingNumber   String?
  bankAccountNumber   String?
  bankAccountType     BankAccountType?

  clicks         AffiliateClick[]
  payoutRequests AffiliatePayoutRequest[]
}

enum AffiliateStatus {
  PENDING    // applied, awaiting manual review
  APPROVED
  REJECTED
}

enum PayoutMethod {
  VENMO
  ZELLE
  CASHAPP
  BANK_ACH
}

enum BankAccountType {
  CHECKING
  SAVINGS
}

model AffiliateClick {
  id          String   @id @default(cuid())
  affiliate   Affiliate @relation(fields: [affiliateId], references: [id], onDelete: Cascade)
  affiliateId String
  createdAt   DateTime @default(now())
}

model AffiliatePayoutRequest {
  id             String   @id @default(cuid())
  affiliate      Affiliate @relation(fields: [affiliateId], references: [id], onDelete: Cascade)
  affiliateId    String
  amountCents    Int
  status         PayoutRequestStatus @default(REQUESTED)
  requestedAt    DateTime @default(now())
  paidAt         DateTime?
  adminNote      String?
}

enum PayoutRequestStatus {
  REQUESTED
  PAID
  REJECTED
}
```

Add the inverse relation on `Customer`:
```prisma
model Customer {
  // ...existing fields...
  affiliate Affiliate?
}
```

`AffiliateClick` is deliberately minimal (just a timestamp row) — enough to compute
`clicks_30d`/`clicks_total` by counting. `slug`/`couponCode` generation on apply: a short
readable value (e.g. the customer's name + 4 random alphanumerics, checked for collision) — the
same approach `REFERRAL-PROGRAM.md` recommends for `Customer.referralCode` on the *other*
(unrelated) referral-credit program, which shares the `?ref=` query param but is a fully separate
feature from this one.

Available commission balance = sum of `AffiliateOrderAttribution.commissionCents` joined to
`COMPLETED` orders, **minus** the sum of any `PAID` or `REQUESTED` `AffiliatePayoutRequest.amountCents`
for that affiliate (so a pending/paid request can't be double-counted as still available).

## API endpoints needed (`/api/store/affiliate/*`)

Every one of these already has a working proxy on the storefront (`evlv-site/src/app/api/affiliate/*`)
sending exactly this shape — they currently 503 because these CRM routes don't exist yet. **All
four authenticate with the same bearer token `/api/store/auth/login` already issues** — there is
no separate affiliate login endpoint, and there should never be one.

### `POST /api/store/affiliate/register`
Request: `{ token, referredBy?, socialLink, phone, address, postalCode, city, province, country }`
→ Resolve the `Customer` from `token` (same way `/api/store/account/orders` already does). If
that Customer already has a linked `Affiliate` row, return its current status instead of creating
a duplicate. Otherwise create one with `status: PENDING`, a generated `slug`/`couponCode`.
Returns the application-received response — matches the "reviewed within a couple of business
days" copy already live on `/affiliates` and in `AffiliatePanel.tsx`.

### `POST /api/store/affiliate/dashboard`
Request: `{ token }` → resolve `Customer` from `token`, then look up the linked `Affiliate` (if
any). **Always returns 200** — this is not an error path, it's three legitimate states:
```json
// No Affiliate row for this Customer at all:
{ "status": "NONE" }

// Affiliate row exists, status PENDING:
{ "status": "PENDING" }

// status APPROVED:
{
  "status": "APPROVED",
  "referralCode": "NIKOLA4K2X",
  "clicks30d": 0, "clicksTotal": 0,
  "salesConfirmed": 0, "salesPending": 0,
  "commissionAvailableCents": 0, "commissionPendingCents": 0,
  "minPayoutCents": 5000,
  "payoutMethod": null, "payoutDestination": null,
  "bankAccountHolder": null, "bankRoutingNumber": null,
  "bankAccountNumber": null, "bankAccountType": null
}
```
Field names are load-bearing — `evlv-site/src/app/account/AffiliatePanel.tsx` reads these exact
keys and switches its rendered state on `status`. `salesConfirmed`/`commissionAvailableCents` =
attributions joined to `COMPLETED` orders (minus pending/paid payout requests, per the balance
formula above). `salesPending`/`commissionPendingCents` = attributions joined to `PENDING`
orders. `minPayoutCents` is a per-org config value (suggest `5000` = $50 to start; make it a real
setting, not hardcoded). Don't mask `bankAccountNumber` in this response — it's returned only to
the authenticated owner of that data confirming their own saved info.

### `POST /api/store/affiliate/payout-info`
Request: `{ token, payoutMethod, payoutDestination?, bankAccountHolder?, bankRoutingNumber?, bankAccountNumber?, bankAccountType? }`
→ Resolve Customer → Affiliate from `token` (must be `APPROVED`). Validates the field set matches
`payoutMethod` (bank fields required only for `BANK_ACH`, `payoutDestination` for the other
three), saves onto the `Affiliate` row. Response: the saved payout fields back, or an error.

### `POST /api/store/affiliate/payout-request`
Request: `{ token }` → **amount is never client-supplied** — resolve Customer → Affiliate,
compute current `commissionAvailableCents` server-side, reject if below `minPayoutCents` or if
`payoutMethod` isn't set, otherwise create an `AffiliatePayoutRequest` row (`status: REQUESTED`,
`amountCents` = the resolved balance at request time). Response: `{ amountCents }`. **This is a
request, not an automatic transfer** — the owner pays out manually via whichever method the
affiliate chose (same manual-payment pattern the store already uses for customer checkout:
Zelle/CashApp/Venmo) and marks the request `PAID` from a CRM admin UI (not built yet — see Open
questions).

### `POST /api/store/affiliate/click`
Already built and wired (see `src/lib/referral.ts`'s `captureReferralFromUrl`, which
fire-and-forgets this on every `?ref=` capture). Request: `{ code }`, public, no auth. Look up an
`Affiliate` by `slug`/`couponCode` matching `code`; if found, write an `AffiliateClick` row.
Silently no-op if the code doesn't match — most `?ref=` codes will be customer referral codes
from the unrelated `REFERRAL-PROGRAM.md` system, not affiliate ones.

## Open questions before this is fully done

1. **Admin UI for marking payouts paid.** `AffiliatePayoutRequest` rows need somewhere to be
   reviewed/marked `PAID` from the CRM's own dashboard (not the affiliate-facing one) — this
   ticket only covers the affiliate-facing side. Worth its own small admin page: a list of
   `REQUESTED` rows with the affiliate's chosen payout method/destination shown, a "Mark Paid"
   button.
2. **Approval + payout notification emails.** No transactional email infrastructure exists yet in
   `peptides-crm-app` (same gap `REFERRAL-PROGRAM.md` flags for its own welcome-coupon email) — an
   approved applicant and a fulfilled payout request should both trigger an email once that's
   built. One provider decision (Resend/Postmark) covers both this and the other program.
3. **Discount stacking / self-referral**: not this program's concern directly (no discount is
   given to a referred *buyer* here, only commission to the affiliate) — but worth checking
   `order-engine.ts`'s existing affiliate-commission math doesn't also let someone use their own
   coupon code on their own order to earn commission on themselves. Flag for review, not blocking.

## Storefront side — already built, ready today

- `src/app/account/page.tsx` — new "Affiliate" tab (alongside Orders/Addresses/Profile), reached
  via the regular signed-in account, or a `?tab=affiliate` deep link.
- `src/app/account/AffiliatePanel.tsx` — the whole three-state UI: `NONE` shows the apply form,
  `PENDING` shows "under review", `APPROVED` shows referral link + stat cards + payout
  request/settings. Fetches `/api/affiliate/dashboard` with the regular customer token from
  `src/lib/auth.ts` (`getStoredToken()`) — **not** a separate affiliate session.
- `src/app/affiliates/AffiliateForm.tsx` — the apply form. No username/email/password fields
  (the customer already has those) — just the affiliate-specific info: referred-by, social link,
  phone, full address, ToS checkbox. Posts `{ token, ... }` to `/api/affiliate/register`.
- `src/app/affiliates/page.tsx` — marketing/landing page. Has a "Already applied? Sign in to your
  account" link right at the top (no scrolling to the form needed), and the Apply form further
  down for new applicants.
- `src/app/account/PayoutSettings.tsx` — Venmo / Zelle / Cash App / US Bank (ACH) method picker
  with the matching field set per method, posting to `/api/affiliate/payout-info`.
- `src/app/api/affiliate/{register,dashboard,payout-info,payout-request,click}/route.ts` — proxy
  routes wired to the exact CRM contract above, 503-ing gracefully today. **There is no
  `/api/affiliate/login` route** — it was deleted; do not recreate it.
- Header's "Affiliate Login" icon was removed (it pointed at a login flow that no longer exists);
  the regular Account icon covers this now.

Every number shown anywhere in this flow is either real (fetched from these endpoints) or an
honest "not connected yet" state — nothing is fabricated. Once the endpoints above exist and
return real data, the frontend needs zero changes to start working.
