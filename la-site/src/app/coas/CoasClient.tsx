"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import type { CoaEntry } from "@/lib/coa-data";
import { getProductImage } from "@/lib/product-images";

type Filter = "all" | "glp" | "blend" | "peptides" | "ancillaries";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All reports" },
  { value: "glp", label: "GLP series" },
  { value: "blend", label: "Blends" },
  { value: "peptides", label: "Peptides" },
  { value: "ancillaries", label: "Ancillaries" },
];

export function CoasClient({ coaEntries }: { coaEntries: CoaEntry[] }) {
  const products = useMemo(() => getProducts(), []);
  const productBySlug = useMemo(() => new Map(products.map((product) => [product.slug, product])), [products]);
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("search") ?? "");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = coaEntries.filter((coa) => {
    const product = productBySlug.get(coa.slug);
    const term = query.trim().toLowerCase();
    const searchText = [coa.productName, coa.compound, coa.label, coa.purity, coa.lab, product?.casNumber]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesQuery = !term || searchText.includes(term);
    const matchesFilter =
      filter === "all" ||
      (filter === "glp" && coa.slug.startsWith("evlv-")) ||
      (filter === "blend" && product?.format === "blend") ||
      product?.category === filter;
    return matchesQuery && matchesFilter;
  });

  const lotCount = coaEntries.length;
  const productCount = new Set(coaEntries.map((coa) => coa.slug)).size;
  const labCount = new Set(coaEntries.map((coa) => coa.lab).filter(Boolean)).size;

  return (
    <main className="bg-white">
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="rounded-2xl border border-stone bg-[#f4f7f5] p-4 md:p-6">
            <div className="relative">
              <i className="ri-search-line absolute left-5 top-1/2 -translate-y-1/2 text-lg text-charcoal/40" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search product, compound, batch code, purity, or lab..."
                className="h-15 w-full rounded-xl border border-stone bg-white pl-13 pr-5 text-base text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-sage-deep focus:shadow-[0_0_0_3px_rgba(50,118,87,.08)]"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full border px-4 py-2 text-[11px] font-semibold transition ${filter === item.value ? "border-sage-deep bg-sage-deep text-white" : "border-stone bg-white text-charcoal/65 hover:border-sage-deep hover:text-sage-deep"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 mt-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-sage-deep">Document library</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-charcoal">Published lot reports</h2>
            </div>
            <p className="text-xs text-charcoal/45">{filtered.length} {filtered.length === 1 ? "report" : "reports"}</p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-stone bg-[#f4f7f5] py-16 text-center">
              <i className="ri-file-search-line text-3xl text-charcoal/25" />
              <p className="mt-3 text-sm text-charcoal/50">No documentation matches &ldquo;{query}&rdquo;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filtered.map((coa) => {
                const product = productBySlug.get(coa.slug);
                const image = product ? getProductImage(product) : "/images/products/vial-placeholder.png";
                return (
                  <a
                    key={coa.url}
                    href={`${coa.url}#page=2`}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid min-h-48 grid-cols-[118px_1fr] overflow-hidden rounded-2xl border border-stone bg-white text-left transition hover:-translate-y-0.5 hover:border-sage-deep hover:shadow-[0_18px_44px_rgba(11,47,44,.10)] sm:grid-cols-[150px_1fr]"
                  >
                    <div className="relative flex items-center justify-center bg-[#f3f7f4] p-3 sm:p-5">
                      <Image src={image} alt={`${coa.productName ?? product?.name ?? "EVLV"} vial`} width={240} height={300} className="h-36 w-full object-contain transition duration-300 group-hover:scale-[1.04]" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-sage-deep shadow-sm">Report on file</span>
                    </div>
                    <div className="flex min-w-0 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-copper">{coa.compound}</p>
                          <h3 className="mt-1 text-sm font-semibold leading-snug text-charcoal sm:text-base">{coa.productName ?? product?.name}</h3>
                        </div>
                        <i className="ri-arrow-right-up-line shrink-0 text-lg text-sage-deep transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-stone pt-4 text-[11px]">
                        <div><dt className="text-charcoal/40">Lot / report</dt><dd className="mt-0.5 font-mono font-semibold text-charcoal/75">{coa.label}</dd></div>
                        <div><dt className="text-charcoal/40">Purity</dt><dd className="mt-0.5 font-semibold text-sage-deep">{coa.purity}</dd></div>
                        <div><dt className="text-charcoal/40">Laboratory</dt><dd className="mt-0.5 font-medium text-charcoal/70">{coa.lab}</dd></div>
                        <div><dt className="text-charcoal/40">Analyzed</dt><dd className="mt-0.5 font-medium text-charcoal/70">{coa.tested}</dd></div>
                      </dl>
                      <span className="mt-auto pt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-sage-deep">Open lab report</span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
