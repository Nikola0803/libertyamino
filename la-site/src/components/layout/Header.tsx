"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SearchWidget } from "./SearchWidget";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export function Header({ products }: { products?: Product[] } = {}) {
  void products;
  const [open, setOpen] = useState(false);
  const { count, openCart } = useCart();
  return (
    <header className="cp-site-header">
      <div className="cp-header-inner">
        <Logo tone="charcoal" imgClassName="cp-logo" />
        <nav className={open ? "cp-nav cp-nav-open" : "cp-nav"} onClick={() => setOpen(false)}>
          <div className="cp-nav-dropdown"><button type="button"><i className="ri-menu-2-line" /> Shop All</button><div className="cp-nav-dropdown-menu"><Link href="/shop?category=peptides">Shop Peptides</Link><Link href="/shop?focus=bioregulators">Shop Bioregulators</Link><Link href="/shop?focus=metabolic">Shop Lipotropics</Link><Link href="/shop?format=oral">Shop Capsules</Link><Link href="/shop">Shop All</Link></div></div>
          <Link href="/track-order">Track Order</Link>
          <Link href="/coas">COA Library</Link>
          <div className="cp-nav-dropdown"><button type="button">More <i className="ri-arrow-down-s-line" /></button><div className="cp-nav-dropdown-menu"><Link href="/research-peptides-usa">Research Peptides USA</Link><Link href="/about">About Us</Link><Link href="/contact">Customer Support</Link><Link href="/faq">FAQ</Link><Link href="/journal">Research Center</Link><Link href="/wholesale">Wholesale</Link><Link href="/ambassadors">Partner Network</Link><Link href="/shipping">Shipping Policy</Link><Link href="/terms">Terms &amp; Conditions</Link><Link href="/privacy">Privacy Policy</Link></div></div>
        </nav>
        <div className="cp-header-actions"><SearchWidget /><Link href="/account" aria-label="Account"><i className="ri-user-line" /></Link><button type="button" onClick={openCart} aria-label="Shopping cart"><i className="ri-shopping-bag-line" />{count > 0 && <span>{count}</span>}</button><Link className="cp-header-shop" href="/shop">Shop Now</Link><button className="cp-mobile-menu" type="button" onClick={() => setOpen(v => !v)} aria-label="Menu"><i className={open ? "ri-close-line" : "ri-menu-line"} /></button></div>
      </div>
    </header>
  );
}
