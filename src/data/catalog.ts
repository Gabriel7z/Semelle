import catalogo from "@/data/vitrine.json"

export const store = {
  name: "Use Semelle",
  legalName: "Use Semelle Calçados",
  tagline: "O par perfeito",
  city: "Brasília",
  state: "DF",
  instagram: "https://www.instagram.com/usesemelle/",
  handle: "@usesemelle",
  dm: "https://ig.me/m/usesemelle",
  whatsappNumber: "556182857131",
  whatsappDisplay: "(61) 8285-7131",
  whatsapp: "https://wa.me/556182857131",
  freeShippingCents: 24900,
  dfShippingCents: 1490,
  brShippingCents: 2790,
} as const

export const shoeSizes = ["33", "34", "35", "36", "37", "38", "39"] as const

export type CategoryId = string

export type Colorway = {
  id: string
  name: string
  swatch: string
  images: string[]
}

export type Product = {
  slug: string
  name: string
  brand: string
  category: CategoryId
  price: number
  compareAt?: number
  reference?: string | null
  badge?: string
  featured?: boolean
  caption: string
  description: string
  details: string[]
  colors: Colorway[]
  sizes: string[]
  /** null = disponível, quantidade desconhecida. Número positivo = quantidade real. */
  stock: Record<string, number | null>
  instagram?: string
}

const armazenado = catalogo as unknown as {
  products: Product[]
  categories: {
    id: string
    name: string
    blurb: string
    image: string
  }[]
}

export const products: Product[] = armazenado.products

export const categories = armazenado.categories

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}

/** Teto por número quando a Aurora não informa a quantidade. Não é estoque. */
export const UNKNOWN_STOCK_ORDER_CAP = 10

export function unitsLeft(
  product: { stock: Record<string, number | null> },
  colorId: string,
  size: string,
): number | null {
  const key = `${colorId}-${size}`
  if (!(key in product.stock)) return 0
  const qty = product.stock[key]
  if (qty === null) return null
  if (typeof qty === "number" && Number.isFinite(qty) && qty > 0) return Math.floor(qty)
  return 0
}

export function productHasSize(
  product: { colors: { id: string }[]; stock: Record<string, number | null> },
  size: string,
) {
  return product.colors.some((color) => {
    const qty = unitsLeft(product, color.id, size)
    return qty === null || qty > 0
  })
}

export function productIsSellable(product: {
  colors: { id: string }[]
  sizes: string[]
  stock: Record<string, number | null>
}) {
  return product.sizes.some((size) => productHasSize(product, size))
}

/** Aviso de poucas unidades só com quantidade real informada pela Aurora. */
export function lowStockCount(qty: number | null): number | null {
  if (typeof qty !== "number" || qty < 1 || qty > 2) return null
  return qty
}

export function maxPurchasable(qty: number | null) {
  if (qty === null) return UNKNOWN_STOCK_ORDER_CAP
  if (qty > 0) return qty
  return 0
}

export function relatedProducts(slug: string) {
  const current = getProduct(slug)
  if (!current) return products.slice(0, 3)
  const same = products.filter(
    (product) => product.category === current.category && product.slug !== slug,
  )
  const rest = products.filter(
    (product) => product.category !== current.category && product.slug !== slug,
  )
  return [...same, ...rest].slice(0, 3)
}

export function categoryName(id: CategoryId) {
  return categories.find((category) => category.id === id)?.name ?? id
}

export const brands = [...new Set(products.map((product) => product.brand))]
