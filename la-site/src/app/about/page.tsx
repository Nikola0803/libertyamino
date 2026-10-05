import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { FinalCta } from "@/components/home/FinalCta";
import { QuizTrigger } from "./QuizTrigger";

export const metadata: Metadata = {
  title: "About EVLV",
  description: "EVLV is built around clarity and consistency in research, documentation over claims, every time.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  { title: "Documentation over claims", body: "Anyone can say “high purity.” We'd rather show you the paperwork." },
  { title: "Specifics over adjectives", body: "Purity, identity and sourcing, stated plainly and backed by third-party testing." },
  { title: "Easy over overwhelming", body: "A catalogue you can actually navigate, whether you're an expert or brand new to this." },
  { title: "Ambient over fragile", body: "Lyophilized and shelf-stable in transit, no cold-chain packaging required, dispatched next-day." },
  { title: "Real answers, not scripts", body: "Support from people who know the catalogue, not a canned-reply queue." },
  { title: "Batch-level, not blanket", body: "Every claim is tied to a specific lot number, not a general promise about the product line." },
];

const STANDARDS = [
  { num: "01", title: "Sourcing", body: "Pharmaceutical-grade raw materials from vetted synthesis partners, under NDA and audit." },
  { num: "02", title: "Synthesis", body: "Solid-phase peptide synthesis in ISO-controlled facilities, with sequence verification." },
  { num: "03", title: "Third-Party Testing", body: "Every lot HPLC and mass-spec verified by independent laboratories. No exceptions." },
  { num: "04", title: "COA Publication", body: "Certificates of Analysis published publicly, searchable by batch code, the moment they clear." },
  { num: "05", title: "Ambient Fulfillment", body: "Shelf-stable in transit, no cold-chain packaging, dispatched next-day." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-ivory-soft py-16 md:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:px-8">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image src="/images/certified/evlv-quality-page.png" alt="EVLV quality-control laboratory and research product" width={1600} height={900} className="h-full w-full object-cover" priority />
          </div>
          <div>
            <span className="mb-4 inline-block rounded-full border border-stone bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal/60">
              About EVLV
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-charcoal md:text-5xl">
              Research peptides, without the guesswork.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-soft-gray md:text-lg">
              The research peptide market has grown faster than its standards. Most vendors sell on hype: big
              promises, vague &ldquo;quality,&rdquo; and very little you can actually verify. We built EVLV to be
              the opposite.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 md:grid-cols-[1fr_1.4fr] md:px-8">
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
            Why
            <br />
            EVLV
            <br />
            exists
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            There are plenty of places to buy research peptides. Very few make it easy to trust what you&apos;re buying,
            or to find the right one. EVLV exists to fix both. We lead with documentation instead of adjectives, and
            we treat the person on the other end like they&apos;re smart enough to want the details. EVLV was built to
            bridge that gap.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <h2 className="mb-10 font-display text-3xl font-semibold text-charcoal md:text-4xl">What we stand for.</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-lg border border-stone bg-ivory-soft p-6">
                <h3 className="font-display text-base font-semibold text-charcoal">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Our Quality Standard</p>
          <h2 className="mb-2 font-display text-3xl font-semibold md:text-4xl">We only list what we can stand behind.</h2>
          <p className="mb-10 text-sm text-white/50">Here&apos;s how every EVLV product is made and verified.</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARDS.map((s) => (
              <div key={s.num} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-copper">{s.num}</p>
                <h3 className="mt-2 font-display text-base font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{s.body}</p>
              </div>
            ))}
          </div>

          <ButtonLink href="/coas" className="mt-10">
            View Our COAs <i className="ri-arrow-right-line" />
          </ButtonLink>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-display text-3xl font-semibold text-charcoal md:text-4xl">What EVLV is not.</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-soft-gray">
              EVLV is a research-use-only supplier. Our products are sold strictly for laboratory and research
              purposes, not for human consumption, not for medical use, and not as treatment for any condition. We
              don&apos;t make therapeutic claims, and we never will.
            </p>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-ivory-soft">
            <video autoPlay loop muted playsInline poster="/images/precision-section.png" className="h-full w-full object-cover">
              <source src="/videos/product-hover.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 md:grid-cols-[1.3fr_1fr] md:px-8">
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Built to actually shop.</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60">
              Browse by compound class from the Shop menu if you know the pharmacological category, or A to
              Z if you know the exact compound. Not sure where to start?{" "}
              <QuizTrigger>Use the compound finder</QuizTrigger> to narrow the catalog by research area.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <i className="ri-customer-service-2-line text-copper" /> Real people, real support
            </p>
            <p className="text-sm leading-relaxed text-white/50">
              Have a question?{" "}
              <Link href="/contact" className="font-semibold text-copper hover:underline">
                Reach out
              </Link>{" "}
              and our team typically responds within minutes during business hours. A real person, not a script.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-sage-forest py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-[800px] px-4 md:px-8">
          <p className="font-display text-2xl font-semibold leading-snug md:text-3xl">
            No black-box sourcing. No miracle claims. Just research-grade peptides, documented and easy to find.
          </p>
          <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-white/40">
            All products sold on this site are strictly for research use, not for human or veterinary consumption.
            Must be 21 or older to purchase. Ships within the US and Canada.
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
