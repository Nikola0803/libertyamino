"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, ProductCategory, ProductFormat } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { getShopMenuGroups } from "@/lib/shop-menu-data";

type Filter = "all" | ProductCategory | ProductFormat;
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All products" },{ value: "peptides", label: "Peptides" },{ value: "ancillaries", label: "Bioregulators & Ancillaries" },{ value: "blend", label: "Blends" },{ value: "oral", label: "Capsules" },
];

export function ShopClient({ products: initialProducts, verifiedCoaSlugs }: { products: Product[]; verifiedCoaSlugs: string[] }) {
  const params = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [filter,setFilter] = useState<Filter>(() => {
    // The main "Shop Peptides" entry point is the complete research catalog,
    // including peptide-adjacent compounds and supplies. Visitors can still
    // narrow the already-visible catalog with the filter buttons below.
    const category = params.get("category") as ProductCategory | null;
    if (category === "peptides") return "all";
    return category || (params.get("format") as ProductFormat | null) || "all";
  });
  const [query,setQuery] = useState(() => params.get("q") || "");
  const [sort,setSort] = useState("featured");
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
        // Keep the last good catalog on screen if Google or the CRM is down.
      }
    }
    const timer = window.setInterval(refreshCatalog, 60_000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const list=useMemo(() => {
    let next=products.filter(p => p.inStock);
    const focus=params.get("focus");
    if(focus){const group=groups.find(g=>g.slug===focus);if(group){const slugs=new Set(group.products.map(p=>p.slug));next=next.filter(p=>slugs.has(p.slug));}}
    if(filter!=="all") next=next.filter(p=>p.category===filter || p.format===filter);
    if(query.trim()) next=next.filter(p=>p.name.toLowerCase().includes(query.trim().toLowerCase()));
    if(sort==="az") next.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort==="low") next.sort((a,b)=>a.price-b.price);
    if(sort==="high") next.sort((a,b)=>b.price-a.price);
    return next;
  },[products,filter,query,sort,params,groups]);

  const title = filter === "all" ? "Shop All Products" : FILTERS.find(f=>f.value===filter)?.label;

  return <section className="cp-shop">
    <header className="cp-shop-hero">
      <div className="cp-shop-hero-inner">
        <div className="cp-shop-hero-copy">
          <small>EVLV RESEARCH CATALOGUE</small>
          <h1>{title}</h1>
          <p>Research compounds with clearly labeled, product-specific batch documentation where available.</p>
          <div className="cp-shop-hero-proof" aria-label="Product quality standards">
            <span>✓ Exact reports labeled</span><span>✓ Transparent purity data</span><span>✓ U.S. dispatch</span>
          </div>
          <a href="#catalogue">Explore products <span aria-hidden="true">→</span></a>
        </div>
        <div className="cp-shop-hero-media" aria-hidden="true" />
      </div>
    </header>
    <div className="cp-shop-inner" id="catalogue">
      <div className="cp-shop-tools">
        <div className="cp-shop-filter-buttons">{FILTERS.map(item=><button key={item.value} className={filter===item.value?"active":""} onClick={()=>setFilter(item.value)}>{item.label}</button>)}</div>
        <div className="cp-shop-mobile-selects">
          <select aria-label="Product category" value={filter} onChange={e=>setFilter(e.target.value as Filter)}>{FILTERS.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select>
          <select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="az">Name A–Z</option><option value="low">Lowest price</option><option value="high">Highest price</option></select>
        </div>
        <div className="cp-shop-search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products" /><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="az">Name</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
      </div>
      <div className="cp-shop-status"><span>{list.length} products</span><span>Exact COA badges appear only when a matching report is available</span></div><div className="cp-shop-grid">{list.map(product=><ProductCard key={product.id} product={product} coaVerified={verifiedCoas.has(product.slug)}/>)}</div>{list.length===0&&<p className="cp-shop-empty">No products match your search.</p>}
    </div>
  </section>;
}
