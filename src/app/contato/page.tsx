import type { Metadata } from "next"
import { InstagramIcon } from "@/components/instagram-icon"
import { buttonVariants } from "@/components/ui/button"
import { store } from "@/data/catalog"
import { cn } from "cn"

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Use Semelle Calçados pelo WhatsApp. Loja em Brasília.",
}

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-[0.68rem] tracking-[0.22em] text-muted-foreground uppercase">
        {store.city}
      </p>
      <h1 className="font-heading mt-3 text-5xl text-primary">Fale com a Use Semelle</h1>
      <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
        O atendimento de pedidos acontece pelo WhatsApp. Número, cor esgotada, retirada e PIX passam por lá — o Instagram segue como vitrine da coleção.
      </p>
      <a
        href={store.whatsapp}
        target="_blank"
        rel="noreferrer"
        className={cn(buttonVariants(), "mt-8 inline-flex h-11 gap-2 px-5")}
      >
        WhatsApp {store.whatsappDisplay}
      </a>
      <a
        href={store.instagram}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex w-fit items-center gap-2 text-sm underline underline-offset-4"
      >
        <InstagramIcon className="size-4" />
        Instagram {store.handle}
      </a>
      <dl className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
        <div>
          <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Cidade</dt>
          <dd className="mt-1">{store.city} — {store.state}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Pedidos</dt>
          <dd className="mt-1">Confirmação pelo WhatsApp, depois da reserva no site.</dd>
        </div>
      </dl>
    </article>
  )
}
