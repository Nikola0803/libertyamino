"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    cc?: (action: string, event: string, extra?: Record<string, unknown>) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

// An order submitted for manual payment is not a paid purchase yet. Track it
// as its own funnel stage so CRO reporting does not overstate revenue.
export function PurchasePixel({ orderNumber, total, currency }: { orderNumber: string; total: number; currency: string }) {
  useEffect(() => {
    if (!orderNumber || !Number.isFinite(total)) return;
    const key = `evlv_order_submitted_tracked_${orderNumber}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {
      /* localStorage unavailable -- fire anyway rather than silently drop the event */
    }

    let attempts = 0;
    let crmFired = false;
    let gaFired = false;
    const tryFire = () => {
      if (!crmFired && window.cc) {
        window.cc("track", "order_submitted", { valueCents: Math.round(total * 100), currency, orderNumber });
        crmFired = true;
      }
      if (!gaFired && window.gtag) {
        window.gtag("event", "order_submitted", { transaction_id: orderNumber, value: total, currency });
        gaFired = true;
      }
      if ((!crmFired || !gaFired) && attempts < 20) {
        attempts += 1;
        setTimeout(tryFire, 250); // analytics scripts load asynchronously
      }
    };
    tryFire();
  }, [orderNumber, total, currency]);

  return null;
}
