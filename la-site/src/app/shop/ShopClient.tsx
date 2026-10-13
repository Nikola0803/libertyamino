"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, ProductCategory, ProductFormat } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { getShopMenuGroups } from "@/lib/shop-menu-data";

type Filter = "all" | ProductCategory | ProductFormat;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "peptides", label: "Peptides" },
  { value: "ancillaries", label: "Ancillaries" },
  { value: "oral", label: "Capsules" },
];

export function ShopClient({
  products: initialProducts,
  verifiedCoaSlugs,
}: {
  products: Product[];
  verifiedCoaSlugs: string[];
}) {
  const params = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState<Filter>(() => {
    const category = params.get("category") as ProductCategory | null;
    if (category === "peptides") return "all";
    return category || (params.get("format") as ProductFormat | null) || "all";
  });
  const [query, setQuery] = useState(() => params.get("q") || "");
  const [sort, setSort] = useState("featured");
  const groups = useMemo(() => getShopMenuGroups(products), [products]);
  const verifiedCoas = useMemo(() => new Set(verifiedCoaSlugs), [verifiedCoaSlugs]);

  useEffect(() => {
    let active = true;
    async function refreshCatalog() {
      try {
        const response = await fetch("/api/catalog", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { products?: Product[] };
        if (active && Array.isArray(data.products)) setProducts(data.products);
      } catch {
        // Keep the last good catalog on screen if the backend is unreachable.
      }
    }
    const timer = window.setInterval(refreshCatalog, 60_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const list = useMemo(() => {
    let next = products.filter((p) => p.inStock);
    const focus = params.get("focus");
    if (focus) {
      const group = groups.find((g) => g.slug === focus);
      if (group) {
        const slugs = new Set(group.products.map((p) => p.slug));
        next = next.filter((p) => slugs.has(p.slug));
      }
    }
    if (filter !== "all") next = next.filter((p) => p.category === filter || p.format === filter);
    if (query.trim()) next = next.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
    if (sort === "az") next.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "low") next.sort((a, b) => a.price - b.price);
    if (sort === "high") next.sort((a, b) => b.price - a.price);
    return next;
  }, [products, filter, query, sort, params, groups]);

  const title = filter === "all" ? "All Products" : FILTERS.find((f) => f.value === filter)?.label;

  return (
    <section className="la-shop">
      <header className="la-shop-hero">
        <div className="la-shop-hero-inner la-wrap">
          <div className="la-shop-hero-copy">
            <small>Liberty Aminos Research Catalogue</small>
            <h1>{title}</h1>
            <p>Research-use-only amino acids and peptides with third-party batch documentation.</p>
            <div className="la-shop-hero-proof">
              <span><i className="ri-check-line" aria-hidden /> Third-Party Tested</span>
              <span><i className="ri-check-line" aria-hidden /> COA Every Batch</span>
              <span><i className="ri-check-line" aria-hidden /> US Fulfillment</span>
            </div>
          </div>
        </div>
      </header>

      <div className="la-shop-inner la-wrap" id="catalogue">
        <div className="la-shop-tools">
          <div className="la-shop-filters">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={item.value === filter ? "active" : ""}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="la-shop-search">
            <i className="ri-search-line" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="az">Name A–Z</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
        </div>

        <div className="la-shop-status">
          <span>{list.length} product{list.length !== 1 ? "s" : ""}</span>
          <span>COA badges appear only when a matching batch report is on file</span>
        </div>

        <div className="la-shop-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} coaVerified={verifiedCoas.has(product.slug)} />
          ))}
        </div>

        {list.length === 0 && (
          <p className="la-shop-empty">No products match your search.</p>
        )}
      </div>
    </section>
  );
}
