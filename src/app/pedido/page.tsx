import { Suspense } from "react"
import { OrderView } from "@/components/order-view"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Pedido",
  description: "Resumo do pedido reservado na Use Semelle. A confirmação segue no WhatsApp.",
  path: "/pedido",
  index: false,
})

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <p className="px-4 py-20 text-sm text-muted-foreground">Buscando o pedido…</p>
      }
    >
      <OrderView />
    </Suspense>
  )
}
