"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { getShopMenuGroups } from "@/lib/shop-menu-data";

type Filter = "all" | "glp1" | "glp2" | "glp3" | "reconstitution";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "glp1", label: "GLP1-Class" },
  { value: "glp2", label: "GLP2-Class" },
  { value: "glp3", label: "GLP3-Class" },
  { value: "reconstitution", label: "Reconstitution" },
];

export function ShopClient({ products: initialProducts, verifiedCoaSlugs }: { products: Product[]; verifiedCoaSlugs: string[] }) {
  const params = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [filter,setFilter] = useState<Filter>(() => {
    const f = params.get("filter") as Filter | null;
    if (f && FILTERS.some(x => x.value === f)) return f;
    return "all";
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
    if(filter==="glp1") next=next.filter(p=>p.name.toLowerCase().includes("glp1") || p.slug.includes("glp1"));
    else if(filter==="glp2") next=next.filter(p=>p.name.toLowerCase().includes("glp2") || p.slug.includes("glp2"));
    else if(filter==="glp3") next=next.filter(p=>p.name.toLowerCase().includes("glp3") || p.slug.includes("glp3"));
    else if(filter==="reconstitution") next=next.filter(p=>p.format==="supplies" || p.category==="ancillaries");
    if(query.trim()) next=next.filter(p=>p.name.toLowerCase().includes(query.trim().toLowerCase()));
    if(sort==="az") next.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort==="low") next.sort((a,b)=>a.price-b.price);
    if(sort==="high") next.sort((a,b)=>b.price-a.price);
    return next;
  },[products,filter,query,sort,params,groups]);

  const title = filter === "all" ? "Research Compounds" : FILTERS.find(f=>f.value===filter)?.label;

  return <section className="cp-shop">
    <header className="cp-shop-hero">
      <div className="cp-shop-hero-inner">
        <div className="cp-shop-hero-copy">
          <small>LIBERTY AMINOS RESEARCH CATALOGUE</small>
          <h1>{title}</h1>
          <p>Research-use-only compounds with clearly labeled, lot-specific batch documentation.</p>
          <div className="cp-shop-hero-proof" aria-label="Product quality standards">
            <span>✓ 99%+ Purity</span><span>✓ Lot-specific COAs</span><span>✓ U.S. dispatch</span>
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
