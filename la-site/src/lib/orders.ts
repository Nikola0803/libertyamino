"use client";

/**
 * Order history, stored locally per browser (keyed by the signed-in user's
 * id) since there's no live payment/order backend wired up yet. Orders are
 * created for real when a checkout is submitted, not fabricated. Swap this
 * for a real CRM/WooCommerce orders fetch once that's connected.
 */

export interface OrderLine {
  name: string;
  packLabel: string;
  qty: number;
  unitPrice: number;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Pending" | "Completed" | "On Hold" | "Refunded" | "Cancelled";

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: "USD" | "CAD";
  paymentMethod?: "cashapp" | "zelle" | "venmo";
  paymentMemo?: string;
  /** True for orders fetched live from the CRM, vs a local-only browser record. */
  isRemote?: boolean;
}

const STORAGE_KEY = "evlv_orders";

function readAll(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeAll(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}

export function getOrdersForUser(userId: string): Order[] {
  return readAll()
    .filter((o) => o.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addOrder(order: Omit<Order, "id" | "createdAt" | "status">): Order {
  const full: Order = {
    ...order,
    id: `EVLV-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    status: "Processing",
  };
  writeAll([...readAll(), full]);
  return full;
}

const CRM_STATUS_LABEL: Record<string, OrderStatus> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

interface CrmOrder {
  id: string;
  number: string;
  status: string;
  total: string;
  date_created: string;
  line_items: { name: string; quantity: number; total: string }[];
}

/** Maps the CRM's /api/store/account/orders response onto the same Order shape local orders use. */
export function mapCrmOrders(userId: string, crmOrders: CrmOrder[], currency: "USD" | "CAD"): Order[] {
  return crmOrders.map((o) => ({
    id: o.number || o.id,
    userId,
    createdAt: o.date_created,
    status: CRM_STATUS_LABEL[o.status] ?? "Processing",
    lines: o.line_items.map((li) => ({
      name: li.name,
      packLabel: "",
      qty: li.quantity,
      unitPrice: li.quantity > 0 ? Number(li.total) / li.quantity : Number(li.total),
    })),
    subtotal: Number(o.total),
    shipping: 0,
    total: Number(o.total),
    currency,
    isRemote: true,
  }));
}
