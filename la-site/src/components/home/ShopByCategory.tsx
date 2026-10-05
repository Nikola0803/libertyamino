"use client";

import Link from "next/link";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";

const CATEGORIES = [
  {
    num: "01",
    title: "Recovery Research",
    descriptor: "Tissue repair and regenerative pathway compounds.",
    compounds: "BPC-157 · TB-500",
    href: "/shop?category=peptides",
    art: "fragmented" as const,
  },
  {
    num: "02",
    title: "Metabolic Research",
    descriptor: "Weight and metabolic regulation research materials.",
    compounds: "GLP1-S · GLP2-T · GLP3-R",
    href: "/shop?category=peptides",
    art: "particles" as const,
  },
  {
    num: "03",
    title: "Performance Research",
    descriptor: "Cellular energy and performance-focused compounds.",
    compounds: "MOTS-C · GHK-Cu",
    href: "/shop?category=ancillaries",
    art: "expanding" as const,
  },
  {
    num: "04",
    title: "Longevity Research",
    descriptor: "Growth hormone and longevity pathway materials.",
    compounds: "CJC-1295 · Sermorelin · Tesamorelin",
    href: "/shop?category=peptides",
    art: "concentric" as const,
  },
];

/**
 * Everlife's "Shop by goal" section is a horizontal snap-scroll carousel
 * with prev/next arrows (goal-track / #goal-prev / #goal-next in the
 * source markup) rather than a static grid -- this ports that exact
 * interaction pattern onto EVLV's own research-area categories.
 */
export function ShopByCategory() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-goal-card]");
    const amount = (card?.offsetWidth ?? 300) + 24;
    track.scrollBy({ left: amount * dir, behavior: "smooth" });
  }

  return (
    <section className="bg-ivory-soft pb-8 pt-20 md:pb-12 md:pt-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">04 / Explore by Research Area</p>
            <h2 className="max-w-xl font-display text-3xl font-semibold text-charcoal md:text-4xl">
              Start with the <em className="text-sage-deep not-italic">research area</em>
              <br />
              you want
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-stone bg-white text-charcoal transition hover:border-sage-deep hover:text-sage-deep"
            >
              <i className="ri-arrow-left-s-line" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-stone bg-white text-charcoal transition hover:border-sage-deep hover:text-sage-deep"
            >
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-proximity gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-12"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              data-goal-card
              className="group block w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[24%]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
                <CategoryArt variant={cat.art} className="h-full w-full transition duration-700 ease-out group-hover:scale-[1.04]" />
                <span className="absolute left-4 top-4 font-display text-xs font-semibold tracking-[0.2em] text-copper">{cat.num}</span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-medium text-charcoal">{cat.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-soft-gray">{cat.descriptor}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.1em] text-charcoal/40">{cat.compounds}</p>
                </div>
                <i className="ri-arrow-right-line mt-1 shrink-0 text-charcoal/40 transition group-hover:translate-x-0.5 group-hover:text-sage-deep" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Each category gets its own visual expression of "transformation" instead
 * of a generic molecular-diagram icon, per the EVLV motif system: fragmented
 * lines reconnecting, particle systems, expanding structures, concentric
 * layers - obsidian/charcoal/copper only, no green (green is reserved for
 * brand sections, not decorative category art).
 */
export function CategoryArt({ variant, className = "" }: { variant: "fragmented" | "particles" | "expanding" | "concentric"; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-charcoal ${className}`}>
      {variant === "fragmented" && (
        <svg viewBox="0 0 160 200" className="h-[70%] w-auto" aria-hidden>
          <path d="M40 30 L60 60 M75 75 L95 100 M110 115 L120 170" stroke="#B8875A" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          <path d="M50 40 L45 20 M85 88 L105 78 M115 130 L135 125" stroke="#E7E3DA" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <circle cx="40" cy="30" r="3" fill="#E7E3DA" />
          <circle cx="75" cy="75" r="3.5" fill="#B8875A" />
          <circle cx="110" cy="115" r="4" fill="#E7E3DA" />
          <circle cx="120" cy="170" r="4.5" fill="#B8875A" />
        </svg>
      )}
      {variant === "particles" && (
        <svg viewBox="0 0 160 160" className="h-[70%] w-auto" aria-hidden>
          <circle cx="80" cy="80" r="58" fill="none" stroke="#314743" strokeWidth="1" opacity="0.6" />
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const r = 58;
            const x = 80 + Math.cos(angle) * r;
            const y = 80 + Math.sin(angle) * r;
            return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 3.5 : 2} fill={i % 5 === 0 ? "#B8875A" : "#E7E3DA"} opacity={i % 5 === 0 ? 0.95 : 0.45} />;
          })}
          <circle cx="80" cy="80" r="4" fill="#B8875A" />
        </svg>
      )}
      {variant === "expanding" && (
        <svg viewBox="0 0 160 160" className="h-[70%] w-auto" aria-hidden>
          <rect x="70" y="70" width="20" height="20" fill="none" stroke="#B8875A" strokeWidth="1.5" />
          <rect x="50" y="50" width="60" height="60" fill="none" stroke="#E7E3DA" strokeWidth="1" opacity="0.5" />
          <rect x="25" y="25" width="110" height="110" fill="none" stroke="#314743" strokeWidth="1" opacity="0.6" />
          <path d="M80 25 V10 M80 150 V135 M25 80 H10 M150 80 H135" stroke="#B8875A" strokeWidth="1" opacity="0.7" />
        </svg>
      )}
      {variant === "concentric" && (
        <svg viewBox="0 0 160 160" className="h-[70%] w-auto" aria-hidden>
          {[62, 46, 30, 14].map((r, i) => (
            <circle key={r} cx="80" cy="80" r={r} fill="none" stroke={i === 3 ? "#B8875A" : "#E7E3DA"} strokeWidth={i === 3 ? 1.5 : 1} opacity={i === 3 ? 0.9 : 0.3 + i * 0.08} />
          ))}
          <circle cx="80" cy="80" r="3" fill="#B8875A" />
        </svg>
      )}
    </div>
  );
}
