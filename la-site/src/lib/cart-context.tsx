"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { Product } from "./types";
import { trackEvent } from "./pixel";
import { getQuantityUnitPrice } from "./quantity-pricing";

interface CartLine {
  product: Product;
  qty: number;
  unitPrice: number;
  packLabel: string;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  toastMessage: string | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, qty: number, unitPrice: number, packLabel: string) => void;
  removeLine: (productId: string, packLabel: string) => void;
  setLineQty: (productId: string, packLabel: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "evlv_cart_v1";

function loadStoredLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        l && typeof l === "object" && l.product && typeof l.qty === "number" && typeof l.unitPrice === "number"
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);
  const hasHydrated = useRef(false);

  // Rehydrate cart from localStorage once, after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    const stored = loadStoredLines();
    if (stored.length > 0) {
      setLines(stored);
    }
    hasHydrated.current = true;
  }, []);

  // Persist cart to localStorage on every change, but only after the initial
  // hydration read has happened (otherwise the empty initial state would
  // immediately overwrite whatever was saved).
  useEffect(() => {
    if (!hasHydrated.current) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore storage failures (e.g. private browsing quota)
    }
  }, [lines]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((product: Product, qty: number, unitPrice: number, packLabel: string) => {
    setLines((prev) => {
      const existingIndex = prev.findIndex((l) => l.product.id === product.id && l.packLabel === packLabel);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], qty: next[existingIndex].qty + qty };
        return next;
      }
      return [...prev, { product, qty, unitPrice, packLabel }];
    });
    setToastMessage(`${product.name} added to cart`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(null), 2600);
    setIsOpen(true);
    trackEvent("add_to_cart", {
      currency: "USD",
      valueCents: Math.round(unitPrice * qty * 100),
      properties: { name: product.name, slug: product.slug, sku: product.sku },
      items: [{
        item_id: product.sku,
        item_name: product.name,
        item_category: product.category,
        quantity: qty,
        price: unitPrice,
      }],
    });
  }, []);

  const removeLine = useCallback((productId: string, packLabel: string) => {
    setLines((prev) => {
      const removed = prev.find((l) => l.product.id === productId && l.packLabel === packLabel);
      if (removed) {
        trackEvent("remove_from_cart", {
          currency: "USD",
          valueCents: Math.round(removed.unitPrice * removed.qty * 100),
          items: [{
            item_id: removed.product.sku,
            item_name: removed.product.name,
            item_category: removed.product.category,
            quantity: removed.qty,
            price: removed.unitPrice,
          }],
        });
      }
      return prev.filter((l) => !(l.product.id === productId && l.packLabel === packLabel));
    });
  }, []);

  const setLineQty = useCallback((productId: string, packLabel: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => {
          if (l.product.id !== productId || l.packLabel !== packLabel) return l;
          const nextQty = Math.max(1, qty);
          return { ...l, qty: nextQty, unitPrice: getQuantityUnitPrice(l.product.price, nextQty) };
        })
        .filter((l) => l.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const productSubtotal = useMemo(() => lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0), [lines]);
  const subtotal = productSubtotal;

  const value = useMemo(
    () => ({ lines, count, subtotal, toastMessage, isOpen, openCart, closeCart, addToCart, removeLine, setLineQty, clearCart }),
    [lines, count, subtotal, toastMessage, isOpen, openCart, closeCart, addToCart, removeLine, setLineQty, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
