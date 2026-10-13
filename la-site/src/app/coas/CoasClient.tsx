"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import type { CoaEntry } from "@/lib/coa-data";
import { getProductImage } from "@/lib/product-images";

type Filter = "all" | "glp1" | "glp2" | "glp3" | "reconstitution";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All reports" },
  { value: "glp1", label: "GLP1-Class" },
  { value: "glp2", label: "GLP2-Class" },
  { value: "glp3", label: "GLP3-Class" },
  { value: "reconstitution", label: "Reconstitution" },
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
      (filter === "glp1" && (coa.slug.includes("glp1") || coa.productName?.toLowerCase().includes("glp1"))) ||
      (filter === "glp2" && (coa.slug.includes("glp2") || coa.productName?.toLowerCase().includes("glp2"))) ||
      (filter === "glp3" && (coa.slug.includes("glp3") || coa.productName?.toLowerCase().includes("glp3"))) ||
      (filter === "reconstitution" && (product?.format === "supplies" || product?.category === "ancillaries"));
    return matchesQuery && matchesFilter;
  });

  const lotCount = coaEntries.length;

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
                  className={`rounded-full border px-4 py-2 text-[11px] font-semibold transition ${filter === item.value ? "border-[var(--navy)] bg-[var(--navy)] text-white" : "border-[var(--border-subtle)] bg-white text-[var(--muted)] hover:border-[var(--navy)] hover:text-[var(--navy)]"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 mt-10 flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--navy)]">COA Library</p>
                <h1 className="mt-2 font-display text-3xl font-semibold text-[var(--ink)] md:text-4xl">COA Library</h1>
                <p className="mt-2 text-sm text-[var(--muted)]">Every batch independently tested. All certificates available for download.</p>
              </div>
              <p className="text-xs text-[var(--muted)] shrink-0">{filtered.length} {filtered.length === 1 ? "report" : "reports"}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-4 text-center text-sm">
              <div><p className="text-2xl font-bold text-[var(--navy)]">{lotCount}</p><p className="text-xs text-[var(--muted)] mt-0.5">Active Lots</p></div>
              <div><p className="text-2xl font-bold text-[var(--navy)]">3rd Party</p><p className="text-xs text-[var(--muted)] mt-0.5">Accredited Lab</p></div>
              <div><p className="text-2xl font-bold text-[var(--navy)]">99%+</p><p className="text-xs text-[var(--muted)] mt-0.5">Purity</p></div>
            </div>
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
                      <Image src={image} alt={`${coa.productName ?? product?.name ?? "Liberty Aminos"} vial`} width={240} height={300} className="h-36 w-full object-contain transition duration-300 group-hover:scale-[1.04]" />
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
