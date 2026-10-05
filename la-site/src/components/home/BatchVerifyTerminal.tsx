"use client";

/**
 * Live batch-verification tool, styled after a terminal. Unlike a typical
 * marketing mockup, this queries the real catalog (getProducts()) so every
 * lookup is against an actual product/batch record, not a fake demo DB.
 */

import { useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

type LookupState = "idle" | "loading" | "found" | "not-found";
type ProductWithBatch = Product & { batch: NonNullable<Product["batch"]> };

function hasBatch(p: Product): p is ProductWithBatch {
  return Boolean(p.batch);
}

const products = getProducts().filter(hasBatch);
const latestBatch = [...products].sort((a, b) => (a.batch.date < b.batch.date ? 1 : -1))[0];

export function BatchVerifyTerminal() {
  const [state, setState] = useState<LookupState>("idle");
  const [query, setQuery] = useState("");
  const [match, setMatch] = useState<(typeof products)[number] | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = query.trim().toUpperCase();
    if (!code) return;
    setState("loading");
    window.setTimeout(() => {
      const found = products.find((p) => p.batch.code.toUpperCase() === code);
      if (found) {
        setMatch(found);
        setState("found");
      } else {
        setMatch(null);
        setState("not-found");
      }
    }, 500);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-copper/15 bg-charcoal shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-copper" />
          <span className="h-2 w-2 rounded-full bg-sage-deep" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">EVLV Verification &middot; Terminal</span>
        <span className="font-mono text-[10px] text-white/25">v1.0</span>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-5 font-mono text-[11px] text-copper">
          <span className="mr-2">$</span>
          <span className="text-white/50">evlv verify --batch</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setState("idle");
            }}
            placeholder={latestBatch.batch.code}
            className="h-13 flex-1 rounded-md border border-white/10 bg-white/5 px-4 font-mono text-sm tracking-wider text-white outline-none placeholder:text-white/25 focus:border-copper"
            type="text"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-copper px-6 text-[12px] font-semibold uppercase tracking-[0.15em] text-charcoal transition hover:bg-copper-light disabled:opacity-70"
          >
            {state === "loading" ? (
              <>
                <i className="ri-loader-4-line animate-spin" /> Scanning
              </>
            ) : (
              <>
                <i className="ri-shield-check-line" /> Verify Batch
              </>
            )}
          </button>
        </form>

        {state === "found" && match && (
          <div className="mt-5 rounded-md border border-sage-deep/40 bg-sage-deep/10 p-4">
            <div className="mb-4 flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-sage" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-sage">Batch Verified, Pass</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Batch</p>
                <p className="font-mono text-white/80">{match.batch.code}</p>
              </div>
              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Compound</p>
                <p className="text-white/80">{match.name}</p>
              </div>
              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Purity</p>
                <p className="font-mono text-copper">{match.purity ?? "On file"}</p>
              </div>
              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Test Date</p>
                <p className="font-mono text-white/80">{match.batch.date}</p>
              </div>
            </div>
            <Link href={`/shop/${match.slug}`} className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-copper transition hover:text-copper-light">
              View product & full COA <i className="ri-arrow-right-line" />
            </Link>
          </div>
        )}

        {state === "not-found" && (
          <div className="mt-5 flex items-center gap-2 rounded-md border border-copper/30 bg-copper/5 p-4">
            <i className="ri-error-warning-line text-copper" />
            <span className="font-mono text-xs text-white/60">Batch not found. Try {latestBatch.batch.code}</span>
          </div>
        )}

        {state === "idle" && (
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Latest Batch</p>
              <p className="font-mono text-xs text-white/70">{latestBatch.batch.code}</p>
            </div>
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Tested</p>
              <p className="font-mono text-xs text-white/70">{latestBatch.batch.date}</p>
            </div>
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Result</p>
              <p className="flex items-center gap-1.5 font-mono text-xs text-sage">
                <i className="ri-checkbox-circle-fill" /> Passed
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.03] px-5 py-2.5">
        <span className="font-mono text-[10px] text-white/30">{products.length} batches archived</span>
        <Link href="/coas" className="flex items-center gap-1 font-mono text-[10px] text-copper transition hover:text-copper-light">
          Browse Archive <i className="ri-arrow-right-line" />
        </Link>
      </div>
    </div>
  );
}
