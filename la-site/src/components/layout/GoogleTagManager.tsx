/**
 * GTM. Needs NEXT_PUBLIC_GTM_ID set (a real "GTM-XXXXXXX" container ID) -
 * renders nothing until it is, same "no broken empty snippet" rule as
 * GoogleAnalytics.tsx. Split into two pieces because GTM's own install
 * instructions require it: the script tag as high in <head> as possible,
 * the <noscript> iframe immediately after the opening <body> tag.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-WHV34TGS";

export function GoogleTagManagerHead() {
  if (!GTM_ID) return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
    />
  );
}

export function GoogleTagManagerBody() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
