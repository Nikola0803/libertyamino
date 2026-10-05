import Link from "next/link";

// GET /unsubscribe?token=... -- the link clicked from inside a marketing
// email (newsletter welcome / bulk campaign, see peptide-saas's
// unsubscribeFooterHtml() + signUnsubscribeToken()). This page calls the
// CRM directly server-side (not through crm-proxy.ts's crmFetch, which is
// POST-only and adds the x-store-domain handshake this doesn't need --
// the signed token IS the auth here) and just reports the result. No
// account/session required: the whole point is this works for someone who
// only ever gave their email, never made an account.
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  let ok = false;
  let email = "";
  let error = "This unsubscribe link is invalid or has expired.";

  if (token && process.env.CRM_API_URL) {
    try {
      const res = await fetch(
        `${process.env.CRM_API_URL}/api/store/newsletter/unsubscribe?token=${encodeURIComponent(token)}`,
        { cache: "no-store" }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        ok = true;
        email = typeof data.email === "string" ? data.email : "";
      } else if (typeof data?.error === "string") {
        error = data.error;
      }
    } catch {
      error = "Something went wrong processing your request. Please try again.";
    }
  }

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center px-4 py-20 text-center md:px-8">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-sage-deep/30 bg-sage-mist">
        <i className={`ri-${ok ? "check-line text-sage-deep" : "mail-close-line text-charcoal/50"} text-3xl`} />
      </div>

      {ok ? (
        <>
          <h1 className="font-display text-2xl font-semibold text-charcoal md:text-3xl">You&apos;re unsubscribed</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/60">
            {email || "This address"} won&apos;t receive any more marketing emails from EVLV Peptides. Order and account
            emails still go out as normal.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-2xl font-semibold text-charcoal md:text-3xl">Couldn&apos;t unsubscribe</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/60">{error}</p>
        </>
      )}

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition hover:bg-charcoal/90"
      >
        Back to EVLV Peptides
      </Link>
    </div>
  );
}
