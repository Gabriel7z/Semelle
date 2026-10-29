"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { store } from "@/data/catalog"
import { formatBRL, formatWhen } from "@/lib/format"
import { formatOrderText, getOrder, type Order } from "@/lib/orders"

export function OrderView({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined)

  useEffect(() => {
    setOrder(getOrder(id))
  }, [id])

  async function copy() {
    if (!order) return
    const cached = sessionStorage.getItem(`semelle-order-text-${order.id}`)
    const text = cached || formatOrderText(order)
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Resumo copiado. Cole no Instagram.")
    } catch {
      toast.error("Não foi possível copiar. Selecione o texto do pedido.")
    }
  }

  if (order === undefined) {
    return <p className="px-4 py-20 text-sm text-muted-foreground">Buscando o pedido…</p>
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <h1 className="font-heading text-4xl text-primary">Pedido não encontrado.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Os pedidos ficam salvos neste navegador. Se você abriu outro aparelho ou limpou os dados, o número {id} não aparece aqui.
        </p>
        <Button nativeButton={false} className="mt-6 h-11" render={<Link href="/produtos" />}>
          Voltar à coleção
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-[0.68rem] tracking-[0.22em] text-muted-foreground uppercase">
        Pedido reservado
      </p>
      <h1 className="font-heading mt-2 text-4xl text-primary sm:text-5xl">{order.id}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatWhen(order.createdAt)} · horário de Brasília
      </p>
      <p className="mt-5 leading-relaxed">
        {order.payment === "pix"
          ? "A Semelle confere o número e envia a chave PIX pelo Instagram. O par só segue para separação depois do pagamento."
          : "A Semelle responde no Instagram para combinar o pagamento. Não pedimos dados de cartão neste site."}
      </p>

      <div className="mt-8 border border-border bg-card">
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.key} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
              <div>
                <p>{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.brand} · {item.colorName} · nº {item.size} · {item.qty}x
                </p>
              </div>
              <p>{formatBRL(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="space-y-1 border-t border-border px-4 py-4 text-sm">
          <div className="flex justify-between">
            <dt>Frete</dt>
            <dd>{order.shippingPrice === 0 ? "Grátis" : formatBRL(order.shippingPrice)}</dd>
          </div>
          <p className="text-xs text-muted-foreground">
            {order.shippingLabel} · {order.shippingDays}
          </p>
          <div className="flex justify-between pt-2 text-base">
            <dt className="font-medium">Total</dt>
            <dd className="font-medium">{formatBRL(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button className="h-11" onClick={copy}>
          Copiar resumo
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          className="h-11"
          render={
            <a href={store.dm} target="_blank" rel="noreferrer" />
          }
        >
          Enviar no Instagram
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Abra o direct de {store.handle}, cole o resumo e aguarde a confirmação do estoque.
      </p>
    </div>
  )
}
