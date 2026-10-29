"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { store } from "@/data/catalog"
import { digits, formatBRL, maskCep, maskPhone } from "@/lib/format"
import { formatOrderText, newOrderId, saveOrder, type Order } from "@/lib/orders"
import { lookupCep, quoteShipping } from "@/lib/shipping"
import { cn } from "cn"

type FieldErrors = Partial<Record<string, string>>

export function CheckoutForm() {
  const router = useRouter()
  const { lines, subtotal, clear, ready } = useCart()
  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [cep, setCep] = useState("")
  const [street, setStreet] = useState("")
  const [number, setNumber] = useState("")
  const [complement, setComplement] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [method, setMethod] = useState<"entrega" | "retirada">("entrega")
  const [payment, setPayment] = useState<"pix" | "combinar">("pix")
  const [note, setNote] = useState("")
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")
  const [cepMessage, setCepMessage] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const clean = digits(cep)
    if (method !== "entrega" || clean.length !== 8) return
    let cancel = false
    setCepStatus("loading")
    setCepMessage("")
    lookupCep(clean)
      .then((address) => {
        if (cancel) return
        setStreet(address.street)
        setNeighborhood(address.neighborhood)
        setCity(address.city)
        setState(address.state)
        setCepStatus("ok")
      })
      .catch((error: Error) => {
        if (cancel) return
        setCepStatus("error")
        setCepMessage(
          error.message === "nao-encontrado"
            ? "Não encontramos esse CEP. Preencha o endereço."
            : "Não foi possível consultar o CEP agora. Preencha o endereço.",
        )
      })
    return () => {
      cancel = true
    }
  }, [cep, method])

  const quote =
    method === "retirada" || digits(cep).length === 8
      ? quoteShipping(cep, subtotal, method)
      : null
  const shippingPrice = quote?.price ?? 0
  const total = subtotal + (quote ? shippingPrice : 0)

  function validate() {
    const next: FieldErrors = {}
    if (name.trim().length < 3) next.name = "Diga como podemos te chamar."
    if (digits(whatsapp).length < 10) next.whatsapp = "WhatsApp com DDD."
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "E-mail incompleto."
    }
    if (method === "entrega") {
      if (digits(cep).length !== 8) next.cep = "CEP com 8 números."
      if (street.trim().length < 2) next.street = "Informe a rua."
      if (number.trim().length < 1) next.number = "Informe o número."
      if (neighborhood.trim().length < 2) next.neighborhood = "Informe o bairro."
      if (city.trim().length < 2) next.city = "Informe a cidade."
      if (state.trim().length !== 2) next.state = "UF com 2 letras."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (lines.length === 0 || !validate() || !quote) return
    setSubmitting(true)
    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      customer: {
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
      },
      address: {
        cep,
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase(),
      },
      shippingMethod: method,
      shippingLabel: quote.label,
      shippingDays: quote.days,
      shippingPrice: quote.price,
      payment,
      note: note.trim(),
      items: lines.map((line) => ({
        key: line.key,
        slug: line.slug,
        name: line.name,
        brand: line.brand,
        colorName: line.colorName,
        size: line.size,
        price: line.price,
        image: line.image,
        qty: line.qty,
      })),
      subtotal,
      total: subtotal + quote.price,
    }
    saveOrder(order)
    const text = formatOrderText(order)
    sessionStorage.setItem(`semelle-order-text-${order.id}`, text)
    clear()
    router.push(`/pedido?id=${encodeURIComponent(order.id)}`)
  }

  if (!ready) {
    return <p className="px-4 py-20 text-sm text-muted-foreground">Abrindo a sacola…</p>
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <p className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">
          Pedido
        </p>
        <h1 className="font-heading mt-2 text-4xl text-primary">A sacola está vazia.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Escolha um par antes de fechar. Cor e número ficam guardados na sacola deste navegador.
        </p>
        <Button nativeButton={false} className="mt-6 h-11" render={<Link href="/produtos" />}>
          Ir para a coleção
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8">
        <div>
          <p className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">
            Fechar pedido
          </p>
          <h1 className="font-heading mt-2 text-4xl text-primary">Seus dados</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            O site não cobra. A Semelle confirma o estoque do número e combina o PIX pelo Instagram {store.handle}.
          </p>
        </div>

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium">Contato</legend>
          <Field label="Nome" error={errors.name}>
            <Input value={name} onChange={(event) => setName(event.target.value)} className="h-11" autoComplete="name" aria-invalid={Boolean(errors.name)} />
          </Field>
          <Field label="WhatsApp" error={errors.whatsapp}>
            <Input
              value={whatsapp}
              onChange={(event) => setWhatsapp(maskPhone(event.target.value))}
              className="h-11"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(61) 90000-0000"
              aria-invalid={Boolean(errors.whatsapp)}
            />
          </Field>
          <Field label="E-mail (opcional)" error={errors.email}>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} className="h-11" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} />
          </Field>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Entrega</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <Choice pressed={method === "entrega"} onClick={() => setMethod("entrega")}>
              Receber em casa
            </Choice>
            <Choice pressed={method === "retirada"} onClick={() => setMethod("retirada")}>
              Retirar em Brasília
            </Choice>
          </div>
          {method === "entrega" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="CEP" error={errors.cep} className="sm:col-span-1">
                <Input
                  value={cep}
                  onChange={(event) => setCep(maskCep(event.target.value))}
                  className="h-11"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  aria-invalid={Boolean(errors.cep)}
                />
                {cepStatus === "loading" ? (
                  <p className="text-xs text-muted-foreground">Buscando endereço…</p>
                ) : null}
                {cepMessage ? <p className="text-xs text-destructive">{cepMessage}</p> : null}
              </Field>
              <Field label="Número" error={errors.number}>
                <Input value={number} onChange={(event) => setNumber(event.target.value)} className="h-11" autoComplete="address-line2" aria-invalid={Boolean(errors.number)} />
              </Field>
              <Field label="Rua" error={errors.street} className="sm:col-span-2">
                <Input value={street} onChange={(event) => setStreet(event.target.value)} className="h-11" autoComplete="address-line1" aria-invalid={Boolean(errors.street)} />
              </Field>
              <Field label="Complemento" className="sm:col-span-2">
                <Input value={complement} onChange={(event) => setComplement(event.target.value)} className="h-11" placeholder="Apto, bloco, referência" />
              </Field>
              <Field label="Bairro" error={errors.neighborhood}>
                <Input value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)} className="h-11" aria-invalid={Boolean(errors.neighborhood)} />
              </Field>
              <div className="grid grid-cols-[1fr_5rem] gap-3">
                <Field label="Cidade" error={errors.city}>
                  <Input value={city} onChange={(event) => setCity(event.target.value)} className="h-11" aria-invalid={Boolean(errors.city)} />
                </Field>
                <Field label="UF" error={errors.state}>
                  <Input value={state} onChange={(event) => setState(event.target.value.toUpperCase().slice(0, 2))} className="h-11" aria-invalid={Boolean(errors.state)} />
                </Field>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              A retirada é em Brasília. Depois do pedido, a Semelle combina o horário pelo Instagram.
            </p>
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Pagamento</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <Choice pressed={payment === "pix"} onClick={() => setPayment("pix")}>
              PIX depois da confirmação
            </Choice>
            <Choice pressed={payment === "combinar"} onClick={() => setPayment("combinar")}>
              Combinar no atendimento
            </Choice>
          </div>
          <p className="text-xs text-muted-foreground">
            Não pedimos número de cartão neste site.
          </p>
        </fieldset>

        <Field label="Observação">
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Presente, horário de entrega, dúvida de número..."
            rows={3}
          />
        </Field>
      </div>

      <aside className="h-fit border border-border bg-card p-5 lg:sticky lg:top-28">
        <h2 className="font-heading text-2xl text-primary">Resumo</h2>
        <ul className="mt-4 space-y-3">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-3 text-sm">
              <div className="relative size-14 shrink-0 overflow-hidden bg-[#efe8dc]">
                <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="leading-tight">{line.name}</p>
                <p className="text-xs text-muted-foreground">
                  {line.colorName} · nº {line.size} · {line.qty}x
                </p>
              </div>
              <p className="shrink-0">{formatBRL(line.price * line.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatBRL(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Frete</dt>
            <dd>
              {quote
                ? quote.price === 0
                  ? "Grátis"
                  : formatBRL(quote.price)
                : "Informe o CEP"}
            </dd>
          </div>
          {quote ? (
            <p className="text-xs text-muted-foreground">
              {quote.label} · {quote.days}
            </p>
          ) : null}
          <div className="flex justify-between pt-2 text-base">
            <dt className="font-medium">Total</dt>
            <dd className="font-medium">{formatBRL(quote ? total : subtotal)}</dd>
          </div>
        </dl>
        <Button type="submit" className="mt-5 h-11 w-full" disabled={submitting || (method === "entrega" && !quote)}>
          {submitting ? "Reservando…" : "Reservar pedido"}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Você recebe o resumo para enviar no Instagram. Nada é cobrado agora.
        </p>
      </aside>
    </form>
  )
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

function Choice({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "h-11 border px-3 text-left text-sm",
        pressed ? "border-primary bg-primary text-primary-foreground" : "border-border",
      )}
    >
      {children}
    </button>
  )
}
