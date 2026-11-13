import { Suspense } from "react"
import { Catalog } from "@/components/catalog"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Coleção",
  description: "Scarpins, rasteiras e papetes da Use Semelle Calçados, em Brasília.",
  path: "/produtos",
})

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-sm text-muted-foreground">Abrindo a coleção…</p>}>
      <Catalog />
    </Suspense>
  )
}
