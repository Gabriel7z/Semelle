export const FIRST_PIX_DISCOUNT_RATE = 0.2

export function firstPixDiscountCents(subtotalCents: number, enabled: boolean) {
  if (!enabled) return 0
  return Math.round(subtotalCents * FIRST_PIX_DISCOUNT_RATE)
}
