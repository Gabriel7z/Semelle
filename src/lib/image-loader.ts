import { pagesBasePath } from "./site"

/** Prefixa as fotos com /Semelle no site publicado. O GitHub Pages ignora o ?w=. */
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
