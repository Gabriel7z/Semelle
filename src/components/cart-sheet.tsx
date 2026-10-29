"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatBRL } from "@/lib/format"
import { store } from "@/data/catalog"

export function CartSheet() {
  const { lines, count, subtotal, open, setOpen, setQty, remove } = useCart()
  const missing = Math.max(store.freeShippingCents - subtotal, 0)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        className="gap-0 bg-background p-0 opacity-100! data-[side=right]:w-full data-[side=right]:max-w-none data-[side=right]:sm:max-w-md"
        style={{ backgroundColor: "#faf7f2", opacity: 1 }}
      >
        <SheetHeader className="border-b">
          <SheetTitle className="font-heading text-2xl">Sacola</SheetTitle>
          <SheetDescription>
            {count === 0
              ? "Nenhum par por aqui ainda."
              : `${count} ${count === 1 ? "peça" : "peças"}`}
          </SheetDescription>
        </SheetHeader>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-5">
            <p className="font-heading text-3xl text-primary">
              Sua sacola está leve.
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Os pares da coleção estão na vitrine. Escolha cor e número e volte
              para fechar o pedido.
            </p>
              <Button
                nativeButton={false}
                className="h-11 px-5"
                onClick={() => setOpen(false)}
                render={<Link href="/produtos" />}
              >
              Ver a coleção
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-3">
                  <Link
                    href={`/produtos/${line.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative size-20 shrink-0 overflow-hidden bg-[#efe8dc]"
                  >
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
                          {line.brand}
                        </p>
                        <p className="leading-tight">{line.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {line.colorName} · nº {line.size}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remover ${line.name}`}
                        onClick={() => remove(line.key)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          className="grid size-8 place-items-center"
                          aria-label="Diminuir quantidade"
                          onClick={() => setQty(line.key, line.qty - 1)}
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{line.qty}</span>
                        <button
                          type="button"
                          className="grid size-8 place-items-center"
                          aria-label="Aumentar quantidade"
                          onClick={() => setQty(line.key, line.qty + 1)}
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <p className="text-sm">{formatBRL(line.price * line.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <SheetFooter className="border-t bg-background">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatBRL(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {missing > 0
                  ? `Faltam ${formatBRL(missing)} para frete grátis em Brasília.`
                  : "Frete grátis para Brasília neste pedido."}
              </p>
              <Button
                nativeButton={false}
                className="h-11"
                onClick={() => setOpen(false)}
                render={<Link href="/checkout" />}
              >
                Fechar pedido
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                className="h-11"
                onClick={() => setOpen(false)}
                render={<Link href="/sacola" />}
              >
                Ver sacola
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
