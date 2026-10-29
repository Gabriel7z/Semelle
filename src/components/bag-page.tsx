"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { formatBRL } from "@/lib/format"
import { store } from "@/data/catalog"

export function BagPage() {
  const { lines, subtotal, setQty, remove, ready } = useCart()
  const missing = Math.max(store.freeShippingCents - subtotal, 0)

  if (!ready) {
    return <p className="px-4 py-20 text-sm text-muted-foreground">Abrindo a sacola…</p>
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <h1 className="font-heading text-4xl text-primary">Sua sacola está leve.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Nada reservado neste navegador. A coleção inteira está a um passo.
        </p>
        <Button nativeButton={false} className="mt-6 h-11" render={<Link href="/produtos" />}>
          Ver a coleção
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl text-primary">Sacola</h1>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {lines.map((line) => (
          <li key={line.key} className="flex gap-3 py-4">
            <Link href={`/produtos/${line.slug}`} className="relative size-20 shrink-0 overflow-hidden bg-[#efe8dc] sm:size-24">
              <Image src={line.image} alt="" fill sizes="96px" className="object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">{line.brand}</p>
                  <p className="font-heading text-xl leading-tight sm:text-2xl">{line.name}</p>
                </div>
                <p className="shrink-0 text-sm">{formatBRL(line.price * line.qty)}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {line.colorName} · nº {line.size}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 items-center border border-border">
                  <button type="button" className="w-11" aria-label="Diminuir" onClick={() => setQty(line.key, line.qty - 1)}>−</button>
                  <span className="w-6 text-center text-sm">{line.qty}</span>
                  <button type="button" className="w-11" aria-label="Aumentar" onClick={() => setQty(line.key, line.qty + 1)}>+</button>
                </div>
                <button type="button" className="text-xs underline" onClick={() => remove(line.key)}>
                  Remover
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="font-heading text-3xl">{formatBRL(subtotal)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {missing > 0
              ? `Faltam ${formatBRL(missing)} para frete grátis em Brasília.`
              : "Frete grátis para Brasília neste pedido."}
          </p>
        </div>
        <Button nativeButton={false} className="h-11 px-6" render={<Link href="/checkout" />}>
          Fechar pedido
        </Button>
      </div>
    </div>
  )
}
