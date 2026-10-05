import Script from "next/script";

/**
 * GA4. Needs NEXT_PUBLIC_GA_MEASUREMENT_ID set (a real "G-XXXXXXXXXX" from
 * Google Analytics > Admin > Data Streams) - renders nothing until it is,
 * rather than shipping a broken/empty gtag call.
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-N0CMJFWH14";

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
