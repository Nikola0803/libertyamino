import { Metadata } from "next";
import { HeroesDiscountForm } from "./HeroesDiscountForm";

export const metadata: Metadata = {
  title: "Heroes Discount | Liberty Aminos",
  description: "Active duty military, veterans, law enforcement, EMS/paramedics, and fire service get 15% off every order at Liberty Aminos. Verified once — discounted forever.",
  alternates: { canonical: "/heroes-discount" },
};

const ELIGIBLE = [
  "Active Military",
  "Veteran",
  "First Responder",
  "Law Enforcement",
  "EMS / Paramedic",
  "Fire Service",
];

const TRUST_TILES = [
  { icon: "ri-time-line", title: "Manual review in ~24h", body: "Every application is reviewed by hand — no automated gates." },
  { icon: "ri-infinity-line", title: "Yours forever — never expires", body: "Approved once, discounted for life on every future order." },
  { icon: "ri-shield-keyhole-line", title: "ID deleted after review", body: "Credential files are deleted immediately after verification is complete." },
];

export default function HeroesDiscountPage() {
  return (
    <>
      <section
        className="relative overflow-hidden bg-navy py-20 text-white md:py-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(196,33,39,0.2) 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-[900px] px-4 text-center md:px-8">
          <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
            <i className="ri-medal-line text-2xl" />
          </span>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Thank You For Your Service
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            15% off, for life. For those who serve.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65">
            Active duty military, veterans, law enforcement, EMS/paramedics, and fire service.
            Verified once — discounted forever.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {ELIGIBLE.map((e) => (
              <span
                key={e}
                className="rounded-full px-4 py-2 text-xs font-semibold text-white"
                style={{ background: "var(--color-red)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-off-white py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TRUST_TILES.map((tile) => (
              <div
                key={tile.title}
                className="rounded-lg border border-border-subtle bg-white p-5 text-center"
              >
                <i className={`${tile.icon} mb-3 block text-2xl text-navy`} />
                <p className="mb-1 text-sm font-semibold text-ink">{tile.title}</p>
                <p className="text-xs leading-relaxed text-muted">{tile.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-off-white py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-4 md:px-8">
          <h2 className="mb-2 text-center font-display text-2xl font-semibold text-ink">
            Apply for your discount.
          </h2>
          <p className="mb-8 text-center text-sm text-muted">
            Reviewed manually within ~24 hours. Your discount code arrives by email once approved.
          </p>
          <HeroesDiscountForm />
        </div>
      </section>
    </>
  );
}
