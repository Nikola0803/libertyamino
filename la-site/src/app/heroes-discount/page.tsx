import { Metadata } from "next";
import { HeroesDiscountForm } from "./HeroesDiscountForm";

export const metadata: Metadata = {
  title: "Heroes Discount | EVLV",
  description: "Active duty, veterans, reservists, National Guard, and first responders get a 20% discount on EVLV research peptides.",
  alternates: { canonical: "/heroes-discount" },
};

const ELIGIBLE = ["Active Duty", "Veterans", "Reservists & National Guard", "Police, Fire & EMS"];

export default function HeroesDiscountPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal py-20 text-white md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(184,135,90,0.16) 0%, rgba(184,135,90,0) 70%)" }}
        />
        <div className="relative mx-auto max-w-[900px] px-4 text-center md:px-8">
          <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-copper/15 text-copper">
            <i className="ri-medal-line text-2xl" />
          </span>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Thank You For Your Service</p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Heroes get 20% off, always.</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
            Active duty, veterans, reservists, National Guard, and first responders get a flat 20% off every order.
            One code per person, applied at checkout - not combinable with other discounts or promotions.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {ELIGIBLE.map((e) => (
              <span key={e} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory-soft py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-4 md:px-8">
          <h2 className="mb-2 text-center font-display text-2xl font-semibold text-charcoal">Request your code.</h2>
          <p className="mb-8 text-center text-sm text-charcoal/60">
            Verified within a couple of business days. Your code arrives by email.
          </p>
          <HeroesDiscountForm />
        </div>
      </section>
    </>
  );
}
