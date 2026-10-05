import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const STANDARDS = [
  {
    num: "01",
    title: "Sourcing",
    body: "Pharmaceutical-grade raw materials from vetted synthesis partners under NDA and audit.",
  },
  {
    num: "02",
    title: "Synthesis",
    body: "Solid-phase peptide synthesis in ISO-controlled facilities with sequence verification.",
  },
  {
    num: "03",
    title: "Third-Party Testing",
    body: "Every lot HPLC and mass-spec verified by independent laboratories. No exceptions.",
  },
  {
    num: "04",
    title: "COA Publication",
    body: "Certificates of Analysis published publicly and searchable by batch code the moment they clear.",
  },
  {
    num: "05",
    title: "Ambient Fulfillment",
    body: "Lyophilized and shelf-stable in transit. No cold-chain packaging, dispatched next-day.",
  },
];

export function AboutSection() {
  return (
    <section className="bg-ivory-soft pb-20 pt-8 md:pb-32 md:pt-12">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-4 md:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-charcoal">
          <video autoPlay loop muted playsInline poster="/images/precision-section.png" className="h-full w-full object-cover">
            <source src="/videos/precision-section.mp4" type="video/mp4" />
          </video>
        </Reveal>

        <Reveal>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">05 / The EVLV Standard</p>
          <h2 className="font-display text-4xl font-semibold uppercase leading-[1.05] text-charcoal md:text-5xl">
            The highest standard in peptides.
            <br />
            Verified at every stage.
          </h2>

          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/40">Full Quality Standards</p>
          <div className="mt-3 divide-y divide-stone border-t border-stone">
            {STANDARDS.map((item) => (
              <div key={item.num} className="flex gap-6 py-5">
                <span className="font-display text-sm text-copper">{item.num}</span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-charcoal">{item.title}</p>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-soft-gray">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <ButtonLink href="/coas" className="mt-10">
            Explore Our Standards <i className="ri-arrow-right-line" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
