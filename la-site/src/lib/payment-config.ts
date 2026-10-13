/**
 * Payment rail configuration for Liberty Aminos.
 *
 * Handles and addresses are fetched at runtime from GET /la/v1/payment-config
 * (served by the la-wp plugin from WP options). A rail with no configured
 * handle/address is hidden from checkout. These static values are placeholders
 * only — override via NEXT_PUBLIC_WC_URL env and the WP settings page.
 *
 * Awaiting from Jerod: LA payment rail handles/addresses.
 */

export type PaymentRailId = "p2p" | "btc" | "usdc" | "usdt";

export interface PaymentRail {
  id: PaymentRailId;
  label: string;
  icon: string;
  /** Handle or address. Empty string = rail hidden from checkout. */
  handle: string;
  note: string;
}

/** Static fallback — replaced by /la/v1/payment-config at runtime. */
export const PAYMENT_RAILS: PaymentRail[] = [
  {
    id: "p2p",
    label: "P2P Transfer",
    icon: "ri-money-dollar-circle-line",
    handle: "",
    note: "Send payment to the handle below. Include your order number as the memo.",
  },
  {
    id: "btc",
    label: "Bitcoin",
    icon: "ri-bit-coin-line",
    handle: "",
    note: "Send exact BTC amount to the address below. Include your order number in the transaction memo/comment field.",
  },
  {
    id: "usdc",
    label: "USDC",
    icon: "ri-coin-line",
    handle: "",
    note: "Send exact USDC amount to the address below. Include your order number in the memo.",
  },
  {
    id: "usdt",
    label: "USDT",
    icon: "ri-coin-line",
    handle: "",
    note: "Send exact USDT amount to the address below. Include your order number in the memo.",
  },
];

/** Returns only rails with a non-empty handle configured. */
export function getActiveRails(rails: PaymentRail[] = PAYMENT_RAILS): PaymentRail[] {
  return rails.filter(r => r.handle.trim() !== "");
}

// ---------------------------------------------------------------------------
// Deprecated — kept for checkout/order-success pages pending Phase 3 rewrite
// ---------------------------------------------------------------------------
export type PaymentGatewayId = "p2p" | "btc" | "usdc" | "usdt";

export const PAYMENT_PROCESSOR_NOTE =
  "Payments processed by Liberty Aminos. Include your order number as the memo.";

/** @deprecated Use PAYMENT_RAILS instead once checkout is rebuilt for LA. */
export const PAYMENT_GATEWAYS = PAYMENT_RAILS.map(r => ({
  id: r.id as PaymentGatewayId,
  label: r.label,
  icon: r.icon,
  handle: r.handle,
  handleNote: r.note,
}));

/** @deprecated Remove once checkout/order-success pages are rebuilt for LA. */
export function getEffectiveHandle(id: PaymentRailId): { handle: string; isDemo: boolean } {
  const rail = PAYMENT_RAILS.find(r => r.id === id);
  return { handle: rail?.handle ?? "", isDemo: !rail?.handle };
}

/** @deprecated Remove once checkout/order-success pages are rebuilt for LA. */
export function buildQuickPayTarget(
  id: PaymentRailId,
  amount: number,
  memo: string,
): { kind: "infoText"; text: string } {
  const { handle } = getEffectiveHandle(id);
  return {
    kind: "infoText",
    text: `${id.toUpperCase()}\nTo: ${handle || "(handle not configured)"}\nAmount: $${amount.toFixed(2)}\nMemo: ${memo}`,
  };
}
