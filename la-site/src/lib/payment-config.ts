import "server-only";
import { laGet } from "@/lib/woocommerce";
import type { PaymentGatewayId, PaymentGateway } from "./payment-meta";
export type { PaymentGatewayId, PaymentGateway } from "./payment-meta";
export { PAYMENT_PROCESSOR_NOTE } from "./payment-meta";

/**
 * Payment rail configuration for Liberty Aminos.
 *
 * Handles and wallet addresses are stored in WP settings (never in code).
 * A rail with no handle configured is hidden from checkout.
 * Config is fetched from GET /la/v1/payment-config on the WP backend.
 *
 * Supported rails: P2P (CashApp, Zelle, Venmo), BTC, USDC, USDT.
 */

export interface PaymentConfig {
  gateways: PaymentGateway[];
}

const GATEWAY_META: Record<PaymentGatewayId, { label: string; icon: string; handleNote: string }> = {
  cashapp: {
    label: "Cash App",
    icon: "ri-money-dollar-circle-line",
    handleNote: "Include only the Liberty Aminos order memo shown below so your payment can be matched quickly.",
  },
  zelle: {
    label: "Zelle",
    icon: "ri-bank-line",
    handleNote: "Include only the order memo shown below so we can match your payment.",
  },
  venmo: {
    label: "Venmo",
    icon: "ri-smartphone-line",
    handleNote: "Include only the Liberty Aminos order memo shown below so your payment can be matched quickly.",
  },
  btc: {
    label: "Bitcoin",
    icon: "ri-bit-coin-line",
    handleNote: "Send the exact BTC amount shown. Include the order number in the memo/description field if your wallet supports it.",
  },
  usdc: {
    label: "USDC",
    icon: "ri-coin-line",
    handleNote: "Send USDC on the Ethereum network. Include the order number in the memo if your wallet supports it.",
  },
  usdt: {
    label: "USDT",
    icon: "ri-coin-line",
    handleNote: "Send USDT on the Ethereum network. Include the order number in the memo if your wallet supports it.",
  },
};

interface WpPaymentConfig {
  cashapp?: string;
  zelle?: string;
  venmo?: string;
  btc?: string;
  usdc?: string;
  usdt?: string;
}

let cached: PaymentConfig | null = null;
let cachedAt = 0;
const CACHE_TTL = 60_000;

export async function getPaymentConfig(): Promise<PaymentConfig> {
  const now = Date.now();
  if (cached && now - cachedAt < CACHE_TTL) return cached;

  const { ok, data } = await laGet<WpPaymentConfig>("/payment-config", { revalidate: 60 });

  if (!ok || !data) {
    return { gateways: [] };
  }

  const gateways: PaymentGateway[] = (
    ["cashapp", "zelle", "venmo", "btc", "usdc", "usdt"] as PaymentGatewayId[]
  )
    .filter((id) => Boolean(data[id]))
    .map((id) => ({
      id,
      handle: data[id]!,
      ...GATEWAY_META[id],
    }));

  cached = { gateways };
  cachedAt = now;
  return cached;
}

export function buildQuickPayTarget(
  gateway: PaymentGateway,
  amount: number,
  memo: string,
): { kind: "payLink"; url: string } | { kind: "infoText"; text: string } {
  const { id, handle } = gateway;
  const amountStr = amount.toFixed(2);

  if (id === "venmo") {
    const clean = handle.replace(/^@/, "");
    return { kind: "payLink", url: `https://venmo.com/${clean}?txn=pay&amount=${amountStr}&note=${encodeURIComponent(memo)}` };
  }
  if (id === "cashapp") {
    const clean = handle.startsWith("$") ? handle.slice(1) : handle;
    return { kind: "payLink", url: `https://cash.app/$${clean}/${amountStr}` };
  }
  if (id === "btc") {
    return { kind: "infoText", text: `Bitcoin\nAddress: ${handle}\nAmount: $${amountStr} USD equivalent\nMemo: ${memo}` };
  }
  if (id === "usdc") {
    return { kind: "infoText", text: `USDC (Ethereum)\nAddress: ${handle}\nAmount: $${amountStr} USDC\nMemo: ${memo}` };
  }
  if (id === "usdt") {
    return { kind: "infoText", text: `USDT (Ethereum)\nAddress: ${handle}\nAmount: $${amountStr} USDT\nMemo: ${memo}` };
  }
  return { kind: "infoText", text: `Zelle\nTo: ${handle}\nAmount: $${amountStr}\nMemo: ${memo}` };
}

export function getEffectiveHandle(_gateway: PaymentGatewayId): { handle: string; isDemo: boolean } {
  return { handle: "", isDemo: false };
}
