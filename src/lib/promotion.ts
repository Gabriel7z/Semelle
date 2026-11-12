import { getProduct } from "@/lib/loja"

export const FIRST_PIX_DISCOUNT_RATE = 0.2

export function lineIsPromo(slug: string) {
  const product = getProduct(slug)
  return Boolean(product?.compareAt && product.compareAt > product.price)
}

export function firstPixDiscountCents(
  lines: { slug: string; price: number; qty: number }[],
  enabled: boolean,
) {
  if (!enabled) return 0
  const eligible = lines.reduce((total, line) => {
    if (lineIsPromo(line.slug)) return total
    return total + line.price * line.qty
  }, 0)
  return Math.round(eligible * FIRST_PIX_DISCOUNT_RATE)
}
