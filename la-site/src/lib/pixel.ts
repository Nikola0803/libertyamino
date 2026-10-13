"use client";

/**
 * Meta Pixel event tracking for Liberty Aminos.
 *
 * Fires browser-side pixel events: PageView, ViewContent, AddToCart,
 * InitiateCheckout. Purchase fires server-side from WooCommerce when an
 * order is marked paid — this file does NOT fire Purchase.
 *
 * NEXT_PUBLIC_META_PIXEL_ID must be set for events to fire.
 */

declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: Record<string, unknown>) => void;
    _fbq?: unknown;
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", event, params);
}

export function trackPageView() {
  trackEvent("PageView");
}

export function trackViewContent(params: { content_ids: string[]; content_type: string; value?: number; currency?: string }) {
  trackEvent("ViewContent", params);
}

export function trackAddToCart(params: { content_ids: string[]; content_type: string; value: number; currency: string }) {
  trackEvent("AddToCart", params);
}

export function trackInitiateCheckout(params: { content_ids: string[]; num_items: number; value: number; currency: string }) {
  trackEvent("InitiateCheckout", params);
}
