import type { Metadata } from "next"
import { store } from "@/data/catalog"
import { formatBRL } from "@/lib/format"

export const metadata: Metadata = {
  title: "Trocas e prazos",
  description: "Prazos de envio, retirada em Brasília e troca em 7 dias na Semelle.",
}

const blocks = [
  {
    title: "Envio",
    text: `Brasília, em compras a partir de ${formatBRL(store.freeShippingCents)}, tem frete grátis e prazo de 1 a 3 dias úteis. Abaixo disso, a entrega na cidade custa ${formatBRL(store.dfShippingCents)}. Para o restante do Brasil, a taxa é ${formatBRL(store.brShippingCents)}, com prazo de 5 a 12 dias úteis.`,
  },
  {
    title: "Retirada",
    text: "Quem está em Brasília pode retirar. O horário é combinado pelo Instagram depois que o pedido é confirmado e, no PIX, depois que o pagamento é reconhecido.",
  },
  {
    title: "Troca",
    text: "Você tem 7 dias depois de receber para pedir troca, com a peça sem uso e na embalagem. O número precisa estar disponível. O frete da troca é alinhado no atendimento.",
  },
  {
    title: "Pagamento",
    text: "Este site não cobra cartão e não guarda dados de pagamento. A chave PIX é enviada pela Semelle no Instagram, só depois da conferência de estoque.",
  },
]

export default function ExchangesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-[0.68rem] tracking-[0.22em] text-muted-foreground uppercase">
        Atendimento
      </p>
      <h1 className="font-heading mt-3 text-5xl text-primary">Trocas e prazos</h1>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {blocks.map((block) => (
          <section key={block.title} className="py-6">
            <h2 className="font-heading text-2xl text-primary">{block.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{block.text}</p>
          </section>
        ))}
      </div>
      <p className="mt-6 text-sm">
        Dúvida de número? Chame {store.handle} antes de reservar.
      </p>
    </article>
  )
}
