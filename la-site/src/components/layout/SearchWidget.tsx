"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/products";
import { useCurrency } from "@/lib/currency-context";
import { getProductImage } from "@/lib/product-images";

export function SearchWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getProducts()
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  function goToShop() {
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    close();
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center transition hover:opacity-70" aria-label="Search">
        <i className="ri-search-line text-base" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[140] flex items-start justify-center pt-24 md:pt-32">
          <div aria-hidden onClick={close} className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-xl px-4">
            <div className="rounded-lg border border-stone bg-ivory shadow-2xl">
              <div className="flex items-center gap-3 border-b border-stone px-5 py-4">
                <i className="ri-search-line text-lg text-charcoal/40" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goToShop()}
                  placeholder="Search products, SKU, category..."
                  className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-charcoal/40"
                />
                <button type="button" onClick={close} aria-label="Close search" className="text-charcoal/40 transition hover:text-charcoal">
                  <i className="ri-close-line text-lg" />
                </button>
              </div>

              {query.trim() && (
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {results.length > 0 ? (
                    <>
                      {results.map((p) => (
                        <Link
                          key={p.id}
                          href={`/shop/${p.slug}`}
                          onClick={close}
                          className="flex items-center gap-3 rounded-md p-3 transition hover:bg-ivory-soft"
                        >
                          <div className="h-14 w-11 shrink-0 overflow-hidden rounded-md bg-ivory-soft">
                            <Image src={getProductImage(p)} alt={p.name} width={90} height={112} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-charcoal">{p.name}</p>
                            <p className="text-xs text-charcoal/50">{p.categoryLabel}</p>
                          </div>
                          <span className="text-sm font-semibold text-charcoal">{formatPrice(p.price)}</span>
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={goToShop}
                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-md py-3 text-xs font-semibold uppercase tracking-wide text-copper transition hover:bg-ivory-soft"
                      >
                        View all results for &ldquo;{query.trim()}&rdquo; <i className="ri-arrow-right-line" />
                      </button>
                    </>
                  ) : (
                    <p className="p-6 text-center text-sm text-charcoal/50">No products match &ldquo;{query.trim()}&rdquo;.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
