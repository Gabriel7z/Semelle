import Link from "next/link"
import { InstagramIcon } from "@/components/instagram-icon"
import { categories, store } from "@/data/catalog"
import { formatBRL } from "@/lib/format"

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-[0.62rem] tracking-[0.28em] uppercase opacity-70">
            {store.tagline}
          </p>
          <p className="font-heading mt-1 text-4xl italic">semelle</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/80">
            Calçados femininos em {store.city}. Scarpins, rasteiras e papetes
            escolhidos para quem quer elegância com o pé no chão.
          </p>
        </div>
        <div>
          <p className="text-[0.68rem] tracking-[0.18em] uppercase opacity-70">
            Coleção
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/produtos" className="hover:underline">
                Todos os pares
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/produtos?categoria=${category.id}`}
                  className="hover:underline"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[0.68rem] tracking-[0.18em] uppercase opacity-70">
            A loja
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/sobre" className="hover:underline">
                Sobre a Semelle
              </Link>
            </li>
            <li>
              <Link href="/trocas" className="hover:underline">
                Trocas e prazos
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:underline">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/sacola" className="hover:underline">
                Sacola
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[0.68rem] tracking-[0.18em] uppercase opacity-70">
            Atendimento
          </p>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
            {store.city} — {store.state}
            <br />
            Frete grátis na cidade acima de {formatBRL(store.freeShippingCents)}.
            <br />
            Pedidos confirmados pelo Instagram.
          </p>
          <a
            href={store.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm hover:underline"
          >
            <InstagramIcon className="size-4" />
            {store.handle}
          </a>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-primary-foreground/70 sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {store.legalName}</p>
          <p>Fotos e peças do Instagram {store.handle}</p>
        </div>
      </div>
    </footer>
  )
}
