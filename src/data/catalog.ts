import catalogo from "@/data/vitrine.json"

export const store = {
  name: "Semelle",
  legalName: "Semelle Calçados",
  tagline: "O par perfeito",
  city: "Brasília",
  state: "DF",
  instagram: "https://www.instagram.com/usesemelle/",
  handle: "@usesemelle",
  dm: "https://ig.me/m/usesemelle",
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
  reference?: string | null
  badge?: string
  featured?: boolean
  caption: string
  description: string
  details: string[]
  colors: Colorway[]
  sizes: string[]
  stock: Record<string, number>
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

export function unitsLeft(
  product: { stock: Record<string, number> },
  colorId: string,
  size: string,
) {
  return product.stock[`${colorId}-${size}`] ?? 0
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
