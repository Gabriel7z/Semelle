"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { shoeSizes, unitsLeft, type Product } from "@/data/catalog"
import { formatBRL, installmentLabel, maskCep } from "@/lib/format"
import { quoteShipping } from "@/lib/shipping"
import { cn } from "cn"

const sizeChart = [
  ["33", "22 cm"],
  ["34", "22,5 cm"],
  ["35", "23,5 cm"],
  ["36", "24 cm"],
  ["37", "25 cm"],
  ["38", "25,5 cm"],
  ["39", "26 cm"],
]

export function ProductDetail({ product }: { product: Product }) {
  const { add, open } = useCart()
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "")
  const [size, setSize] = useState<string | null>(null)
  const [photo, setPhoto] = useState(0)
  const [qty, setQty] = useState(1)
  const [cep, setCep] = useState("")
  const [alertContact, setAlertContact] = useState("")

  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0]
  const images = color?.images ?? []
  const activePhoto = images[Math.min(photo, images.length - 1)] ?? images[0]
  const available = size && color ? unitsLeft(product, color.id, size) : null

  const shippingPreview = useMemo(() => {
    const digits = cep.replace(/\D/g, "")
    if (digits.length !== 8) return null
    return quoteShipping(cep, product.price, "entrega")
  }, [cep, product.price])

  function chooseColor(next: string) {
    setColorId(next)
    setPhoto(0)
    setQty(1)
  }

  function addToBag() {
    if (!color) return
    if (!size) {
      toast.error("Escolha o número.")
      return
    }
    const left = unitsLeft(product, color.id, size)
    if (left < 1) {
      toast.error("Este número esgotou.")
      return
    }
    add(
      {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        colorId: color.id,
        colorName: color.name,
        size,
        price: product.price,
        image: color.images[0] ?? "",
      },
      qty,
    )
  }

  function saveAlert(event: React.FormEvent) {
    event.preventDefault()
    if (!size || !color) {
      toast.error("Escolha o número esgotado.")
      return
    }
    const contact = alertContact.trim()
    if (contact.length < 8) {
      toast.error("Deixe um WhatsApp para o aviso.")
      return
    }
    const key = "semelle-alerts"
    const current = JSON.parse(localStorage.getItem(key) || "[]") as unknown[]
    current.push({
      slug: product.slug,
      color: color.name,
      size,
      contact,
      at: new Date().toISOString(),
    })
    localStorage.setItem(key, JSON.stringify(current))
    setAlertContact("")
    toast.success("Aviso anotado. A Semelle chama quando voltar.")
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 pb-28 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pb-8">
      <div>
        <div className="relative aspect-square overflow-hidden bg-[#efe8dc]">
          {activePhoto ? (
            <Image
              src={activePhoto}
              alt={`${product.name} ${color?.name ?? ""}`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setPhoto(index)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden border",
                  index === photo ? "border-primary" : "border-transparent",
                )}
                aria-label={`Foto ${index + 1}`}
              >
                <Image src={image} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <p className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">
          <Link href={`/produtos?categoria=${product.category}`} className="hover:text-primary">
            {product.category}
          </Link>
          {" · "}
          {product.brand}
          {product.reference ? ` · ref. ${product.reference}` : ""}
        </p>
        <h1 className="font-heading mt-2 text-4xl text-primary sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 font-heading text-3xl">{formatBRL(product.price)}</p>
        <p className="text-sm text-muted-foreground">{installmentLabel(product.price)}</p>
        <p className="mt-5 text-base leading-relaxed">{product.description}</p>
        <blockquote className="mt-4 border-l-2 border-gold pl-4 text-sm text-muted-foreground italic">
          “{product.caption}”
        </blockquote>

        <div className="mt-8">
          <p className="text-sm">
            Cor: <span className="font-medium">{color?.name}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === color?.id}
                onClick={() => chooseColor(item.id)}
                className={cn(
                  "flex items-center gap-2 border px-3 py-2 text-sm",
                  item.id === color?.id ? "border-primary" : "border-border",
                )}
              >
                <span
                  className="size-3 rounded-full border border-black/10"
                  style={{ backgroundColor: item.swatch }}
                />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm">Número</p>
            <Dialog>
              <DialogTrigger
                className="text-xs underline underline-offset-4"
                render={<button type="button" />}
              >
                Guia de tamanhos
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Guia de tamanhos</DialogTitle>
                  <DialogDescription>
                    Medida aproximada do pé. Vizzano e Beira Rio podem variar um
                    número. Na dúvida, chame no Instagram antes de fechar.
                  </DialogDescription>
                </DialogHeader>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-2 font-medium">Número</th>
                      <th className="py-2 font-medium">Pé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map(([number, cm]) => (
                      <tr key={number} className="border-b border-border/70">
                        <td className="py-2">{number}</td>
                        <td className="py-2">{cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {shoeSizes.map((item) => {
              const left = color ? unitsLeft(product, color.id, item) : 0
              const selected = size === item
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSize(item)
                    setQty(1)
                  }}
                  className={cn(
                    "h-10 border text-sm",
                    selected && "border-primary bg-primary text-primary-foreground",
                    !selected && left === 0 && "text-muted-foreground line-through",
                    !selected && left > 0 && "border-border hover:border-primary",
                  )}
                >
                  {item}
                </button>
              )
            })}
          </div>
          {size && available === 0 ? (
            <p className="mt-2 text-sm text-destructive">
              Número {size} esgotado em {color?.name}.
            </p>
          ) : null}
          {size && available !== null && available > 0 && available <= 2 ? (
            <p className="mt-2 text-sm text-gold">
              Últimas {available} no número {size}.
            </p>
          ) : null}
        </div>

        {size && available === 0 ? (
          <form onSubmit={saveAlert} className="mt-6 space-y-2 border border-border p-4">
            <p className="text-sm">Avise-me quando o {size} voltar.</p>
            <Input
              value={alertContact}
              onChange={(event) => setAlertContact(event.target.value)}
              placeholder="WhatsApp"
              className="h-11"
              aria-label="WhatsApp para aviso de estoque"
            />
            <Button type="submit" variant="outline" className="h-11 w-full">
              Quero o aviso
            </Button>
          </form>
        ) : (
          <div className="mt-6 hidden items-center gap-3 lg:flex">
            <div className="flex h-11 items-center border border-border">
              <button
                type="button"
                className="w-10"
                aria-label="Diminuir"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                type="button"
                className="w-10"
                aria-label="Aumentar"
                onClick={() =>
                  setQty((value) => Math.min(available && available > 0 ? available : 3, value + 1))
                }
              >
                +
              </button>
            </div>
            <Button className="h-11 flex-1" onClick={addToBag}>
              Adicionar à sacola
            </Button>
          </div>
        )}

        <div className="mt-8 border-t border-border pt-5">
          <p className="text-sm font-medium">Frete</p>
          <div className="mt-2 flex gap-2">
            <Input
              value={cep}
              onChange={(event) => setCep(maskCep(event.target.value))}
              inputMode="numeric"
              placeholder="Seu CEP"
              aria-label="CEP para estimar o frete"
              className="h-11 max-w-40"
            />
          </div>
          {shippingPreview ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {shippingPreview.label}:{" "}
              {shippingPreview.price === 0
                ? "grátis"
                : formatBRL(shippingPreview.price)}{" "}
              · {shippingPreview.days}. O valor fecha no pedido, com o subtotal da sacola.
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Brasília acima de {formatBRL(24900)} sai sem frete. Retirada na cidade também.
            </p>
          )}
        </div>

        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {product.details.map((detail) => (
            <li key={detail}>· {detail}</li>
          ))}
          <li>· Troca em até 7 dias, peça sem uso.</li>
          {product.instagram ? (
            <li>
              ·{" "}
              <a href={product.instagram} target="_blank" rel="noreferrer" className="underline">
                Ver esta publicação no Instagram
              </a>
            </li>
          ) : null}
        </ul>
      </div>

      {!open && !(size && available === 0) ? (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">{product.brand}</p>
            <p className="font-medium">{formatBRL(product.price)}</p>
          </div>
          <Button className="ml-auto h-11 px-5" onClick={addToBag}>
            Adicionar
          </Button>
        </div>
      ) : null}
    </div>
  )
}
