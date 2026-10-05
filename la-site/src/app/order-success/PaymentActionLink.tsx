"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/pixel";

export function PaymentActionLink({
  href,
  gateway,
  orderNumber,
  amount,
  children,
}: {
  href: string;
  gateway: string;
  orderNumber: string;
  amount: number;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={() => trackEvent("payment_link_click", {
        currency: "USD",
        valueCents: Math.round(amount * 100),
        order_number: orderNumber,
        payment_method: gateway,
      })}
      className="mt-4 inline-block w-full rounded-md bg-copper px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal transition hover:bg-copper-light"
    >
      {children}
    </a>
  );
}
