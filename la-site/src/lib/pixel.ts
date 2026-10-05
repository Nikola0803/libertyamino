"use client";

// Thin wrapper around the CRM tracking pixel's window.cc(...) global (see
// public/pixel.js server-side and layout.tsx's embed) -- safe to call even
// before the async pixel script has loaded (no-ops silently) or when the
// pixel isn't configured at all.
declare global {
  interface Window {
    cc?: (action: string, event: string, extra?: Record<string, unknown>) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: string, extra?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.cc?.("track", event, extra);

  // Never forward identify/PII calls to Google Analytics. Commerce events
  // are mirrored to GA4 so email traffic can be measured through purchase.
  if (event === "identify" || !window.gtag) return;
  const { valueCents, properties: _properties, ...rest } = extra ?? {};
  window.gtag("event", event, {
    ...rest,
    ...(typeof valueCents === "number" ? { value: valueCents / 100 } : {}),
  });
}
