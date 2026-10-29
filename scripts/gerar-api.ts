import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { catalogoFornecedor } from "../src/lib/fornecedor"
import { precoVenda } from "../src/lib/margem"
import { pagesOrigin } from "../src/lib/site"

type Bruto = {
  categories: { id: string; name: string; blurb: string; image: string }[]
  products: {
    slug: string
    name: string
    brand: string
    category: string
    cost: number
    reference?: string | null
    badge?: string
    featured?: boolean
    caption: string
    description: string
    details: string[]
    colors: { id: string; name: string; swatch: string; images: string[] }[]
    sizes: string[]
    stock: Record<string, number>
    instagram?: string
  }[]
}

const bruto = JSON.parse(readFileSync(join(process.cwd(), "src/data/aurora.json"), "utf8")) as Bruto

const vitrine = {
  categories: bruto.categories,
  products: bruto.products.map((product) => ({
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: precoVenda(product.cost),
    reference: product.reference,
    badge: product.badge,
    featured: product.featured,
    caption: product.caption,
    description: product.description,
    details: product.details,
    colors: product.colors,
    sizes: product.sizes,
    stock: product.stock,
    instagram: product.instagram,
  })),
}

writeFileSync(join(process.cwd(), "src/data/vitrine.json"), JSON.stringify(vitrine))

const catalogo = catalogoFornecedor(pagesOrigin)
const root = join(process.cwd(), "public", "api", "fornecedor")
const porAnuncio = join(root, "produtos")

mkdirSync(porAnuncio, { recursive: true })

writeFileSync(join(root, "produtos.json"), `${JSON.stringify(catalogo)}\n`)

for (const anuncio of catalogo.anuncios) {
  writeFileSync(join(porAnuncio, `${anuncio.slug}.json`), `${JSON.stringify(anuncio)}\n`)
}
