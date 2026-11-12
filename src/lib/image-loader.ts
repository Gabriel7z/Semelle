import { pagesBasePath } from "./site"

/** No domínio próprio as fotos ficam na raiz. O GitHub Pages ignora o ?w=. */
export default function imageLoader({
  src,
  width,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (src.startsWith("http://") || src.startsWith("https://")) return src
  const base = process.env.NODE_ENV === "development" ? "" : pagesBasePath
  return `${base}${src}?w=${width}`
}
