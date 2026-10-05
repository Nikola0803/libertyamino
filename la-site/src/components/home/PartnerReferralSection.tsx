import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Two-panel partner CTA. Both panels point at the SAME real backend --
 * the ambassador/affiliate program (percentage commission, 8-20%, see
 * /ambassadors and account/AffiliatePanel.tsx) -- framed for two
 * audiences (apply vs. already-approved) rather than two separate
 * programs. No flat-dollar "refer a friend" credit program exists in
 * the codebase, so this deliberately doesn't invent one.
 *
 * Backgrounds are the two real photos (ambassador-bg.webp / referral-bg.webp)
 * the original scraped mockup's CSS already referenced for this exact
 * card pair (.ref-card.amb / .ref-card.ref) but never actually resolved --
 * the savepage-url comment pointed at the source CMS, and the url()
 * itself was left empty. Using the real local copies here + the same
 * gradient-tint colors the mockup specified (dark green over the
 * ambassador photo, copper over the referral photo) finishes what was
 * already the intended design instead of substituting flat color blocks.
 */
const APPLY_POINTS = [
  "Commission that grows with volume -- 8% to 20%, paid monthly",
  "A personal discount code for your own research orders",
  "Early access to new EVLV research releases",
];

const AMBASSADOR_POINTS = [
  "Your own referral link and code",
  "Monthly payouts on confirmed orders",
  "No cap on how many researchers you refer",
];

export function PartnerReferralSection() {
  return (
    <section className="bg-ivory-soft py-20 md:py-28">
      <div className="mx-auto max-w-[1300px] px-4 md:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Research Partners</p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-charcoal md:text-4xl">
            Labs, researchers, and creators partner with EVLV.
          </h2>
        </Reveal>

        <Reveal stagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-lg p-8 text-white md:p-10">
            <Image
              src="/images/home/ambassador-bg.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="absolute inset-0 -z-20 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0f2a20]/90 via-[#0f2a20]/85 to-[#0e1113]/95" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-copper/20 text-copper">
              <i className="ri-flask-line text-xl" />
            </div>
            <p className="relative mb-1.5 mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Apply</p>
            <h3 className="relative font-display text-2xl font-semibold">Become an EVLV Ambassador</h3>
            <p className="relative mt-3 text-sm leading-relaxed text-white/70">
              Labs, researchers, and science content creators  -  get commission-based partnership, real batch
              data to share, and direct support from our team.
            </p>
            <ul className="relative mt-6 flex flex-1 flex-col gap-2.5">
              {APPLY_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-white/85">
                  <i className="ri-check-line mt-0.5 shrink-0 text-copper" /> {p}
                </li>
              ))}
            </ul>
            <Link
              href="/ambassadors#apply"
              className="relative mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-copper px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-copper-light"
            >
              Apply for Partnership <i className="ri-arrow-right-line" />
            </Link>
          </div>

          <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-lg p-8 text-white md:p-10">
            <Image
              src="/images/home/referral-bg.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="absolute inset-0 -z-20 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#ac6843]/90 via-[#8c5034]/88 to-[#5c341f]/95" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
              <i className="ri-user-star-line text-xl" />
            </div>
            <p className="relative mb-1.5 mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
              Already Approved
            </p>
            <h3 className="relative font-display text-2xl font-semibold">Refer a Researcher</h3>
            <p className="relative mt-3 text-sm leading-relaxed text-white/85">
              Share your ambassador link. When someone you refer places an order, it&apos;s tracked automatically and
              your commission accrues on the confirmed sale.
            </p>
            <ul className="relative mt-6 flex flex-1 flex-col gap-2.5">
              {AMBASSADOR_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-white/90">
                  <i className="ri-check-line mt-0.5 shrink-0 text-white" /> {p}
                </li>
              ))}
            </ul>
            <Link
              href="/account?tab=affiliate"
              className="relative mt-8 inline-flex w-fit items-center gap-2 rounded-md border border-white/40 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white/15"
            >
              Get Your Link <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
