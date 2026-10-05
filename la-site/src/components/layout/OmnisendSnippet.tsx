import Script from "next/script";

/**
 * Omnisend tracking + on-site popup/launcher snippet. Fires a $pageViewed
 * track call and loads Omnisend's launcher-v2.js (in-shop popups/forms),
 * same as GoogleAnalytics/GoogleTagManager below -- front-end only, this
 * has nothing to do with the CRM's own transactional/newsletter email
 * (see peptide-saas's src/lib/email.ts), it's Omnisend's own client-side
 * tracking + on-site widgets.
 */
const OMNISEND_BRAND_ID = process.env.NEXT_PUBLIC_OMNISEND_BRAND_ID || "6aa903409b0f973742e3f8cb";

export function OmnisendSnippet() {
  return (
    <Script id="omnisend-snippet" strategy="afterInteractive">
      {`
        window.omnisend = window.omnisend || [];
        omnisend.push(["brandID", "${OMNISEND_BRAND_ID}"]);
        omnisend.push(["track", "$pageViewed"]);
        !function(){var e=document.createElement("script");
        e.type="text/javascript",e.async=!0,
        e.src="https://omnisnippet1.com/inshop/launcher-v2.js";
        var t=document.getElementsByTagName("script")[0];
        t.parentNode.insertBefore(e,t)}();
      `}
    </Script>
  );
}
