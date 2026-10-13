import { Metadata } from "next";
import { HeroesDiscountForm } from "./HeroesDiscountForm";

export const metadata: Metadata = {
  title: "Heroes Program — 15% Off for Life | Liberty Aminos",
  description: "Military, veterans, and first responders receive 15% off every order, for life. Apply once. Manually verified in about 24 hours.",
  alternates: { canonical: "/heroes-discount" },
};

const ELIGIBLE = [
  "Active Duty Military",
  "Reserve & National Guard",
  "Honorably Discharged Veterans",
  "Law Enforcement",
  "Fire & EMS / Paramedics",
];

const TRUST_TILES = [
  { icon: "ri-time-line", title: "~24 Hour Review", body: "We manually verify every application within about 24 hours." },
  { icon: "ri-infinity-line", title: "Yours Forever", body: "Your 15% discount never expires. One code, every order, for life." },
  { icon: "ri-delete-bin-line", title: "ID Deleted After Review", body: "Your uploaded credential is permanently deleted once verified." },
];

export default function HeroesDiscountPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white md:py-32">
        <div className="mx-auto max-w-[900px] px-4 text-center md:px-8">
          <span
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{ background: "var(--color-red)", color: "#fff" }}
          >
            <i className="ri-medal-line" /> Heroes Program
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            15% off, for life.
            <br />
            <span className="text-white/70 font-normal">For those who serve.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
            If you are active duty, a veteran, or a first responder, you receive a personal 15% discount
            on every order — applied at checkout, non-expiring.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {ELIGIBLE.map((e) => (
              <span key={e} className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-medium text-white/80">
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-off-white py-12">
        <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-6 px-4 md:grid-cols-3 md:px-8">
          {TRUST_TILES.map((tile) => (
            <div key={tile.title} className="rounded-lg bg-white p-6 border border-border-subtle">
              <i className={`${tile.icon} text-2xl text-navy mb-3 block`} />
              <p className="font-semibold text-ink mb-1">{tile.title}</p>
              <p className="text-sm text-muted leading-relaxed">{tile.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-4 md:px-8">
          <h2 className="mb-2 text-center text-2xl font-bold text-ink">Apply for your code</h2>
          <p className="mb-8 text-center text-sm text-muted">
            Verified within about 24 hours. Your personal code arrives by email.
            No auto-apply — you enter it at checkout.
          </p>
          <HeroesDiscountForm />
        </div>
      </section>
    </>
  );
}
