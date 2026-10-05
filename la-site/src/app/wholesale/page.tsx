import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WholesaleForm } from "./WholesaleForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Wholesale, White Label & Dropshipping | EVLV",
  description:
    "Build with EVLV through bulk wholesale, private-label product development, or direct-to-customer dropshipping and fulfillment.",
  alternates: { canonical: "/wholesale" },
};

const PROGRAMS = [
  {
    number: "01",
    icon: "ri-box-3-line",
    title: "Bulk Wholesale",
    eyebrow: "Stock it. Sell it.",
    body: "Purchase finished EVLV research products at volume pricing and fulfill from your own operation.",
    points: ["Volume-based pricing", "Batch documentation", "Flexible multi-SKU orders"],
  },
  {
    number: "02",
    icon: "ri-palette-line",
    title: "White Label",
    eyebrow: "Your brand. Built properly.",
    body: "Launch a distinct research brand with custom packaging and a storefront supported by our infrastructure.",
    points: ["Custom brand and packaging", "Storefront and CRM options", "Guided launch planning"],
    featured: true,
  },
  {
    number: "03",
    icon: "ri-truck-line",
    title: "Dropshipping",
    eyebrow: "Sell it. We ship it.",
    body: "Offer an approved catalog without holding inventory. We pick, pack, and ship eligible orders directly.",
    points: ["No inventory storage", "Direct U.S. fulfillment", "Tracking and support workflow"],
  },
];

const CAPABILITIES = [
  { icon: "ri-test-tube-line", title: "Verified catalog", body: "Research products supported by batch-level quality documentation." },
  { icon: "ri-layout-4-line", title: "Brand development", body: "A coherent identity, packaging system, and customer-ready presentation." },
  { icon: "ri-dashboard-3-line", title: "Commerce infrastructure", body: "Optional storefront, CRM, content, and order-management capabilities." },
  { icon: "ri-map-pin-2-line", title: "U.S. fulfillment", body: "Domestic pick, pack, dispatch, and tracked delivery workflows." },
];

const STEPS = [
  { number: "01", title: "Choose your model", body: "Tell us whether you need wholesale, white label, dropshipping, or a hybrid." },
  { number: "02", title: "Qualify the opportunity", body: "We review your catalog, audience, expected volume, and launch timeline." },
  { number: "03", title: "Receive a scoped offer", body: "You get a clear commercial proposal built around your actual operation." },
  { number: "04", title: "Build and launch", body: "We align products, branding, systems, and fulfillment before go-live." },
];

export default function WholesalePage() {
  return (
    <>
      <div className="border-b border-stone bg-white py-2.5 text-center text-xs text-charcoal/60">
        Already a partner?{" "}
        <Link href="/account?tab=wholesale" className="font-semibold text-sage-deep underline underline-offset-2 hover:text-charcoal">
          Sign in to your dashboard
        </Link>
      </div>

      <section className="px-3 pb-12 pt-5 md:px-6 md:pb-16 md:pt-7">
        <div className="relative mx-auto min-h-[650px] max-w-[1400px] overflow-hidden rounded-[26px] bg-[#062f31] text-white shadow-[0_24px_70px_rgba(7,42,43,0.18)] md:min-h-[690px]">
          <Image
            src="/images/wholesale/evlv-b2b-fulfillment.png"
            alt="EVLV research products and branded fulfillment operation"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover object-[64%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,36,38,.98)_0%,rgba(4,36,38,.92)_34%,rgba(4,36,38,.42)_61%,rgba(4,36,38,.08)_100%)] md:bg-[linear-gradient(90deg,rgba(4,36,38,.98)_0%,rgba(4,36,38,.92)_35%,rgba(4,36,38,.35)_62%,rgba(4,36,38,.04)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#062f31]/70 to-transparent md:hidden" />

          <div className="relative z-10 flex min-h-[650px] items-center px-6 py-14 sm:px-10 md:min-h-[690px] md:px-16 lg:px-20">
            <div className="max-w-[650px]">
              <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b9d9ce]">
                <span className="h-px w-8 bg-[#b9d9ce]/70" /> EVLV Partner Programs
              </p>
              <h1 className="font-display text-[42px] font-semibold leading-[1.02] tracking-[-0.025em] text-white sm:text-5xl md:text-6xl lg:text-[68px]">
                Wholesale, white label, and dropshipping - built around you.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                One reliable partner for quality-led research products, brand development, commerce infrastructure,
                and U.S. fulfillment.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#inquire" className="rounded-md bg-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#07383a] transition hover:bg-[#edf5f2]">
                  Get partner pricing <i className="ri-arrow-right-line" />
                </a>
                <a href="#programs" className="rounded-md border border-white/35 bg-white/5 px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition hover:bg-white/12">
                  Compare programs
                </a>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 border-t border-white/15 pt-7 text-xs text-white/75 sm:grid-cols-3">
                <span className="flex items-center gap-2"><i className="ri-shield-check-line text-[#b9d9ce]" /> Batch documentation</span>
                <span className="flex items-center gap-2"><i className="ri-map-pin-2-line text-[#b9d9ce]" /> U.S. fulfillment</span>
                <span className="flex items-center gap-2"><i className="ri-git-merge-line text-[#b9d9ce]" /> Flexible models</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="pb-20 pt-6 md:pb-28 md:pt-10">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal className="mx-auto mb-11 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-deep">Three ways to partner</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-charcoal md:text-5xl">Choose the operating model that fits.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/60 md:text-base">
              Start with a single model or combine them. Every proposal is scoped around your market, catalog, volume, and fulfillment needs.
            </p>
          </Reveal>

          <Reveal stagger className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {PROGRAMS.map((program) => (
              <article key={program.title} className={`relative overflow-hidden rounded-2xl border p-7 md:p-8 ${program.featured ? "border-sage-deep bg-[#eef5f2] shadow-[0_16px_45px_rgba(11,65,64,.10)]" : "border-stone bg-white"}`}>
                {program.featured && <span className="absolute right-5 top-5 rounded-full bg-sage-deep px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white">Most flexible</span>}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-deep text-xl text-white"><i className={program.icon} /></div>
                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-sage-deep">{program.number} · {program.eyebrow}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-charcoal">{program.title}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-charcoal/60">{program.body}</p>
                <ul className="mt-6 space-y-3 border-t border-charcoal/10 pt-5">
                  {program.points.map((point) => <li key={point} className="flex items-center gap-2.5 text-sm text-charcoal/75"><i className="ri-check-line text-sage-deep" />{point}</li>)}
                </ul>
                <a href="#inquire" className="mt-7 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-sage-deep">Discuss this model <i className="ri-arrow-right-line" /></a>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f2f6f4] py-20 md:py-28">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(10,52,53,.10)]">
            <Image src="/images/wholesale/evlv-white-label-dropship.png" alt="EVLV white label packaging and dropshipping operation" fill sizes="(max-width: 1024px) 100vw, 650px" className="object-cover" />
          </Reveal>
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-deep">More than product supply</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight text-charcoal md:text-5xl">The infrastructure behind your next stage of growth.</h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-charcoal/60 md:text-base">
              Whether you need cases delivered to your warehouse or individual orders shipped to your customers, we can assemble the operating model around your business.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {CAPABILITIES.map((item) => (
                <div key={item.title} className="border-t border-charcoal/10 pt-4">
                  <div className="flex items-center gap-2.5"><i className={`${item.icon} text-lg text-sage-deep`} /><h3 className="font-display text-base font-semibold text-charcoal">{item.title}</h3></div>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/55">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal className="mb-10 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sage-deep">A clear path to launch</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal md:text-5xl">From first conversation to fulfillment.</h2>
          </Reveal>
          <Reveal stagger className="grid grid-cols-1 border-y border-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.number} className={`py-7 sm:p-7 ${index > 0 ? "border-t border-charcoal/10 sm:border-t-0 sm:border-l" : ""} ${index === 2 ? "sm:border-l-0 lg:border-l" : ""}`}>
                <p className="text-[11px] font-bold tracking-[0.18em] text-sage-deep">{step.number}</p>
                <h3 className="mt-5 font-display text-xl font-semibold text-charcoal">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/55">{step.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="inquire" className="bg-[#07383a] py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 px-5 md:px-8 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b9d9ce]">Partner inquiry</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">Tell us what you want to build.</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/65 md:text-base">Our team reviews every inquiry and replies with the most suitable program, practical next steps, and a scoped commercial conversation.</p>
            <div className="mt-8 space-y-4 border-t border-white/15 pt-7 text-sm text-white/70">
              <p className="flex items-start gap-3"><i className="ri-check-line mt-0.5 text-[#b9d9ce]" /> No generic tier required before we understand your needs.</p>
              <p className="flex items-start gap-3"><i className="ri-check-line mt-0.5 text-[#b9d9ce]" /> Wholesale, white label, dropshipping, and hybrid models welcome.</p>
              <p className="flex items-start gap-3"><i className="ri-check-line mt-0.5 text-[#b9d9ce]" /> Clear research-use-only positioning and quality documentation.</p>
            </div>
          </Reveal>
          <Reveal><WholesaleForm /></Reveal>
        </div>
      </section>
    </>
  );
}
