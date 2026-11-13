import Image from "next/image"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { buttonVariants } from "@/components/ui/button"
import { categories, store } from "@/data/catalog"
import { resolveHeroTiles } from "@/lib/hero-tiles"
import { products } from "@/lib/loja"
import { formatBRL } from "@/lib/format"
import { cn } from "cn"

function resumo(texto: string) {
  const limpo = texto.replace(/\s+/g, " ").trim()
  if (limpo.length <= 220) return limpo
  return `${limpo.slice(0, 220).replace(/\s+\S*$/, "").replace(/[.,;:\s]+$/, "")}.`
}

const steps = [
  {
    n: "01",
    title: "Escolha cor e número",
    text: "A vitrine é a coleção da Use Semelle. Cada par mostra cor, número e o que está disponível.",
  },
  {
    n: "02",
    title: "Reserve o pedido",
    text: "Seus dados e o endereço ficam no pedido. Nada é cobrado neste site.",
  },
  {
    n: "03",
    title: "Confirme no WhatsApp",
    text: "A Use Semelle recebe o pedido, confere o estoque e envia o PIX, ou combina a retirada em Brasília.",
  },
]

export default async function HomePage() {
  const featured = products.filter((product) => product.featured).slice(0, 6)
  const quote = featured[0] ?? products[0]
  const hero = quote?.colors[0]?.images[0] ?? "/products/rasteira-flor.jpg"
  const vitrine = categories.slice(0, 6)
  const tiles = await resolveHeroTiles()

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
            {store.city} · calçados femininos
          </p>
          <h1 className="font-heading mt-3.5 text-[2.25rem] leading-[1.05] font-light text-primary sm:text-[3.5rem]">
            As marcas que você ama,
            <br />
            <span className="italic">escolhidas um a um.</span>
          </h1>
          <p className="mt-3 text-base leading-6 text-muted-foreground">
            Escolha por marca e encontre o seu par.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-11 sm:gap-4 lg:grid-cols-4">
            {tiles.map((tile) => (
              <Link key={tile.brand} href={tile.href} className="group block text-center">
                <div className="relative aspect-[4/5] overflow-hidden bg-photo-stage">
                  <Image
                    src={tile.image}
                    alt={tile.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-contain p-4 mix-blend-multiply sm:p-7"
                  />
                </div>
                <p className="mt-3.5 text-xs tracking-[0.26em] text-foreground uppercase sm:text-[0.8125rem] sm:tracking-[0.32em]">
                  {tile.brand}
                </p>
                <p className="mt-1.5 text-xs tracking-wide text-gold group-hover:underline">
                  Ver coleção
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/produtos"
            className={cn(buttonVariants(), "mt-10 inline-flex h-11 px-7 text-sm tracking-[0.06em] sm:mt-11")}
          >
            Ver toda a coleção
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-4xl text-primary">Por onde começar</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {vitrine.map((category) => (
            <Link key={category.id} href={`/produtos?categoria=${category.id}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-photo-stage">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-contain"
                />
              </div>
              <h3 className="font-heading mt-3 text-3xl text-primary">{category.name}</h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">{category.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_1.1fr]">
          <div className="relative aspect-square overflow-hidden bg-photo-stage">
            <Image
              src={hero}
              alt={quote ? `${quote.name} ${quote.brand}` : "Coleção Use Semelle"}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
              Da vitrine
            </p>
            <blockquote className="font-heading mt-3 text-3xl leading-snug text-primary sm:text-4xl">
              “{quote?.name}”
            </blockquote>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {quote?.description ? `${resumo(quote.description)} ` : null}
              A Use Semelle monta a coleção em {store.city}: Vizzano, Beira Rio, Modare, Moleca e outras marcas selecionadas.
            </p>
            <Link href="/sobre" className="mt-6 inline-block text-sm underline underline-offset-4">
              Conhecer a loja
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-4xl text-primary">Em destaque</h2>
          <Link href="/produtos" className="text-sm underline underline-offset-4">
            Ver tudo
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-border">
        <div className="mx-auto grid max-w-6xl md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="border-b border-border px-6 py-10 md:border-r md:border-b-0 md:last:border-r-0">
              <p className="text-xs tracking-[0.2em] text-gold">{step.n}</p>
              <h3 className="font-heading mt-3 text-2xl text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
        <h2 className="font-heading text-4xl text-primary">Frete e retirada</h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Compras acima de {formatBRL(store.freeShippingCents)} para Brasília saem sem frete. O restante do país segue com uma taxa fixa de envio, e quem está na cidade pode retirar — o horário é combinado no WhatsApp.
        </p>
        <Link href="/trocas" className="text-sm underline underline-offset-4">
          Ver prazos e trocas
        </Link>
      </section>
    </div>
  )
}
