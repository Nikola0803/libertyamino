# Researcher/Institutional Verification — CRM Build Ticket

A compliance gate for restricted product formats (nasal sprays, injector pens) — these are closer
to human-use delivery devices than a standard lyophilized vial, so they're locked behind a
manually-reviewed researcher/institutional verification, separate from the paid "Member" plan.
Same architectural pattern as `AFFILIATE-PORTAL.md`: a role linked to the existing `Customer`
account, not a separate login. The storefront side is **already built and committed**; nothing
changes there once the CRM endpoints below exist.

## Why this is separate from `memberOnly`

`Product.memberOnly` (existing) gates content behind the paid Member plan — a loyalty/pricing
tier, nothing to do with compliance. `Product.restricted` (new) gates content behind verified
researcher/institutional status — a compliance control. A product can carry either flag
independently. Conflating them would mean a customer could buy a restricted-format product just
by being a paying member, which defeats the point.

## Schema changes needed

```prisma
model Customer {
  // ...existing fields...
  verification CustomerVerification?
}

model CustomerVerification {
  id             String   @id @default(cuid())
  customer       Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  customerId     String   @unique
  status         VerificationStatus @default(PENDING)
  institution    String
  role           String
  phone          String
  purpose        String
  reviewedAt     DateTime?
  reviewNote     String?
  createdAt      DateTime @default(now())
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

`Product.restricted: Boolean` (new field, mirrors the CRM's product schema wherever `memberOnly`
already lives — check for the equivalent field name there and match the pattern exactly).

## API endpoints needed (`/api/store/verification/*`)

Both already have a working proxy on the storefront (`evlv-site/src/app/api/verification/*`)
sending exactly this shape — they currently 503 because these CRM routes don't exist yet.

### `POST /api/store/verification/status`
Request: `{ token }` → resolve `Customer` from token, look up `CustomerVerification`. **Always
returns 200** — a customer who never applied is a legitimate `"NONE"` state, not an error:
```json
{ "status": "NONE" }
// or
{ "status": "PENDING" }
// or
{ "status": "APPROVED" }
```
Field name/values are load-bearing — `evlv-site/src/app/account/VerificationPanel.tsx` and
`VerificationSync.tsx` read this exact shape.

### `POST /api/store/verification/request`
Request: `{ token, institution, role, phone, purpose }` → resolve `Customer` from token. If a
`CustomerVerification` row already exists for this customer, return its current status instead of
creating a duplicate (same idempotency behavior as the affiliate `register` endpoint). Otherwise
create one with `status: PENDING`.

### Checkout / add-to-cart enforcement
This is the part that actually matters for compliance: **the storefront's lock UI is a courtesy,
not the enforcement boundary.** A customer could still hit `/api/store/checkout` directly with a
restricted product's slug. `order-engine.ts` needs its own check: for any line item where
`Product.restricted === true`, verify the placing customer has an `APPROVED`
`CustomerVerification` row, and reject the order (or strip the line item, whichever the business
prefers) if not. Don't rely on frontend-only gating for something compliance-sensitive.

## Open questions before this is fully done

1. **Rejection handling.** What does a `REJECTED` customer see if they apply again — blocked
   entirely, or allowed to reapply? Not specified yet.
2. **Approval notification email.** Same "no transactional email infra yet" gap flagged in
   `REFERRAL-PROGRAM.md` and `AFFILIATE-PORTAL.md` — one provider decision covers all of these.
3. **Actual restricted products.** Infrastructure is built; no nasal-spray/injector-pen SKUs exist
   in the catalog yet. When real product details (names, doses, pricing) are provided, they get
   added to `products.ts` with `restricted: true` and a `"device"` or `"nasal"` format — both
   format values already exist in `ProductFormat`.

## Storefront side — already built, ready today

- `src/lib/auth.ts` — `AuthUser.researcherStatus` ("NONE" | "PENDING" | "APPROVED"), cached
  locally, never set as a client-side preview (unlike `plan`) — only ever synced from what the
  CRM actually approved.
- `src/components/layout/VerificationSync.tsx` — mounted once in the root layout, refreshes the
  cached status from the CRM on load for any signed-in customer.
- `src/app/account/VerificationPanel.tsx` — the "Verification" tab in `/account` (reached via
  `/account?tab=verification`, same deep-link pattern as the Affiliate tab). Three real states:
  apply form (`NONE`), "under review" (`PENDING`), confirmation (`APPROVED`) — no fabricated data.
- `ProductCard.tsx` / `ProductClient.tsx` — a `restricted` product shows a "Verified Researchers
  Only" lock (distinct copy from "Member Exclusive") and links to `/account?tab=verification`
  instead of `/plans`.
- `src/lib/types.ts` — `Product.restricted?: boolean`, and `ProductFormat` gained `"device"` (for
  injector pens) alongside the existing `"nasal"`.
- `src/app/api/verification/{status,request}/route.ts` — proxy routes wired to the exact CRM
  contract above, 503-ing gracefully today.

Every state shown anywhere in this flow is either real (fetched from these endpoints) or an
honest "not connected yet" state — nothing is fabricated, consistent with the rest of this
codebase's convention.
