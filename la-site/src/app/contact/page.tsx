import { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | EVLV",
  description: "Get in touch with the EVLV support team.",
};

export default function ContactPage() {
  return (
    <>
      <section className="cp-info-hero cp-info-support -mt-[90px] bg-charcoal pb-20 pt-[150px] text-center text-white md:-mt-[100px] md:pb-32 md:pt-[170px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <h1 className="mb-4 font-display text-4xl font-semibold md:text-5xl lg:text-6xl">Contact Us</h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Have a question about an order, product, or need assistance? We typically respond within minutes.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-5 lg:gap-16">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h3 className="mb-4 font-display text-xl font-semibold text-charcoal">Get in touch</h3>
              <p className="text-sm leading-relaxed text-charcoal/60">
                Our support team is available to help with orders, product questions, and anything else you need.
              </p>
            </div>

            <div className="space-y-4">
              <ContactRow icon="ri-mail-line" label="Email">
                <a href="mailto:support@evlvpeptides.com" className="text-sm text-sage-deep transition hover:underline">
                  support@evlvpeptides.com
                </a>
              </ContactRow>
              <ContactRow icon="ri-mail-line" label="Office">
                <a href="mailto:office@evlvpeptides.com" className="text-sm text-sage-deep transition hover:underline">
                  office@evlvpeptides.com
                </a>
              </ContactRow>
              <ContactRow icon="ri-time-line" label="Response Time">
                <p className="text-sm text-charcoal/60">Typically within minutes during business hours</p>
              </ContactRow>
            </div>

            <div className="rounded-lg border border-stone bg-ivory-soft p-5">
              <h4 className="mb-2 text-sm font-semibold text-charcoal">A note on compliance</h4>
              <p className="text-xs leading-relaxed text-charcoal/60">
                EVLV products are supplied for research use only and are not intended for human consumption.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory-soft">
        <i className={`${icon} text-sage-deep`} />
      </div>
      <div>
        <div className="text-sm font-semibold text-charcoal">{label}</div>
        {children}
      </div>
    </div>
  );
}
