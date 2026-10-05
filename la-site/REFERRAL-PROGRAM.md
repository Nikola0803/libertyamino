# Referral & Welcome-Coupon Program — CRM/CMS Requirements

Spec for the automatic customer referral program: new accounts get a 10% welcome coupon,
every customer gets a personal referral link, a referred friend's first order gets $10 off,
and the referrer earns $10 store credit once that friend actually buys. Everything in this
doc lives in `peptides-crm-app` (the CRM/CMS) — the storefront (`evlv-site`) side is already
built and described at the bottom.

Grounded in the CRM's real schema/code as of 2026-08-26 (`prisma/schema.prisma`,
`src/lib/order-engine.ts`, `src/app/api/store/auth/register/route.ts`) — not guessed field names.

## The flow

1. **Registration** → new `Customer` row is created. CRM auto-generates a personal welcome
   coupon (10% off, single-use) and a personal referral code/link for that customer. A
   welcome email is sent with both.
2. **Referral link visited** → `?ref=<code>` is captured client-side (already built, see
   below) and forwarded on registration (`referralCode`) and checkout (`affiliateRef`).
3. **Referred friend's first order** → if the CRM recognizes the `affiliateRef`/`couponCode`
   as a customer referral code (not a manual Affiliate), it auto-applies a $10 discount to
   that order. This should only fire once per referred person (their first qualifying order).
4. **Order completes** (`status` moves to `COMPLETED`, not just `PENDING`) → the referrer's
   store-credit balance goes up by $10. **This is a deliberate design call, not literal to
   what was asked for** — the request described the discount landing at cart-add and didn't
   say explicitly when the referrer's credit lands. Firing referrer credit on a completed
   order (not on the friend merely adding to cart) is the recommendation here, to prevent
   someone farming credits by spinning up carts that never convert. Flag if you want it
   looser than that.
5. **Referrer's credit balance** is redeemable at their own checkout (stacks with or replaces
   a coupon — needs a product decision, see Open questions).
6. Referrer gets a short "you earned $10 store credit" email when it lands.

## Schema changes needed (`prisma/schema.prisma`)

The `Coupon` model already exists and already supports `PERCENT`/`FIXED`, `usageLimit`,
`minSubtotalCents`, `expiresAt` — but every coupon there is **org-wide**, with a single
shared `usageCount`. There's no concept of "one coupon, but only usable by customer X, once."
The `Affiliate` model is close to a referral system (has its own `couponCode`, and
`order-engine.ts` already resolves `affiliateRef`/`couponCode` against it for commission) but
it's built for hand-approved partners paid in commission — not "every customer automatically
gets one, paid in store credit."

Net new:

```prisma
model Customer {
  // ...existing fields...
  referralCode     String   @unique @default(cuid())  // short human-friendly slug preferred, see below
  storeCreditCents Int      @default(0)
}

model StoreCreditTransaction {
  id             String       @id @default(cuid())
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  organizationId String
  customer       Customer     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  customerId     String

  type           StoreCreditType   // EARNED_REFERRAL | REDEEMED | ADJUSTED
  amountCents    Int               // positive for earned, negative for redeemed
  relatedOrderId String?           // the referred friend's order (for EARNED_REFERRAL)
                                    // or this customer's own order (for REDEEMED)
  note           String?
  createdAt      DateTime @default(now())
}

enum StoreCreditType {
  EARNED_REFERRAL
  REDEEMED
  ADJUSTED
}

model Referral {
  id                  String   @id @default(cuid())
  organization        Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  organizationId      String
  referrerCustomerId  String
  referredCustomerId  String   @unique   // one referral credited per referred person, ever
  referredOrderId     String?  @unique   // set once their qualifying order completes
  status              ReferralStatus @default(PENDING)
  createdAt           DateTime @default(now())
}

enum ReferralStatus {
  PENDING     // referred person registered, hasn't ordered yet
  QUALIFIED   // their order completed, referrer credited
}
```

`referralCode` generation: `cuid()` works but isn't a nice link (`?ref=cm3x9f...`). Recommend
a short readable slug instead — e.g. first name + 4 random alphanumerics, checked for
collision (`JOHN4K2X`), matching the tone of `Affiliate.slug`.

## Coupon reuse vs. a parallel system

Two workable paths — pick one, don't build both:

- **(A) Reuse `Coupon`, add per-customer scoping.** Add `customerId String?` (nullable —
  null means org-wide, same as today) and `singleUse Boolean @default(false)` to `Coupon`.
  Welcome coupons and referral discounts become real `Coupon` rows the existing
  `order-engine.ts` validation logic already knows how to apply — least new code.
- **(B) Keep referral discounts out of `Coupon` entirely**, handled as a distinct code space
  matched in `order-engine.ts` alongside the existing `Affiliate` lookup (extend the
  `refCandidates` loop to also check `Customer.referralCode`). Keeps `Coupon` purely "manual
  marketing codes an admin creates."

**(A) is less total work** since `order-engine.ts` already has the coupon-application branch
(discount math, expiry, min-subtotal, `usageCount`) — extending it beats writing a second
parallel discount path.

## API endpoints (new or changed)

- `POST /api/store/auth/register` — currently ignores `referralCode` entirely (confirmed by
  reading the route). Needs to: read `referralCode` from the body, resolve it to a referrer
  `Customer` via `referralCode`, create the `Referral` row (`status: PENDING`), generate this
  new customer's own `referralCode` + welcome `Coupon`, and trigger the welcome email.
- `POST /api/store/checkout` (`order-engine.ts`) — the `refCandidates` matching loop
  (currently only checks `Affiliate.couponCode`/`slug`) needs a second branch checking
  `Customer.referralCode`, applying the $10 flat referral discount when matched and this is
  the referred customer's first order.
- **New:** an order-status webhook/hook — whenever an `Order.status` transitions to
  `COMPLETED`, check if it's tied to a `Referral.referredOrderId` in `PENDING` state; if so,
  credit the referrer's `storeCreditCents`, write the `StoreCreditTransaction`, flip
  `Referral.status` to `QUALIFIED`, send the referrer's earned-credit email.
- **New:** `GET /api/store/account/referral` — returns `{ referralCode, referralLink,
  storeCreditCents, referrals: [...] }` for the logged-in customer, so `/account` can show a
  real "Refer a Friend" panel instead of the honest-empty-state placeholder it'll ship with
  first.
- Store-credit redemption at checkout needs its own field/branch too (separate from
  `couponCode` — a customer should be able to apply their credit balance regardless of
  whether they also have a coupon).

## Email infrastructure — currently doesn't exist

Grepped `peptides-crm-app/src` for any transactional email sending (nodemailer, Resend,
Postmark, SES, etc.) — **there is none**. `subscribeToMailchimp` exists for marketing-list
signup only, not transactional send. This program needs:
- A transactional email provider wired in (Resend or Postmark are the least-friction options
  for a Next.js app).
- Two templates: **welcome + coupon** (fires on registration) and **referral credit earned**
  (fires when a `Referral` flips to `QUALIFIED`).
- Template variables, per your draft: `{{couponCode}}` and `{{referralLink}}`, plus whatever
  else the template needs (name, amount). Account URL is `https://evlvpeptides.com/account`
  (already live) — confirmed, no placeholder needed there.
- `referralLink` should render as `https://evlvpeptides.com/?ref={{referralCode}}` — the
  storefront's landing capture (below) reads `?ref=` from any page, not just `/`.

## Open questions before this gets built

1. **Discount stacking**: can a customer apply both a coupon/referral code *and* redeem store
   credit on the same order? Recommend yes, math order: subtotal → coupon% or coupon-flat →
   store credit (never below $0).
2. **Self-referral / abuse**: block a `Referral` where `referrerCustomerId === referredCustomerId`,
   and probably also same email domain patterns / same shipping address as a soft fraud
   signal — not blocking, just flagged for review.
3. **Does the referred friend's $10 discount require them to be a first-time customer**, or
   does it apply to their literal first *order* even if they registered a while ago before
   clicking the link? Recommend: first order only, checked by whether that `Customer` has any
   prior `COMPLETED` order.
4. Welcome coupon **expiry** — recommend 30 days, matching typical urgency-free EVLV tone (no
   countdown timer in the UI, but a real backend expiry is fine).

## Storefront side — already built, ready today

`evlv-site` already does everything a frontend can do without the CRM support above:

- `src/lib/referral.ts` — captures `?ref=CODE` from any landing URL into `localStorage`,
  read/write/clear helpers. Doubles as generic promo-code storage.
- `src/components/layout/ReferralCapture.tsx` — mounted once in `layout.tsx`, silently
  captures `?ref=` on every page load.
- `AgeGate.tsx` registration now sends `referralCode` in the `/api/auth/register` body when a
  captured code exists (today the CRM ignores it — see above).
- `checkout/page.tsx` has a real "Promo / Referral Code" field, sending both `couponCode`
  (what the shopper typed) and `affiliateRef` (the captured `?ref=` value) — matching
  `order-engine.ts`'s existing two-field contract exactly, so once the CRM changes above
  ship, this starts working with no further frontend change.
- `CartDrawer.tsx`'s promo-code field now actually saves the code (via the same
  `referral.ts` storage) instead of the old `alert("Promo codes aren't wired up yet.")`.

Not built yet, waiting on the CRM API above: the `/account` "Refer a Friend" panel (referral
link, store-credit balance, referral history) — that needs `GET
/api/store/account/referral` to exist first; building it against fake data would violate this
codebase's "honest empty state, no fabricated numbers" convention (see `GoogleReviewsWidget`,
`plans.tsx`'s "member pricing coming soon").
