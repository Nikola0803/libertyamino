"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SearchWidget } from "./SearchWidget";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();

  return (
    <>
      {/* RUO utility bar */}
      <div className="la-ruo-bar">
        <span>For Research Use Only · 21+ Only · Not for Human Consumption</span>
        <Link href="/heroes" className="la-heroes-pill">
          <i className="ri-medal-line" /> Military &amp; First Responders – 15% Off, For Life
        </Link>
      </div>

      <header className="la-site-header">
        <div className="la-header-inner">
          <Logo tone="dark" />

          <nav className={`la-nav${mobileOpen ? " la-nav-open" : ""}`} onClick={() => setMobileOpen(false)}>
            <Link href="/shop">Shop</Link>
            <Link href="/coas">COA Library</Link>
            <Link href="/track-order">Track Order</Link>
            <Link href="/about">About</Link>
          </nav>

          <div className="la-header-actions">
            <SearchWidget />
            <Link href="/account" aria-label="Account"><i className="ri-user-line" /></Link>
            <button type="button" onClick={openCart} aria-label="Shopping cart" className="la-cart-btn">
              <i className="ri-shopping-bag-line" />
              {count > 0 && <span className="la-cart-count">{count}</span>}
            </button>
            <button
              className="la-mobile-menu"
              type="button"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
            >
              <i className={mobileOpen ? "ri-close-line" : "ri-menu-line"} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
