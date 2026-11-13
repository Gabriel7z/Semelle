import type { MetadataRoute } from "next"
import { products } from "@/data/catalog"
import { absolutePageUrl } from "@/lib/seo"

export const dynamic = "force-static"

const staticPages: {
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/produtos", changeFrequency: "daily", priority: 0.9 },
  { path: "/sobre", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contato", changeFrequency: "monthly", priority: 0.4 },
  { path: "/trocas", changeFrequency: "monthly", priority: 0.4 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    ...staticPages.map((page) => ({
      url: absolutePageUrl(page.path),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...products.map((product) => ({
      url: absolutePageUrl(`/produtos/${product.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]
}
