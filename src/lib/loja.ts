import {
  brands as marcas,
  getProduct as produtoFornecedor,
  products as anuncios,
  relatedProducts as relacionadosFornecedor,
  type Product as ProdutoFornecedor,
} from "@/data/catalog"
import { precoVenda } from "@/lib/margem"

export type Product = ProdutoFornecedor & { price: number }

export function paraVitrine(produto: ProdutoFornecedor): Product {
  return { ...produto, price: precoVenda(produto.cost) }
}

export const products: Product[] = anuncios.map(paraVitrine)

export function getProduct(slug: string) {
  const produto = produtoFornecedor(slug)
  return produto ? paraVitrine(produto) : undefined
}

export function relatedProducts(slug: string) {
  return relacionadosFornecedor(slug).map(paraVitrine)
}

export const brands = marcas
