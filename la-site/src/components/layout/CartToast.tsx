"use client";

import { useCart } from "@/lib/cart-context";

export function CartToast() {
  const { toastMessage } = useCart();

  return (
    <div
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-sm bg-charcoal px-5 py-3 text-xs font-medium text-ivory shadow-lg transition-all duration-300 ${
        toastMessage ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {toastMessage}
    </div>
  );
}
