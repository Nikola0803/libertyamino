"use client";

/**
 * Order history. Local browser storage is used for orders placed in this
 * session; remote orders are fetched from the WooCommerce REST API via
 * /api/account/orders and merged in by the account page.
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
  paymentMethod?: string;
  paymentMemo?: string;
  /** True for orders fetched live from WooCommerce, vs a local-only browser record. */
  isRemote?: boolean;
}

const STORAGE_KEY = "la_orders";

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
    id: `LA-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    status: "Processing",
  };
  writeAll([...readAll(), full]);
  return full;
}

const WC_STATUS_LABEL: Record<string, OrderStatus> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  on_hold: "On Hold",
  refunded: "Refunded",
  cancelled: "Cancelled",
  failed: "Cancelled",
};

interface WcOrder {
  id: number;
  number: string;
  status: string;
  total: string;
  date_created: string;
  shipping_total: string;
  line_items: { name: string; quantity: number; total: string }[];
  payment_method?: string;
  meta_data?: Array<{ key: string; value: string }>;
}

/** Maps WooCommerce REST API orders onto the Order shape. */
export function mapWcOrders(userId: string, wcOrders: WcOrder[]): Order[] {
  return wcOrders.map((o) => {
    const total = Number(o.total);
    const shipping = Number(o.shipping_total ?? 0);
    const subtotal = total - shipping;
    const memo = o.meta_data?.find((m) => m.key === "_payment_memo")?.value;
    return {
      id: o.number || String(o.id),
      userId,
      createdAt: o.date_created,
      status: WC_STATUS_LABEL[o.status] ?? "Processing",
      lines: o.line_items.map((li) => ({
        name: li.name,
        packLabel: "",
        qty: li.quantity,
        unitPrice: li.quantity > 0 ? Number(li.total) / li.quantity : Number(li.total),
      })),
      subtotal,
      shipping,
      total,
      currency: "USD",
      paymentMethod: o.payment_method,
      paymentMemo: memo,
      isRemote: true,
    };
  });
}
