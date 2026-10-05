import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy | EVLV",
  description: "How EVLV processes, ships and delivers orders across the US and Canada.",
};

export default function ShippingPage() {
  return (
    <>
      <section className="cp-info-hero cp-info-shipping -mt-[90px] bg-charcoal pb-16 pt-[150px] text-center text-white md:-mt-[100px] md:pb-24 md:pt-[170px]">
        <div className="mx-auto max-w-[800px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Legal</p>
          <h1 className="font-display text-3xl font-semibold uppercase leading-tight md:text-5xl">Shipping Policy</h1>
          <p className="mt-4 text-sm text-white/50">Effective Date: August 2026</p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-4 md:px-8">
          <p className="mb-12 text-base leading-relaxed text-soft-gray">
            EVLV (&ldquo;EVLV,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) ships orders in a
            controlled and responsible manner to maintain product integrity and meet professional expectations. This
            Shipping Policy explains how orders are processed, shipped, and delivered.
          </p>

          <div className="space-y-12">
            <PolicySection num="1" title="Order Processing">
              <p>
                Orders are processed after payment confirmation and order acceptance. Processing times may vary
                depending on product availability, order volume, and verification requirements. Order confirmation
                does not guarantee immediate dispatch. EVLV reserves the right to delay or cancel orders if
                additional review is required.
              </p>
            </PolicySection>

            <PolicySection num="2" title="Shipping Methods">
              <p>
                Orders are shipped using trusted logistics providers selected to support reliable handling and
                delivery. Shipping options, costs, and estimated delivery timelines are displayed at checkout and
                may vary by destination.
              </p>
            </PolicySection>

            <PolicySection num="3" title="Shipping Timeframes">
              <p>
                Delivery timeframes are estimates only and are not guaranteed. Actual delivery times may be affected
                by factors beyond EVLV&rsquo;s control, including carrier delays, weather conditions, or other
                logistical factors. EVLV is not responsible for delays caused by third-party carriers or external
                circumstances.
              </p>
            </PolicySection>

            <PolicySection num="4" title="Shipping Availability">
              <p>
                Shipping is available within the United States and Canada. EVLV does not currently offer shipping
                outside these regions.
              </p>
            </PolicySection>

            <PolicySection num="5" title="Free Shipping">
              <p>
                Free shipping is offered on qualifying orders over $300 (in your selected currency). Eligibility and
                terms are displayed at checkout and may change without notice.
              </p>
            </PolicySection>

            <PolicySection num="6" title="Order Tracking">
              <p>
                Tracking information is provided by email when available after dispatch. Tracking updates are
                managed by the shipping carrier and may not reflect real-time status immediately.
              </p>
            </PolicySection>

            <PolicySection num="7" title="Risk of Loss">
              <p>
                Risk of loss and responsibility for the shipment transfer to the customer upon dispatch, unless
                otherwise required by applicable law.
              </p>
            </PolicySection>

            <PolicySection num="8" title="Incorrect or Incomplete Address">
              <p>
                Customers are responsible for providing accurate and complete shipping information. EVLV is not
                responsible for delivery issues resulting from incorrect or incomplete addresses.
              </p>
            </PolicySection>

            <PolicySection num="9" title="Damaged or Lost Shipments">
              <p>
                If an order arrives damaged or is lost in transit, customers should{" "}
                <Link href="/contact" className="font-semibold text-copper hover:underline">
                  contact us
                </Link>{" "}
                promptly with relevant order details. Claims may be subject to carrier investigation and resolution
                timelines.
              </p>
            </PolicySection>

            <PolicySection num="10" title="Contact Information">
              <p>
                EVLV. Questions about an order or shipment can be sent through our{" "}
                <Link href="/contact" className="font-semibold text-copper hover:underline">
                  Contact page
                </Link>
                .
              </p>
            </PolicySection>
          </div>

          <div className="mt-16 border-t border-stone pt-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal/40">Related Legal Documents</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/returns" className="text-charcoal/60 transition hover:text-charcoal">
                Returns Policy
              </Link>
              <Link href="/terms" className="text-charcoal/60 transition hover:text-charcoal">
                Terms &amp; Conditions
              </Link>
              <Link href="/privacy" className="text-charcoal/60 transition hover:text-charcoal">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PolicySection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="flex items-baseline gap-2 font-display text-xl font-semibold text-charcoal">
        <span className="text-copper">{num}.</span> {title}
      </h2>
      <div className="mt-3 text-base leading-relaxed text-soft-gray">{children}</div>
    </div>
  );
}
