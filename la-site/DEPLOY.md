# EVLV deployment

This project is a Next.js application and requires a Node.js hosting environment. It is not a static HTML upload.

## Build commands

```bash
npm install
npm run build
npm run start
```

## Required production environment variables

Copy the values from the secure production environment. Do not upload `.env.local` or commit secrets.

```text
CRM_API_URL=
CRM_ORG_API_KEY=
CRM_STORE_DOMAIN=
CRM_CONTACT_FORM_KEY=
NEXT_PUBLIC_CRM_URL=
NEXT_PUBLIC_CRM_TRACKING_KEY=
```

Optional analytics and reviews variables are documented in `.env.example`.

## Research access flow

Normal visitors must sign in or create an account and confirm the RUO restriction. Account creation sends `marketingOptIn: true` to the CRM.

Approved advertising and deep links may bypass the account gate with:

```text
?age_verified=1
```

The site removes only `age_verified` from the visible URL. Product paths, UTM parameters, referral codes, and anchors remain intact.

Example:

```text
https://evlvpeptides.com/shop/evlv-3-10mg?age_verified=1&utm_source=meta&utm_campaign=launch
```

## Verification

The production build was verified with Next.js 16.3.2 and generated all configured pages successfully.
