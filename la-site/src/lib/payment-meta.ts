// Client-safe payment constants — no server-only imports.
// Import PaymentGatewayId and PaymentGateway from here in client components.

export type PaymentGatewayId = "cashapp" | "zelle" | "venmo" | "btc" | "usdc" | "usdt";

export interface PaymentGateway {
  id: PaymentGatewayId;
  label: string;
  icon: string;
  handle: string;
  handleNote: string;
}

export const PAYMENT_PROCESSOR_NOTE =
  "Liberty Aminos does not store or process payment details. Payments are made directly between you and the payment recipient shown above.";

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: "cashapp",
    label: "Cash App",
    icon: "ri-money-dollar-circle-line",
    handle: "",
    handleNote: "Include only the Liberty Aminos order memo shown below so your payment can be matched quickly.",
  },
  {
    id: "zelle",
    label: "Zelle",
    icon: "ri-bank-line",
    handle: "",
    handleNote: "Include only the order memo shown below so we can match your payment.",
  },
  {
    id: "venmo",
    label: "Venmo",
    icon: "ri-smartphone-line",
    handle: "",
    handleNote: "Include only the Liberty Aminos order memo shown below so your payment can be matched quickly.",
  },
  {
    id: "btc",
    label: "Bitcoin",
    icon: "ri-bit-coin-line",
    handle: "",
    handleNote: "Send the exact BTC amount shown. Include the order number in the memo/description field if your wallet supports it.",
  },
  {
    id: "usdc",
    label: "USDC",
    icon: "ri-coin-line",
    handle: "",
    handleNote: "Send USDC on the Ethereum network. Include the order number in the memo if your wallet supports it.",
  },
  {
    id: "usdt",
    label: "USDT",
    icon: "ri-coin-line",
    handle: "",
    handleNote: "Send USDT on the Ethereum network. Include the order number in the memo if your wallet supports it.",
  },
];
