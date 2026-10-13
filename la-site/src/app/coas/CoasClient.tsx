"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import type { CoaEntry } from "@/lib/coa-data";
import { getProductImage } from "@/lib/product-images";

type Filter = "all" | "glp" | "peptides" | "ancillaries" | "oral";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All reports" },
  { value: "glp", label: "GLP series" },
  { value: "peptides", label: "Peptides" },
  { value: "ancillaries", label: "Ancillaries" },
  { value: "oral", label: "Capsules" },
];

const GLP_COMPOUNDS = ["semaglutide", "tirzepatide", "retatrutide"];

export function CoasClient({ coaEntries }: { coaEntries: CoaEntry[] }) {
  const products = useMemo(() => getProducts(), []);
  const productBySlug = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);
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
    const isGlp = GLP_COMPOUNDS.some((c) => coa.compound?.toLowerCase().includes(c));
    const matchesFilter =
      filter === "all" ||
      (filter === "glp" && isGlp) ||
      product?.format === filter ||
      product?.category === filter;
    return matchesQuery && matchesFilter;
  });

  const lotCount = coaEntries.length;
  const productCount = new Set(coaEntries.map((c) => c.slug)).size;
  const labCount = new Set(coaEntries.map((c) => c.lab).filter(Boolean)).size;

  return (
    <main className="la-coa-page">
      <section className="la-coa-hero">
        <div className="la-wrap la-coa-hero-inner">
          <small className="la-coa-kicker">Batch Documentation · Research Use Only</small>
          <h1>Certificate of Analysis Library</h1>
          <p>
            Third-party laboratory reports for every Liberty Aminos batch. Match the lot code on your
            received item to verify your specific batch.
          </p>
          <div className="la-coa-stats">
            <div><b>{lotCount}</b><span>Lot reports</span></div>
            <div><b>{productCount}</b><span>Products tested</span></div>
            <div><b>{labCount}</b><span>Independent labs</span></div>
          </div>
        </div>
      </section>

      <div className="la-wrap la-coa-body">
        <div className="la-coa-search-box">
          <div className="la-coa-search-input">
            <i className="ri-search-line" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search compound, batch code, lot, purity, or lab…"
              aria-label="Search COA library"
            />
          </div>
          <div className="la-coa-filters">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={item.value === filter ? "active" : ""}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="la-coa-list-header">
          <h2>Published lot reports</h2>
          <span>{filtered.length} {filtered.length === 1 ? "report" : "reports"}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="la-coa-empty">
            <i className="ri-file-search-line" aria-hidden />
            <p>No documentation matches &ldquo;{query}&rdquo;.</p>
          </div>
        ) : (
          <div className="la-coa-grid">
            {filtered.map((coa) => {
              const product = productBySlug.get(coa.slug);
              const image = product ? getProductImage(product) : "/images/products/vial-placeholder.png";
              return (
                <a
                  key={coa.url}
                  href={`${coa.url}#page=2`}
                  target="_blank"
                  rel="noreferrer"
                  className="la-coa-card"
                >
                  <div className="la-coa-card-img">
                    <Image
                      src={image}
                      alt={`${coa.productName ?? product?.name ?? "Liberty Aminos"} vial`}
                      width={240}
                      height={300}
                    />
                    <span>Report on file</span>
                  </div>
                  <div className="la-coa-card-body">
                    <div className="la-coa-card-head">
                      <div>
                        <p className="la-coa-compound">{coa.compound}</p>
                        <h3>{coa.productName ?? product?.name}</h3>
                      </div>
                      <i className="ri-arrow-right-up-line" aria-hidden />
                    </div>
                    <dl className="la-coa-card-dl">
                      <div><dt>Lot / report</dt><dd>{coa.label}</dd></div>
                      <div><dt>Purity</dt><dd className="la-coa-purity">{coa.purity}</dd></div>
                      <div><dt>Laboratory</dt><dd>{coa.lab}</dd></div>
                      <div><dt>Analyzed</dt><dd>{coa.tested}</dd></div>
                    </dl>
                    <span className="la-coa-card-cta">
                      <i className="ri-external-link-line" aria-hidden /> Open lab report
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
