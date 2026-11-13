import type { Metadata } from "next"
import { store } from "@/data/catalog"
import { formatBRL } from "@/lib/format"
import { pagesOrigin } from "@/lib/site"

export const titleTemplate = `%s · ${store.name}`

export const homeTitle = `${store.legalName} · ${store.tagline}`

export const homeDescription =
  "Calçados femininos em Brasília. Scarpins, rasteiras e papetes Vizzano e Beira Rio, com elegância e conforto. Enviamos para todo o Brasil."

/** Foto local da vitrine, servida no próprio domínio. */
export const defaultShareImage = {
  url: "/products/rasteira-flor.jpg",
  width: 722,
  height: 1280,
  alt: "Rasteira da coleção Use Semelle",
} as const

const SHARE_DESCRIPTION_LIMIT = 200

export function absolutePageUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized === "/") return `${pagesOrigin}/`
  return `${pagesOrigin}${normalized.endsWith("/") ? normalized : `${normalized}/`}`
}

export function absoluteAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${pagesOrigin}${normalized}`
}

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

/** Uma troca, inclusão ou remoção de caractere. Cobre "Actvitta" / "Beir Rio". */
function withinOneEdit(a: string, b: string) {
  if (a === b) return true
  const longer = a.length >= b.length ? a : b
  const shorter = a.length >= b.length ? b : a
  if (longer.length - shorter.length > 1) return false
  let skips = 0
  let i = 0
  let j = 0
  while (i < longer.length && j < shorter.length) {
    if (longer[i] === shorter[j]) {
      i += 1
      j += 1
      continue
    }
    skips += 1
    if (skips > 1) return false
    i += 1
    if (longer.length === shorter.length) j += 1
  }
  return true
}

/**
 * Título do par sem repetir a marca. O nome da Aurora quase sempre já termina
 * com ela — às vezes com um typo ("Actvitta", "Beir Rio").
 */
export function productLabel(product: { name: string; brand: string }) {
  const name = product.name.trim()
  const brand = product.brand.trim()
  if (!brand) return name
  const foldedName = fold(name)
  const foldedBrand = fold(brand)
  if (!foldedBrand || foldedName.includes(foldedBrand)) return name
  const tail = foldedName.split(" ").slice(-foldedBrand.split(" ").length).join(" ")
  if (tail && withinOneEdit(tail, foldedBrand)) return name
  return `${name} · ${brand}`
}

export function productShareDescription(product: {
  brand: string
  description: string
  price: number
}) {
  const context = `${product.brand} · ${formatBRL(product.price)}`
  const body = product.description.replace(/\s+/g, " ").trim()
  const combined = body ? `${context}. ${body}` : context
  if (combined.length <= SHARE_DESCRIPTION_LIMIT) return combined
  const trimmed = combined
    .slice(0, SHARE_DESCRIPTION_LIMIT)
    .replace(/\s+\S*$/, "")
    .replace(/[.,;:\s-]+$/g, "")
  return trimmed.length > context.length ? `${trimmed}.` : context
}

type ShareImage = {
  url: string
  alt: string
  width?: number
  height?: number
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
  image,
}: {
  title: string
  description: string
  path: string
  index?: boolean
  image?: ShareImage
}): Metadata {
  const shareImage = image ?? defaultShareImage
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      siteName: store.name,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: shareImage.url,
          alt: shareImage.alt,
          ...(shareImage.width ? { width: shareImage.width } : {}),
          ...(shareImage.height ? { height: shareImage.height } : {}),
        },
      ],
    },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  }
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
