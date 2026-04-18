/**
 * Returns the effective price per day based on the number of days selected.
 *
 * Discount tiers:
 *  1–4  days  → base price (no discount)
 *  5–19 days  → base price − 1
 *  20+  days  → base price − 2
 */
export function getEffectivePricePerDay(
  basePricePerDay: number,
  daysCount: number,
): number {
  if (daysCount >= 20) return Math.max(0, basePricePerDay - 2);
  if (daysCount >= 5) return Math.max(0, basePricePerDay - 1);
  return basePricePerDay;
}

/**
 * Returns the total price for a given base price and days count,
 * applying the discount tier automatically.
 */
export function getTotalPrice(
  basePricePerDay: number,
  daysCount: number,
): number {
  return getEffectivePricePerDay(basePricePerDay, daysCount) * daysCount;
}
