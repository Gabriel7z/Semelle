import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { store } from "@/data/catalog"
import { cn } from "cn"

export const metadata: Metadata = {
  title: "Sobre",
  description: "A Semelle Calçados escolhe scarpins, rasteiras e papetes em Brasília.",
}

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-[0.68rem] tracking-[0.22em] text-muted-foreground uppercase">
        {store.city} — {store.state}
      </p>
      <h1 className="font-heading mt-3 text-5xl text-primary">O par perfeito.</h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed">
        <p>
          A Semelle é uma loja de calçados femininos em Brasília. O nome, em francês, é a sola — a parte que encontra o chão. A proposta cabe numa frase que a própria loja usa: elegância e conforto no mesmo pé.
        </p>
        <p>
          A coleção reúne os pares femininos da Vizzano, Beira Rio, Modare, Moleca, Activitta e da linha Aurora. O preço na vitrine é o da Semelle. O pedido continua reservado no site e confirmado no Instagram {store.handle}.
        </p>
        <p>
          O pedido é reservado aqui e confirmado no direct. A Semelle confere o número, envia o PIX e só então separa o par. Quem está em Brasília pode retirar; o restante do país recebe em casa.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/produtos" className={cn(buttonVariants(), "h-11 px-5")}>
          Ver a coleção
        </Link>
        <a
          href={store.instagram}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
        >
          {store.handle}
        </a>
      </div>
    </article>
  )
}
