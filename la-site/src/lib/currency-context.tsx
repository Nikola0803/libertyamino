"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Currency = "USD" | "CAD";

const STORAGE_KEY = "evlv_currency";

/**
 * Static approximate USD->CAD rate. There's no live FX feed wired up yet --
 * replace this with a real-time rate (or a fixed retail price list per
 * currency, which is more common for RUO stores) before this matters for
 * real money. All internal math (cart subtotal, product.price, etc.) stays
 * in USD; this is a display-only conversion applied via formatPrice/convert.
 */
const USD_TO_CAD_RATE = 1.38;

/**
 * Launching US-only for the first few days -- the CurrencySwitcher is
 * hidden from the header, so CAD auto-detection/stored-preference is
 * disabled here too (a Canadian visitor would otherwise get stuck in CAD
 * with no UI to switch back). Flip this back to false once CAD is ready
 * to show again; nothing else needs to change.
 */
const US_ONLY_LAUNCH = true;

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (usdAmount: number) => number;
  formatPrice: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // US is the default/main store -- USD unless we detect Canada or the visitor already chose CAD.
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    if (US_ONLY_LAUNCH) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (stored === "USD" || stored === "CAD") {
      setCurrencyState(stored);
      return;
    }

    // No saved preference yet -- auto-detect by IP country on first visit. Any failure,
    // block (ad-blockers etc.), or non-Canada result all fall through to the USD default.
    fetch("https://get.geojs.io/v1/ip/country.json")
      .then((r) => r.json())
      .then((d) => {
        if (d?.country === "CA") setCurrencyState("CAD");
      })
      .catch(() => {
        /* stay on USD default */
      });
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  const convert = useCallback((usdAmount: number) => (currency === "CAD" ? usdAmount * USD_TO_CAD_RATE : usdAmount), [currency]);
  const formatPrice = useCallback((usdAmount: number) => `$${convert(usdAmount).toFixed(2)} ${currency}`, [convert, currency]);

  const value = useMemo(() => ({ currency, setCurrency, convert, formatPrice }), [currency, setCurrency, convert, formatPrice]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
