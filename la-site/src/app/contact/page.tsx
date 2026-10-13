import { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Liberty Aminos",
  description: "Get in touch with the Liberty Aminos support team.",
};

export default function ContactPage() {
  return (
    <>
      <section className="cp-info-hero cp-info-support -mt-[90px] bg-navy pb-20 pt-[150px] text-center text-white md:-mt-[100px] md:pb-32 md:pt-[170px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <h1 className="mb-4 font-sans text-4xl font-semibold md:text-5xl lg:text-6xl">Contact Us</h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Have a question about an order, product, or need assistance? We typically respond within minutes.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-5 lg:gap-16">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h3 className="mb-4 font-sans text-xl font-semibold text-ink">Get in touch</h3>
              <p className="text-sm leading-relaxed text-muted">
                Our support team is available to help with orders, product questions, and anything else you need.
              </p>
            </div>

            <div className="space-y-4">
              <ContactRow icon="ri-mail-line" label="Email">
                <a href="mailto:support@libertyaminos.com" className="text-sm text-navy transition hover:underline">
                  support@libertyaminos.com
                </a>
              </ContactRow>
              <ContactRow icon="ri-mail-line" label="Office">
                <a href="mailto:office@libertyaminos.com" className="text-sm text-navy transition hover:underline">
                  office@libertyaminos.com
                </a>
              </ContactRow>
              <ContactRow icon="ri-time-line" label="Response Time">
                <p className="text-sm text-muted">Typically within minutes during business hours</p>
              </ContactRow>
            </div>

            <div className="rounded-lg border border-border-subtle bg-off-white p-5">
              <h4 className="mb-2 text-sm font-semibold text-ink">A note on compliance</h4>
              <p className="text-xs leading-relaxed text-muted">
                Liberty Aminos products are supplied for research use only and are not intended for human consumption.
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-off-white">
        <i className={`${icon} text-navy`} />
      </div>
      <div>
        <div className="text-sm font-semibold text-ink">{label}</div>
        {children}
      </div>
    </div>
  );
}
