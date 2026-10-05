"use client";

import { FormEvent, useState } from "react";

interface TrackingResult {
  orderNumber: string;
  shortOrderNumber: string;
  status: string;
  placedAt: string;
  carrierCode?: string | null;
  trackingNumber?: string | null;
  shippedAt?: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  ON_HOLD: "On hold",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

function carrierUrl(carrier: string | null | undefined, tracking: string) {
  const code = carrier?.toLowerCase() ?? "";
  if (code.includes("ups")) return `https://www.ups.com/track?loc=en_US&tracknum=${encodeURIComponent(tracking)}`;
  if (code.includes("usps")) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(tracking)}`;
  return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(tracking)}`;
}

export function TrackOrderForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/order-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "We couldn't retrieve that order.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't retrieve that order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-stone bg-white p-6 shadow-[0_24px_70px_rgba(11,47,44,.08)] md:p-9">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label htmlFor="order-id" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">Order ID</label>
          <input id="order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} required autoComplete="off" placeholder="Example: STORE-… or 1042" className="h-13 w-full rounded-lg border border-stone bg-white px-4 text-sm text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-sage-deep" />
        </div>
        <div>
          <label htmlFor="billing-email" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">Billing email</label>
          <input id="billing-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="Email used at checkout" className="h-13 w-full rounded-lg border border-stone bg-white px-4 text-sm text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-sage-deep" />
        </div>
        <button type="submit" disabled={loading} className="flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-sage-deep text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-60">
          <i className={loading ? "ri-loader-4-line animate-spin" : "ri-map-pin-time-line"} />
          {loading ? "Checking order" : "Track order"}
        </button>
      </form>

      {error && <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} <a href="/contact" className="font-semibold underline">Contact support</a></div>}
      {result && (
        <div className="mt-6 rounded-xl bg-sage-mist p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><small className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/45">Order</small><p className="mt-1 font-mono text-sm font-semibold text-charcoal">#{result.shortOrderNumber || result.orderNumber}</p></div>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-sage-deep">{STATUS_LABELS[result.status] || result.status}</span>
          </div>
          <p className="mt-4 text-xs text-charcoal/60">Placed {new Date(result.placedAt).toLocaleDateString()}</p>
          {result.trackingNumber ? (
            <a href={carrierUrl(result.carrierCode, result.trackingNumber)} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-between rounded-lg bg-white p-4 text-sm font-semibold text-charcoal transition hover:text-sage-deep">
              <span><small className="block text-[9px] uppercase tracking-wider text-charcoal/40">Tracking number</small>{result.trackingNumber}</span><i className="ri-external-link-line" />
            </a>
          ) : <p className="mt-4 rounded-lg bg-white p-4 text-sm text-charcoal/60">Tracking will appear here after the carrier accepts your parcel.</p>}
        </div>
      )}
    </div>
  );
}
