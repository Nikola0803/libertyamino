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
        <Logo tone="dark" className="cp-logo" />
        <nav className={open ? "cp-nav cp-nav-open" : "cp-nav"} onClick={() => setOpen(false)}>
          <Link href="/shop">Shop All</Link>
          <Link href="/coas">COA Library</Link>
          <Link href="/track-order">Track Order</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="cp-header-actions">
          <SearchWidget />
          <Link href="/account" aria-label="Account"><i className="ri-user-line" /></Link>
          <button type="button" onClick={openCart} aria-label="Shopping cart">
            <i className="ri-shopping-bag-line" />
            {count > 0 && <span>{count}</span>}
          </button>
          <Link className="cp-header-shop" href="/shop">Shop Now</Link>
          <button
            className="cp-mobile-menu"
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
          >
            <i className={open ? "ri-close-line" : "ri-menu-line"} />
          </button>
        </div>
      </div>
    </header>
  );
}
