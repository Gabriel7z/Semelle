"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Menu, Search, ShoppingBag } from "lucide-react"
import { InstagramIcon } from "@/components/instagram-icon"
import { useCart } from "@/components/cart-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { categories, store } from "@/data/catalog"
import { products } from "@/lib/loja"
import { formatBRL } from "@/lib/format"
import { cn } from "cn"

const links = [
  { href: "/produtos", label: "Coleção" },
  ...categories.slice(0, 4).map((category) => ({
    href: `/produtos?categoria=${category.id}`,
    label: category.name,
  })),
  { href: "/sobre", label: "A loja" },
  { href: "/contato", label: "Contato" },
]

export function SiteHeader() {
  const { count, setOpen, ready } = useCart()
  const [menu, setMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    const pool = term
      ? products.filter((product) =>
          `${product.name} ${product.brand} ${product.category} ${product.caption}`
            .toLowerCase()
            .includes(term),
        )
      : products.filter((product) => product.featured)
    return pool.slice(0, 6)
  }, [query])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-6xl px-4 py-2 text-center text-[0.72rem] tracking-wide sm:px-6">
          Frete grátis para Brasília acima de {formatBRL(store.freeShippingCents)}
          <span className="hidden sm:inline"> · Enviamos para todo o Brasil</span>
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-3 sm:px-6">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setMenu(true)}
          >
            <Menu />
          </Button>
          <a
            href={store.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram da Semelle"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden lg:inline-flex")}
          >
            <InstagramIcon className="size-4" />
          </a>
        </div>
        <Link href="/" className="justify-self-center text-center">
          <span className="block text-[0.58rem] tracking-[0.16em] text-primary/70 uppercase sm:tracking-[0.32em]">
            {store.tagline}
          </span>
          <span className="block text-[1.35rem] leading-none font-extrabold tracking-tight text-primary italic sm:text-[1.65rem]">
            semelle
          </span>
        </Link>
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Buscar"
            onClick={() => setSearchOpen(true)}
          >
            <Search />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Abrir sacola"
            onClick={() => setOpen(true)}
          >
            <ShoppingBag />
            {ready && count > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-primary text-[0.6rem] text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Button>
        </div>
      </div>
      <nav className="mx-auto hidden max-w-6xl items-center justify-center gap-6 px-6 pb-3 lg:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[0.78rem] tracking-[0.16em] text-foreground/80 uppercase hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-xs">
          <SheetHeader>
            <SheetTitle className="font-heading text-2xl italic">semelle</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4 pb-8">
            <Link href="/produtos" onClick={() => setMenu(false)} className="border-b border-border py-3 text-lg">
              Coleção
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/produtos?categoria=${category.id}`}
                onClick={() => setMenu(false)}
                className="border-b border-border py-3 text-lg"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/sobre" onClick={() => setMenu(false)} className="border-b border-border py-3 text-lg">
              A loja
            </Link>
            <Link href="/contato" onClick={() => setMenu(false)} className="border-b border-border py-3 text-lg">
              Contato
            </Link>
            <Link href="/trocas" onClick={() => setMenu(false)} className="border-b border-border py-3 text-lg">
              Trocas
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Buscar um par</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Scarpin, Vizzano, papete..."
            className="h-11"
            aria-label="Buscar produtos"
          />
          <ul className="max-h-80 space-y-1 overflow-y-auto">
            {results.length === 0 ? (
              <li className="px-1 py-6 text-sm text-muted-foreground">
                Nenhum par com “{query}”. Tente a marca ou o modelo.
              </li>
            ) : (
              results.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/produtos/${product.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted"
                  >
                    <span>
                      <span className="block text-sm">{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {product.brand}
                      </span>
                    </span>
                    <span className="text-sm">{formatBRL(product.price)}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </header>
  )
}
