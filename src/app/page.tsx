import Image from "next/image"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { buttonVariants } from "@/components/ui/button"
import { categories, store } from "@/data/catalog"
import { products } from "@/lib/loja"
import { formatBRL } from "@/lib/format"
import { cn } from "cn"

const steps = [
  {
    n: "01",
    title: "Escolha cor e número",
    text: "A vitrine é a coleção do Instagram. Cada par mostra o que está disponível.",
  },
  {
    n: "02",
    title: "Reserve o pedido",
    text: "Seus dados e o endereço ficam no pedido. Nada é cobrado neste site.",
  },
  {
    n: "03",
    title: "Confirme no Instagram",
    text: "A Semelle confere o estoque e envia o PIX, ou combina a retirada em Brasília.",
  },
]

export default function HomePage() {
  const featured = products.filter((product) => product.featured)
  const quote = products[0]

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl lg:min-h-[640px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:py-20 lg:pr-16">
            <p className="text-[0.68rem] tracking-[0.24em] text-muted-foreground uppercase">
              {store.city} · calçados femininos
            </p>
            <h1 className="font-heading mt-4 text-5xl leading-[0.95] text-primary sm:text-6xl">
              O par perfeito para cada passo.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Scarpins, rasteiras e papetes escolhidos um a um. Elegância que aguenta o dia — e o brilho, só quando o look pede.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/produtos"
                className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
              >
                Ver a coleção
              </Link>
              <a
                href={store.instagram}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6")}
              >
                Instagram
              </a>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-6 text-sm">
              <div>
                <dt className="text-muted-foreground">Origem</dt>
                <dd className="mt-1 font-medium">Brasília</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Envio</dt>
                <dd className="mt-1 font-medium">Todo o Brasil</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Troca</dt>
                <dd className="mt-1 font-medium">7 dias</dd>
              </div>
            </dl>
          </div>
          <div className="relative min-h-[440px] bg-[#efe8dc]">
            <Image
              src="/products/rasteira-flor.jpg"
              alt="Rasteira dourada com flor de ráfia e amarração no tornozelo"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b border-border py-3">
        <div className="semelle-marquee flex w-max gap-8 text-[0.72rem] tracking-[0.22em] text-muted-foreground uppercase">
          {Array.from({ length: 2 }).map((_, copy) => (
            <p key={copy} className="flex gap-8">
              {["Vizzano", "Beira Rio", "Semelle", "Brasília", "O par perfeito"].map((item) => (
                <span key={`${copy}-${item}`}>{item}</span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-4xl text-primary">Por onde começar</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/produtos?categoria=${category.id}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#efe8dc]">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
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
          <div className="relative aspect-square overflow-hidden bg-[#efe8dc]">
            <Image
              src="/products/scarpin-offwhite.jpg"
              alt="Scarpin slingback off white Vizzano"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[0.68rem] tracking-[0.22em] text-muted-foreground uppercase">
              Da vitrine
            </p>
            <blockquote className="font-heading mt-3 text-3xl leading-snug text-primary sm:text-4xl">
              “{quote?.caption}”
            </blockquote>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              A Semelle monta a coleção em {store.city}. O que está aqui é o que aparece no {store.handle}: Vizzano, Beira Rio e as seleções com flor, strass e ornamento.
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
          Compras acima de {formatBRL(store.freeShippingCents)} para Brasília saem sem frete. O restante do país segue com uma taxa fixa de envio, e quem está na cidade pode retirar — o horário é combinado no Instagram.
        </p>
        <Link href="/trocas" className="text-sm underline underline-offset-4">
          Ver prazos e trocas
        </Link>
      </section>
    </div>
  )
}
