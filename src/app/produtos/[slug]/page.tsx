import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { ProductDetail } from "@/components/product-detail"
import { productIsSellable, store } from "@/data/catalog"
import { getProduct, products, relatedProducts } from "@/lib/loja"
import { formatBRL } from "@/lib/format"
import {
  absolutePageUrl,
  jsonLdScript,
  pageMetadata,
  productLabel,
  productShareDescription,
} from "@/lib/seo"

type Params = { slug: string }

export const dynamicParams = false

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) {
    return {
      title: "Par não encontrado",
      robots: { index: false, follow: true },
      alternates: {},
    }
  }
  const label = productLabel(product)
  const image = product.colors.find((color) => color.images[0])?.images[0]
  return pageMetadata({
    title: label,
    description: productShareDescription(product),
    path: `/produtos/${product.slug}`,
    image: image ? { url: image, alt: label } : undefined,
  })
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  const related = relatedProducts(product.slug)

  const pageUrl = absolutePageUrl(`/produtos/${product.slug}`)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: pageUrl,
    brand: { "@type": "Brand", name: product.brand },
    image: product.colors.flatMap((color) => color.images).filter(Boolean),
    sku: product.reference ?? product.slug,
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "BRL",
      price: (product.price / 100).toFixed(2),
      availability: productIsSellable(product)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: store.legalName },
    },
  }

  return (
    <>
      <ProductDetail product={product} />
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="font-heading text-3xl text-primary">Outros pares</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
        <p className="sr-only">{formatBRL(product.price)}</p>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
    </>
  )
}
