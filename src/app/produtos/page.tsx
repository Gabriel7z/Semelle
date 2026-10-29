import type { Metadata } from "next"
import { Suspense } from "react"
import { Catalog } from "@/components/catalog"

export const metadata: Metadata = {
  title: "Coleção",
  description: "Scarpins, rasteiras e papetes da Semelle Calçados, em Brasília.",
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-sm text-muted-foreground">Abrindo a coleção…</p>}>
      <Catalog />
    </Suspense>
  )
}
