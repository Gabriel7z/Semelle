import type { Metadata } from "next"
import { Suspense } from "react"
import { OrderView } from "@/components/order-view"

export const metadata: Metadata = {
  title: "Pedido",
}

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
