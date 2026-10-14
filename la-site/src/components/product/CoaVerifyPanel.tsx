import Link from "next/link";

interface CoaVerifyPanelProps {
  /** Current lot number for this product. Empty string if no lot on file. */
  lot: string;
  /** PDF URL if available. If absent, download button is disabled. */
  pdfUrl?: string;
}

/**
 * Batch verification panel shown on product detail pages.
 * Navy background, white text. Links to the per-lot COA verification page.
 */
export function CoaVerifyPanel({ lot, pdfUrl }: CoaVerifyPanelProps) {
  const hasLot = Boolean(lot);

  return (
    <div
      className="mt-6 rounded-lg p-5"
      style={{ background: "var(--color-navy)", color: "#fff" }}
      aria-label="Batch verification"
    >
      <div className="flex items-center gap-2 mb-3">
        <i className="ri-shield-check-line text-lg" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/75">
          Verify this batch
        </span>
      </div>

      {hasLot ? (
        <>
          <p className="text-sm text-white/70 mb-1">Current lot</p>
          <p className="font-mono text-base font-semibold mb-4">{lot}</p>

          <div className="rounded border border-white/20 bg-white/10 flex items-center justify-center h-24 mb-4" aria-label="QR code placeholder">
            <span className="text-xs text-white/50 text-center px-2">Scan to verify<br /><span className="text-white/30">(QR code coming soon)</span></span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/coas/${encodeURIComponent(lot)}`}
              className="flex-1 text-center rounded-md border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/20"
            >
              View full COA
            </Link>
            {pdfUrl ? (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center rounded-md border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/20"
              >
                <i className="ri-download-line mr-1" aria-hidden="true" />
                Download COA PDF
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 text-center rounded-md border border-white/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/35 cursor-not-allowed"
              >
                PDF — Coming soon
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm text-white/60">
          No lot on file for this product yet.{" "}
          <Link href="/coas" className="text-white underline underline-offset-2">
            Search the COA library →
          </Link>
        </p>
      )}
    </div>
  );
}
