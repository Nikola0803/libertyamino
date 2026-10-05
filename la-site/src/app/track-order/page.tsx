import type { Metadata } from "next";
import Link from "next/link";
import { TrackOrderForm } from "./TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the processing and shipping status of an EVLV research order.",
  alternates: { canonical: "/track-order" },
};

const SHIPPING_POINTS = [
  ["ri-box-3-line", "Order processing", "Most confirmed orders leave our facility within 2–3 business days."],
  ["ri-radar-line", "Live tracking", "Tracking activates after the first carrier scan, which can take up to 24 hours."],
  ["ri-truck-line", "Priority transit", "FedEx 2Day typically arrives within 2–3 business days after carrier acceptance."],
  ["ri-map-pin-check-line", "Address accuracy", "Review your delivery address before checkout; post-dispatch changes may cause delays."],
] as const;

export default function TrackOrderPage() {
  return (
    <main className="bg-white">
      <section className="cp-info-hero cp-info-shipping">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Order support</p>
          <h1 className="font-display font-semibold text-white">Track your order</h1>
          <p className="mt-5 text-base leading-relaxed text-white/70">Enter the order ID from your confirmation email together with the billing email used at checkout.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">Secure lookup</p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-charcoal md:text-4xl">Find your shipment</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-charcoal/60">For privacy, both fields must match the original order. Carrier events may take several hours to appear after dispatch.</p>
            <div className="mt-7 rounded-xl border-l-4 border-sage-deep bg-sage-mist p-5 text-sm leading-6 text-charcoal/65"><b className="block text-charcoal">Research use only</b>All EVLV products are supplied exclusively for laboratory and analytical research - not for human or veterinary use.</div>
          </div>
          <TrackOrderForm />
        </div>
      </section>

      <section className="bg-[#f4f7f5] py-16 md:py-20">
        <div className="mx-auto max-w-[1180px] px-4 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">Fast, traceable delivery</p><h2 className="font-display text-3xl font-semibold text-charcoal">Shipping at a glance</h2></div><p className="max-w-md text-sm leading-6 text-charcoal/55">FedEx 2Day provides fast, secure domestic transit with tracking from carrier acceptance to delivery.</p></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{SHIPPING_POINTS.map(([icon,title,copy]) => <article key={title} className="rounded-xl border border-stone bg-white p-6"><i className={`${icon} text-2xl text-sage-deep`} /><h3 className="mt-5 text-sm font-semibold text-charcoal">{title}</h3><p className="mt-2 text-xs leading-6 text-charcoal/55">{copy}</p></article>)}</div>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-xl bg-sage-deep p-6 text-white sm:flex-row md:p-8"><div><h3 className="font-display text-xl font-semibold">Need help locating an order?</h3><p className="mt-1 text-sm text-white/65">Our support team can review order and carrier details.</p></div><Link href="/contact" className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-sage-deep">Go to customer support</Link></div>
        </div>
      </section>
    </main>
  );
}
