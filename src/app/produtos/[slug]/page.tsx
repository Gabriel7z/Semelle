import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { ProductDetail } from "@/components/product-detail"
import { getProduct, products, relatedProducts, store } from "@/data/catalog"
import { formatBRL } from "@/lib/format"

type Params = { slug: string }

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
  if (!product) return { title: "Par não encontrado" }
  return {
    title: `${product.name} ${product.brand}`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  const related = relatedProducts(product.slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: product.brand,
    image: product.colors[0]?.images.map((image) => image),
    sku: product.reference ?? product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (product.price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
