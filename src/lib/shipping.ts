import { store } from "@/data/catalog"
import { digits } from "@/lib/format"

export type AddressLookup = {
  street: string
  neighborhood: string
  city: string
  state: string
}

export type ShippingQuote = {
  price: number
  label: string
  days: string
  zone: "df" | "br" | "retirada"
}

export async function lookupCep(cep: string): Promise<AddressLookup> {
  const clean = digits(cep)
  if (clean.length !== 8) {
    throw new Error("incompleto")
  }
  const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
  if (!response.ok) {
    throw new Error("rede")
  }
  const data = (await response.json()) as {
    erro?: boolean
    logradouro?: string
    bairro?: string
    localidade?: string
    uf?: string
  }
  if (data.erro) {
    throw new Error("nao-encontrado")
  }
  return {
    street: data.logradouro ?? "",
    neighborhood: data.bairro ?? "",
    city: data.localidade ?? "",
    state: data.uf ?? "",
  }
}

export function isBrasiliaCep(cep: string) {
  const prefix = Number(digits(cep).slice(0, 5))
  return prefix >= 70000 && prefix <= 73699
}

export function quoteShipping(
  cep: string,
  subtotal: number,
  method: "entrega" | "retirada",
): ShippingQuote {
  if (method === "retirada") {
    return {
      price: 0,
      label: "Retirada em Brasília",
      days: "Horário combinado pelo Instagram",
      zone: "retirada",
    }
  }
  if (isBrasiliaCep(cep)) {
    const free = subtotal >= store.freeShippingCents
    return {
      price: free ? 0 : store.dfShippingCents,
      label: free ? "Frete grátis para Brasília" : "Entrega em Brasília",
      days: "1 a 3 dias úteis",
      zone: "df",
    }
  }
  return {
    price: store.brShippingCents,
    label: "Entrega para o restante do Brasil",
    days: "5 a 12 dias úteis",
    zone: "br",
  }
}
