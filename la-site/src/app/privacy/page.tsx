import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | EVLV",
  description: "How EVLV collects, uses, stores and safeguards personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="cp-info-hero cp-info-quality -mt-[90px] bg-charcoal pb-16 pt-[150px] text-center text-white md:-mt-[100px] md:pb-24 md:pt-[170px]">
        <div className="mx-auto max-w-[800px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Legal</p>
          <h1 className="font-display text-3xl font-semibold uppercase leading-tight md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-white/50">Effective Date: August 2026</p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-4 md:px-8">
          <p className="mb-12 text-base leading-relaxed text-soft-gray">
            EVLV (&ldquo;EVLV,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy
            and is committed to protecting personal information collected through our website and related services.
            This Privacy Policy explains how information is collected, used, stored, and safeguarded.
          </p>

          <div className="space-y-12">
            <PolicySection num="1" title="Information We Collect">
              <p>We may collect limited personal information when you interact with our website, including:</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Name",
                  "Email address",
                  "Billing and shipping information",
                  "Payment-related details (processed securely by third-party providers)",
                  "Communications you send to us",
                  "Technical information such as IP address, browser type, and device data",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                    <i className="ri-check-line mt-0.5 shrink-0 text-copper" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">We collect only information necessary to operate responsibly and provide our services.</p>
            </PolicySection>

            <PolicySection num="2" title="How We Use Information">
              <p>Information collected may be used to:</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Process orders and payments",
                  "Communicate regarding inquiries, orders, or support requests",
                  "Provide access to documentation or account-related information",
                  "Improve website functionality and security",
                  "Comply with legal and regulatory obligations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                    <i className="ri-check-line mt-0.5 shrink-0 text-copper" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">EVLV does not sell, rent, or trade personal information.</p>
            </PolicySection>

            <PolicySection num="3" title="SMS and Text Message Program">
              <p>
                EVLV operates an optional SMS marketing program. Participation is entirely voluntary and is never
                required in order to buy anything from us.
              </p>
              <p className="mt-4">
                <strong className="text-charcoal">How we collect consent.</strong> We only send marketing text
                messages to a phone number when the person who owns that number has given express written consent
                by ticking an unchecked opt-in box on our website and submitting it. The box is never pre-ticked,
                and consent to receive text messages is not a condition of any purchase. Consent to receive email
                does not carry over to SMS, and we do not treat it as though it does.
              </p>
              <p className="mt-4">
                <strong className="text-charcoal">What we record as proof of consent.</strong> When you opt in we
                store the phone number, the date and time of the opt-in in UTC, the IP address and browser user
                agent of the device used, the page the consent was given on, and a version identifier for the exact
                consent wording shown to you at that moment. We retain this record for as long as you remain
                subscribed and for at least five years after you opt out, so that we can evidence your consent if
                asked.
              </p>
              <p className="mt-4">
                <strong className="text-charcoal">What we send.</strong> Restock and back-in-stock alerts,
                occasional offers, and messages about an order you have placed. Message frequency varies. Message
                and data rates may apply.
              </p>
              <p className="mt-4">
                <strong className="text-charcoal">How to opt out.</strong> Reply STOP to any message from us to
                unsubscribe immediately. Reply HELP to any message for assistance, or reach us through our{" "}
                <Link href="/contact" className="font-semibold text-copper hover:underline">
                  Contact page
                </Link>
                . Opting out of SMS does not affect your email subscription or your ability to order.
              </p>
              <p className="mt-4">
                <strong className="text-charcoal">We do not sell your phone number.</strong> We never sell, rent, or
                trade phone numbers. We do not share phone numbers or SMS consent data with third parties for their
                own marketing. Numbers are shared only with the messaging providers who deliver our texts on our
                behalf, and only for that purpose.
              </p>
              <p className="mt-4">Mobile carriers are not liable for delayed or undelivered messages.</p>
            </PolicySection>

            <PolicySection num="4" title="Payments">
              <p>
                Payments are processed through secure, third-party payment providers. EVLV does not store full
                payment card details. We accept major credit and debit cards, and any other payment methods made
                available at checkout.
              </p>
            </PolicySection>

            <PolicySection num="5" title="Data Sharing & Disclosure">
              <p>Personal information may be shared only when necessary:</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  "With service providers who support website operations, payment processing, or logistics",
                  "When required by law, regulation, or legal process",
                  "To protect the rights, security, or integrity of EVLV",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                    <i className="ri-check-line mt-0.5 shrink-0 text-copper" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">All third parties are expected to handle data responsibly and securely.</p>
            </PolicySection>

            <PolicySection num="6" title="Data Security">
              <p>
                EVLV implements reasonable administrative, technical, and organizational measures to protect
                personal information against unauthorized access, misuse, or disclosure. While no system can
                guarantee absolute security, we take data protection seriously and act responsibly.
              </p>
            </PolicySection>

            <PolicySection num="7" title="Cookies & Analytics">
              <p>
                Our website may use cookies or similar technologies to support functionality, performance, and basic
                analytics. These tools help us understand website usage and improve user experience. You may manage
                cookie preferences through your browser settings.
              </p>
            </PolicySection>

            <PolicySection num="8" title="Data Retention">
              <p>
                Personal information is retained only for as long as necessary to fulfill operational, legal, or
                regulatory purposes. When no longer required, information is securely deleted or anonymized.
              </p>
            </PolicySection>

            <PolicySection num="9" title="Your Rights">
              <p>Depending on your location, you may have rights to:</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Access or request a copy of your personal information",
                  "Request correction of inaccurate information",
                  "Request deletion of certain personal data",
                  "Withdraw consent where applicable",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/70">
                    <i className="ri-check-line mt-0.5 shrink-0 text-copper" /> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Requests can be submitted through our{" "}
                <Link href="/contact" className="font-semibold text-copper hover:underline">
                  Contact page
                </Link>
                .
              </p>
            </PolicySection>

            <PolicySection num="10" title="Third-Party Links">
              <p>
                Our website may contain links to third-party websites. EVLV is not responsible for the privacy
                practices or content of external sites. We encourage users to review third-party privacy policies
                independently.
              </p>
            </PolicySection>

            <PolicySection num="11" title="Changes to This Policy">
              <p>
                EVLV may update this Privacy Policy periodically to reflect operational, legal, or regulatory
                changes. Updates will be posted on this page with a revised effective date.
              </p>
            </PolicySection>

            <PolicySection num="12" title="Contact Information">
              <p>
                For privacy-related questions or requests, please reach out through our{" "}
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
              <Link href="/terms" className="text-charcoal/60 transition hover:text-charcoal">
                Terms &amp; Conditions
              </Link>
              <Link href="/ruo" className="text-charcoal/60 transition hover:text-charcoal">
                Research Use Only Policy
              </Link>
              <Link href="/returns" className="text-charcoal/60 transition hover:text-charcoal">
                Returns Policy
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
