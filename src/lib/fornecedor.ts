import {
  products,
  store,
  type Product,
} from "@/data/catalog"

export type Anuncio = {
  slug: string
  nome: string
  marca: string
  categoria: Product["category"]
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

function anuncio(product: Product, origin: string): Anuncio {
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
      nome: store.legalName,
      cidade: `${store.city} — ${store.state}`,
      repositorio: "https://github.com/Gabriel7z/Semelle",
      instagram: store.instagram,
    },
    moeda: "BRL",
    precos: "custo do fornecedor, sem a margem da loja",
    anuncios: products.map((product) => anuncio(product, origin)),
  }
}
