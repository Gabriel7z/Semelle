import bruto from "@/data/aurora.json"

export type Anuncio = {
  slug: string
  nome: string
  marca: string
  categoria: string
  precoCentavos: number
  preco: number
  referencia: string | null
  descricao: string
  legenda: string
  detalhes: string[]
  tamanhos: string[]
  cores: {
    id: string
    nome: string
    amostra: string
    imagens: string[]
  }[]
  estoque: Record<string, number>
  destaque: boolean
  selo: string | null
  instagram: string | null
}

type AnuncioBruto = {
  slug: string
  name: string
  brand: string
  category: string
  cost: number
  reference?: string | null
  description: string
  caption: string
  details: string[]
  sizes: string[]
  colors: { id: string; name: string; swatch: string; images: string[] }[]
  stock: Record<string, number>
  featured?: boolean
  badge?: string
  instagram?: string
}

const produtos = (bruto as unknown as { products: AnuncioBruto[] }).products

function anuncio(product: AnuncioBruto, origin: string): Anuncio {
  const absolutizar = (path: string) =>
    path.startsWith("http") ? path : `${origin}${path}`

  return {
    slug: product.slug,
    nome: product.name,
    marca: product.brand,
    categoria: product.category,
    precoCentavos: product.cost,
    preco: product.cost / 100,
    referencia: product.reference ?? null,
    descricao: product.description,
    legenda: product.caption,
    detalhes: product.details,
    tamanhos: product.sizes,
    cores: product.colors.map((color) => ({
      id: color.id,
      nome: color.name,
      amostra: color.swatch,
      imagens: color.images.map(absolutizar),
    })),
    estoque: product.stock,
    destaque: Boolean(product.featured),
    selo: product.badge ?? null,
    instagram: product.instagram ?? null,
  }
}

export function catalogoFornecedor(origin = "") {
  return {
    fornecedor: {
      nome: "Aurora Calçados",
      cidade: "Novo Gama — GO",
      catalogo: "https://auroracalcados.com.br/",
      instagram: "https://instagram.com/revendaaurora",
    },
    moeda: "BRL",
    precos: "custo do fornecedor, sem a margem da loja",
    anuncios: produtos.map((product) => anuncio(product, origin)),
  }
}
