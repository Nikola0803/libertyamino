import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | EVLV",
  description: "The terms that govern use of the EVLV website and purchase of EVLV products.",
};

export default function TermsPage() {
  return (
    <>
      <section className="cp-info-hero cp-info-quality -mt-[90px] bg-charcoal pb-16 pt-[150px] text-center text-white md:-mt-[100px] md:pb-24 md:pt-[170px]">
        <div className="mx-auto max-w-[800px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Legal</p>
          <h1 className="font-display text-3xl font-semibold uppercase leading-tight md:text-5xl">Terms &amp; Conditions</h1>
          <p className="mt-4 text-sm text-white/50">Effective Date: August 2026</p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-4 md:px-8">
          <p className="mb-12 text-base leading-relaxed text-soft-gray">
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the EVLV website and
            related services. By accessing or using this website, you agree to be bound by these Terms. If you do
            not agree, please do not use the website.
          </p>

          <div className="space-y-12">
            <PolicySection num="1" title="About EVLV">
              <p>
                EVLV (&ldquo;EVLV,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates as a
                precision research peptide brand. Products and information provided are intended strictly for
                research use only, within clearly defined scientific and regulatory boundaries.
              </p>
            </PolicySection>

            <PolicySection num="2" title="Eligibility & Use of Website">
              <p>
                By using this website, you confirm that you are legally permitted to access and use this site in
                your jurisdiction, you are acting in a professional or research-related capacity, and you will not
                use the website or its content for unlawful or unauthorized purposes. EVLV reserves the right to
                restrict access at its discretion.
              </p>
            </PolicySection>

            <PolicySection num="3" title="Research Use Only">
              <p>
                All products offered by EVLV are intended for research use only. EVLV does not provide medical,
                therapeutic, or diagnostic products, offer usage protocols, dosing guidance, or application
                instructions, or make or imply health, performance, or therapeutic claims. You agree not to use EVLV
                products outside of their intended research scope. See our full{" "}
                <Link href="/ruo" className="font-semibold text-copper hover:underline">
                  Research Use Only Policy
                </Link>
                .
              </p>
            </PolicySection>

            <PolicySection num="4" title="Product Information & Documentation">
              <p>
                Product descriptions, specifications, and documentation are provided for informational and research
                reference purposes only. While EVLV maintains disciplined standards for accuracy and consistency,
                all information is subject to change without notice. Certificates of Analysis and related
                documentation are provided to support transparency and independent evaluation.
              </p>
            </PolicySection>

            <PolicySection num="5" title="Orders & Availability">
              <p>
                All orders are subject to acceptance and availability. EVLV reserves the right to refuse or cancel
                orders, limit quantities, or discontinue products without prior notice. Order confirmation does not
                constitute final acceptance until processing is completed.
              </p>
            </PolicySection>

            <PolicySection num="6" title="Pricing & Payments">
              <p>
                Prices are listed in the applicable currency (USD or CAD) and may change without notice. EVLV
                accepts major credit and debit cards, and any other payment methods made available at checkout.
                Payments are processed through secure third-party providers. EVLV does not store full payment card
                details.
              </p>
            </PolicySection>

            <PolicySection num="7" title="Shipping & Delivery">
              <p>
                Shipping timelines are estimates and may vary based on location, logistics providers, and regulatory
                considerations. EVLV is not responsible for delays outside its reasonable control. Risk of loss
                transfers upon dispatch unless otherwise required by law.
              </p>
            </PolicySection>

            <PolicySection num="8" title="Returns & Refunds">
              <p>
                Due to the nature of research products, returns or refunds may be limited or unavailable once an
                order has been processed or shipped. See our{" "}
                <Link href="/returns" className="font-semibold text-copper hover:underline">
                  Returns Policy
                </Link>{" "}
                for details.
              </p>
            </PolicySection>

            <PolicySection num="9" title="Intellectual Property">
              <p>
                All website content, including text, design, logos, graphics, and documentation, is the intellectual
                property of EVLV or its licensors. Content may not be copied, reproduced, distributed, or modified
                without prior written permission.
              </p>
            </PolicySection>

            <PolicySection num="10" title="Limitation of Liability">
              <p>
                To the fullest extent permitted by law, EVLV shall not be liable for any direct, indirect,
                incidental, or consequential damages arising from use or inability to use the website, use or misuse
                of products outside their intended research scope, or reliance on information provided on the
                website. All use is at your own risk.
              </p>
            </PolicySection>

            <PolicySection num="11" title="Indemnification">
              <p>
                You agree to indemnify and hold harmless EVLV from any claims, damages, or losses arising from your
                misuse of the website, violation of these Terms, or use of products outside their intended purpose.
              </p>
            </PolicySection>

            <PolicySection num="12" title="Third-Party Links">
              <p>
                The website may include links to third-party sites. EVLV is not responsible for the content,
                accuracy, or practices of external websites.
              </p>
            </PolicySection>

            <PolicySection num="13" title="Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with the laws applicable in the
                jurisdiction where EVLV operates, without regard to conflict of law principles.
              </p>
            </PolicySection>

            <PolicySection num="14" title="Changes to These Terms">
              <p>
                EVLV may update these Terms from time to time. Changes will be posted on this page with an updated
                effective date. Continued use of the website constitutes acceptance of the revised Terms.
              </p>
            </PolicySection>

            <PolicySection num="15" title="SMS and Text Message Program">
              <p>
                If you opt in to our SMS program you agree to receive recurring marketing text messages from EVLV at
                the number you provide, including messages sent by autodialer. Consent is not a condition of
                purchase. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe at
                any time, or HELP for help. Mobile carriers are not liable for delayed or undelivered messages. How
                we collect, record and retain SMS consent, and how we handle phone numbers, is described in our{" "}
                <Link href="/privacy" className="font-semibold text-copper hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </PolicySection>

            <PolicySection num="16" title="Contact Information">
              <p>
                EVLV. Questions about these Terms can be sent through our{" "}
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
              <Link href="/privacy" className="text-charcoal/60 transition hover:text-charcoal">
                Privacy Policy
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
