import { getProduct, heroBrands, productIsSellable, products, type Product } from "@/data/catalog"

export type HeroTile = {
  brand: string
  slug: string
  name: string
  image: string
  href: string
}

const NEUTRAL =
  /branco|off[\s-]?white|\boff\b|nude|bege|areia|creme|natural|champagne|marfim|palha|baunilha|p[eé]rola|gelo|ivory|vanilla/i

function sellableWithPhoto(product: Product | undefined, brand: string) {
  if (!product || product.brand !== brand) return null
  if (!productIsSellable(product)) return null
  if (!product.colors[0]?.images[0]) return null
  return product
}

export function isNeutralProduct(product: Product) {
  const label = `${product.name} ${product.slug} ${product.colors.map((color) => color.name).join(" ")}`
  return NEUTRAL.test(label)
}

/** Slug preferido, depois a lista ordenada. Null se nenhum estiver à venda. */
export function configuredHeroProduct(
  entry: (typeof heroBrands)[number],
  lookup: (slug: string) => Product | undefined = getProduct,
) {
  const preferred = sellableWithPhoto(lookup(entry.preferred), entry.brand)
  if (preferred) return preferred
  for (const slug of entry.fallbacks) {
    const product = sellableWithPhoto(lookup(slug), entry.brand)
    if (product) return product
  }
  return null
}

export function automaticHeroPool(brand: string, skip: ReadonlySet<string>) {
  return products
    .filter(
      (product) =>
        product.brand === brand &&
        product.category === "saltos" &&
        !skip.has(product.slug) &&
        sellableWithPhoto(product, brand),
    )
    .sort((a, b) => {
      const neutral = Number(isNeutralProduct(b)) - Number(isNeutralProduct(a))
      if (neutral !== 0) return neutral
      return a.slug.localeCompare(b.slug, "pt-BR")
    })
}

export async function imageHasWhiteBackground(url: string) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) return false
    const bytes = Buffer.from(await response.arrayBuffer())
    const sharp = (await import("sharp")).default
    const { data, info } = await sharp(bytes)
      .resize(20, 20, { fit: "fill" })
      .flatten({ background: "#ffffff" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const { width, height, channels } = info
    let edge = 0
    let white = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x !== 0 && y !== 0 && x !== width - 1 && y !== height - 1) continue
        edge += 1
        const offset = (y * width + x) * channels
        const red = data[offset] ?? 0
        const green = data[offset + 1] ?? 0
        const blue = data[offset + 2] ?? 0
        if (red >= 242 && green >= 242 && blue >= 242) white += 1
      }
    }
    return edge > 0 && white / edge >= 0.8
  } catch {
    return false
  }
}

function toTile(product: Product): HeroTile {
  return {
    brand: product.brand,
    slug: product.slug,
    name: product.name,
    image: product.colors[0]?.images[0] ?? "",
    href: `/produtos?marca=${encodeURIComponent(product.brand)}`,
  }
}

/**
 * Foto de cada marca no build. Se o slug configurado sumir ou esgotar, procura
 * outro salto da mesma marca — cor neutra primeiro — cuja primeira imagem tenha
 * fundo branco.
 */
export async function resolveHeroTiles(): Promise<HeroTile[]> {
  const tiles: HeroTile[] = []
  for (const entry of heroBrands) {
    let product = configuredHeroProduct(entry)
    if (!product) {
      const skip = new Set<string>([entry.preferred, ...entry.fallbacks])
      const pool = automaticHeroPool(entry.brand, skip)
      const neutral = pool.filter(isNeutralProduct)
      const rest = pool.filter((item) => !isNeutralProduct(item))
      for (const candidate of [...neutral, ...rest].slice(0, 16)) {
        const image = candidate.colors[0]?.images[0]
        if (image && (await imageHasWhiteBackground(image))) {
          product = candidate
          break
        }
      }
      product ??= neutral[0] ?? pool[0] ?? products.find((item) => sellableWithPhoto(item, entry.brand)) ?? null
    }
    if (product) tiles.push(toTile(product))
  }
  return tiles
}
