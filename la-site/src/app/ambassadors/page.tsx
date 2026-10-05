import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AffiliateForm } from "./AffiliateForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "EVLV Partner Network | Apply for a Brand Partnership",
  description:
    "Apply to the selective EVLV Partner Network. Approved partners receive private performance-led rewards, brand support, merchandise, and opportunities that grow with their impact.",
  alternates: { canonical: "/ambassadors" },
};

const PARTNER_VALUE = [
  { icon: "ri-line-chart-line", title: "Performance-led rewards", body: "Commercial terms are private, considered individually, and built to grow alongside verified contribution and long-term results." },
  { icon: "ri-t-shirt-air-line", title: "Merchandise & product access", body: "Strong partners can unlock EVLV merchandise, product support, and access designed around the work we build together." },
  { icon: "ri-focus-3-line", title: "Campaign opportunities", body: "From featured launches to custom creative and deeper brand activations, the partnership expands when the fit is right." },
  { icon: "ri-team-line", title: "A direct relationship", body: "Approved partners work with real people at EVLV—not a faceless affiliate platform or a generic support queue." },
];

const GROWTH_PATH = [
  { step: "01", title: "Apply", body: "Share your primary channel and contact information. Every submission is reviewed by our team." },
  { step: "02", title: "Alignment", body: "We assess audience fit, content quality, brand alignment, compliance awareness, and commercial potential." },
  { step: "03", title: "Launch", body: "Approved partners receive their private terms, tracking access, creative direction, and a direct EVLV contact." },
  { step: "04", title: "Scale", body: "Consistent impact can unlock expanded rewards, merchandise, early access, campaigns, and custom opportunities." },
];

const FIT = [
  ["Trusted reach", "An audience that listens, engages, and takes action—regardless of whether it is niche or large."],
  ["Original perspective", "A distinct point of view and the ability to communicate research products with clarity and restraint."],
  ["Commercial discipline", "Reliable execution, clean attribution, and an interest in building measurable, repeatable growth."],
  ["Long-term alignment", "Partners who want to build equity with the brand, not publish a single post and disappear."],
] as const;

export default function AmbassadorsPage() {
  return (
    <main className="overflow-hidden bg-[#f7f7f3] text-[#102d28]">
      <div className="hidden border-b border-white/10 bg-[#082a27] py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65 sm:block">
        Existing EVLV partner?{" "}
        <Link href="/account?tab=affiliate" className="text-[#b9d9ce] underline decoration-white/30 underline-offset-4 transition hover:text-white">Open your partner portal</Link>
      </div>

      <section className="relative bg-[#082a27] text-white">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_18%_20%,rgba(111,179,155,.24),transparent_32%),radial-gradient(circle_at_88%_80%,rgba(111,179,155,.16),transparent_30%)]" />
        <div className="relative mx-auto grid min-h-[720px] max-w-[1440px] grid-cols-1 lg:grid-cols-[1.05fr_.95fr]">
          <div className="flex flex-col justify-center px-6 py-20 sm:px-10 md:px-16 lg:px-20 lg:py-24">
            <div className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#b9d9ce]"><span className="h-px w-10 bg-[#b9d9ce]/55" />EVLV Partner Network</div>
            <h1 className="max-w-3xl font-display text-[clamp(3.1rem,6vw,6.6rem)] font-semibold leading-[.92] tracking-[-.055em]">Built for partners who move markets.</h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/68 md:text-lg md:leading-8">EVLV is building a selective network of creators, operators, educators, communities, and strategic voices ready to grow with a premium research brand.</p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/48">This is not an open-enrollment affiliate link. Every applicant is reviewed. Every approved relationship is built around alignment, contribution, and potential.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#apply" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-white px-8 text-[11px] font-bold uppercase tracking-[.14em] text-[#102d28] transition hover:bg-[#dcece6]">Apply for consideration <i className="ri-arrow-right-line text-base" /></a>
              <a href="#network" className="inline-flex min-h-14 items-center justify-center rounded-lg border border-white/22 px-8 text-[11px] font-bold uppercase tracking-[.14em] text-white transition hover:border-white/45 hover:bg-white/7">Explore the network</a>
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden lg:min-h-full">
            <Image src="/images/ambassadors/hero-creator.webp" alt="EVLV brand partner producing original content" fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" style={{ objectPosition: "30% center" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#082a27] via-transparent to-[#082a27]/15 lg:bg-gradient-to-r lg:from-[#082a27] lg:via-transparent lg:to-transparent" />
            <div className="absolute inset-x-6 bottom-8 grid grid-cols-3 gap-2 sm:inset-x-10 lg:inset-x-12 lg:bottom-12">
              {["Application only", "Private terms", "Built to scale"].map((item) => <div key={item} className="rounded-lg border border-white/16 bg-[#082a27]/72 px-3 py-4 text-center text-[9px] font-bold uppercase tracking-[.12em] text-white/80 backdrop-blur-md sm:text-[10px]">{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="network" className="border-b border-[#dce5e1] bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <Reveal className="grid items-end gap-10 lg:grid-cols-[1fr_.72fr]">
            <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#4c766b]">A different kind of network</p><h2 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-.04em] md:text-6xl">More than a link.<br />More than a percentage.</h2></div>
            <p className="max-w-xl text-sm leading-7 text-[#52645f] md:text-base">We do not publish a one-size-fits-all commission rate because we are not building one-size-fits-all partnerships. Terms are discussed privately after review and can evolve with the value a partner creates.</p>
          </Reveal>
          <Reveal stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[#dce5e1] bg-[#dce5e1] md:grid-cols-2">
            {PARTNER_VALUE.map((item) => <article key={item.title} className="group bg-[#f7f7f3] p-7 transition hover:bg-white md:p-10"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dcece6] text-[#16483f] transition group-hover:bg-[#16483f] group-hover:text-white"><i className={`${item.icon} text-xl`} aria-hidden /></div><h3 className="mt-8 font-display text-2xl font-semibold tracking-[-.025em]">{item.title}</h3><p className="mt-3 max-w-md text-sm leading-7 text-[#60706b]">{item.body}</p></article>)}
          </Reveal>
        </div>
      </section>

      <section className="bg-[#102d28] py-20 text-white md:py-28">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <Reveal className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b9d9ce]">The partnership path</p><h2 className="mt-5 max-w-md font-display text-4xl font-semibold leading-[1.04] tracking-[-.04em] md:text-5xl">Earn the relationship. Then expand it.</h2><p className="mt-6 max-w-md text-sm leading-7 text-white/55">Reach matters. Trust, execution, and measurable contribution matter more. The strongest EVLV partnerships are designed to compound over time.</p></div>
            <div className="border-t border-white/14">{GROWTH_PATH.map((item) => <article key={item.step} className="grid grid-cols-[54px_1fr] gap-3 border-b border-white/14 py-8 sm:grid-cols-[72px_180px_1fr] sm:gap-5 md:py-10"><span className="font-display text-sm text-[#b9d9ce]">{item.step}</span><h3 className="font-display text-2xl font-semibold sm:text-xl">{item.title}</h3><p className="col-start-2 text-sm leading-7 text-white/55 sm:col-start-3">{item.body}</p></article>)}</div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#eaf0ed] py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <Reveal className="text-center"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#4c766b]">Who we partner with</p><h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.04] tracking-[-.04em] md:text-6xl">Influence is more than follower count.</h2><p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#52645f] md:text-base">We welcome serious applicants with a credible audience, a clear voice, and the ambition to build something durable with EVLV.</p></Reveal>
          <Reveal stagger className="mt-14 grid gap-4 md:grid-cols-2">{FIT.map(([title, body], index) => <article key={title} className="rounded-2xl border border-[#cedbd6] bg-white p-7 md:p-9"><span className="text-[10px] font-bold tracking-[.16em] text-[#64897f]">0{index + 1}</span><h3 className="mt-6 font-display text-2xl font-semibold tracking-[-.025em]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#60706b]">{body}</p></article>)}</Reveal>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <Reveal className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative min-h-[480px] overflow-hidden rounded-2xl bg-[#102d28]"><Image src="/images/certified/evlv-science-wide.png" alt="EVLV premium research presentation" fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-[#082a27] via-[#082a27]/15 to-transparent" /><div className="absolute inset-x-8 bottom-8 md:inset-x-10 md:bottom-10"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b9d9ce]">What growth can unlock</p><p className="mt-3 max-w-lg font-display text-3xl font-semibold leading-tight text-white md:text-4xl">Commission. Merchandise. Access. Campaigns. More.</p></div></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#4c766b]">Built around contribution</p><h2 className="mt-5 font-display text-4xl font-semibold leading-[1.04] tracking-[-.04em] md:text-5xl">The more value you create, the more the partnership can become.</h2><p className="mt-6 text-sm leading-7 text-[#52645f] md:text-base">Every approved partner receives a clear commercial foundation. From there, benefits can expand based on consistency, attributed growth, creative quality, audience response, and the opportunities we pursue together.</p><div className="mt-8 flex flex-wrap gap-2">{["Private commercial terms", "EVLV merchandise", "Creative support", "Early access", "Featured campaigns", "Custom opportunities"].map((item) => <span key={item} className="rounded-full border border-[#cedbd6] bg-[#f7f7f3] px-4 py-2 text-[10px] font-bold uppercase tracking-[.09em] text-[#355f55]">{item}</span>)}</div></div>
        </Reveal>
      </section>

      <section id="apply" className="bg-[#0b2f2c] py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-[1200px] items-start gap-12 px-5 md:px-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <Reveal><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b9d9ce]">Application only</p><h2 className="mt-5 font-display text-4xl font-semibold leading-[1.03] tracking-[-.04em] md:text-6xl">Bring us the opportunity.</h2><p className="mt-6 max-w-md text-sm leading-7 text-white/60 md:text-base">Tell us who you are and where you create impact. Our partnerships team reviews every application individually and contacts selected applicants directly.</p><div className="mt-10 space-y-4 border-t border-white/12 pt-8">{["No automatic acceptance", "No public rate card", "No follower-count shortcut", "Private terms for approved partners"].map((item) => <p key={item} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.1em] text-white/72"><i className="ri-check-line text-lg text-[#b9d9ce]" /> {item}</p>)}</div></Reveal>
          <Reveal><AffiliateForm /></Reveal>
        </div>
      </section>

      <section className="bg-[#dcece6] px-5 py-20 text-center md:py-24">
        <Reveal><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#4c766b]">EVLV Partner Network</p><h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.03] tracking-[-.04em] md:text-6xl">We are building the category—not chasing it.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#52645f] md:text-base">If you have the audience, discipline, and ambition to build with us, we want to hear from you.</p><a href="#apply" className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[#102d28] px-9 text-[11px] font-bold uppercase tracking-[.14em] text-white transition hover:bg-[#19483f]">Apply for consideration <i className="ri-arrow-up-line" /></a></Reveal>
      </section>
    </main>
  );
}
