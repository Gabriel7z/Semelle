import { readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { precoVitrine } from "../src/lib/margem"

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
    stock: Record<string, number | null>
    instagram?: string
  }[]
}

const bruto = JSON.parse(readFileSync(join(process.cwd(), "src/data/aurora.json"), "utf8")) as Bruto

const vitrine = {
  categories: bruto.categories,
  products: bruto.products.map((product) => {
    const venda = precoVitrine(product.cost)
    return {
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: venda.price,
      ...(venda.compareAt ? { compareAt: venda.compareAt } : {}),
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
    }
  }),
}

for (const product of vitrine.products) {
  if ("cost" in product || "precoCentavos" in product) {
    throw new Error("A vitrine não pode carregar custo do fornecedor.")
  }
}

writeFileSync(join(process.cwd(), "src/data/vitrine.json"), JSON.stringify(vitrine))

// O JSON público antigo levava o custo do atacado. Não recriar.
rmSync(join(process.cwd(), "public", "api"), { recursive: true, force: true })

console.log(`Vitrine pronta: ${vitrine.products.length} anúncios, sem custo do fornecedor.`)
