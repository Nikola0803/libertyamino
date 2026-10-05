export const QUANTITY_DISCOUNT_TIERS = [
  { qty: 1, savePercent: 0 },
  { qty: 3, savePercent: 3 },
  { qty: 5, savePercent: 7 },
  { qty: 10, savePercent: 10 },
] as const;

export function getQuantityDiscountPercent(quantity: number): number {
  if (quantity >= 10) return 10;
  if (quantity >= 5) return 7;
  if (quantity >= 3) return 3;
  return 0;
}

export function getQuantityUnitPrice(retailPrice: number, quantity: number): number {
  const savePercent = getQuantityDiscountPercent(quantity);
  return Math.round(retailPrice * 100 * (1 - savePercent / 100)) / 100;
}
