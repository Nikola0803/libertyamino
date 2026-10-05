# Wholesale/Dropship Partner Portal — CRM Build Ticket

Real gap identified 2026-08-27: `/wholesale` only ever built a B2B inquiry form (lead-gen, manual
follow-up) — there was no partner-facing login or dashboard at all. This spec covers the missing
piece: once an inquiry is approved, the partner needs somewhere to configure where their
order/invoice notifications go, and see what they owe and what's been paid, since payment is
manual (no processor) same as the storefront's own checkout.

Same architecture as `AFFILIATE-PORTAL.md` and `RESEARCHER-VERIFICATION.md`: a role linked to the
partner's existing `Customer` account, not a separate login. The storefront side is **already
built and committed** against the contract below; nothing changes there once these CRM endpoints
exist.

## The flow

1. Prospect submits the existing inquiry form on `/wholesale` (`POST
   /api/store/wholesale/inquiry` — already specced, not repeated here) — this does **not**
   require an existing account; a prospect might not have shopped on EVLV before.
2. Your team reviews the inquiry manually, as today.
3. **New, manual step**: once approved, someone on the team links the `WholesaleInquiry` to a
   `Customer` record (create one if the prospect doesn't have one yet, matched by email) and flips
   status to `APPROVED`. There's no self-serve UI for this step in this ticket — it's an admin
   action, same tier of manual work as approving the inquiry itself.
4. The partner signs in with their regular EVLV account and sees a "Wholesale" tab in `/account`
   showing their invoices and settings.

## Schema changes needed

```prisma
model Customer {
  // ...existing fields...
  wholesalePartner WholesalePartner?
}

model WholesalePartner {
  id                 String   @id @default(cuid())
  customer           Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  customerId         String   @unique
  status             WholesaleStatus @default(PENDING)
  businessName       String?
  notificationEmail  String?
  inquiryId          String?  // links back to the original WholesaleInquiry, if you keep that as its own table
  invoices           WholesaleInvoice[]
  createdAt          DateTime @default(now())
}

enum WholesaleStatus {
  PENDING
  APPROVED
  REJECTED
}

model WholesaleInvoice {
  id             String   @id @default(cuid())
  partner        WholesalePartner @relation(fields: [partnerId], references: [id], onDelete: Cascade)
  partnerId      String
  label          String   // e.g. "August 2026 wholesale order" or an order/batch reference
  amountCents    Int
  status         InvoiceStatus @default(UNPAID)
  issuedDate     DateTime @default(now())
  paidDate       DateTime?
  paymentMethod  String?  // "zelle" | "cashapp" | "venmo" | "bank_ach" -- same manual-payment
                           // methods the storefront checkout already uses (see payment-config.ts)
  paymentMemo    String?  // what to put in the memo/note when paying, so it's identifiable
}

enum InvoiceStatus {
  UNPAID
  PAID
}
```

## API endpoints needed (`/api/store/wholesale/*`)

### `POST /api/store/wholesale/dashboard`
Request: `{ token }` → resolve `Customer` from token, look up `WholesalePartner`. **Always
returns 200**:
```json
{ "status": "NONE" }
// or
{ "status": "PENDING" }
// or
{
  "status": "APPROVED",
  "businessName": "Acme Research Co.",
  "notificationEmail": "orders@acmeresearch.com",
  "invoices": [
    {
      "id": "inv_abc",
      "label": "August 2026 wholesale order",
      "amountCents": 500000,
      "status": "UNPAID",
      "issuedDate": "2026-08-15",
      "paymentMethod": "zelle",
      "paymentMemo": "ACME-AUG26"
    }
  ]
}
```
Field names are load-bearing — `evlv-site/src/app/account/WholesalePanel.tsx` reads this exact
shape. `"NONE"` covers both "never inquired" and "inquiry submitted but not yet linked/approved" —
the frontend doesn't distinguish those two, it just shows a link back to the `/wholesale` inquiry
form either way.

### `POST /api/store/wholesale/settings`
Request: `{ token, notificationEmail, businessName? }` → resolve `Customer` → `WholesalePartner`
(must exist and be `APPROVED`), save the fields. This is deliberately a separate inbox from the
account's login email — ops/billing may not be the same person as whoever signs in.

### Invoice creation/payment marking — admin-side, not in this ticket
Nothing here builds an admin UI for creating invoices or marking them paid — that's CRM-dashboard
work (the internal side, not the storefront-facing `/account` panel this ticket covers). At
minimum, whoever builds the CRM admin needs a way to create a `WholesaleInvoice` row for a
partner and flip its status to `PAID` once payment is manually confirmed (same trust model as the
storefront's own checkout: no payment processor, a human confirms the Zelle/CashApp/Venmo/bank
transfer arrived).

## Open questions before this is fully done

1. **Notification emails.** Once an invoice is created, does the partner get an email at
   `notificationEmail`? Same "no transactional email infra yet" gap flagged in
   `REFERRAL-PROGRAM.md`, `AFFILIATE-PORTAL.md`, and `RESEARCHER-VERIFICATION.md` — one provider
   decision (Resend/Postmark) covers all four features waiting on this.
2. **Recurring vs. per-order invoicing.** Is a wholesale partner invoiced per order, per batch, or
   on a billing cycle (e.g. monthly)? The schema above is agnostic to this (just a list of
   invoices), but it affects how/when the admin side creates them.
3. **What else does "main dropshipping company elements" mean?** This ticket covers settings +
   invoice/payment visibility, which is what was explicitly asked for. If there's more expected —
   order history/tracking for orders placed through the partner's own branded storefront, a
   product catalog/pricing sheet view, etc. — flag it and it can be scoped as a follow-up; wasn't
   guessed at here to avoid building speculative UI.

## Storefront side — already built, ready today

- `src/app/account/WholesalePanel.tsx` — the "Wholesale" tab in `/account` (reached via
  `/account?tab=wholesale`, same deep-link pattern as Affiliate/Verification). Four real states:
  no account yet (links to the `/wholesale` inquiry form), under review, and — once approved — a
  settings form (business name, notification email) plus an invoice list showing amount, paid/
  unpaid status, and payment instructions for anything still owed.
- `src/app/wholesale/page.tsx` — added an "Already a partner? Sign in to your account" link in
  the hero, so a returning partner doesn't have to scroll to the inquiry form.
- `src/app/api/wholesale/{dashboard,settings}/route.ts` — proxy routes wired to the exact CRM
  contract above, 503-ing gracefully today. `src/app/api/wholesale/inquiry/route.ts` (the
  original lead-gen form) is unchanged.

Every number/status shown anywhere in this flow is either real (fetched from these endpoints) or
an honest "not connected yet" state — nothing is fabricated, consistent with this codebase's
convention elsewhere.
